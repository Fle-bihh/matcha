import {
	Box,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Typography,
	Button,
	CircularProgress,
	Chip,
} from "@mui/material";
import { ProfilePageWrapper } from "@/components";
import { useVisits } from "@/hooks";
import { useEffect } from "react";
import { useRouting } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import { useActionsData } from "@/hooks";
import { EActionKeys } from "@/types";
import { useSelector } from "react-redux";

export function ProfileVisitsPage() {
	const { visits, fetchNextPage, hasNextPage, refresh, visitsReceivedCount } =
		useVisits(true);
	const { push } = useRouting();
	const { isLoading } = useActionsData([EActionKeys.GetVisitsReceived]);
	const handleVisitClick = (userId: number) => {
		push(APP_ROUTES.user(String(userId)));
	};

	return (
		<ProfilePageWrapper
			title="Visits"
			description="Profiles you've visited and visitors to your profile."
		>
			<Box sx={{ maxWidth: 800 }}>
				<Box
					sx={{
						mb: 3,
						display: "flex",
						gap: 2,
						alignItems: "center",
					}}
				>
					<Chip
						label={`Visits Received: ${visitsReceivedCount}`}
						color="primary"
						variant="outlined"
					/>
				</Box>

				<Typography variant="h6" sx={{ mb: 2 }}>
					Profiles You Visited
				</Typography>

				{visits.length === 0 && !isLoading ? (
					<Typography variant="body1" color="text.secondary">
						You haven't visited any profiles yet.
					</Typography>
				) : (
					<>
						<List>
							{visits.map((visit) => (
								<ListItem
									key={visit.id}
									sx={{
										cursor: "pointer",
										"&:hover": {
											backgroundColor: "action.hover",
										},
										borderRadius: 1,
										mb: 1,
									}}
									onClick={() =>
										handleVisitClick(visit.visited.id)
									}
								>
									<ListItemAvatar>
										<Avatar
											src={
												visit.visited.pictures_urls?.[0]
											}
											alt={`${visit.visited.first_name} ${visit.visited.last_name}`}
											sx={{
												width: 56,
												height: 56,
												mr: 2,
											}}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={`${visit.visited.first_name} ${visit.visited.last_name}`}
										secondary={
											<>
												{visit.visited.age && (
													<Typography
														component="span"
														variant="body2"
													>
														Age: {visit.visited.age}
													</Typography>
												)}
												<Typography
													component="span"
													variant="body2"
													display="block"
												>
													Visited:{" "}
													{new Date(
														visit.created_at,
													).toLocaleString()}
												</Typography>
											</>
										}
									/>
								</ListItem>
							))}
						</List>

						{hasNextPage && (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									mt: 3,
								}}
							>
								{isLoading ? (
									<CircularProgress size={40} />
								) : (
									<Button
										variant="contained"
										onClick={fetchNextPage}
										sx={{ minWidth: 200 }}
									>
										Load More
									</Button>
								)}
							</Box>
						)}
					</>
				)}
			</Box>
		</ProfilePageWrapper>
	);
}
