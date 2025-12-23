import multer from "multer";

export const PROFILE_PICTURE_UPLOAD_PATH = "uploads/profile-pictures/";
const profileUpload = multer({ dest: PROFILE_PICTURE_UPLOAD_PATH });

export const uploadProfilePictureMiddleware =
  profileUpload.single("profile_picture");
