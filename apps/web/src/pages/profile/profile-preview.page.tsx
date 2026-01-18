import { Box, Card, CardContent, Typography } from "@mui/material";
import { useAuthUser } from "@/hooks";
import { ProfilePageWrapper } from "@/components";
import { ProfilePreviewImage } from "@/components";
import { ProfilePreviewInfo } from "@/components";
import { ProfilePreviewLocation } from "@/components";
import { ProfilePreviewBio } from "@/components";
import { ProfilePreviewInterests } from "@/components";
import { ProfilePreviewFame } from "@/components";

export function ProfilePreviewPage() {
	const { authUser } = useAuthUser();

	if (!authUser) {
		return (
			<Box
				sx={{
					p: 3,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "80%",
				}}
			>
				<Typography variant="h6">Loading...</Typography>
			</Box>
		);
	}

	const profilePictureUrl = authUser.pictures_urls?.[0];
	const displayName = `${authUser.first_name} ${authUser.last_name}`;

	return (
		<ProfilePageWrapper
			title="Profile Preview"
			description="This is how other users will see your profile. Make sure your information is accurate and appealing."
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Card
					sx={{
						maxWidth: 500,
						width: "100%",
						boxShadow: 3,
						borderRadius: 2,
						padding: 1,
					}}
				>
					<ProfilePreviewImage
						pictureUrl={profilePictureUrl}
						displayName={displayName}
					/>

					<CardContent>
						<ProfilePreviewInfo
							displayName={displayName}
							age={authUser.age}
							gender={authUser.gender}
							orientation={authUser.orientation}
						/>

						<ProfilePreviewLocation
							location={authUser.location?.display_name}
						/>

						<ProfilePreviewBio bio={authUser.bio} />

						<ProfilePreviewInterests
							interests={authUser.interests}
						/>

						<ProfilePreviewFame fameScore={authUser.fame_score} />
					</CardContent>
				</Card>
			</Box>
		</ProfilePageWrapper>
	);
}
