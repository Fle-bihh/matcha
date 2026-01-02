import { useQuery } from "@tanstack/react-query";
import { EStorageKeys } from "@/types/storage.constants";
import { config } from "@/config";

async function fetchAuthenticatedImage(
	imageUrl: string
): Promise<string | null> {
	const token = localStorage.getItem(EStorageKeys.AccessToken);

	const fullUrl = imageUrl.startsWith("http")
		? imageUrl
		: `${config.apiUrl}/${imageUrl.replace(/^\//, "")}`;

	const response = await fetch(fullUrl, {
		headers: token
			? {
					Authorization: `Bearer ${token}`,
			  }
			: {},
	});

	if (!response.ok) {
		throw new Error(`Failed to load image: ${response.statusText}`);
	}

	const blob = await response.blob();
	return URL.createObjectURL(blob);
}

export function useAuthenticatedImage(imageUrl: string | null | undefined) {
	const {
		data: blobUrl,
		isLoading: loading,
		error,
	} = useQuery({
		queryKey: ["authenticated-image", imageUrl],
		queryFn: () => fetchAuthenticatedImage(imageUrl!),
		enabled: !!imageUrl,
		staleTime: Infinity,
		gcTime: 30 * 60 * 1000,
	});

	return {
		blobUrl: blobUrl ?? null,
		loading,
		error: error as Error | null,
	};
}
