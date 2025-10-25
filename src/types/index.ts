export type SortField = "name" | "email" | "company";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type { User, Address, Company } from "../schemas/user.schema";
