// Contact form checks (11 Nov 2026). Run: npm run test:contact
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  DELIVERY_EMAIL,
  FROM_EMAIL,
  ENQUIRY_TYPES,
  buildEnquiryEmail,
  escapeHtml,
  isValidEmail,
  logSendError,
  normaliseEnquiryType,
  sendChecked,
} from "../lib/contact.ts";

const root = new URL("..", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const walk = (dir) =>
  readdirSync(new URL(dir, root)).flatMap((name) => {
    const rel = join(dir, name).split(String.fromCharCode(92)).join("/");
    return statSync(new URL(rel, root)).isDirectory() ? walk(rel + "/") : [rel];
  });
const base = { name: "n", email: "e@x.co", subject: "General enquiry", message: "m" };

test("the form delivers to damian@churchtownmedia.co.uk from the verified stand-in sender", () => {
  assert.equal(DELIVERY_EMAIL, "damian@churchtownmedia.co.uk");
  assert.equal(FROM_EMAIL, "The Lakes Guide <noreply@southportguide.co.uk>");
  const mail = buildEnquiryEmail(base);
  assert.deepEqual(mail.to, [DELIVERY_EMAIL]);
  assert.equal(mail.from, FROM_EMAIL);
});

test("the route builds the mail in lib/contact.ts, checks the send result and fails loudly", () => {
  const src = read("app/api/contact/route.ts");
  assert.match(src, /from "@\/lib\/contact"/);
  assert.match(src, /const\s*\{\s*error\s*\}\s*=\s*await\s+getResend\(\)\.emails\.send\(\s*buildEnquiryEmail\(/);
  assert.match(src, /if\s*\(error\)\s*\{\s*logSendError\(error\);\s*return NextResponse\.json\([\s\S]*?status:\s*502/);
  assert.match(src, /catch\s*\(err\)\s*\{\s*logSendError\(err\);/);
  assert.match(src, /isValidEmail\(email\)/);
  assert.match(src, /HONEYPOT_FIELD/);
  assert.doesNotMatch(src, /RESEND_FROM_EMAIL/, "the sender must be the constant, not an env override");
});

test("the client form never imports lib/contact.ts (keeps the address out of the browser bundle)", () => {
  assert.doesNotMatch(read("app/contact/ContactClient.tsx"), /from\s+["'](?:@\/|\.\.\/)+lib\/contact["']/);
});

test("the form's enquiry types match what the route accepts", () => {
  const cf = read("app/contact/ContactClient.tsx");
  const block = cf.match(/const SUBJECTS = \[([\s\S]*?)\]/)[1];
  assert.deepEqual([...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]), [...ENQUIRY_TYPES]);
  assert.equal(normaliseEnquiryType("Report an issue"), "Report an issue");
  assert.equal(normaliseEnquiryType("<b>spam</b>"), "General enquiry");
  assert.match(cf, /name="website"/, "honeypot field missing from the form");
});

test("every typed value is escaped in the html", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  const evil = "<script>x</script>&";
  for (const field of ["name", "email", "subject", "message", "businessName"]) {
    const html = buildEnquiryEmail({ ...base, [field]: evil }).html;
    assert.ok(!html.includes("<script>"), field + " not escaped");
    assert.ok(html.includes("&lt;script&gt;x&lt;/script&gt;&amp;"), field + " missing escaped text");
  }
  assert.ok(buildEnquiryEmail({ ...base, message: "a\nb" }).html.includes("a<br>b"));
});

test("replyTo is the enquirer's address; unsafe addresses are rejected", () => {
  assert.equal(buildEnquiryEmail({ ...base, email: "visitor@example.com" }).replyTo, "visitor@example.com");
  for (const bad of ["a@b.co, c@d.co", "a@b.co\nBcc: x@y.co", "a b@c.co", "<a@b.co>", "nodomain", "a@b", "x".repeat(250) + "@b.co"]) {
    assert.equal(isValidEmail(bad), false, bad);
    assert.equal(buildEnquiryEmail({ ...base, email: bad }).replyTo, undefined, bad);
  }
});

test("the subject has no CR or LF", () => {
  const { subject } = buildEnquiryEmail({ ...base, name: "a\r\nBcc: x", businessName: "b\nc" });
  assert.doesNotMatch(subject, /[\r\n]/);
});

test("logSendError logs only the error's name and message", () => {
  const calls = [];
  const orig = console.error;
  console.error = (...args) => calls.push(args);
  try {
    logSendError({ name: "validation_error", message: "domain not verified", to: "secret@x.co", body: "private text" });
  } finally {
    console.error = orig;
  }
  assert.equal(calls.length, 1);
  const out = calls[0].join(" ");
  assert.match(out, /validation_error/);
  assert.match(out, /domain not verified/);
  assert.doesNotMatch(out, /secret@x\.co|private text/);
});

test("no address of ours is printed on any page, public file or mail text", () => {
  const ours = /[A-Za-z0-9._%+-]+@(?:[a-z0-9-]+\.)*(?:thelakes\.network|thelakesguide\.co\.uk|hikethelakes\.com|thelakeswildlife\.co\.uk|churchtownmedia\.co\.uk|southportguide\.co\.uk)/gi;
  // Server-side senders and recipients that a visitor never sees on a page,
  // and the public demo account's login name. Anything else fails.
  const allowed = {
    "lib/contact.ts": ["damian@churchtownmedia.co.uk", "noreply@southportguide.co.uk"],
    "app/dashboard/DashboardLoginClient.tsx": ["demo@thelakesguide.co.uk"],
    "app/dashboard/(hub)/HubShell.tsx": ["demo@thelakesguide.co.uk"],
    "app/api/hub/upload-image/route.ts": ["demo@thelakesguide.co.uk", "demo@thelakesguide.co.uk"],
    "app/api/hub/create-pro-checkout/route.ts": ["demo@thelakesguide.co.uk"],
    "app/api/hub/create-boost-checkout/route.ts": ["demo@thelakesguide.co.uk"],
  };
  const files = [...walk("app/"), ...walk("components/"), ...walk("lib/"), ...walk("public/")].filter((f) =>
    /\.(ts|tsx|js|mjs|json|txt|xml|md|html)$/.test(f),
  );
  for (const f of files) {
    const src = read(f).replace(/^\s*\/\/.*$/gm, "");
    const found = (src.match(ours) ?? []).map((a) => a.toLowerCase());
    assert.deepEqual(found, allowed[f] ?? [], `${f} prints ${found.join(", ")}`);
  }
});

test("no route or helper can fall back to Resend's test sender (resend.dev)", () => {
  const files = [...walk("app/"), ...walk("lib/"), ...walk("components/")].filter((f) => /\.(ts|tsx|js|mjs)$/.test(f));
  for (const f of files) assert.ok(!read(f).replace(/^\s*\/\/.*$/gm, "").includes("resend.dev"), `${f} mentions resend.dev`);
});

test("hub mail (claims, reviews) sends from the stand-in sender and checks every send", () => {
  const files = [
    "app/api/hub/claim/submit/route.ts",
    "app/api/admin/claims/[id]/approve/route.ts",
    "app/api/admin/claims/[id]/reject/route.ts",
    "app/api/reviews/route.ts",
    "app/api/admin/reviews/[id]/route.ts",
    "app/api/auth/forgot-password/route.ts",
  ];
  for (const f of files) {
    const src = read(f);
    const sends = (src.match(/emails\.send\(/g) ?? []).length;
    const checked = (src.match(/sendChecked\(\(\) => getResend\(\)\.emails\.send\(/g) ?? []).length;
    assert.ok(sends > 0, f);
    assert.equal(checked, sends, `${f}: every send must go through sendChecked`);
    assert.doesNotMatch(src, /RESEND_FROM_EMAIL|from:\s*"/, `${f}: sender must be FROM_EMAIL from lib/contact.ts`);
  }
  assert.match(read("lib/email-templates/claim-approval.ts"), /import \{ FROM_EMAIL, escapeHtml \} from "@\/lib\/contact"/);
});

test("sendChecked reports a refused or thrown send without throwing", async () => {
  const calls = [];
  const orig = console.error;
  console.error = (...args) => calls.push(args.join(" "));
  try {
    assert.equal(await sendChecked(async () => ({ error: null }), "X"), true);
    assert.equal(await sendChecked(async () => ({ error: { name: "validation_error", message: "nope" } }), "Claim email"), false);
    assert.equal(await sendChecked(() => { throw new Error("RESEND_API_KEY is not set"); }, "Review email"), false);
  } finally {
    console.error = orig;
  }
  assert.equal(calls.length, 2);
  assert.match(calls[0], /Claim email failed: validation_error nope/);
  assert.match(calls[1], /Review email failed: Error RESEND_API_KEY is not set/);
});

test("hub mail templates escape the names and text people type", () => {
  const raw = {
    "lib/email-templates/claim-approval.ts": ["${params.name}", "${params.businessName}"],
    "lib/email-templates/review-verify.ts": ["${businessName}", "${reviewerName}", "${reviewerDisplay}", '${ownerName || "there"}', "${reviewBody.slice(0, 300)}"],
    "app/api/hub/claim/submit/route.ts": ["${parsed.data.name}", "${parsed.data.email}", "${message}", "${message.replace"],
  };
  for (const [f, list] of Object.entries(raw)) {
    const src = read(f);
    for (const r of list) assert.ok(!src.includes(r), `${f} interpolates ${r} without escaping`);
  }
  // business.name only appears raw in subject lines, which are not HTML.
  for (const line of read("app/api/hub/claim/submit/route.ts").split("\n").filter((l) => l.includes("${business.name}"))) {
    assert.match(line, /^\s*subject:/, line);
  }
});

test("password reset: the send goes through sendChecked with FROM_EMAIL and the answer never depends on it", () => {
  const src = read("app/api/auth/forgot-password/route.ts");
  assert.match(src, /import \{ FROM_EMAIL, sendChecked \} from "@\/lib\/contact"/);
  assert.match(src, /\n\s*await sendChecked\(\(\) => getResend\(\)\.emails\.send\(\{\s*from: FROM_EMAIL,/, "send must be wrapped and its result unused");
  assert.doesNotMatch(src, /(const|let|if\s*\(|return)\s*[^\n]*sendChecked/, "the route must not branch on the send result");
  // Every answer the route can give: the same ok for a known or unknown address,
  // 400 for no address, 500 only for an error before the send (sendChecked never throws).
  const answers = [...src.matchAll(/NextResponse\.json\(([^;]*)\);/g)].map((m) => m[1].replace(/\s+/g, " "));
  assert.deepEqual(answers, [
    '{ error: "Email required." }, { status: 400 }',
    "{ ok: true }",
    "{ ok: true }",
    '{ error: "Something went wrong." }, { status: 500 }',
  ]);
  const okAfterSend = src.lastIndexOf("NextResponse.json({ ok: true })");
  assert.ok(okAfterSend > src.indexOf("sendChecked(() =>"), "the ok answer must follow the send unconditionally");
});

test("password reset: the link always starts with the site address, never \"undefined\"", () => {
  const src = read("app/api/auth/forgot-password/route.ts");
  const line = src.split(/\r?\n/).find((l) => l.includes("/dashboard/reset-password?token="));
  assert.ok(line, "the reset link is built in the route");
  assert.match(line, /process\.env\.NEXTAUTH_URL \|\| "https:\/\/www\.thelakesguide\.co\.uk"/, "NEXTAUTH_URL has a fallback");
  const build = (base) => `${base || "https://www.thelakesguide.co.uk"}/dashboard/reset-password?token=t`;
  assert.ok(!build(undefined).startsWith("undefined"));
  assert.ok(build(undefined).startsWith("https://www.thelakesguide.co.uk/"));
});

test("a failed send's log never contains an email address", () => {
  const calls = [];
  const orig = console.error;
  console.error = (...args) => calls.push(args.join(" "));
  try {
    logSendError({ name: "validation_error", message: "Invalid `to` field: someone@example.co.uk is not allowed" }, "Password reset email");
  } finally {
    console.error = orig;
  }
  assert.match(calls[0], /Password reset email failed: validation_error Invalid `to` field: \[address\] is not allowed/);
  assert.doesNotMatch(calls[0], /someone@example/);
});
