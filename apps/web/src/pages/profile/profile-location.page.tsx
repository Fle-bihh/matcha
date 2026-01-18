import { Box, Button, Alert, Paper, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import { ProfilePageWrapper } from "@/components";
import { useAuthUser } from "@/hooks";
import { useFlagger } from "@/hooks";
import { EFlaggers } from "@/constants";
import { ChangeLocationDialog } from "@/components";

export function ProfileLocationPage() {
	const { authUser } = useAuthUser();
	const { setFlagger } = useFlagger(EFlaggers.ChangeLocationDialog);

	const currentLocation = authUser?.location;

	const openFlagger = () => {
		setFlagger({ isOpen: true });
	};

	return (
		<ProfilePageWrapper
			title="Location"
			description="Your location helps us find matches near you. You can use GPS for automatic detection or search manually."
		>
			<Box sx={{ mt: 2 }}>
				{currentLocation ? (
					<Paper
						variant="outlined"
						sx={{
							p: 3,
							bgcolor: "primary.50",
							borderColor: "primary.main",
							borderWidth: 2,
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "flex-start",
								gap: 2,
							}}
						>
							<LocationOnIcon
								sx={{ color: "primary.main", fontSize: 32 }}
							/>
							<Box sx={{ flex: 1 }}>
								<Typography
									variant="h6"
									gutterBottom
									color="primary.main"
								>
									Current Location
								</Typography>
								<Typography variant="body1" gutterBottom>
									{[
										currentLocation.neighborhood,
										currentLocation.city,
										currentLocation.country,
									]
										.filter(Boolean)
										.join(", ") || "Location set"}
								</Typography>

								<Button
									variant="outlined"
									startIcon={<EditLocationIcon />}
									onClick={openFlagger}
									sx={{ mt: 3 }}
								>
									Change Location
								</Button>
							</Box>
						</Box>
					</Paper>
				) : (
					<Alert severity="warning" sx={{ mb: 3 }}>
						<Typography variant="body1" gutterBottom>
							<strong>No location set</strong>
						</Typography>
						<Typography variant="body2" gutterBottom>
							You need to set your location to use the matching
							features. Click the button below to select your
							location.
						</Typography>
						<Button
							variant="contained"
							color="primary"
							startIcon={<LocationOnIcon />}
							onClick={openFlagger}
							sx={{ mt: 2 }}
						>
							Set Location
						</Button>
					</Alert>
				)}

				<Alert severity="info" sx={{ mt: 3 }}>
					<Typography variant="body2">
						<strong>Privacy Notice:</strong> Your location will only
						be used to find matches near you. Only your city and
						neighborhood will be visible to other users, not your
						exact address or GPS coordinates.
					</Typography>
				</Alert>
			</Box>

			<ChangeLocationDialog />
		</ProfilePageWrapper>
	);
}
