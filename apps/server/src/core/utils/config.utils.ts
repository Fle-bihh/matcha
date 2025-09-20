function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`❌ Missing required environment variable: ${name}`);
	}
	return value;
}

function requireNumberEnv(name: string): number {
	const value = process.env[name];
	if (!value) {
		throw new Error(`❌ Missing required environment variable: ${name}`);
	}
	const numberValue = Number(value);
	if (isNaN(numberValue)) {
		throw new Error(
			`❌ Environment variable ${name} must be a valid number`
		);
	}
	return numberValue;
}

export { requireEnv, requireNumberEnv };
