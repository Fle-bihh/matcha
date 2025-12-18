import { Box, CircularProgress, Fade, Typography } from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";

export function AuthenticateLoading() {
	return (
		<Fade in timeout={300}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					backgroundColor: "background.default",
					gap: 3,
				}}
			>
				<Box
					sx={{
						position: "relative",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<CircularProgress
						size={80}
						thickness={2}
						sx={{
							color: "primary.main",
						}}
					/>
					<LockPersonIcon
						sx={{
							position: "absolute",
							fontSize: 40,
							color: "primary.main",
						}}
					/>
				</Box>
				<Typography
					variant="h6"
					sx={{
						color: "text.secondary",
						fontWeight: 400,
						letterSpacing: 0.5,
					}}
				>
					Authenticating...
				</Typography>
			</Box>
		</Fade>
	);
}
