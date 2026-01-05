import { APP_PAGES } from "@/constants";
import { Route, Routes } from "react-router-dom";
import { withEmailVerified, withLoggedIn, withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage, HomePage } from "@/pages";
import { EntryLayout, ProtectedLayout, ProfileLayout } from "@/layouts";
import { RegisterPage, LoginPage, ForgotPasswordPage } from "@/pages/auth";
import { ConfirmEmailPage } from "@/pages/auth/confirm-email.page";
import { ConfirmEmailChangePage } from "@/pages/auth/confirm-email-change.page";
import { ModifyPasswordPage } from "@/pages/auth/modify-password.page";
import { ProfilePage } from "@/pages/profile/profile.page";
import { ProfileSettingsPage } from "@/pages/profile/profile-settings.page";
import { ProfilePreviewPage } from "@/pages/profile/profile-preview.page";
import { ProfilePicturesPage } from "@/pages/profile/profile-pictures.page";
import { ProfileInterestsPage } from "@/pages/profile/profile-interests.page";
import { ProfileLocationPage } from "@/pages/profile/profile-location.page";

export function Router() {
	return (
		<Routes>
			<Route
				path={APP_PAGES.entry}
				element={withLoggedOut(EntryLayout)()}
			>
				<Route index element={<EntryPage />} />
				<Route path={APP_PAGES.register} element={<RegisterPage />} />
				<Route path={APP_PAGES.login} element={<LoginPage />} />
				<Route
					path={APP_PAGES.forgotPassword}
					element={<ForgotPasswordPage />}
				/>
			</Route>
			<Route
				path={APP_PAGES.protected}
				element={withLoggedIn(ProtectedLayout)()}
			>
				<Route index element={<HomePage />} />
				<Route
					path={APP_PAGES.profile}
					element={withEmailVerified(ProfileLayout)()}
				>
					<Route index element={<ProfilePage />} />
					<Route
						path={APP_PAGES.profilePreview}
						element={<ProfilePreviewPage />}
					/>
					<Route
						path={APP_PAGES.profileSettings}
						element={<ProfileSettingsPage />}
					/>
					<Route
						path={APP_PAGES.profilePictures}
						element={<ProfilePicturesPage />}
					/>
					<Route
						path={APP_PAGES.profileInterests}
						element={<ProfileInterestsPage />}
					/>
					<Route
						path={APP_PAGES.profileLocation}
						element={<ProfileLocationPage />}
					/>
				</Route>
			</Route>
			<Route
				path={APP_PAGES.confirmEmail}
				element={<ConfirmEmailPage />}
			/>
			<Route
				path={APP_PAGES.confirmEmailChange}
				element={<ConfirmEmailChangePage />}
			/>
			<Route
				path={APP_PAGES.modifyPassword}
				element={<ModifyPasswordPage />}
			/>
			<Route path={APP_PAGES.notFound} element={<NotFoundPage />} />
		</Routes>
	);
}
