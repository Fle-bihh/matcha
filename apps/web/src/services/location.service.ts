import type { GeocodingResult } from "@matcha/shared";
import { UserLocation } from "@matcha/shared";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import {
  setSelectedLocation,
  setSearchResults,
  clearSearchResults,
  setIsGettingGPS,
  setIsSearching,
  setError,
  clearError,
} from "@/store";
import { ServiceResponse } from "@/types";

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    neighbourhood?: string;
    country?: string;
  };
}

export class LocationService extends BaseService {
  private readonly NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
  private readonly USER_AGENT = "Matcha Dating App";

  @action({ showSuccessMessage: false, showErrorMessage: true })
  async getCurrentPosition(): Promise<ServiceResponse> {
    this.dispatch(setIsGettingGPS(true));
    this.dispatch(clearError());

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const errorMessage = "Geolocation is not supported by your browser";
        this.dispatch(setError(errorMessage));
        this.dispatch(setIsGettingGPS(false));
        resolve(ServiceResponse.failure(errorMessage));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const geocodingResult = await this.reverseGeocode(
              latitude,
              longitude
            );

            const location: UserLocation = {
              latitude: geocodingResult.latitude,
              longitude: geocodingResult.longitude,
              city: geocodingResult.city,
              neighborhood: geocodingResult.neighborhood,
              country: geocodingResult.country,
              display_name: geocodingResult.display_name,
              manually_set: false,
            };

            this.dispatch(setSelectedLocation(location));
            this.dispatch(clearSearchResults());
            this.dispatch(setIsGettingGPS(false));
            resolve(ServiceResponse.success("Location retrieved successfully"));
          } catch (error) {
            const errorMessage =
              "Failed to get address from coordinates: " +
              (error as Error).message;
            this.dispatch(setError(errorMessage));
            this.dispatch(setIsGettingGPS(false));
            resolve(ServiceResponse.failure(errorMessage));
          }
        },
        (error) => {
          let message = "Failed to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Location permission denied. Please enable it in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "Location request timed out.";
              break;
          }

          this.dispatch(setError(message));
          this.dispatch(setIsGettingGPS(false));
          resolve(ServiceResponse.failure(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  @action({ showSuccessMessage: false, showErrorMessage: true })
  async searchLocation(query: string) {
    if (!query || query.trim().length < 3) {
      const errorMessage = "Search query must be at least 3 characters";
      this.dispatch(setError(errorMessage));
      return ServiceResponse.failure(errorMessage);
    }

    this.dispatch(setIsSearching(true));
    this.dispatch(clearError());

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        format: "json",
        addressdetails: "1",
        limit: "5",
      });

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?${params}`,
        {
          headers: {
            "User-Agent": this.USER_AGENT,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.statusText}`);
      }

      const data: NominatimResponse[] = await response.json();
      const results = data.map((result) => this.parseNominatimResponse(result));

      this.dispatch(setSearchResults(results));
      this.dispatch(setIsSearching(false));

      if (results.length === 0) {
        const message = "No locations found. Try a different search term.";
        this.dispatch(setError(message));
        return ServiceResponse.failure(message);
      }

      return ServiceResponse.success("Locations found");
    } catch (error) {
      const errorMessage =
        "Failed to search location: " + (error as Error).message;
      this.dispatch(setError(errorMessage));
      this.dispatch(setSearchResults([]));
      this.dispatch(setIsSearching(false));
      return ServiceResponse.failure(errorMessage);
    }
  }

  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<GeocodingResult> {
    try {
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: "json",
        addressdetails: "1",
      });

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?${params}`,
        {
          headers: {
            "User-Agent": this.USER_AGENT,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Reverse geocoding request failed: ${response.statusText}`
        );
      }

      const data: NominatimResponse = await response.json();

      return this.parseNominatimResponse(data);
    } catch (error) {
      throw new Error("Failed to reverse geocode: " + (error as Error).message);
    }
  }

  @action({ showSuccessMessage: false, showErrorMessage: false })
  async createManualLocation(geocodingResult: GeocodingResult) {
    const location: UserLocation = {
      latitude: geocodingResult.latitude,
      longitude: geocodingResult.longitude,
      city: geocodingResult.city,
      neighborhood: geocodingResult.neighborhood,
      country: geocodingResult.country,
      display_name: geocodingResult.display_name,
      manually_set: true,
    };

    this.dispatch(setSelectedLocation(location));
    this.dispatch(clearSearchResults());
    this.dispatch(clearError());

    return ServiceResponse.success("Location selected");
  }

  /**
   * Parse Nominatim API response into our GeocodingResult format
   */
  private parseNominatimResponse(response: NominatimResponse): GeocodingResult {
    const address = response.address || {};

    // Extract city (could be in different fields depending on location)
    const city = address.city || address.town || address.village || null;

    // Extract neighborhood/suburb
    const neighborhood = address.neighbourhood || address.suburb || null;

    return {
      latitude: parseFloat(response.lat),
      longitude: parseFloat(response.lon),
      display_name: response.display_name,
      city,
      neighborhood,
      country: address.country || null,
    };
  }
}
