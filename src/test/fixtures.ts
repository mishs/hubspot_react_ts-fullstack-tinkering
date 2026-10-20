import type { User } from "@/types";

/** Deterministic synthetic users in the API's shape (ids 1-3). */
export const fixtureUsers: User[] = [
  ["Leanne Graham", "Bret", "Sincere@april.biz", "Romaguera-Crona"],
  ["Ervin Howell", "Antonette", "Shanna@melissa.tv", "Deckow-Crist"],
  ["Clementine Bauch", "Samantha", "Nathan@yesenia.net", "Romaguera-Jacobson"],
].map(([name, username, email, company], i) => ({
  id: i + 1,
  name,
  username,
  email,
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: { lat: "-37.3159", lng: "81.1496" },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: company,
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
}));

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
