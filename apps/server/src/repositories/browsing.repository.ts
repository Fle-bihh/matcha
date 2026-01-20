import {
	AuthUser,
	BrowsingFiltersDto,
	Gender,
	Orientation,
	logger,
	PaginationParams,
	User,
} from "@matcha/shared";
import {
	QueryOptions,
	ETokens,
	IRepository,
	TableSchema,
	IContainer,
} from "@/types";
import { BaseRepository, UserRepository } from "@/repositories";

export class BrowsingRepository extends BaseRepository implements IRepository {
	private readonly MAX_DISTANCE_KM = 999999;

	public loadTableSchema(): TableSchema {
		return {
			tableName: "",
			fields: "",
			constraints: "",
		};
	}

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	private getCompatibleGenders(
		userGender: Gender | null,
		userOrientation: Orientation | null,
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
		userLon: number | null,
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

	private applyAgeFilters(
		whereConditions: string[],
		values: any[],
		filters: BrowsingFiltersDto,
	): void {
		if (filters.age_min !== undefined) {
			whereConditions.push("age >= ?");
			values.push(filters.age_min);
		}
		if (filters.age_max !== undefined) {
			whereConditions.push("age <= ?");
			values.push(filters.age_max);
		}
	}

	private applyFameFilters(
		whereConditions: string[],
		values: any[],
		filters: BrowsingFiltersDto,
	): void {
		if (filters.fame_min !== undefined) {
			whereConditions.push("fame_score >= ?");
			values.push(filters.fame_min);
		}
		if (filters.fame_max !== undefined) {
			whereConditions.push("fame_score >= ?");
			values.push(filters.fame_max);
		}
	}

	private applyInterestsFilter(
		whereConditions: string[],
		values: any[],
		filters: BrowsingFiltersDto,
	): void {
		if (!filters.interests || filters.interests.length === 0) {
			return;
		}

		const interestConditions = filters.interests.map(
			() => "JSON_CONTAINS(interests, ?)",
		);
		whereConditions.push(`(${interestConditions.join(" OR ")})`);
		filters.interests.forEach((interest) => {
			values.push(JSON.stringify(interest));
		});
	}

	private applyDistanceFilter(
		whereConditions: string[],
		values: any[],
		filters: BrowsingFiltersDto,
		userLat: number | null,
		userLon: number | null,
	): void {
		if (
			filters.distance_max === undefined ||
			userLat === null ||
			userLon === null
		) {
			return;
		}

		const distanceCalc = this.buildDistanceQuery(userLat, userLon);
		whereConditions.push(`(${distanceCalc}) <= ?`);
		values.push(filters.distance_max);
	}

	private buildOrderByClause(
		filters: BrowsingFiltersDto,
		distanceQuery: string,
		sharedInterestsQuery: string,
	): string {
		if (!filters.sort_by) {
			return this.getDefaultOrderBy(distanceQuery, sharedInterestsQuery);
		}

		const sortOrder = filters.sort_order === "desc" ? "DESC" : "ASC";

		switch (filters.sort_by) {
			case "age":
				return `age ${sortOrder}, id ASC`;
			case "distance":
				return `${distanceQuery} ${sortOrder}, id ASC`;
			case "fame_rating":
				return `fame_score ${sortOrder}, id ASC`;
			case "common_tags":
				return `${sharedInterestsQuery} ${sortOrder}, id ASC`;
			default:
				return this.getDefaultOrderBy(
					distanceQuery,
					sharedInterestsQuery,
				);
		}
	}

	private getDefaultOrderBy(
		distanceQuery: string,
		sharedInterestsQuery: string,
	): string {
		return `
			${distanceQuery} ASC,
			${sharedInterestsQuery} DESC,
			fame_score DESC,
			id ASC
		`;
	}

	private buildCompatibilityFilters(
		currentUser: AuthUser,
		whereConditions: string[],
		values: any[],
	): void {
		whereConditions.push("id != ?");
		values.push(currentUser.id);

		whereConditions.push(
			"NOT EXISTS (SELECT 1 FROM likes WHERE likes.liker_id = ? AND likes.liked_id = users.id AND likes.deleted_at IS NULL)",
		);
		values.push(currentUser.id);

		whereConditions.push(
			"NOT EXISTS (SELECT 1 FROM blocks WHERE ((blocks.blocker_id = ? AND blocks.blocked_id = users.id) OR (blocks.blocker_id = users.id AND blocks.blocked_id = ?)) AND blocks.deleted_at IS NULL)",
		);
		values.push(currentUser.id, currentUser.id);

		const compatibleGenders = this.getCompatibleGenders(
			currentUser.gender,
			currentUser.orientation,
		);

		if (compatibleGenders.length > 0) {
			const genderPlaceholders = compatibleGenders
				.map(() => "?")
				.join(", ");
			whereConditions.push(`gender IN (${genderPlaceholders})`);
			values.push(...compatibleGenders);
		}

		if (currentUser.gender) {
			this.applyOrientationCompatibility(
				currentUser.gender,
				whereConditions,
				values,
			);
		}

		whereConditions.push("is_profile_complete = ?");
		values.push(true);
	}

	private applyOrientationCompatibility(
		userGender: Gender,
		whereConditions: string[],
		values: any[],
	): void {
		const orientationConditions: string[] = [];

		orientationConditions.push("orientation = ?");
		values.push(Orientation.Bisexual);

		orientationConditions.push("orientation IS NULL");

		if (userGender === Gender.Male) {
			orientationConditions.push("(orientation = ? AND gender = ?)");
			values.push(Orientation.Heterosexual, Gender.Female);
		} else if (userGender === Gender.Female) {
			orientationConditions.push("(orientation = ? AND gender = ?)");
			values.push(Orientation.Heterosexual, Gender.Male);
		}

		orientationConditions.push("(orientation = ? AND gender = ?)");
		values.push(Orientation.Homosexual, userGender);

		whereConditions.push(`(${orientationConditions.join(" OR ")})`);
	}

	public async getBrowsingQueryOptions(
		userId: number,
		limit: number,
		offset: number,
		filters: BrowsingFiltersDto,
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

		const whereConditions: string[] = [];
		const values: any[] = [];

		this.buildCompatibilityFilters(currentUser, whereConditions, values);
		this.applyAgeFilters(whereConditions, values, filters);
		this.applyFameFilters(whereConditions, values, filters);
		this.applyInterestsFilter(whereConditions, values, filters);

		const userLat = currentUser.location?.latitude ?? null;
		const userLon = currentUser.location?.longitude ?? null;

		this.applyDistanceFilter(
			whereConditions,
			values,
			filters,
			userLat,
			userLon,
		);

		const where = whereConditions.join(" AND ");

		const userInterests = currentUser.interests ?? null;
		const distanceQuery = this.buildDistanceQuery(userLat, userLon);
		const sharedInterestsQuery =
			this.buildSharedInterestsQuery(userInterests);

		const orderBy = this.buildOrderByClause(
			filters,
			distanceQuery,
			sharedInterestsQuery,
		)
			.replace(/\s+/g, " ")
			.trim();

		return {
			where,
			values,
			orderBy,
			limit,
			offset,
		};
	}
}
