import { z } from "zod";
import { MAX_USER_INTERESTS } from "../constants";

const COMMON_PASSWORDS = [
	"password",
	"qwerty",
	"welcome",
	"football",
	"baseball",
	"basketball",
	"sunshine",
	"iloveyou",
	"princess",
	"monkey",
	"charlie",
	"master",
	"dragon",
	"superman",
	"batman",
	"trustno1",
	"letmein",
	"starwars",
	"computer",
	"internet",
	"whatever",
	"freedom",
	"ranger",
	"shadow",
	"jordan",
	"midnight",
	"summer",
	"winter",
	"spring",
	"autumn",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
	"january",
	"february",
	"march",
	"april",
	"august",
	"september",
	"october",
	"november",
	"december",
];

export const fields = {
	email: z.email("Invalid email address"),

	password: z
		.string()
		.min(10, "Password must be at least 10 characters")
		.max(30, "Password must not exceed 30 characters")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
			"Password must contain at least one special character"
		)
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.refine(
			(password) => {
				const lowerPassword = password.toLowerCase();
				for (const commonWord of COMMON_PASSWORDS) {
					if (lowerPassword.includes(commonWord)) {
						return false;
					}
				}
				return true;
			},
			{
				message:
					"Password contains common words or patterns. Please choose a more unique password.",
			}
		)
		.refine(
			(password) => {
				const hasSequential =
					/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
						password
					);
				return !hasSequential;
			},
			{
				message:
					"Password should not contain sequential characters (e.g., '123', 'abc').",
			}
		)
		.refine(
			(password) => {
				const hasRepeating = /(.)\1{2,}/.test(password);
				return !hasRepeating;
			},
			{
				message:
					"Password should not contain repeated characters (e.g., 'aaa', '111').",
			}
		),

	// For login - less strict, just needs to be non-empty
	passwordLogin: z.string().min(1, "Password is required"),

	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username too long"),

	firstName: z
		.string()
		.min(1, "First name must be at least 1 character")
		.max(30, "First name too long"),

	lastName: z
		.string()
		.min(1, "Last name must be at least 1 character")
		.max(30, "Last name too long"),

	accessToken: z.string().min(1, "Access token is required"),

	refreshToken: z.string().min(1, "Refresh token is required"),

	age: z
		.number()
		.int("Age must be a whole number")
		.min(18, "You must be at least 18 years old")
		.max(120, "Age must be realistic"),

	bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),

	interests: z
		.array(z.string())
		.max(MAX_USER_INTERESTS, "Too many interests selected")
		.refine((arr) => {
			const uniqueInterests = new Set(arr);
			return uniqueInterests.size === arr.length;
		}, "Interests must be unique")
		.optional(),

	formDataNumber: z
		.string()
		.nonempty("Number is required")
		.refine((val) => {
			const num = Number(val);
			return !isNaN(num);
		}, "Must be a valid number"),
};
