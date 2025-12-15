import { useAuthUser } from "@/hooks/auth.hook";

export function HomePage() {
	const { logout, authUser } = useAuthUser();
	return (
		<div
			style={{
				padding: 20,
				flexDirection: "column",
				display: "flex",
				gap: 10,
			}}
		>
			Home, logged in as {authUser?.username}
			<button onClick={logout}>Logout</button>
		</div>
	);
}
