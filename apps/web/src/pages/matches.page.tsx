import {
	Container,
	Typography,
	Box,
	List,
	Paper,
} from "@mui/material";
import { MatchItem } from "@/components/matches/match-item.component";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";

const mockMatches = [
	{
		id: 1,
		name: "Emma Wilson",
		lastMessage: "Hey! How are you doing?",
		lastMessageTime: "2m ago",
		unread: true,
	},
	{
		id: 2,
		name: "Lucas Martin",
		lastMessage: "That sounds amazing!",
		lastMessageTime: "1h ago",
		unread: false,
	},
	{
		id: 3,
		name: "Sophie Anderson",
		lastMessage: "See you tomorrow 😊",
		lastMessageTime: "3h ago",
		unread: true,
	},
	{
		id: 4,
		name: "James Taylor",
		lastMessage: "Thanks for the recommendation!",
		lastMessageTime: "5h ago",
		unread: false,
	},
	{
		id: 5,
		name: "Olivia Brown",
		lastMessage: "I'd love to!",
		lastMessageTime: "Yesterday",
		unread: false,
	},
	{
		id: 6,
		name: "Noah Johnson",
		lastMessage: "What time works for you?",
		lastMessageTime: "Yesterday",
		unread: false,
	},
	{
		id: 7,
		name: "Ava Davis",
		lastMessage: "Can't wait!",
		lastMessageTime: "2 days ago",
		unread: false,
	},
	{
		id: 8,
		name: "William Garcia",
		lastMessage: "That's perfect!",
		lastMessageTime: "3 days ago",
		unread: false,
	},
];

function MatchesPageComp() {
	return (
		<Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={600}>
					Matches
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					{mockMatches.length} {mockMatches.length === 1 ? 'match' : 'matches'}
				</Typography>
			</Box>

			{mockMatches.length > 0 ? (
				<Paper elevation={0} variant="outlined">
					<List disablePadding>
						{mockMatches.map((match) => (
							<MatchItem
								key={match.id}
								name={match.name}
								lastMessage={match.lastMessage}
								lastMessageTime={match.lastMessageTime}
								unread={match.unread}
							/>
						))}
					</List>
				</Paper>
			) : (
				<Box
					sx={{
						textAlign: "center",
						py: 8,
					}}
				>
					<Typography variant="h6" color="text.secondary">
						No matches yet
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1 }}
					>
						Start liking profiles to find your matches!
					</Typography>
				</Box>
			)}
		</Container>
	);
}

export const MatchesPage = withProfileCompleteComponent(
	MatchesPageComp,
	ProfileUncomplete
);
