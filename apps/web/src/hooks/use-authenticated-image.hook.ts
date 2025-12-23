import { useState, useEffect } from "react";
import { EStorageKeys } from "@/types/storage.constants";
import { config } from "@/config";

export function useAuthenticatedImage(imageUrl: string | null | undefined) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);

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

        if (!cancelled) {
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to load image")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl]);

  return { blobUrl, loading, error };
}
