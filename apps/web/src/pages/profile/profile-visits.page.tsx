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
} from "@mui/material";
import { ProfilePageWrapper } from "@/components/profile/profile-page-wrapper.component";
import { useVisits } from "@/hooks/visit.hook";
import { useEffect } from "react";
import { useRouting } from "@/hooks/routing.hooks";
import { APP_ROUTES } from "@/constants";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";

export function ProfileVisitsPage() {
	const { visits, fetchNextPage, hasNextPage } = useVisits();
	const { push } = useRouting();
	const { isLoading } = useActionsData([EActionKeys.GetVisitsReceived]);

	const handleVisitClick = (userId: number) => {
		push(APP_ROUTES.user(String(userId)));
	};

	return (
		<ProfilePageWrapper
			title="Visits"
			description="Users who have visited your profile."
		>
			<Box sx={{ maxWidth: 800 }}>
				{visits.length === 0 && !isLoading ? (
					<Typography variant="body1" color="text.secondary">
						No visits yet.
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
										handleVisitClick(visit.visitor.id)
									}
								>
									<ListItemAvatar>
										<Avatar
											src={
												visit.visitor.pictures_urls?.[0]
											}
											alt={`${visit.visitor.first_name} ${visit.visitor.last_name}`}
											sx={{ width: 56, height: 56 }}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={`${visit.visitor.first_name} ${visit.visitor.last_name}`}
										secondary={
											<>
												{visit.visitor.age && (
													<Typography
														component="span"
														variant="body2"
													>
														Age: {visit.visitor.age}
													</Typography>
												)}
												<Typography
													component="span"
													variant="body2"
													display="block"
												>
													Visited:{" "}
													{new Date(
														visit.created_at
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
