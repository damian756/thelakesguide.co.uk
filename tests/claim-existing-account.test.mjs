// A claim submitted with the email of an existing account must never change that
// account: not its name, not its password. On Southport Guide (the code this site
// was cloned from) the claim route overwrote both, so anyone could lock out the
// owner of an email, an admin included, by claiming a listing with their address.
// This test runs the real route with a stand-in database and mail, and fails if the
// route writes to the existing user at all.
import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

// Point the route's "@/lib/..." and next/server imports at stand-ins kept on globalThis.
const stub = (body) => "data:text/javascript," + encodeURIComponent(body);
const STUBS = {
  // next/server has no ESM entry Node can resolve outside Next; the route only uses NextResponse.json.
  "next/server": stub("export const NextResponse = { json: (body, init) => Response.json(body, init) };"),
  "@/lib/prisma": stub("export const prisma = new Proxy({}, { get: (_, key) => globalThis.__claimTest.prisma[key] });"),
  "@/lib/resend": stub("export const getResend = () => globalThis.__claimTest.resend;"),
  "@/lib/contact": stub(
    "export const DELIVERY_EMAIL = 'owner@example.test';" +
      "export const FROM_EMAIL = 'Test <noreply@example.test>';" +
      "export const escapeHtml = (v) => String(v ?? '');" +
      "export const sendChecked = async (send) => { await send(); return true; };",
  ),
};
register(
  stub(
    `const STUBS = ${JSON.stringify(STUBS)};
     export async function resolve(specifier, context, next) {
       if (Object.hasOwn(STUBS, specifier)) return { url: STUBS[specifier], shortCircuit: true };
       return next(specifier, context);
     }`,
  ),
);

const BUSINESS_ID = "6f1c2b0a-1d2e-4f3a-9b8c-7d6e5f4a3b2c";

function world({ existingUser }) {
  const calls = { userUpdate: [], userCreate: [], claimCreate: [] };
  const users = existingUser ? [{ ...existingUser }] : [];
  globalThis.__claimTest = {
    calls,
    users,
    resend: { emails: { send: async () => ({ error: null }) } },
    prisma: {
      business: {
        findUnique: async () => ({
          id: BUSINESS_ID, name: "Test Cafe", claimed: false, address: "1 Main Street", postcode: "LA22 0AA",
          category: { name: "Cafes" },
        }),
      },
      claimRequest: {
        findFirst: async () => null,
        create: async ({ data }) => { calls.claimCreate.push(data); return { id: "c1", ...data }; },
      },
      user: {
        findUnique: async ({ where }) => {
          const u = users.find((x) => x.email === where.email);
          return u ? { ...u, businesses: [] } : null;
        },
        update: async ({ where, data }) => {
          calls.userUpdate.push({ where, data });
          const u = users.find((x) => x.id === where.id);
          if (u) Object.assign(u, data);
          return u;
        },
        create: async ({ data }) => { calls.userCreate.push(data); const u = { id: "new-user", ...data }; users.push(u); return u; },
      },
    },
  };
  return globalThis.__claimTest;
}

function claim(email) {
  return new Request("http://localhost/api/hub/claim/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessId: BUSINESS_ID, name: "Someone Else", email, message: "This is my cafe." }),
  });
}

const { POST } = await import("../app/api/hub/claim/submit/route.ts");

test("a claim with an existing account's email leaves that account's name and password unchanged", async () => {
  const owner = { id: "owner-1", email: "owner@example.test", name: "The Owner", password: "$2a$12$existinghashexistinghashexistinghashexistinghash12", role: "admin" };
  const w = world({ existingUser: owner });
  const res = await POST(claim(owner.email));
  assert.equal(res.status, 200);
  assert.equal(w.calls.userUpdate.length, 0, "the route must not write to the existing account");
  assert.equal(w.calls.userCreate.length, 0, "no second account for the same email");
  assert.equal(w.users[0].name, owner.name);
  assert.equal(w.users[0].password, owner.password);
  assert.equal(w.users[0].role, owner.role);
  assert.equal(w.calls.claimCreate.length, 1);
  assert.equal(w.calls.claimCreate[0].userId, owner.id, "the claim is linked to the existing account");
});

test("a claim with a new email still creates the account, with a random password hash", async () => {
  const w = world({ existingUser: null });
  const res = await POST(claim("new@example.test"));
  assert.equal(res.status, 200);
  assert.equal(w.calls.userCreate.length, 1);
  assert.equal(w.calls.userCreate[0].email, "new@example.test");
  assert.match(w.calls.userCreate[0].password, /^\$2[aby]\$12\$/);
  assert.equal(w.calls.userUpdate.length, 0);
  assert.equal(w.calls.claimCreate[0].userId, "new-user");
});
