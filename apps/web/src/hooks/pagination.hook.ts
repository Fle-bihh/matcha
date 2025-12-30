import { useSelector } from "react-redux";
import {
  selectPaginatedEntities,
  selectPagerMeta,
} from "@/store/selectors/pagination.selectors";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { PaginationParams } from "@matcha/shared";
import { useEffect, useRef, useCallback } from "react";

interface IPagerHookProps {
  pagerKey: EPagerKeys;
  entityType: EEntityTypes;
  fn: (params: PaginationParams | null) => void;
  loadData?: boolean;
  defaultLimit?: number;
}
export function usePager<T>({
  pagerKey,
  entityType,
  fn,
  loadData = true,
  defaultLimit = 10,
}: IPagerHookProps) {
  const hasLoaded = useRef(false);
  const data = useSelector(selectPaginatedEntities<T>(pagerKey, entityType));
  const meta = useSelector(selectPagerMeta(pagerKey));

  useEffect(() => {
    if (loadData && !hasLoaded.current) {
      hasLoaded.current = true;
      fn({ page: 1, limit: defaultLimit });
    }
  }, [fn, loadData, defaultLimit]);

  const fetchPage = useCallback(
    (page: number, limit?: number) => {
      fn({ page, limit: limit ?? meta?.limit ?? defaultLimit });
    },
    [fn, meta?.limit, defaultLimit]
  );

  const fetchNextPage = useCallback(() => {
    if (meta?.hasNextPage) {
      fetchPage(meta.page + 1);
    }
  }, [meta, fetchPage]);

  const fetchPreviousPage = useCallback(() => {
    if (meta?.hasPreviousPage) {
      fetchPage(meta.page - 1);
    }
  }, [meta, fetchPage]);

  const refresh = useCallback(() => {
    const currentPage = meta?.page ?? 1;
    const currentLimit = meta?.limit ?? defaultLimit;
    fn({ page: currentPage, limit: currentLimit });
  }, [fn, meta?.page, meta?.limit, defaultLimit]);

  const setLimit = useCallback(
    (newLimit: number) => {
      fn({ page: 1, limit: newLimit });
    },
    [fn]
  );

  return {
    data,
    meta,
    fetchPage,
    fetchNextPage,
    fetchPreviousPage,
    refresh,
    setLimit,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
  };
}
