import { IconButton, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMessages, useRouting } from "@/hooks";
import { APP_ROUTES } from "@/constants";

interface ChatHeaderProps {
	matchId?: string;
}
export function ChatHeader({ matchId }: ChatHeaderProps) {
	const { otherUser } = useMessages(matchId || "");
	const router = useRouting();

	const handleBack = () => {
		router.goBack();
	};

	const handleNavigateToProfile = () => {
		if (otherUser) {
			router.push(APP_ROUTES.user(otherUser.id.toString()));
		}
	};

	if (!otherUser) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					mb: 2,
					gap: 2,
				}}
			>
				<IconButton onClick={handleBack} edge="start">
					<ArrowBackIcon />
				</IconButton>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				mb: 2,
				gap: 2,
			}}
		>
			<IconButton onClick={handleBack} edge="start">
				<ArrowBackIcon />
			</IconButton>
			<Typography
				variant="h5"
				component="h1"
				fontWeight={600}
				onClick={handleNavigateToProfile}
				sx={{ cursor: "pointer" }}
			>
				{otherUser.first_name}
			</Typography>
		</Box>
	);
}
