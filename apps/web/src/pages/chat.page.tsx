import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { useMessages, useScroll } from "@/hooks";
import { ChatHeader, MessageList, MessageInput } from "@/components/chat";
import { useLayoutSizes } from "@/contexts";
import { withMatchExists } from "@/components";
import { useEffect, useMemo } from "react";

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

	const { scrollToTop, scrollToBottom } = useScroll();
	useEffect(() => {
		scrollToTop();
		console.log("Scroll to bottom on chat load");
	}, [scrollToTop]);

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
