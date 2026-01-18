import { Box, Typography } from "@mui/material";
import { AuthImage } from "@/components";

interface ProfilePreviewImageProps {
	pictureUrl?: string;
	displayName: string;
}

export const ProfilePreviewImage = ({
	pictureUrl,
	displayName,
}: ProfilePreviewImageProps) => {
	return (
		<AuthImage
			src={pictureUrl}
			alt={`${displayName}'s profile picture`}
			height={300}
			width="100%"
			objectFit="contain"
			fallback={
				<Box
					sx={{
						height: 300,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "grey.300",
					}}
				>
					<Typography variant="h6" color="text.secondary">
						No photo
					</Typography>
				</Box>
			}
		/>
	);
};
