import { APP_PAGES } from "@/constants";
import { Route, Routes } from "react-router-dom";
import { withEmailVerified, withLoggedIn, withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage, HomePage, MatchesPage } from "@/pages";
import { EntryLayout, ProtectedLayout, ProfileLayout } from "@/layouts";
import { RegisterPage, LoginPage, ForgotPasswordPage } from "@/pages";
import { ConfirmEmailPage } from "@/pages";
import { ConfirmEmailChangePage } from "@/pages";
import { ModifyPasswordPage } from "@/pages";
import { ProfilePage } from "@/pages";
import { ProfileSettingsPage } from "@/pages";
import { ProfilePreviewPage } from "@/pages";
import { ProfilePicturesPage } from "@/pages";
import { ProfileInterestsPage } from "@/pages";
import { ProfileLocationPage } from "@/pages";
import { ProfileVisitsPage } from "@/pages";
import { UserPage } from "@/pages";

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
				<Route path={APP_PAGES.user} element={<UserPage />} />
				<Route path={APP_PAGES.matches} element={<MatchesPage />} />
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
					<Route
						path={APP_PAGES.profileVisits}
						element={<ProfileVisitsPage />}
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
