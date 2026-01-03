import {
	Container,
	Typography,
	Box,
	Button,
	IconButton,
	CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";
import { usePager } from "@/hooks/pagination.hook";
import { EPagerKeys } from "@/constants";
import { User } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { EEntityTypes } from "@/types";
import { ProfileCard } from "@/components/home/profile-card.component";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";

function HomePageComp() {
	const { getUsers } = useAuthUser();
	const { isLoading, isSuccess } = useActionsData([EActionKeys.GetUsers]);
	const {
		data: users,
		fetchNextPage,
		refresh,
		hasNextPage,
	} = usePager<User>({
		pagerKey: EPagerKeys.Users,
		entityType: EEntityTypes.Users,
		fn: getUsers,
		loadData: isSuccess !== true,
	});

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Typography variant="h4" component="h1" fontWeight={600}>
					Discover
				</Typography>
				<IconButton onClick={refresh} color="primary">
					<RefreshIcon />
				</IconButton>
			</Box>

			{users.length > 0 ? (
				<>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								md: "repeat(3, 1fr)",
								lg: "repeat(4, 1fr)",
							},
							gap: 3,
						}}
					>
						{users.map((user: User) => (
							<ProfileCard key={user.id} user={user} />
						))}
					</Box>

					{hasNextPage && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								mt: 4,
							}}
						>
							{isLoading ? (
								<CircularProgress size={40} />
							) : (
								<Button
									variant="contained"
									size="large"
									onClick={fetchNextPage}
									sx={{ minWidth: 200 }}
								>
									Load More
								</Button>
							)}
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
						No profiles found
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1 }}
					>
						Try refreshing or check back later
					</Typography>
				</Box>
			)}
		</Container>
	);
}

export const HomePage = withProfileCompleteComponent(
	HomePageComp,
	ProfileUncomplete
);
