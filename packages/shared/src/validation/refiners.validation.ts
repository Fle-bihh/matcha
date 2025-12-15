import { z } from "zod";

export function validatePasswordSimilarity(
	email: string,
	password: string,
	ctx: z.RefinementCtx
) {
	const emailPrefix = email.split("@")[0].toLowerCase();
	const pwd = password.toLowerCase();
	
	if (emailPrefix.length >= 3 && (pwd.includes(emailPrefix) || emailPrefix.includes(pwd))) {
		ctx.addIssue({
			code: "custom",
			message: "Password cannot be too similar to your email address",
			path: ["password"],
		});
	}
}

export function validateUsernameUniqueness(
	username: string,
	email: string,
	ctx: z.RefinementCtx
) {
	const trimmed = username.trim();
	const emailPrefix = email.split("@")[0].toLowerCase();
	const usernameRegex = /^(?!.*\.\.)[a-zA-Z][a-zA-Z0-9_\.]{2,31}$/;

	if (trimmed.length > 32) {
		ctx.addIssue({
			code: "too_big",
			maximum: 32,
			origin: "string",
			inclusive: true,
			message: "Username must be 32 characters or fewer",
			path: ["username"],
		});
		return;
	}

	if (trimmed.includes(" ")) {
		ctx.addIssue({
			code: "custom",
			message: "Username cannot contain spaces",
			path: ["username"],
		});
		return;
	}

	if (!usernameRegex.test(trimmed)) {
		ctx.addIssue({
			code: "custom",
			message: "Username must start with a letter and contain only letters, numbers, underscores, or dots (no consecutive dots)",
			path: ["username"],
		});
		return;
	}

	if (trimmed.toLowerCase() === emailPrefix) {
		ctx.addIssue({
			code: "custom",
			message: "Username cannot be identical to your email prefix",
			path: ["username"],
		});
	}
}
