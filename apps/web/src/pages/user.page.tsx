import {
	Box,
	Typography,
	Container,
	Card,
	CardMedia,
	Stack,
	Chip,
	IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";
import { AuthImage, FameScore } from "@/components/utils";
import { useRouting } from "@/hooks/routing.hooks";
import MockImage from "@/assets/imperial-stormtrooper-picture.png";

export function UserPage() {
	const { id } = useParams<{ id: string }>();
	const { goBack } = useRouting();

	const user = useSelector(
		selectEntityById<StoreUser>(EEntityTypes.Users, id ?? "")
	);

	if (!user) {
		return (
			<Container maxWidth="xl" sx={{ py: 4, pb: 12 }}>
				<Box
					sx={{
						position: "sticky",
						top: 0,
						zIndex: 10,
						mb: 2,
						ml: 2,
					}}
				>
					<IconButton
						onClick={goBack}
						sx={{
							bgcolor: "background.paper",
							boxShadow: 1,
							"&:hover": {
								bgcolor: "action.hover",
							},
						}}
					>
						<ArrowBackIcon />
					</IconButton>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
					}}
				>
					<Typography variant="h6">
						User not found in store
					</Typography>
				</Box>
			</Container>
		);
	}

	const mainPicture = user.pictures_urls?.[0] ?? null;
	const allPictures = user.pictures_urls ?? [];
	const otherPictures = [
		allPictures[1] ?? null,
		allPictures[2] ?? null,
		allPictures[3] ?? null,
		allPictures[4] ?? null,
	];
	const displayName = `${user.first_name} ${user.last_name}`;

	return (
		<Container maxWidth="xl" sx={{ py: 4, pb: 12 }}>
			<Box
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 10,
					mb: 2,
					ml: 2,
				}}
			>
				<IconButton
					onClick={goBack}
					sx={{
						bgcolor: "background.paper",
						boxShadow: 1,
						"&:hover": {
							bgcolor: "action.hover",
						},
					}}
				>
					<ArrowBackIcon />
				</IconButton>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: 3,
					mb: 3,
					alignItems: { xs: "center", md: "flex-start" },
				}}
			>
				<Box
					sx={{
						flex: { xs: "1 1 auto", md: "0 0 50%" },
						width: { xs: "100%", md: "50%" },
					}}
				>
					<Card
						sx={{
							width: "100%",
							aspectRatio: "1/1",
							position: "relative",
							overflow: "hidden",
							borderRadius: 2,
						}}
					>
						<AuthImage
							src={mainPicture}
							alt={displayName}
							height="100%"
							width="100%"
							objectFit="contain"
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
								top: 16,
								right: 16,
								zIndex: 2,
							}}
						>
							<FameScore score={user.fame_score} />
						</Box>
					</Card>
				</Box>

				<Box
					sx={{
						flex: { xs: "1 1 auto", md: "1" },
						width: { xs: "100%", md: "auto" },
					}}
				>
					<Typography variant="h4" component="div" gutterBottom>
						{displayName}
						{user.age && (
							<Typography
								component="span"
								variant="h4"
								color="text.secondary"
							>
								, {user.age}
							</Typography>
						)}
					</Typography>

					<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
						{user.gender && (
							<Chip
								label={
									user.gender.charAt(0).toUpperCase() +
									user.gender.slice(1)
								}
								size="small"
								variant="outlined"
							/>
						)}
						{user.orientation && (
							<Chip
								label={
									user.orientation.charAt(0).toUpperCase() +
									user.orientation.slice(1)
								}
								size="small"
								variant="outlined"
							/>
						)}
					</Stack>

					{user.location && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 2,
							}}
						>
							<LocationOnIcon
								sx={{
									mr: 0.5,
									fontSize: 20,
									color: "text.secondary",
								}}
							/>
							<Typography variant="body2" color="text.secondary">
								{user.location.city}, {user.location.country}
							</Typography>
						</Box>
					)}

					{user.interests && user.interests.length > 0 && (
						<Box sx={{ mb: 2 }}>
							<Stack
								direction="row"
								spacing={1}
								flexWrap="wrap"
								gap={1}
							>
								{user.interests.map((interest, index) => (
									<Chip
										key={index}
										label={`#${interest}`}
										size="small"
										color="primary"
										variant="outlined"
									/>
								))}
							</Stack>
						</Box>
					)}

					{user.bio && (
						<Typography
							variant="body1"
							color="text.primary"
							sx={{ mb: 3, mt: 2 }}
						>
							{user.bio}
						</Typography>
					)}
				</Box>
			</Box>

			<Box sx={{ mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					More Photos
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
						},
						gap: 2,
					}}
				>
					{otherPictures.map((pictureUrl, index) => (
						<Card
							key={index}
							sx={{
								width: "100%",
								aspectRatio: "1/1",
								overflow: "hidden",
								borderRadius: 2,
								bgcolor: pictureUrl
									? "transparent"
									: "action.hover",
							}}
						>
							{pictureUrl ? (
								<AuthImage
									src={pictureUrl}
									alt={`${displayName} photo ${index + 2}`}
									height="100%"
									width="100%"
									objectFit="cover"
									fallback={
										<CardMedia
											component="img"
											height="100%"
											image={MockImage}
											alt="Default photo"
											sx={{ objectFit: "cover" }}
										/>
									}
								/>
							) : (
								<Box
									sx={{
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Typography
										variant="body2"
										color="text.disabled"
									>
										No photo
									</Typography>
								</Box>
							)}
						</Card>
					))}
				</Box>
			</Box>
		</Container>
	);
}
