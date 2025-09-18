import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { APP_NAME } from "@matcha/shared";

const App = () => {
	useEffect(() => {
		fetch("/api/hello")
			.then((res) => res.json())
			.then((data) => console.log("Backend says:", data))
			.catch((err) => console.error("Error fetching /api/hello:", err));

		fetch("/api/users")
			.then((res) => res.json())
			.then((users) => console.log("Users from DB:", users))
			.catch((err) => console.error("Error fetching users:", err));
	}, []);

	return <h1>{APP_NAME} Frontend</h1>;
};

const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	root.render(<App />);
}
