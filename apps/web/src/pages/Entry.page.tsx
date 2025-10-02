import { useAuthUser } from "@/hooks/auth.hook";

export function EntryPage() {
	const { authUser, register, isLoading, error } = useAuthUser();

	return (
		<div>
			<h1>Entry Page</h1>
			{authUser ? (
				<p>Welcome, {authUser.username}!</p>
			) : (
				<button onClick={register}>Register</button>
			)}
			{isLoading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>Error: {error}</p>}
		</div>
	);
}
