"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type BusinessBasic = {
  id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string };
};

type ClaimCandidate = {
  business: BusinessBasic & { email?: string | null };
  views: number;
  lastSentAt: string | null;
};

type UpgradeCandidate = {
  business: BusinessBasic;
  views: number;
  lastSentAt: string | null;
};

type BoostCandidate = {
  business: BusinessBasic;
  currViews: number;
  delta: number;
  lastSentAt: string | null;
};

type LogEntry = {
  id: string;
  businessId: string;
  businessName: string;
  type: string;
  sentTo: string;
  sentAt: string;
  sentBy: string | null;
};

type Props = {
  claimCandidates: ClaimCandidate[];
  upgradeCandidates: UpgradeCandidate[];
  boostCandidates: BoostCandidate[];
  logs: LogEntry[];
};

type SendState = "idle" | "sending" | "sent" | "error";

const TABS = [
  { value: "claim", label: "Claim candidates" },
  { value: "upgrade", label: "Upgrade candidates" },
  { value: "boost", label: "Boost candidates" },
  { value: "log", label: "Log" },
] as const;

function typeLabel(type: string): string {
  if (type === "claim_invite") return "Claim invite";
  if (type === "upgrade_nudge") return "Upgrade nudge";
  if (type === "boost_upsell") return "Boost upsell";
  return type;
}

function typePillClass(type: string): string {
  if (type === "claim_invite") return "bg-blue-100 text-blue-800";
  if (type === "upgrade_nudge") return "bg-amber-100 text-amber-800";
  if (type === "boost_upsell") return "bg-emerald-100 text-emerald-800";
  return "bg-gray-100 text-gray-700";
}

export default function OutreachClient({
  claimCandidates,
  upgradeCandidates,
  boostCandidates,
  logs,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as (typeof TABS)[number]["value"]) || "claim";
  const validTab = TABS.some((t) => t.value === tab) ? tab : "claim";

  const [sendState, setSendState] = useState<Record<string, { status: SendState; error?: string }>>({});

  async function sendClaimInvite(businessId: string) {
    setSendState((s) => ({ ...s, [businessId]: { status: "sending" } }));
    const res = await fetch("/api/admin/outreach/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
    const data = await res.json();
    if (res.ok) {
      setSendState((s) => ({ ...s, [businessId]: { status: "sent" } }));
      router.refresh();
    } else if (res.status === 409) {
      setSendState((s) => ({ ...s, [businessId]: { status: "sent" } }));
      router.refresh();
    } else {
      setSendState((s) => ({
        ...s,
        [businessId]: { status: "error", error: data.error || "Failed to send" },
      }));
    }
  }

  async function sendUpgradeNudge(businessId: string) {
    setSendState((s) => ({ ...s, [businessId]: { status: "sending" } }));
    const res = await fetch("/api/admin/outreach/upgrade-nudge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
    const data = await res.json();
    if (res.ok) {
      setSendState((s) => ({ ...s, [businessId]: { status: "sent" } }));
      router.refresh();
    } else if (res.status === 409) {
      setSendState((s) => ({ ...s, [businessId]: { status: "sent" } }));
      router.refresh();
    } else {
      setSendState((s) => ({
        ...s,
        [businessId]: { status: "error", error: data.error || "Failed to send" },
      }));
    }
  }

  async function sendBoostUpsell(businessId: string, delta: number, currViews: number) {
    setSendState((s) => ({ ...s, [businessId]: { status: "sending" } }));
    const res = await fetch("/api/admin/outreach/boost-upsell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, delta, currViews }),
    });
    const data = await res.json();
    if (res.ok) {
      setSendState((s) => ({ ...s, [businessId]: { status: "sent" } }));
      router.refresh();
    } else if (res.status === 409) {
      setSendState((s) => ({ ...s, [businessId]: { status: "sent" } }));
      router.refresh();
    } else {
      setSendState((s) => ({
        ...s,
        [businessId]: { status: "error", error: data.error || "Failed to send" },
      }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/admin/outreach?tab=${t.value}`}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg -mb-px transition ${
              validTab === t.value
                ? "bg-white border border-b-0 border-gray-200 text-[#1B2E4B]"
                : "text-gray-500 hover:text-[#1B2E4B]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {validTab === "claim" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Business</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Email</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Views (30d)</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claimCandidates.map((c) => {
                const state = sendState[c.business.id];
                const showSent = c.lastSentAt || state?.status === "sent";
                const sentDate = c.lastSentAt ? new Date(c.lastSentAt) : null;
                return (
                  <tr key={c.business.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/businesses/${c.business.id}`}
                        className="font-medium text-[#1B2E4B] hover:text-[#C9A84C]"
                      >
                        {c.business.name}
                      </Link>
                      <p className="text-xs text-gray-500">{c.business.category.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      {c.business.email ? (
                        <span className="text-gray-600">{c.business.email}</span>
                      ) : (
                        <span className="text-gray-400">No email</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right tabular-nums">{c.views.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                      {!c.business.email ? (
                        <span className="text-gray-400 text-xs">No email</span>
                      ) : showSent ? (
                        <span className="text-gray-500 text-xs">
                          Sent {sentDate ? formatDistanceToNow(sentDate, { addSuffix: true }) : "recently"}
                        </span>
                      ) : state?.status === "sending" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 inline" />
                      ) : state?.status === "error" ? (
                        <span className="text-red-500 text-xs">{state.error}</span>
                      ) : (
                        <button
                          onClick={() => sendClaimInvite(c.business.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2E4B] text-white text-xs font-semibold rounded-lg hover:bg-[#2a4270]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send invite
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {claimCandidates.length === 0 && (
            <p className="px-6 py-8 text-gray-500 text-sm">No unclaimed businesses with traffic.</p>
          )}
        </div>
      )}

      {validTab === "upgrade" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Business</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Views (30d)</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upgradeCandidates.map((c) => {
                const state = sendState[c.business.id];
                const showSent = c.lastSentAt || state?.status === "sent";
                const sentDate = c.lastSentAt ? new Date(c.lastSentAt) : null;
                return (
                  <tr key={c.business.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/businesses/${c.business.id}`}
                        className="font-medium text-[#1B2E4B] hover:text-[#C9A84C]"
                      >
                        {c.business.name}
                      </Link>
                      <p className="text-xs text-gray-500">{c.business.category.name}</p>
                    </td>
                    <td className="py-4 px-6 text-right tabular-nums">{c.views.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                      {showSent ? (
                        <span className="text-gray-500 text-xs">
                          Sent {sentDate ? formatDistanceToNow(sentDate, { addSuffix: true }) : "recently"}
                        </span>
                      ) : state?.status === "sending" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 inline" />
                      ) : state?.status === "error" ? (
                        <span className="text-red-500 text-xs">{state.error}</span>
                      ) : (
                        <button
                          onClick={() => sendUpgradeNudge(c.business.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2E4B] text-white text-xs font-semibold rounded-lg hover:bg-[#2a4270]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send nudge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {upgradeCandidates.length === 0 && (
            <p className="px-6 py-8 text-gray-500 text-sm">No claimed free-tier businesses with 10+ views.</p>
          )}
        </div>
      )}

      {validTab === "boost" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Business</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Delta</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {boostCandidates.map((c) => {
                const state = sendState[c.business.id];
                const showSent = c.lastSentAt || state?.status === "sent";
                const sentDate = c.lastSentAt ? new Date(c.lastSentAt) : null;
                return (
                  <tr key={c.business.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/businesses/${c.business.id}`}
                        className="font-medium text-[#1B2E4B] hover:text-[#C9A84C]"
                      >
                        {c.business.name}
                      </Link>
                      <p className="text-xs text-gray-500">{c.business.category.name}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-emerald-600 font-semibold tabular-nums">+{c.delta}</span>
                      <span className="text-gray-400 text-xs ml-1">vs prior 30d</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {showSent ? (
                        <span className="text-gray-500 text-xs">
                          Sent {sentDate ? formatDistanceToNow(sentDate, { addSuffix: true }) : "recently"}
                        </span>
                      ) : state?.status === "sending" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 inline" />
                      ) : state?.status === "error" ? (
                        <span className="text-red-500 text-xs">{state.error}</span>
                      ) : (
                        <button
                          onClick={() => sendBoostUpsell(c.business.id, c.delta, c.currViews)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2E4B] text-white text-xs font-semibold rounded-lg hover:bg-[#2a4270]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send upsell
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {boostCandidates.length === 0 && (
            <p className="px-6 py-8 text-gray-500 text-sm">No Pro businesses with rising traffic.</p>
          )}
        </div>
      )}

      {validTab === "log" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Business</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Type</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Sent to</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/businesses/${l.businessId}`}
                      className="font-medium text-[#1B2E4B] hover:text-[#C9A84C]"
                    >
                      {l.businessName}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typePillClass(l.type)}`}>
                      {typeLabel(l.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{l.sentTo}</td>
                  <td className="py-4 px-6 text-gray-500">
                    {formatDistanceToNow(new Date(l.sentAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <p className="px-6 py-8 text-gray-500 text-sm">No outreach sent yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
