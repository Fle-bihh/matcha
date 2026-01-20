import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { useMessages } from "@/hooks";
import { ChatHeader, MessageList, MessageInput } from "@/components/chat";
import { useLayoutSizes } from "@/contexts";

export function ChatPage() {
	const { matchId } = useParams<{ matchId: string }>();

	const { createMessage, fetchNextPage } = useMessages(matchId || "", true);
	const { contentHeight } = useLayoutSizes();

	const handleSendMessage = async (content: string) => {
		if (!matchId) return;

		createMessage({
			match_id: parseInt(matchId, 10),
			content,
		});
	};

	return (
		<Container
			maxWidth="md"
			sx={{
				height: contentHeight,
				display: "flex",
				flexDirection: "column",
				py: 2,
			}}
		>
			<ChatHeader />
			<MessageList onScroll={fetchNextPage} matchId={matchId} />
			<MessageInput onSendMessage={handleSendMessage} />
		</Container>
	);
}
