import multer from "multer";

export const PROFILE_PICTURE_UPLOAD_PATH = "uploads/profile-pictures/";

const upload = multer({
  dest: "uploads/temp/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1, // Only 1 file per request
  },
});

export const uploadProfilePictureMiddleware = upload.single("picture");
