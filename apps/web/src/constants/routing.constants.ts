export const APP_PAGES = {
  entry: "",
  protected: "p",
  profile: "profile",
  profileSettings: "settings",
  profilePreview: "preview",
  notFound: "*",
  register: "register",
  login: "login",
  forgotPassword: "forgot-password",
  confirmEmail: "confirm-email",
  modifyPassword: "modify-password",
};

export const APP_ROUTES = {
  entry: `/`,
  protected: `/${APP_PAGES.protected}`,
  profile: `/${APP_PAGES.protected}/${APP_PAGES.profile}`,
  profileSettings: `/${APP_PAGES.protected}/${APP_PAGES.profile}/${APP_PAGES.profileSettings}`,
  profilePreview: `/${APP_PAGES.protected}/${APP_PAGES.profile}/${APP_PAGES.profilePreview}`,
  notFound: `/${APP_PAGES.notFound}`,
  register: `/${APP_PAGES.register}`,
  login: `/${APP_PAGES.login}`,
  forgotPassword: `/${APP_PAGES.forgotPassword}`,
  confirmEmail: `/${APP_PAGES.confirmEmail}`,
  modifyPassword: `/${APP_PAGES.modifyPassword}`,
};
