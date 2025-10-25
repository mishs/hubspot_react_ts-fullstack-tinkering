import { UsersArraySchema, type User } from "@/schemas/user.schema";
import type { ApiError } from "@/types";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const validated = UsersArraySchema.parse(data);
    return validated;
  } catch (error) {
    if (error instanceof Error) {
      const apiError: ApiError = {
        message: error.message,
        status: error instanceof Response ? error.status : undefined,
      };
      throw apiError;
    }
    throw new Error("An unknown error occurred while fetching users");
  }
}
