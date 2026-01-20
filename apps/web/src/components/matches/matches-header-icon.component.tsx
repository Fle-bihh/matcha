import { APP_ROUTES } from "@/constants";
import { useRouting } from "@/hooks";
import { IconButton, Badge } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

export function MatchesHeaderIcon() {
	const routing = useRouting();

	const handleMatchesClick = () => {
		routing.push(APP_ROUTES.matches);
	};

	return (
		<IconButton
			color="inherit"
			onClick={handleMatchesClick}
			aria-label="matches"
		/>
	);
}
