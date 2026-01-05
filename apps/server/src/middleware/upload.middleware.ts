import multer from "multer";
import path from "path";

export const PROFILE_PICTURE_UPLOAD_PATH = "uploads/profile-pictures/";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const imageFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
	if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		return cb(
			new Error(
				"Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
			)
		);
	}

	const ext = path.extname(file.originalname).toLowerCase();
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		return cb(
			new Error(
				"Invalid file extension. Only .jpg, .jpeg, .png, .gif, and .webp are allowed."
			)
		);
	}

	// File is valid
	cb(null, true);
};

const upload = multer({
	dest: "uploads/temp/",
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max file size
		files: 1, // Only 1 file per request
	},
	fileFilter: imageFileFilter,
});

export const uploadProfilePictureMiddleware = upload.single("picture");
