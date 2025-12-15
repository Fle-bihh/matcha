
import { ROUTES } from "@/constants";
import { Link } from "react-router-dom";

export function EntryPage() {
	return (
		<div>
			<h1>Entry Page</h1>
			<Link to={ROUTES.register}>
				<button>Register</button>
			</Link>
			<Link to={ROUTES.login}>
				<button>Login</button>
			</Link>
		</div>
	);
}
