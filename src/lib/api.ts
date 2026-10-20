import { UsersArraySchema, type User } from "@/schemas/user.schema";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/** Why a directory load failed: the service answered with an error, could not be reached, or sent unreadable data. */
export type LoadFailureKind = "unavailable" | "network" | "invalid-data";

export class DirectoryLoadError extends Error {
  readonly kind: LoadFailureKind;
  readonly status?: number;

  constructor(kind: LoadFailureKind, message: string, status?: number) {
    super(message);
    this.name = "DirectoryLoadError";
    this.kind = kind;
    this.status = status;
  }
}

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users`, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new DirectoryLoadError("network", "The directory service could not be reached.");
  }

  if (!response.ok) {
    throw new DirectoryLoadError(
      "unavailable",
      `The directory service responded with an error (${response.status}).`,
      response.status
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new DirectoryLoadError(
      "invalid-data",
      "The directory service sent a response that could not be read."
    );
  }

  const parsed = UsersArraySchema.safeParse(data);
  if (!parsed.success) {
    throw new DirectoryLoadError(
      "invalid-data",
      "The directory service sent data in an unexpected format."
    );
  }
  return parsed.data;
}
