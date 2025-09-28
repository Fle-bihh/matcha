import { setLoader } from "@/store/slices/loaders.slice";
import { ELoaderKeys } from "@/types/store.types";
import { logger } from "@matcha/shared";
import { useDispatch, useSelector } from "react-redux";

interface IProps {
	loaders: ELoaderKeys | ELoaderKeys[];
}

export const useLoaders = ({ loaders }: IProps) => {
	const dispatch = useDispatch();
	const loadersData = Array.isArray(loaders) ? loaders : [loaders];
	const isLoading = useSelector((state: any) => {
		for (const loader of loadersData) {
			if (state.loaders[loader]) {
				return true;
			}
		}
		return false;
	});

	const setLoaderState = (isLoading: boolean) => {
		loadersData.forEach((loader) => {
			dispatch(setLoader({ key: loader, loading: isLoading }));
		});
	};

	return {
		isLoading,
		setLoaderState,
	};
};
