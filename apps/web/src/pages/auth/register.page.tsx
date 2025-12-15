
export function RegisterPage() {
	return (
		<form style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240, margin: '40px auto' }}>
			<h2>Register</h2>
			<input type="text" placeholder="Username" />
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<button type="submit">Register</button>
		</form>
	);
}
