"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface Props {
  user: { name: string | null; email: string };
  business: {
    weeklyEmailEnabled: boolean;
    hubTier: string;
    stripeSubscriptionId: string | null;
  } | null;
  subscription: {
    currentPeriodEnd: string | null;
  } | null;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h2 className="font-display text-lg font-bold text-[#1B2E4B]">{title}</h2>
      {children}
    </div>
  );
}

export function SettingsClient({ user, business, subscription }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email);
  const [nameSaving, setNameSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [weeklyEmail, setWeeklyEmail] = useState(business?.weeklyEmailEnabled ?? true);
  const [notifSaving, setNotifSaving] = useState(false);

  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelSaving, setCancelSaving] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function saveName() {
    setNameSaving(true);
    setNameMsg(null);
    const res = await fetch("/api/hub/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "name", name }),
    });
    const data = await res.json();
    setNameMsg(res.ok ? { ok: true, text: "Name updated." } : { ok: false, text: data.error ?? "Failed." });
    setNameSaving(false);
  }

  async function saveEmail() {
    setEmailSaving(true);
    setEmailMsg(null);
    const res = await fetch("/api/hub/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "email", email }),
    });
    const data = await res.json();
    setEmailMsg(res.ok ? { ok: true, text: "Email updated. Use new address to sign in." } : { ok: false, text: data.error ?? "Failed." });
    setEmailSaving(false);
  }

  async function savePassword() {
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "Passwords don't match." });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ ok: false, text: "Password must be at least 8 characters." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const res = await fetch("/api/hub/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "password", current: currentPw, new: newPw }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwMsg({ ok: true, text: "Password changed." });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setShowPwForm(false);
    } else {
      setPwMsg({ ok: false, text: data.error ?? "Failed." });
    }
    setPwSaving(false);
  }

  async function toggleWeeklyEmail() {
    const next = !weeklyEmail;
    setWeeklyEmail(next);
    setNotifSaving(true);
    await fetch("/api/hub/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weeklyEmailEnabled: next }),
    });
    setNotifSaving(false);
  }

  async function cancelSubscription() {
    setCancelSaving(true);
    setCancelMsg(null);
    const res = await fetch("/api/hub/cancel-subscription", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setCancelMsg({ ok: true, text: "Subscription cancelled. Pro access continues until end of billing period." });
      setCancelConfirm(false);
    } else {
      setCancelMsg({ ok: false, text: data.error ?? "Failed to cancel." });
    }
    setCancelSaving(false);
  }

  const periodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 bg-[#FAF8F5]";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Settings</h1>

      {/* Section 1 — Account */}
      <Section title="Account">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
            <button
              onClick={saveName}
              disabled={nameSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2E4B] text-white text-sm font-semibold rounded-lg hover:bg-[#16263f] disabled:opacity-50 whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              {nameSaving ? "Saving…" : "Save"}
            </button>
          </div>
          {nameMsg && (
            <p className={`text-xs mt-1.5 ${nameMsg.ok ? "text-emerald-600" : "text-red-500"}`}>
              {nameMsg.text}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address{" "}
            <span className="text-gray-400 font-normal">
              — changing this changes your login email
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
            <button
              onClick={saveEmail}
              disabled={emailSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2E4B] text-white text-sm font-semibold rounded-lg hover:bg-[#16263f] disabled:opacity-50 whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              {emailSaving ? "Saving…" : "Save"}
            </button>
          </div>
          {emailMsg && (
            <p className={`text-xs mt-1.5 ${emailMsg.ok ? "text-emerald-600" : "text-red-500"}`}>
              {emailMsg.text}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          {!showPwForm ? (
            <button
              onClick={() => setShowPwForm(true)}
              className="text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A]"
            >
              Change password →
            </button>
          ) : (
            <div className="space-y-3 border border-gray-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700">Change password</p>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Current password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <input
                type={showPw ? "text" : "password"}
                placeholder="New password (min 8 chars)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className={inputCls}
              />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className={inputCls}
              />
              {pwMsg && (
                <p className={`text-xs ${pwMsg.ok ? "text-emerald-600" : "text-red-500"}`}>
                  {pwMsg.text}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={savePassword}
                  disabled={pwSaving}
                  className="px-4 py-2 bg-[#1B2E4B] text-white text-sm font-semibold rounded-lg hover:bg-[#16263f] disabled:opacity-50"
                >
                  {pwSaving ? "Saving…" : "Update password"}
                </button>
                <button
                  onClick={() => {
                    setShowPwForm(false);
                    setPwMsg(null);
                  }}
                  className="px-4 py-2 text-gray-500 text-sm rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Section 2 — Email Preferences */}
      {business && <Section title="Email preferences">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Weekly performance email
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Sent every Monday at 8am with your stats
            </p>
          </div>
          <button
            role="switch"
            aria-checked={weeklyEmail}
            onClick={toggleWeeklyEmail}
            disabled={notifSaving}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              weeklyEmail ? "bg-[#C9A84C]" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                weeklyEmail ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </Section>}

      {/* Section 3 — Plan & Billing */}
      {business && <Section title="Plan &amp; billing">
        {business.hubTier === "pro" ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1B2E4B]">
                  Pro plan — active
                </p>
                {periodEnd && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Renews {periodEnd}
                  </p>
                )}
              </div>
              <span className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-2.5 py-1 rounded-full font-bold">
                PRO
              </span>
            </div>

            {cancelMsg && (
              <p className={`text-sm ${cancelMsg.ok ? "text-emerald-600" : "text-red-500"}`}>
                {cancelMsg.text}
              </p>
            )}

            {!cancelConfirm ? (
              <button
                onClick={() => setCancelConfirm(true)}
                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600"
              >
                <AlertTriangle className="w-4 h-4" />
                Cancel subscription
              </button>
            ) : (
              <div className="border border-red-200 rounded-xl p-4 space-y-3">
                <p className="text-sm text-gray-700">
                  Are you sure? Your Pro benefits will continue until{" "}
                  <strong>{periodEnd ?? "the end of your billing period"}</strong>,
                  then revert to Free.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={cancelSubscription}
                    disabled={cancelSaving}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {cancelSaving ? "Cancelling…" : "Yes, cancel"}
                  </button>
                  <button
                    onClick={() => setCancelConfirm(false)}
                    className="px-4 py-2 text-gray-500 text-sm rounded-lg hover:bg-gray-50"
                  >
                    Keep Pro
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">You&apos;re on the free plan.</p>
            <div className="bg-[#1B2E4B] rounded-2xl p-5 text-white space-y-3">
              <p className="font-display text-lg font-bold">Upgrade to Pro</p>
              <p className="text-sm text-white/80">
                Get featured placement, category benchmarks, event intel, and one
                free boost credit every month.
              </p>
              <a
                href="/dashboard/upgrade"
                className="inline-block mt-1 px-5 py-2.5 bg-[#C9A84C] text-white font-semibold text-sm rounded-lg hover:bg-[#B8972A]"
              >
                See Pro plans →
              </a>
            </div>
          </>
        )}
      </Section>}
    </div>
  );
}
