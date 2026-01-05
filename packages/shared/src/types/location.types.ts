export interface UserLocation {
	latitude: number;
	longitude: number;
	city: string | null;
	neighborhood: string | null;
	country: string | null;
	display_name: string; // Full formatted address
	manually_set: boolean; // True if user manually entered, false if GPS
}

export interface GeocodingResult {
	latitude: number;
	longitude: number;
	display_name: string;
	city: string | null;
	neighborhood: string | null;
	country: string | null;
}
