import React, { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { useUserActions } from "../store/userActions";
import {
	selectUsers,
	selectUsersLoading,
	selectUsersError,
} from "../store/selectors/userSelectors";

export const UserList: React.FC = () => {
	const users = useAppSelector(selectUsers);
	const loading = useAppSelector(selectUsersLoading);
	const error = useAppSelector(selectUsersError);
	const { fetchUsers, clearError } = useUserActions();

	useEffect(() => {
		fetchUsers();
	}, []);

	if (loading) return <div>Chargement...</div>;
	if (error) {
		return (
			<div>
				<div>Erreur: {error}</div>
				<button onClick={clearError}>Effacer l'erreur</button>
				<button onClick={fetchUsers}>Réessayer</button>
			</div>
		);
	}

	return (
		<div>
			<h2>Liste des utilisateurs</h2>
			{users.length === 0 ? (
				<p>Aucun utilisateur trouvé</p>
			) : (
				<ul>
					{users.map((user) => (
						<li key={user.id}>
							{user.username} (ID: {user.id})
						</li>
					))}
				</ul>
			)}
			<button onClick={fetchUsers}>Actualiser</button>
		</div>
	);
};
