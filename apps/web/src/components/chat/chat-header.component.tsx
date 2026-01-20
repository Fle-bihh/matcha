import { IconButton, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useRouting } from "@/hooks";

export function ChatHeader() {
	const router = useRouting();

	const handleBack = () => {
		router.goBack();
	};

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
			<Typography variant="h5" component="h1" fontWeight={600}>
				Chat
			</Typography>
		</Box>
	);
}
