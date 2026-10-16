import { afterEach, describe, expect, it, vi } from "vitest";
import { DirectoryLoadError, fetchUsers } from "./api";
import { fixtureUsers, jsonResponse } from "@/test/fixtures";

const mockFetch = (impl: () => Promise<Response>) =>
  vi.spyOn(globalThis, "fetch").mockImplementation(impl);
const failure = (p: Promise<unknown>) =>
  p.then(
    () => {
      throw new Error("expected a failure");
    },
    (e: unknown) => e as DirectoryLoadError
  );

afterEach(() => vi.restoreAllMocks());

describe("fetchUsers", () => {
  it("returns validated users from a successful response", async () => {
    mockFetch(async () => jsonResponse(fixtureUsers));
    await expect(fetchUsers()).resolves.toEqual(fixtureUsers);
  });

  it("returns an empty list for a valid empty response", async () => {
    mockFetch(async () => jsonResponse([]));
    await expect(fetchUsers()).resolves.toEqual([]);
  });

  it("reports an HTTP error as the service being unavailable, with its status", async () => {
    mockFetch(async () => jsonResponse({ error: "Service Unavailable" }, 503));
    const error = await failure(fetchUsers());
    expect(error).toBeInstanceOf(DirectoryLoadError);
    expect(error.kind).toBe("unavailable");
    expect(error.status).toBe(503);
  });

  it("reports a request that never reaches the service as a network failure", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect((await failure(fetchUsers())).kind).toBe("network");
  });

  it("reports data in the wrong shape as invalid, not as an empty directory", async () => {
    mockFetch(async () => jsonResponse({ unexpected: true }));
    expect((await failure(fetchUsers())).kind).toBe("invalid-data");
  });

  it("reports a body that is not JSON as invalid", async () => {
    mockFetch(async () => new Response("<html>oops</html>", { status: 200 }));
    expect((await failure(fetchUsers())).kind).toBe("invalid-data");
  });

  it("lets a cancelled request stay cancelled", async () => {
    const controller = new AbortController();
    mockFetch(async () => {
      throw new DOMException("Aborted", "AbortError");
    });
    controller.abort();
    const error = await failure(fetchUsers(controller.signal));
    expect(error).not.toBeInstanceOf(DirectoryLoadError);
  });
});
