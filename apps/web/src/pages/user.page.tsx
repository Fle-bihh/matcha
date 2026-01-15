import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";

export function UserPage() {
	const { id } = useParams<{ id: string }>();

	const user = useSelector(
		selectEntityById<StoreUser>(EEntityTypes.Users, id ?? "")
	);

	if (!user) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}
			>
				<Typography variant="h6">User not found in store</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h4">
				{user.first_name} {user.last_name}
			</Typography>
		</Box>
	);
}
