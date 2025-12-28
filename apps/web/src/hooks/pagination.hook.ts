import { useSelector } from "react-redux";
import {
  selectPaginatedEntities,
  selectPagerMeta,
} from "@/store/selectors/pagination.selectors";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";

interface IPagerHookProps {
  pagerKey: EPagerKeys;
  entityType: EEntityTypes;
}
export function usePager({ pagerKey, entityType }: IPagerHookProps) {
  const data = useSelector(selectPaginatedEntities(pagerKey, entityType));
  const meta = useSelector(selectPagerMeta(pagerKey));

  return {
    data,
    meta,
  };
}
