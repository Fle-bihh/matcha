import {
	AuthUser,
	BrowsingFiltersDto,
	Gender,
	Orientation,
} from "@matcha/shared";
import { BaseService } from "./base.service";
import { QueryOptions } from "@/types/db.types";
import { ETokens } from "@/types";
import { UserRepository } from "@/repositories";

export class BrowsingService extends BaseService {
	private readonly MAX_DISTANCE_KM = 999999;

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	private getCompatibleGenders(
		userGender: Gender | null,
		userOrientation: Orientation | null
	): Gender[] {
		if (!userOrientation) {
			return [Gender.Male, Gender.Female, Gender.Other];
		}

		switch (userOrientation) {
			case Orientation.Heterosexual:
				if (userGender === Gender.Male) {
					return [Gender.Female];
				} else if (userGender === Gender.Female) {
					return [Gender.Male];
				} else {
					return [Gender.Male, Gender.Female];
				}
			case Orientation.Homosexual:
				if (userGender === Gender.Male) {
					return [Gender.Male];
				} else if (userGender === Gender.Female) {
					return [Gender.Female];
				} else {
					return [Gender.Other];
				}
			case Orientation.Bisexual:
				return [Gender.Male, Gender.Female, Gender.Other];
			default:
				return [Gender.Male, Gender.Female, Gender.Other];
		}
	}

	private buildSharedInterestsQuery(userInterests: string[] | null): string {
		if (!userInterests || userInterests.length === 0) {
			return "0";
		}

		const interestChecks = userInterests.map((interest) => {
			const escapedInterest = interest.replace(/'/g, "''");
			return `CASE WHEN interests IS NOT NULL AND JSON_CONTAINS(interests, '"${escapedInterest}"') THEN 1 ELSE 0 END`;
		});

		return `(${interestChecks.join(" + ")})`;
	}

	private buildDistanceQuery(
		userLat: number | null,
		userLon: number | null
	): string {
		if (userLat === null || userLon === null) {
			return this.MAX_DISTANCE_KM.toString();
		}

		return `
			CASE
				WHEN location IS NOT NULL AND JSON_TYPE(location) = 'OBJECT' THEN
					(6371 * 2 * ASIN(SQRT(
						POWER(SIN((CAST(JSON_EXTRACT(location, '$.latitude') AS DECIMAL(10,7)) - ${userLat}) * 3.14159265359 / 360), 2) +
						COS(${userLat} * 3.14159265359 / 180) *
						COS(CAST(JSON_EXTRACT(location, '$.latitude') AS DECIMAL(10,7)) * 3.14159265359 / 180) *
						POWER(SIN((CAST(JSON_EXTRACT(location, '$.longitude') AS DECIMAL(10,7)) - ${userLon}) * 3.14159265359 / 360), 2)
					)))
				ELSE ${this.MAX_DISTANCE_KM}
			END
		`;
	}

	public async getBrowsingQueryOptions(
		userId: number,
		limit: number,
		offset: number,
		filters: BrowsingFiltersDto
	): Promise<QueryOptions> {
		const currentUser = await this.userRepository.findUserById(userId);
		if (!currentUser) {
			return {
				where: "1 = 0",
				values: [],
				limit,
				offset,
			};
		}

		const compatibleGenders = this.getCompatibleGenders(
			currentUser.gender,
			currentUser.orientation
		);

		const whereConditions: string[] = [];
		const values: any[] = [];

		whereConditions.push("id != ?");
		values.push(userId);

		if (compatibleGenders.length > 0) {
			const genderPlaceholders = compatibleGenders
				.map(() => "?")
				.join(", ");
			whereConditions.push(`gender IN (${genderPlaceholders})`);
			values.push(...compatibleGenders);
		}

		if (currentUser.gender) {
			const orientationConditions: string[] = [];

			orientationConditions.push("orientation = ?");
			values.push(Orientation.Bisexual);

			orientationConditions.push("orientation IS NULL");

			if (currentUser.gender === Gender.Male) {
				orientationConditions.push("(orientation = ? AND gender = ?)");
				values.push(Orientation.Heterosexual, Gender.Female);
			} else if (currentUser.gender === Gender.Female) {
				orientationConditions.push("(orientation = ? AND gender = ?)");
				values.push(Orientation.Heterosexual, Gender.Male);
			}

			orientationConditions.push("(orientation = ? AND gender = ?)");
			values.push(Orientation.Homosexual, currentUser.gender);

			whereConditions.push(`(${orientationConditions.join(" OR ")})`);
		}

		whereConditions.push("is_profile_complete = ?");
		values.push(true);

		// Apply age filters
		if (filters.ageMin !== undefined) {
			whereConditions.push("age >= ?");
			values.push(filters.ageMin);
		}
		if (filters.ageMax !== undefined) {
			whereConditions.push("age <= ?");
			values.push(filters.ageMax);
		}

		// Apply fame filters
		if (filters.fameMin !== undefined) {
			whereConditions.push("fame_score >= ?");
			values.push(filters.fameMin);
		}
		if (filters.fameMax !== undefined) {
			whereConditions.push("fame_score <= ?");
			values.push(filters.fameMax);
		}

		// Apply interests filter
		if (filters.interests && filters.interests.length > 0) {
			const interestConditions = filters.interests.map(() => {
				return "JSON_CONTAINS(interests, ?)";
			});
			whereConditions.push(`(${interestConditions.join(" OR ")})`);
			filters.interests.forEach((interest) => {
				values.push(JSON.stringify(interest));
			});
		}

		const userLat = currentUser.location?.latitude ?? null;
		const userLon = currentUser.location?.longitude ?? null;

		// Apply distance filter
		if (filters.distanceMax !== undefined && userLat !== null && userLon !== null) {
			const distanceCalc = this.buildDistanceQuery(userLat, userLon);
			whereConditions.push(`(${distanceCalc}) <= ?`);
			values.push(filters.distanceMax);
		}

		const where = whereConditions.join(" AND ");

		const userInterests = currentUser.interests ?? null;

		const distanceQuery = this.buildDistanceQuery(userLat, userLon);
		const sharedInterestsQuery =
			this.buildSharedInterestsQuery(userInterests);

		// Apply custom sorting if provided, otherwise use default
		let orderBy: string;
		if (filters.sortBy) {
			const sortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC";
			switch (filters.sortBy) {
				case "age":
					orderBy = `age ${sortOrder}, id ASC`;
					break;
				case "distance":
					orderBy = `${distanceQuery} ${sortOrder}, id ASC`;
					break;
				case "fame_rating":
					orderBy = `fame_score ${sortOrder}, id ASC`;
					break;
				case "common_tags":
					orderBy = `${sharedInterestsQuery} ${sortOrder}, id ASC`;
					break;
				default:
					orderBy = `
						${distanceQuery} ASC,
						${sharedInterestsQuery} DESC,
						fame_score DESC,
						id ASC
					`;
			}
		} else {
			orderBy = `
				${distanceQuery} ASC,
				${sharedInterestsQuery} DESC,
				fame_score DESC,
				id ASC
			`;
		}

		orderBy = orderBy.replace(/\s+/g, " ").trim();

		return {
			where,
			values,
			orderBy,
			limit,
			offset,
		};
	}
}
