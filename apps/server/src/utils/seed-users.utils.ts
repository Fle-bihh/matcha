import {
	Gender,
	Orientation,
	CreateUserDto,
	USER_INTERESTS,
	UserInterest,
	User,
	AuthUser,
	AuthUserWithPassword,
	OmitBaseEntity,
} from "@matcha/shared";

const FIRST_NAMES = [
	"Emma",
	"Liam",
	"Olivia",
	"Noah",
	"Ava",
	"Ethan",
	"Sophia",
	"Mason",
	"Isabella",
	"William",
	"Mia",
	"James",
	"Charlotte",
	"Benjamin",
	"Amelia",
	"Lucas",
	"Harper",
	"Henry",
	"Evelyn",
	"Alexander",
	"Abigail",
	"Michael",
	"Emily",
	"Daniel",
	"Elizabeth",
	"Matthew",
	"Sofia",
	"Jackson",
	"Avery",
	"Sebastian",
	"Ella",
	"Jack",
	"Scarlett",
	"Aiden",
	"Grace",
	"Owen",
	"Chloe",
	"Samuel",
	"Victoria",
	"David",
	"Riley",
	"Joseph",
	"Aria",
	"Carter",
	"Lily",
	"Wyatt",
	"Aubrey",
	"John",
	"Zoey",
	"Luke",
];

const LAST_NAMES = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
	"Hernandez",
	"Lopez",
	"Gonzalez",
	"Wilson",
	"Anderson",
	"Thomas",
	"Taylor",
	"Moore",
	"Jackson",
	"Martin",
	"Lee",
	"Perez",
	"Thompson",
	"White",
	"Harris",
	"Sanchez",
	"Clark",
	"Ramirez",
	"Lewis",
	"Robinson",
	"Walker",
	"Young",
	"Allen",
	"King",
	"Wright",
	"Scott",
	"Torres",
	"Nguyen",
	"Hill",
	"Flores",
	"Green",
	"Adams",
	"Nelson",
	"Baker",
	"Hall",
	"Rivera",
	"Campbell",
	"Mitchell",
	"Carter",
	"Roberts",
];

const BIOS = [
	"Love hiking and outdoor adventures. Always up for trying new restaurants.",
	"Coffee enthusiast and bookworm. Netflix is my best friend.",
	"Fitness junkie who loves traveling. Looking for a workout buddy.",
	"Artist at heart, science by profession. Believer in good vibes only.",
	"Foodie exploring the city one bite at a time. Let's grab tacos!",
	"Music lover and concert goer. Life is better with good playlists.",
	"Adventure seeker with a passion for photography. Let's make memories.",
	"Tech geek who enjoys cooking. Always learning something new.",
	"Yoga enthusiast and meditation practitioner. Peace and positivity.",
	"Dog lover and nature explorer. Weekends are for hiking.",
	"Amateur chef experimenting in the kitchen. Food is my love language.",
	"Gym rat with a sweet tooth. Balance is key.",
	"Traveler with a bucket list. 30 countries and counting.",
	"Gaming nerd who also loves the outdoors. Best of both worlds.",
	"Fashion enthusiast and creative soul. Life is too short for boring clothes.",
	"Beach lover and sunset chaser. Salt water heals everything.",
	"Runner training for marathons. Endorphins are my addiction.",
	"Movie buff and popcorn connoisseur. Marvel or DC? Both!",
	"Plant parent to 20+ green babies. My jungle is growing.",
	"Volunteering makes my heart happy. Kindness matters.",
];

const CITIES = [
	{
		city: "Paris",
		country: "France",
		latitude: 48.8566,
		longitude: 2.3522,
		neighborhoods: [
			"Marais",
			"Montmartre",
			"Saint-Germain",
			"Latin Quarter",
			"Le Marais",
		],
	},
	{
		city: "New York",
		country: "United States",
		latitude: 40.7128,
		longitude: -74.006,
		neighborhoods: [
			"Brooklyn",
			"Manhattan",
			"Queens",
			"Bronx",
			"Williamsburg",
		],
	},
	{
		city: "Tokyo",
		country: "Japan",
		latitude: 35.6762,
		longitude: 139.6503,
		neighborhoods: ["Shibuya", "Shinjuku", "Harajuku", "Roppongi", "Ginza"],
	},
	{
		city: "London",
		country: "United Kingdom",
		latitude: 51.5074,
		longitude: -0.1278,
		neighborhoods: [
			"Soho",
			"Camden",
			"Shoreditch",
			"Notting Hill",
			"Chelsea",
		],
	},
	{
		city: "Sydney",
		country: "Australia",
		latitude: -33.8688,
		longitude: 151.2093,
		neighborhoods: [
			"Bondi",
			"Surry Hills",
			"Newtown",
			"Darlinghurst",
			"Manly",
		],
	},
	{
		city: "Berlin",
		country: "Germany",
		latitude: 52.52,
		longitude: 13.405,
		neighborhoods: [
			"Kreuzberg",
			"Mitte",
			"Prenzlauer Berg",
			"Friedrichshain",
			"Charlottenburg",
		],
	},
	{
		city: "Barcelona",
		country: "Spain",
		latitude: 41.3851,
		longitude: 2.1734,
		neighborhoods: [
			"Gothic Quarter",
			"Eixample",
			"Gracia",
			"El Born",
			"Barceloneta",
		],
	},
	{
		city: "Amsterdam",
		country: "Netherlands",
		latitude: 52.3676,
		longitude: 4.9041,
		neighborhoods: ["Jordaan", "De Pijp", "Oud-West", "Centrum", "Noord"],
	},
	{
		city: "Los Angeles",
		country: "United States",
		latitude: 34.0522,
		longitude: -118.2437,
		neighborhoods: [
			"Venice Beach",
			"Santa Monica",
			"Hollywood",
			"Downtown",
			"Silver Lake",
		],
	},
	{
		city: "Rome",
		country: "Italy",
		latitude: 41.9028,
		longitude: 12.4964,
		neighborhoods: [
			"Trastevere",
			"Monti",
			"Centro Storico",
			"Testaccio",
			"Prati",
		],
	},
];

function randomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function randomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomUser(): OmitBaseEntity<AuthUserWithPassword> {
	const firstName = randomElement(FIRST_NAMES);
	const lastName = randomElement(LAST_NAMES);
	const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber(
		1,
		999,
	)}`;
	const email = `${username}@example.com`;
	const gender = randomElement([Gender.Male, Gender.Female, Gender.Other]);
	const orientation = randomElement([
		Orientation.Heterosexual,
		Orientation.Homosexual,
		Orientation.Bisexual,
	]);
	const age = randomNumber(18, 65);
	const bio = randomElement(BIOS);
	const interestsCount = randomNumber(3, 5);
	const interests = randomElements(
		[...USER_INTERESTS] as UserInterest[],
		interestsCount,
	);
	const location = randomElement(CITIES);
	const neighborhood = randomElement(location.neighborhoods);
	const fameScore = randomNumber(0, 100);

	return {
		username,
		email,
		first_name: firstName,
		last_name: lastName,
		password: "Password123!",
		gender,
		orientation,
		age,
		bio,
		interests,
		location: {
			latitude: location.latitude,
			longitude: location.longitude,
			city: location.city,
			neighborhood,
			country: location.country,
			display_name: `${neighborhood}, ${location.city}, ${location.country}`,
			manually_set: false,
		},
		fame_score: fameScore,
		is_email_verified: true,
		is_profile_complete: true,
		pictures_urls: [],
	};
}

export function generateRandomUsers(
	count: number,
): OmitBaseEntity<AuthUserWithPassword>[] {
	return Array.from({ length: count }, (_) => generateRandomUser());
}

const BASE_ADMIN_USER: Omit<
	OmitBaseEntity<AuthUserWithPassword>,
	"username" | "email" | "last_name"
> = {
	password: "pass",
	is_email_verified: true,
	is_profile_complete: true,
	pictures_urls: [],
	first_name: "Admin",
	gender: Gender.Other,
	orientation: Orientation.Bisexual,
	bio: "Administrator account",
	interests: [USER_INTERESTS[0], USER_INTERESTS[1]],
	location: {
		latitude: 0,
		longitude: 0,
		city: "Admin City",
		neighborhood: "Admin Neighborhood",
		country: "Admin Country",
		display_name: "Admin Neighborhood, Admin City, Admin Country",
		manually_set: false,
	},
	fame_score: 100,
	age: 30,
};

const ADMIN_USERS: OmitBaseEntity<AuthUserWithPassword>[] = [
	{
		username: "admin1",
		email: "admin1@mail.com",
		last_name: "One",
		...BASE_ADMIN_USER,
	},
	{
		username: "admin2",
		email: "admin2@mail.com",
		last_name: "Two",
		...BASE_ADMIN_USER,
	},
];

export function generateAdminUsers(): OmitBaseEntity<AuthUserWithPassword>[] {
	return ADMIN_USERS;
}
