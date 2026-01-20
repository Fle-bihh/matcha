import {
	Message,
	MessageType,
	SystemMessage,
	UserMessage,
} from "@matcha/shared";
import { UserMessageComponent } from "./user-message.component";
import { SystemMessageComponent } from "./system-message.component";

interface MessageItemProps {
	message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
	if (message.type === MessageType.User) {
		return <UserMessageComponent message={message as UserMessage} />;
	}

	return <SystemMessageComponent message={message as SystemMessage} />;
}
