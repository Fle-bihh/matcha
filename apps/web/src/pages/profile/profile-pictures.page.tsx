import { Box } from "@mui/material";
import { useRef } from "react";
import { EActionKeys } from "@/types";
import { useActionsData, useAuthUser } from "@/hooks";
import { AdditionalPicturesSection, MainPictureSection, ProfilePageWrapper } from "@/components";

export const ProfilePicturesPage = () => {
	const { authUser, updateProfilePicture } = useAuthUser();
	const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const { isLoading } = useActionsData([EActionKeys.UpdateProfilePicture]);

	const pictures = authUser?.pictures_urls || [];

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const indexString = index.toString();

		if (!file.type.startsWith("image/")) {
			return;
		}

		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			return;
		}

		await updateProfilePicture({ file, index: indexString });

		if (fileInputRefs.current[index]) {
			fileInputRefs.current[index]!.value = "";
		}
	};

	const handleBoxClick = (index: number) => {
		fileInputRefs.current[index]?.click();
	};

	return (
		<ProfilePageWrapper
			title="Profile Pictures"
			description="You can upload up to 5 pictures. The first one will be your main profile picture and will be displayed more prominently."
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 3,
				}}
			>
				<MainPictureSection
					pictureUrl={pictures[0]}
					isLoading={isLoading}
					onFileSelect={handleFileSelect}
					fileInputRef={(el) => {
						fileInputRefs.current[0] = el;
					}}
					onClick={() => handleBoxClick(0)}
				/>

				<AdditionalPicturesSection
					pictures={pictures}
					isLoading={isLoading}
					onFileSelect={handleFileSelect}
					fileInputRefs={(index) => (el) => {
						fileInputRefs.current[index] = el;
					}}
					onBoxClick={handleBoxClick}
				/>
			</Box>
		</ProfilePageWrapper>
	);
};
