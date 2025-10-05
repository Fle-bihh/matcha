import { EStorageKeys, StorageDataType } from "@/types/storage.constants";
import { BaseService } from "./base.service";

export class StorageService extends BaseService {
	public async getItem(
		key: EStorageKeys
	): Promise<StorageDataType[typeof key]> {
		const item = localStorage.getItem(key);
		if (!item) return null;

		try {
			return JSON.parse(item);
		} catch {
			return item;
		}
	}

	public async setItem<T extends EStorageKeys>(
		key: T,
		value: StorageDataType[T]
	): Promise<void> {
		const item = typeof value === "string" ? value : JSON.stringify(value);
		localStorage.setItem(key, item);
	}

	public async removeItem(key: EStorageKeys): Promise<void> {
		localStorage.removeItem(key);
	}

	public async clear(): Promise<void> {
		localStorage.clear();
	}
}
