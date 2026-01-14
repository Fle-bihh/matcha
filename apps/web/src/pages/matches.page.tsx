import { Container, Typography, Box, List, Paper } from "@mui/material";
import { MatchItem } from "@/components/matches/match-item.component";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";
import { useMatches } from "@/hooks/matches.hook";

function MatchesPageComp() {
	const { matches } = useMatches();

	return (
		<Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={600}>
					Matches
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mt: 1 }}
				>
					{matches.length}{" "}
					{matches.length === 1 ? "match" : "matches"}
				</Typography>
			</Box>

			{matches.length > 0 ? (
				<Paper elevation={0} variant="outlined">
					<List disablePadding>
						{matches.map((match) => (
							<MatchItem key={match.id} match={match} />
						))}
					</List>
				</Paper>
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
