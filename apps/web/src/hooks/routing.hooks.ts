import { useNavigate } from "react-router-dom";

export const useRouting = () => {
	const nav = useNavigate();

	const push = (path: string) => {
		nav(path);
	};

	const replace = (path: string) => {
		nav(path, { replace: true });
	};

	const toHome = () => {
		nav("/");
	};

	return { toHome };
};
