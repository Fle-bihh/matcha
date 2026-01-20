import { useState, useRef, useCallback } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useActionsData } from "@/hooks";
import { EActionKeys } from "@/types";

interface MessageInputProps {
	onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
	const [messageText, setMessageText] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { isLoading: isSending } = useActionsData([
		EActionKeys.CreateMessage,
	]);

	const handleSendMessage = useCallback(() => {
		if (!messageText.trim()) return;

		const messageContent = messageText.trim();
		setMessageText("");
		onSendMessage(messageContent);

		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	}, [messageText, onSendMessage]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();
			}
		},
		[handleSendMessage],
	);

	return (
		<Box
			sx={{
				display: "flex",
				gap: 1,
				alignItems: "flex-end",
			}}
		>
			<TextField
				fullWidth
				multiline
				maxRows={4}
				value={messageText}
				onChange={(e) => setMessageText(e.target.value)}
				onKeyPress={handleKeyPress}
				placeholder="Type a message..."
				disabled={isSending}
				variant="outlined"
				inputRef={inputRef}
			/>
			<IconButton
				color="primary"
				onClick={handleSendMessage}
				disabled={!messageText.trim() || isSending}
				sx={{ mb: 1 }}
			>
				<SendIcon />
			</IconButton>
		</Box>
	);
}
