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
import { usePager } from "@/hooks/pagination.hook";
import { selectFilters } from "@/store/selectors/filters.selectors";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { User, BrowsingFilters, BrowsingParams } from "@matcha/shared";
import { PaginationDto } from "@/types/api.types";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useBrowsing } from "@/hooks/browsing.hook";
import { useAuthUser } from "@/hooks/auth.hook";
import { EFilterKeys } from "@/types/filters.types";

const FILTER_KEY = EFilterKeys.Browsing;

type BrowsingContextType = ReturnType<typeof useBrowsingState>;

const BrowsingContext = createContext<BrowsingContextType | undefined>(
	undefined
);

function useBrowsingState() {
	const { getUsers, applyBrowsingFilters, clearBrowsingFilters } =
		useBrowsing();
	const filters = useSelector(selectFilters(FILTER_KEY));
	const { isLoading } = useActionsData([EActionKeys.GetUsers]);

	const buildParams = useCallback(
		(pagination: PaginationDto): BrowsingParams => ({
			...pagination,
			...(filters || {}),
		}),
		[filters]
	);

	const pager = usePager<User, BrowsingParams>({
		pagerKey: EPagerKeys.Users,
		entityType: EEntityTypes.Users,
		fn: getUsers,
		buildParams,
		loadData: false,
	});

	const applyFilters = useCallback(
		(newFilters?: BrowsingFilters) => {
			const filtersToApply = newFilters || filters || {};
			const currentLimit = pager.meta?.limit ?? 10;

			applyBrowsingFilters({
				...filtersToApply,
				currentLimit,
			});
		},
		[filters, pager.meta?.limit, applyBrowsingFilters]
	);

	const clearFiltersHandler = useCallback(() => {
		clearBrowsingFilters();
	}, [clearBrowsingFilters]);

	const refresh = useCallback(() => {
		const currentLimit = pager.meta?.limit ?? 10;

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
		[filters]
	);

	return {
		...pager,
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
			"useBrowsingContext must be used within BrowsingProvider"
		);
	}
	return context;
}
