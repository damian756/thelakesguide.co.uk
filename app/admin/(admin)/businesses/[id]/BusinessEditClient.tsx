"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Business = {
  id: string;
  name: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  shortDescription: string;
  description: string;
  placeId: string;
  listingTier: string;
  hubTier: string;
  boostCredits: number;
  featured: boolean;
  claimed: boolean;
  categoryName: string;
};

export default function BusinessEditClient({ business }: { business: Business }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: business.name,
    address: business.address,
    postcode: business.postcode,
    phone: business.phone,
    email: business.email,
    website: business.website,
    shortDescription: business.shortDescription,
    description: business.description,
    placeId: business.placeId,
    listingTier: business.listingTier,
    hubTier: business.hubTier,
    boostCredits: business.boostCredits,
    featured: business.featured,
    claimed: business.claimed,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 bg-[#FAF8F5]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/businesses/${business.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save.");
      setSaving(false);
      return;
    }
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Postcode</label>
        <input
          type="text"
          value={form.postcode}
          onChange={(e) => setForm({ ...form, postcode: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Website</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Short Description <span className="font-normal text-gray-400">(shown in listing cards)</span></label>
        <input
          type="text"
          maxLength={160}
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputCls} resize-none`}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Google Place ID</label>
        <input
          type="text"
          value={form.placeId}
          onChange={(e) => setForm({ ...form, placeId: e.target.value })}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Listing Tier <span className="font-normal text-gray-400">(public visibility)</span></label>
          <select
            value={form.listingTier}
            onChange={(e) => setForm({ ...form, listingTier: e.target.value })}
            className={inputCls}
          >
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="featured">Featured</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hub Tier <span className="font-normal text-gray-400">(dashboard access)</span></label>
          <select
            value={form.hubTier}
            onChange={(e) => setForm({ ...form, hubTier: e.target.value })}
            className={inputCls}
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Boost Credits</label>
        <input
          type="number"
          min={0}
          value={form.boostCredits}
          onChange={(e) =>
            setForm({ ...form, boostCredits: parseInt(e.target.value, 10) || 0 })
          }
          className={inputCls}
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.claimed}
            onChange={(e) => setForm({ ...form, claimed: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">Claimed</span>
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#1B2E4B] text-white font-semibold rounded-lg hover:bg-[#2A4A73] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <Link
          href="/admin/businesses"
          className="px-5 py-2.5 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Back
        </Link>
      </div>
    </form>
  );
}
