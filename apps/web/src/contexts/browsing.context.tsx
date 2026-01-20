import {
	createContext,
	useContext,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useSelector } from "react-redux";
import { usePager } from "@/hooks";
import { selectFilters, selectBrowsingUsers } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes, StoreUser } from "@/types";
import { User, BrowsingFilters, BrowsingParams } from "@matcha/shared";
import { PaginationDto } from "@/types";
import { useActionsData } from "@/hooks";
import { EActionKeys } from "@/types";
import { useBrowsing } from "@/hooks";
import { useAuthUser } from "@/hooks";
import { EFilterKeys } from "@/types";

const FILTER_KEY = EFilterKeys.Browsing;

type BrowsingContextType = ReturnType<typeof useBrowsingState>;

const BrowsingContext = createContext<BrowsingContextType | undefined>(
	undefined,
);

function useBrowsingState() {
	const { getUsers, applyBrowsingFilters, clearBrowsingFilters } =
		useBrowsing();
	const filters = useSelector(selectFilters(FILTER_KEY));
	const { isLoading } = useActionsData([EActionKeys.GetUsers]);
	const browsingUsers = useSelector(selectBrowsingUsers);

	const buildParams = useCallback(
		(pagination: PaginationDto): BrowsingParams => ({
			...pagination,
			...(filters || {}),
			limit: pagination.limit || 12,
		}),
		[filters],
	);

	const pager = usePager(EEntityTypes.Users, {
		pagerKey: EPagerKeys.Users,
		fn: getUsers,
		buildParams,
		loadData: false,
	});

	const applyFilters = useCallback(
		(newFilters?: BrowsingFilters) => {
			const filtersToApply = newFilters || filters || {};
			const currentLimit = pager.meta?.limit ?? 12;

			applyBrowsingFilters({
				...filtersToApply,
				currentLimit,
			});
		},
		[filters, pager.meta?.limit, applyBrowsingFilters],
	);

	const clearFiltersHandler = useCallback(() => {
		clearBrowsingFilters();
	}, [clearBrowsingFilters]);

	const refresh = useCallback(() => {
		const currentLimit = pager.meta?.limit ?? 12;

		applyBrowsingFilters({
			...(filters || {}),
			currentLimit,
		});
	}, [applyBrowsingFilters, pager.meta?.limit, filters]);

	const hasChanges = useCallback(
		(filtersToCompare: BrowsingFilters) => {
			if (!filters) return Object.keys(filtersToCompare).length > 0;

			for (const key in filtersToCompare) {
				if (
					filtersToCompare[key as keyof BrowsingFilters] !==
					filters[key as keyof BrowsingFilters]
				) {
					return true;
				}
			}
			return false;
		},
		[filters],
	);

	return {
		...pager,
		data: browsingUsers,
		refresh,
		filters: filters || {},
		clearFilters: clearFiltersHandler,
		applyFilters,
		hasChanges,
		isLoading,
	};
}

export function BrowsingProvider({ children }: { children: ReactNode }) {
	const browsing = useBrowsingState();

	return (
		<BrowsingContext.Provider value={browsing}>
			{children}
		</BrowsingContext.Provider>
	);
}

export function useBrowsingContext() {
	const context = useContext(BrowsingContext);
	if (!context) {
		throw new Error(
			"useBrowsingContext must be used within BrowsingProvider",
		);
	}
	return context;
}
