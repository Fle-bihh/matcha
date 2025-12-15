
export function LoginPage() {
	return (
		<form style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240, margin: '40px auto' }}>
			<h2>Login</h2>
			<input type="text" placeholder="Username" />
			<input type="password" placeholder="Password" />
			<button type="submit">Login</button>
		</form>
	);
}
