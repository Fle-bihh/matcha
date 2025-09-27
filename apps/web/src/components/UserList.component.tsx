import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUserStore, fetchUsers } from "@/store";
import { TAppDispatch } from "@/types/store.types";

export const UserList: React.FC = () => {
	const dispatch = useDispatch<TAppDispatch>();
	const { getUsers, isUsersLoading, isUsersFetched, hasUsersFetchError } =
		useUserStore();
	const users = getUsers;
	const loading = isUsersLoading;
	const fetched = isUsersFetched;
	const error = hasUsersFetchError;

	useEffect(() => {
		if (!fetched && !loading) {
			dispatch(fetchUsers());
		}
	}, [fetched, loading, dispatch]);

	const handleRefresh = async () => {
		try {
			await dispatch(fetchUsers());
		} catch (error) {
			console.error("Erreur lors du rafraîchissement:", error);
		}
	};

	if (loading) return <div>Chargement...</div>;

	if (error) {
		return (
			<div>
				<div>Erreur lors du chargement des utilisateurs</div>
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
