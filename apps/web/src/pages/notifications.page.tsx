import {
	Container,
	Typography,
	Box,
	List,
	Paper,
	IconButton,
	Button,
	CircularProgress,
	ListItem,
	ListItemText,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNotification, useActionsData } from "@/hooks";
import { getNotificationContent, Notification } from "@matcha/shared";
import { EActionKeys } from "@/types";

export function NotificationsPage() {
	const {
		notifications,
		hasNextPage,
		refreshNotifications,
		fetchNextNotificationsPage,
	} = useNotification();
	const { isLoading } = useActionsData([EActionKeys.GetNotifications]);

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
						Notifications
					</Typography>
				</Box>
				<IconButton onClick={refreshNotifications} color="primary">
					<RefreshIcon />
				</IconButton>
			</Box>

			{isLoading && notifications.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						py: 8,
					}}
				>
					<CircularProgress />
				</Box>
			) : notifications.length > 0 ? (
				<>
					<Paper elevation={0} variant="outlined">
						<List disablePadding>
							{notifications.map((notification: Notification) => (
								<ListItem
									key={notification.id}
									divider
									sx={{ py: 2 }}
								>
									<ListItemText
										primary={getNotificationContent(
											notification,
										)}
										secondary={new Date(
											notification.created_at,
										).toLocaleString()}
									/>
								</ListItem>
							))}
						</List>
					</Paper>

					{hasNextPage && (
						<Box sx={{ mt: 3, textAlign: "center" }}>
							<Button
								onClick={fetchNextNotificationsPage}
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
						No notifications yet
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1 }}
					>
						You will be notified when someone likes or views your
						profile
					</Typography>
				</Box>
			)}
		</Container>
	);
}
