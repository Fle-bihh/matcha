import { useSelector } from "react-redux";
import { useAuthUser } from "./auth.hook";
import { selectAllEntities } from "@/store/selectors/entity.selectors";
import { EEntityTypes } from "@/types";
import { Match } from "@matcha/shared";

export function useMatches() {
	const matches = useSelector(selectAllEntities<Match>(EEntityTypes.Matches));

	return {
		matches,
	};
}
