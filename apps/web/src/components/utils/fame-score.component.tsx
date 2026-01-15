import { Box, Typography } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";

interface FameScoreProps {
	score: number;
}

export function FameScore({ score }: FameScoreProps) {
	return (
		<Box
			sx={{
				position: "relative",
				width: 64,
				height: 64,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "rgba(255, 255, 255, 0.95)",
				borderRadius: "50%",
				boxShadow: 3,
			}}
		>
			<AcUnitIcon
				sx={{
					position: "absolute",
					fontSize: 64,
					color: "primary.main",
					opacity: 0.2,
				}}
			/>
			<Typography
				variant="h6"
				sx={{
					position: "relative",
					fontWeight: 700,
					color: "primary.main",
					zIndex: 1,
				}}
			>
				{score}
			</Typography>
		</Box>
	);
}
