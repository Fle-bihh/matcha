import React, { useEffect } from "react";
import { useUser } from "@/hooks/user.hooks";

export const UserList: React.FC = () => {
	const {
		users,
		fetchUsers,
		isUsersLoading,
		isUsersFetched,
		hasUsersFetchError,
		userFetchError,
	} = useUser();
	const loading = isUsersLoading;
	const fetched = isUsersFetched;
	const error = hasUsersFetchError;

	useEffect(() => {
		if (!fetched && !loading && !error) {
			fetchUsers();
		}
	}, [fetched, loading, error]);

	const handleRefresh = async () => {
		try {
			await fetchUsers();
		} catch (error) {
			console.error("Erreur lors du rafraîchissement:", error);
		}
	};

	if (loading) return <div>Chargement...</div>;

	if (error) {
		return (
			<div>
				<div>Erreur lors du chargement des utilisateurs</div>
				{userFetchError && (
					<div>Détails de l'erreur: {userFetchError.message}</div>
				)}
				<button onClick={handleRefresh}>Réessayer</button>
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
			<button onClick={handleRefresh}>Actualiser</button>
		</div>
	);
};
