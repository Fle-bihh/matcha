export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type PartialBaseEntity<T extends BaseEntity> = Partial<
  Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">
>;
