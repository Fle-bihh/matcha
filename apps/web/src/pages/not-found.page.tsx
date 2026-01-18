import { CenteredPaper } from "@/components";
import { useRouting } from "@/hooks";
import { Box, Button, Typography } from "@mui/material";

export function NotFoundPage() {
	const { toHome } = useRouting();
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<CenteredPaper backButtonDisabled sx={{ textAlign: "center" }}>
				<Typography variant="h1" gutterBottom>
					404
				</Typography>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					Page Not Found
				</Typography>
				<Button
					onClick={toHome}
					variant="contained"
					size="large"
					fullWidth
				>
					Return Home
				</Button>
			</CenteredPaper>
		</Box>
	);
}
