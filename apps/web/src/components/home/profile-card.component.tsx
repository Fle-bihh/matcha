import { Card, Typography, Box, CardMedia, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AuthImage, FameScore } from "@/components";
import MockImage from "@/assets/imperial-stormtrooper-picture.png";
import { StoreUser } from "@/types";
import { useLike, useRouting } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import { useState } from "react";

interface ProfileCardProps {
	user: StoreUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const mainPicture = user.pictures_urls?.[0] ?? null;
	const age = user.age || "N/A";
	const { push } = useRouting();
	const { createLike } = useLike();
	const [isHovered, setIsHovered] = useState(false);

	const handleViewProfile = (e: React.MouseEvent) => {
		e.stopPropagation();
		push(APP_ROUTES.user(String(user.id)));
	};

	const handleLike = (e: React.MouseEvent) => {
		e.stopPropagation();
		createLike({ liked_id: user.id });
	};

	return (
		<Box sx={{ position: "relative", width: "100%" }}>
			<Card
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
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

				{user.is_liked && (
					<Box
						sx={{
							position: "absolute",
							top: "20%",
							left: "50%",
							transform: "translateX(-50%) rotate(-15deg)",
							background: "rgba(255, 0, 0, 0.85)",
							border: "3px solid white",
							borderRadius: 1,
							px: 3,
							py: 1.5,
							boxShadow: 3,
							zIndex: 1,
						}}
					>
						<Typography
							variant="h6"
							sx={{
								color: "white",
								fontWeight: 700,
								letterSpacing: 2,
							}}
						>
							LIKED
						</Typography>
					</Box>
				)}

				{isHovered && (
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							display: "flex",
							gap: 2,
							zIndex: 2,
						}}
					>
						{!user.is_liked && (
							<IconButton
								onClick={handleLike}
								sx={{
									bgcolor: "rgba(255, 255, 255, 0.9)",
									"&:hover": {
										bgcolor: "white",
									},
								}}
							>
								<FavoriteBorderIcon
									sx={{ color: "error.main" }}
								/>
							</IconButton>
						)}
						<IconButton
							onClick={handleViewProfile}
							sx={{
								bgcolor: "rgba(255, 255, 255, 0.9)",
								"&:hover": {
									bgcolor: "white",
								},
							}}
						>
							<VisibilityIcon sx={{ color: "primary.main" }} />
						</IconButton>
					</Box>
				)}

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
