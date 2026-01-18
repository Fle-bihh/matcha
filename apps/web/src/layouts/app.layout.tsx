import { Router } from "@/components";
import { Container } from "@mui/material";

export function AppLayout() {
	return (
		<Container maxWidth={false} disableGutters sx={{ height: "100vh" }}>
			<Router />
		</Container>
	);
}
