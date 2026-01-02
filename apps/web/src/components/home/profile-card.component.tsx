import {
	Card,
	CardContent,
	Typography,
	Box,
	IconButton,
	Chip,
	Stack,
	CardMedia,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { User } from "@matcha/shared";
import { AuthImage } from "@/components/utils/auth-image.component";
import MockImage from "@/../public/imperial-stormtrooper-picture.png";

interface ProfileCardProps {
	user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const mainPicture = user.pictures_urls?.[0] ?? null;

	const age = user.age || "N/A";

	return (
		<Card
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				transition: "transform 0.2s, box-shadow 0.2s",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: 6,
				},
			}}
		>
			<Box sx={{ position: "relative" }}>
				<AuthImage
					src={mainPicture}
					alt={`${user.first_name} ${user.last_name}`}
					height="280px"
					width="100%"
					objectFit="cover"
					fallback={
						<CardMedia
							component="img"
							height="280px"
							image={MockImage}
							alt="Default profile"
						/>
					}
				/>
				<Box
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						display: "flex",
						gap: 1,
					}}
				>
					<IconButton
						sx={{
							bgcolor: "rgba(255, 255, 255, 0.9)",
							"&:hover": {
								bgcolor: "rgba(255, 255, 255, 1)",
							},
						}}
						size="small"
					>
						<MoreVertIcon />
					</IconButton>
				</Box>
				<Box
					sx={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						background:
							"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
						p: 2,
					}}
				>
					<Typography
						variant="h6"
						sx={{ color: "white", fontWeight: 600 }}
					>
						{user.first_name}, {age}
					</Typography>
					{user.location && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<LocationOnIcon
								sx={{ fontSize: 16, color: "white" }}
							/>
							<Typography variant="body2" sx={{ color: "white" }}>
								{user.location.city}, {user.location.country}
							</Typography>
						</Box>
					)}
				</Box>
			</Box>

			<CardContent sx={{ flexGrow: 1, pb: 1 }}>
				{user.bio && (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							mb: 1.5,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{user.bio}
					</Typography>
				)}

				<Stack
					direction="row"
					spacing={0.5}
					flexWrap="wrap"
					sx={{ mb: 1 }}
				>
					{user.gender && (
						<Chip
							label={user.gender}
							size="small"
							sx={{ mb: 0.5 }}
						/>
					)}
					{user.orientation && (
						<Chip
							label={user.orientation}
							size="small"
							sx={{ mb: 0.5 }}
						/>
					)}
				</Stack>

				{user.interests && user.interests.length > 0 && (
					<Stack direction="row" spacing={0.5} flexWrap="wrap">
						{user.interests.slice(0, 3).map((interest, idx) => (
							<Chip
								key={idx}
								label={interest}
								size="small"
								variant="outlined"
								sx={{ mb: 0.5 }}
							/>
						))}
						{user.interests.length > 3 && (
							<Chip
								label={`+${user.interests.length - 3}`}
								size="small"
								variant="outlined"
								sx={{ mb: 0.5 }}
							/>
						)}
					</Stack>
				)}
			</CardContent>

			<Box
				sx={{
					p: 1,
					borderTop: 1,
					borderColor: "divider",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<IconButton
					color="error"
					sx={{
						"&:hover": {
							transform: "scale(1.1)",
						},
					}}
				>
					<FavoriteIcon />
				</IconButton>
			</Box>
		</Card>
	);
}
