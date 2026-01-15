import { Card, Typography, Box, CardMedia } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { AuthImage, FameScore } from "@/components/utils";
import MockImage from "@/assets/imperial-stormtrooper-picture.png";
import { StoreUser } from "@/types";

interface ProfileCardProps {
	user: StoreUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const mainPicture = user.pictures_urls?.[0] ?? null;
	const age = user.age || "N/A";

	return (
		<Box sx={{ position: "relative", width: "100%" }}>
			<Card
				sx={{
					width: "100%",
					aspectRatio: "1/1",
					borderRadius: "50%",
					position: "relative",
					overflow: "hidden",
					transition: "transform 0.2s, box-shadow 0.2s",
					"&:hover": {
						transform: "scale(1.02)",
						boxShadow: 8,
						cursor: "pointer",
					},
				}}
			>
				<AuthImage
					src={mainPicture}
					alt={`${user.first_name} ${user.last_name}`}
					height="100%"
					width="100%"
					objectFit="cover"
					fallback={
						<CardMedia
							component="img"
							height="100%"
							image={MockImage}
							alt="Default profile"
							sx={{ objectFit: "cover" }}
						/>
					}
				/>

				<Box
					sx={{
						position: "absolute",
						bottom: 40,
						left: "50%",
						transform: "translateX(-50%)",
						background: "rgba(0, 0, 0, 0.5)",
						borderRadius: 2,
						px: 2,
						py: 1,
						textAlign: "center",
						maxWidth: "80%",
					}}
				>
					<Typography
						variant="body1"
						sx={{ color: "white", fontWeight: 600, mb: 0.25 }}
					>
						{user.first_name}, {age}
					</Typography>
					{user.location && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 0.5,
							}}
						>
							<LocationOnIcon
								sx={{ fontSize: 14, color: "white" }}
							/>
							<Typography
								variant="caption"
								sx={{ color: "white" }}
							>
								{user.location.city}, {user.location.country}
							</Typography>
						</Box>
					)}
				</Box>
			</Card>

			<Box
				sx={{
					position: "absolute",
					top: "8%",
					right: "8%",
					zIndex: 2,
				}}
			>
				<FameScore score={user.fame_score} />
			</Box>
		</Box>
	);
}
