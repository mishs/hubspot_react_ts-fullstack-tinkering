import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./HomePage";
import { useUserStore } from "@/stores/useUserStore";
import { fixtureUsers, jsonResponse } from "@/test/fixtures";

const initialStore = useUserStore.getState();
const unavailable = () => jsonResponse({ error: "Service Unavailable" }, 503);

/** fetch answers come from this queue, one per request; a function lets a test hold a request open. */
let answers: Array<Response | (() => Promise<Response>)>;
let fetchSpy: MockInstance<typeof fetch>;
const deferred = () => {
  let resolve!: (r: Response) => void;
  const promise = new Promise<Response>((r) => (resolve = r));
  return { promise, resolve };
};

beforeEach(() => {
  useUserStore.setState(initialStore, true);
  answers = [];
  fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
    const next = answers.shift();
    if (!next) throw new Error("unexpected extra request");
    return typeof next === "function" ? next() : next;
  });
});
afterEach(() => vi.restoreAllMocks());

const cards = () => screen.queryAllByRole("listitem");

describe("directory loading", () => {
  it("shows the users after a normal load", async () => {
    answers.push(jsonResponse(fixtureUsers));
    render(<HomePage />);
    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
    expect(cards()).toHaveLength(3);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("explains a failed load and offers Retry, without pretending the directory is empty", async () => {
    answers.push(unavailable());
    render(<HomePage />);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("We couldn’t load the directory");
    expect(alert).toHaveTextContent("(error 503)");
    expect(within(alert).getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.queryByText("Try adjusting your search criteria")).not.toBeInTheDocument();
    expect(screen.queryByText(/No users/)).not.toBeInTheDocument();
  });

  it("shows a real empty state for a successful empty response", async () => {
    answers.push(jsonResponse([]));
    render(<HomePage />);
    expect(await screen.findByText("The directory is empty")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("treats unreadable data as a failure, not as an empty directory", async () => {
    answers.push(jsonResponse({ unexpected: true }));
    render(<HomePage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("sent data we couldn’t read");
    expect(screen.queryByText("The directory is empty")).not.toBeInTheDocument();
  });
});

describe("Retry", () => {
  it("makes a new request, shows it is pending, then shows the returned users in place", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    answers.push(unavailable(), () => pending.promise);
    render(<HomePage />);
    await user.click(await screen.findByRole("button", { name: "Retry" }));

    const button = screen.getByRole("button", { name: "Retrying…" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("Loading users")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    await act(async () => pending.resolve(jsonResponse(fixtureUsers)));
    expect(await screen.findByText("Ervin Howell")).toBeInTheDocument();
    expect(cards()).toHaveLength(3); // no duplicates
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("load-announcement")).toHaveTextContent("Directory loaded: 3 users.");
  });

  it("ignores extra clicks while a retry is pending", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    answers.push(unavailable(), () => pending.promise);
    render(<HomePage />);
    await user.click(await screen.findByRole("button", { name: "Retry" }));
    await user.click(screen.getByRole("button", { name: "Retrying…" }));
    await user.click(screen.getByRole("button", { name: "Retrying…" }));
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    await act(async () => pending.resolve(jsonResponse(fixtureUsers)));
    expect(await screen.findAllByRole("listitem")).toHaveLength(3);
  });

  it("stays truthful when the retry fails again, and a later retry recovers", async () => {
    const user = userEvent.setup();
    answers.push(unavailable(), unavailable(), jsonResponse(fixtureUsers));
    render(<HomePage />);
    await user.click(await screen.findByRole("button", { name: "Retry" }));
    const alert = await screen.findByText("Still couldn’t load the directory");
    expect(alert).toBeInTheDocument();
    expect(cards()).toHaveLength(0);
    expect(screen.queryByText(/Directory loaded/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("Clementine Bauch")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it("keeps the search typed during the outage and applies it to the recovered users", async () => {
    const user = userEvent.setup();
    answers.push(unavailable(), jsonResponse(fixtureUsers));
    render(<HomePage />);
    await screen.findByRole("alert");
    await user.type(screen.getByRole("searchbox", { name: "Search users" }), "Ervin");
    await act(() => new Promise((r) => setTimeout(r, 350))); // search debounce
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Ervin Howell")).toBeInTheDocument();
    expect(cards()).toHaveLength(1);
    expect(screen.getByRole("searchbox", { name: "Search users" })).toHaveValue("Ervin");
  });

  it("can be reached and used with the keyboard alone", async () => {
    const user = userEvent.setup();
    answers.push(unavailable(), jsonResponse(fixtureUsers));
    render(<HomePage />);
    const retry = await screen.findByRole("button", { name: "Retry" });
    for (let i = 0; i < 6 && document.activeElement !== retry; i++) await user.tab();
    expect(retry).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByTestId("directory-results")).toHaveFocus(); // focus lands on the results
  });
});

describe("search results", () => {
  it("says when a search matches nobody, distinct from an empty directory", async () => {
    const user = userEvent.setup();
    answers.push(jsonResponse(fixtureUsers));
    render(<HomePage />);
    await screen.findByText("Leanne Graham");
    await user.type(screen.getByRole("searchbox", { name: "Search users" }), "Zed");
    expect(await screen.findByText("No users match “Zed”")).toBeInTheDocument();
    expect(screen.queryByText("The directory is empty")).not.toBeInTheDocument();
  });
});
