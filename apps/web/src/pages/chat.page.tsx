import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { useMessages } from "@/hooks";
import { ChatHeader, MessageList, MessageInput } from "@/components/chat";
import { useLayoutSizes } from "@/contexts";
import { withMatchExists } from "@/components";
import { useMemo } from "react";

function ChatPageComp() {
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
			maxWidth="xl"
			sx={{
				height: contentHeight,
				display: "flex",
				flexDirection: "column",
				py: 2,
			}}
		>
			<ChatHeader matchId={matchId} />
			<MessageList onScroll={fetchNextPage} matchId={matchId} />
			<MessageInput onSendMessage={handleSendMessage} />
		</Container>
	);
}

export function ChatPage() {
	const { matchId } = useParams<{ matchId: string }>();
	const matchIdNum = useMemo(
		() => (matchId ? parseInt(matchId, 10) : null),
		[matchId],
	);

	return withMatchExists(ChatPageComp, matchIdNum)();
}
