import { useCallback, useEffect, useRef, useState } from "react";
import { DirectoryLoadError, fetchUsers } from "@/lib/api";
import type { User } from "@/types";

export type DirectoryLoadStatus = "loading" | "success" | "error";

export interface DirectoryLoadState {
  status: DirectoryLoadStatus;
  /** The last failure; kept while a retry is pending so the message stays in place. */
  error: DirectoryLoadError | null;
  /** Consecutive failed attempts since the last successful load. */
  failedAttempts: number;
}

const toLoadError = (error: unknown) =>
  error instanceof DirectoryLoadError
    ? error
    : new DirectoryLoadError("network", "The directory could not be loaded.");

/**
 * Loads the directory once on mount and exposes `retry` to request it again in place.
 * Only the latest request may update state, so a slow earlier response can never
 * overwrite a newer result; leaving the page cancels the request in flight.
 */
export function useDirectoryLoad(onLoaded: (users: User[]) => void) {
  const [state, setState] = useState<DirectoryLoadState>({
    status: "loading",
    error: null,
    failedAttempts: 0,
  });
  const latest = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    const id = ++latest.current;
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const users = await fetchUsers(current.signal);
      if (id !== latest.current) return;
      onLoaded(users);
      setState({ status: "success", error: null, failedAttempts: 0 });
    } catch (error) {
      if (id !== latest.current || current.signal.aborted) return;
      setState((s) => ({
        status: "error",
        error: toLoadError(error),
        failedAttempts: s.failedAttempts + 1,
      }));
    }
  }, [onLoaded]);

  useEffect(() => {
    load();
    return () => controller.current?.abort();
  }, [load]);

  const retry = useCallback(() => {
    if (state.status === "loading") return; // one attempt at a time
    load();
  }, [load, state.status]);

  return { ...state, retry };
}
