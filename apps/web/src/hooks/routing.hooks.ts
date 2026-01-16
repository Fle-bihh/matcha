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

	const goBack = () => {
		if (window.history.length <= 2) {
			nav("/");
			return;
		}
		nav(-1);
	};

	return { toHome, goBack, push, replace };
};
