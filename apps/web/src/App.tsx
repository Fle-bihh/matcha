import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchUsers } from "./store/slices/userSlice";
import {
	selectUsers,
	selectUsersLoading,
	selectUsersError,
} from "./store/selectors/userSelectors";

function App() {
	const dispatch = useAppDispatch();
	const users = useAppSelector(selectUsers);
	const loading = useAppSelector(selectUsersLoading);
	const error = useAppSelector(selectUsersError);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!hasFetched.current) {
			console.log("Dispatching fetchUsers");
			dispatch(fetchUsers());
			hasFetched.current = true;
		}
	}, [dispatch]);

	if (loading) return <div>Chargement des utilisateurs...</div>;
	if (error) return <div>Erreur: {error}</div>;

	return (
		<div>
			<h1>Hello World</h1>
			<h2>Utilisateurs ({users.length})</h2>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						{user.username} (ID: {user.id})
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
