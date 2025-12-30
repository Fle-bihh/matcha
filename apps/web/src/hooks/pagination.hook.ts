import { useSelector } from "react-redux";
import {
  selectPaginatedEntities,
  selectPagerMeta,
} from "@/store/selectors/pagination.selectors";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { PaginationParams } from "@matcha/shared";
import { useEffect, useRef } from "react";

interface IPagerHookProps {
  pagerKey: EPagerKeys;
  entityType: EEntityTypes;
  fn: (params: PaginationParams | null) => void;
  loadData?: boolean;
}
export function usePager<T>({
  pagerKey,
  entityType,
  fn,
  loadData = true,
}: IPagerHookProps) {
  const hasLoaded = useRef(false);
  const data = useSelector(selectPaginatedEntities<T>(pagerKey, entityType));
  const meta = useSelector(selectPagerMeta(pagerKey));

  useEffect(() => {
    if (loadData && !hasLoaded.current) {
      hasLoaded.current = true;
      fn({ page: 1, limit: 10 });
    }
  }, [fn, loadData]);

  return {
    data,
    meta,
  };
}
