import {
	Container,
	Typography,
	Box,
	List,
	Paper,
	IconButton,
	Button,
	CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MatchItem } from "@/components/matches/match-item.component";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";
import { useMatches } from "@/hooks/matches.hook";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";

function MatchesPageComp() {
	const { matches, fetchNextPage, refresh, hasNextPage } = useMatches();
	const { isLoading } = useActionsData([EActionKeys.GetMatches]);

	return (
		<Container maxWidth="xl" sx={{ py: 4, pb: 12 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={600}>
						Matches
					</Typography>
				</Box>
				<IconButton onClick={refresh} color="primary">
					<RefreshIcon />
				</IconButton>
			</Box>

			{isLoading && matches.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						py: 8,
					}}
				>
					<CircularProgress />
				</Box>
			) : matches.length > 0 ? (
				<>
					<Paper elevation={0} variant="outlined">
						<List disablePadding>
							{matches.map((match) => (
								<MatchItem key={match.id} match={match} />
							))}
						</List>
					</Paper>

					{hasNextPage && (
						<Box sx={{ mt: 3, textAlign: "center" }}>
							<Button
								onClick={fetchNextPage}
								variant="outlined"
								disabled={isLoading}
							>
								{isLoading ? "Loading..." : "Load More"}
							</Button>
						</Box>
					)}
				</>
			) : (
				<Box
					sx={{
						textAlign: "center",
						py: 8,
					}}
				>
					<Typography variant="h6" color="text.secondary">
						No matches yet
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1 }}
					>
						Start liking profiles to find your matches!
					</Typography>
				</Box>
			)}
		</Container>
	);
}

export const MatchesPage = withProfileCompleteComponent(
	MatchesPageComp,
	ProfileUncomplete
);
