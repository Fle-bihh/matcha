import { UpdateProfileForm } from "@/forms/update-profile.form";
import { ProfileContentWrapper } from "@/components/profile/profile-content-wrapper.component";

export function ProfilePage() {
  return (
    <ProfileContentWrapper title="Your Profiles">
      <UpdateProfileForm />
    </ProfileContentWrapper>
  );
}
