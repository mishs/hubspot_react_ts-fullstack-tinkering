export type SortField = "name" | "email" | "company";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export type { User, Address, Company } from "../schemas/user.schema";
