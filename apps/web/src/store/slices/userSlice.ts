import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
	createAsyncThunk,
} from "@reduxjs/toolkit";
import { logger, User } from "@matcha/shared";
import { ETokens, IContainer } from "../../types/container";
import { UserService } from "../../services";

const userAdapter = createEntityAdapter<User>();

const initialState = userAdapter.getInitialState({
	loading: false,
	error: null as string | null,
});

export const createUserSlice = (container: IContainer) => {
	const fetchUsers = createAsyncThunk(
		"users/fetchUsers",
		async (_, { rejectWithValue }) => {
			try {
				const userService = container.get<UserService>(
					ETokens.UserService
				);
				const users = await userService.getUsers();
				return users;
			} catch (error) {
				logger.error("Failed to fetch users:", error);
				return rejectWithValue(
					error instanceof Error
						? error.message
						: "Une erreur est survenue"
				);
			}
		}
	);

	const userSlice = createSlice({
		name: "users",
		initialState,
		reducers: {
			clearError: (state) => {
				state.error = null;
			},
		},
		extraReducers: (builder) => {
			builder
				.addCase(fetchUsers.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(
					fetchUsers.fulfilled,
					(state, action: PayloadAction<User[]>) => {
						state.loading = false;
						logger.debug("Received user data:", action.payload);

						if (!Array.isArray(action.payload)) {
							logger.error(
								`Expected array but received: ${typeof action.payload}`,
								action.payload
							);
							state.error =
								"Format de données utilisateur invalide";
							return;
						}

						const validUsers = action.payload.filter(
							(user): user is User => {
								const isValid =
									user &&
									typeof user === "object" &&
									"id" in user &&
									typeof user.id === "number";

								if (!isValid) {
									logger.warn(
										"Invalid user data received:",
										user
									);
								}

								return isValid;
							}
						);

						logger.debug(
							"Valid users after filtering:",
							validUsers
						);
						userAdapter.setAll(state, validUsers);
					}
				)
				.addCase(fetchUsers.rejected, (state, action) => {
					state.loading = false;
					state.error = action.payload as string;
				});
		},
	});

	return {
		...userSlice,
		actions: {
			...userSlice.actions,
			fetchUsers,
		},
	};
};

export const userSelectors = {
	selectAll: userAdapter.getSelectors().selectAll,
	selectById: userAdapter.getSelectors().selectById,
	selectIds: userAdapter.getSelectors().selectIds,
};
