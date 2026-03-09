"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, EyeOff, Eye } from "lucide-react";

type EventItem = {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string | null;
  description: string;
  category: string;
  featured: boolean;
  source: string;
  status: string;
};

type Props = { events: EventItem[] };

export default function EventsPageClient({ events }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    description: "",
    category: "",
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      dateStart: new Date().toISOString().slice(0, 10),
      dateEnd: "",
      description: "",
      category: "",
      featured: false,
    });
    setShowForm(true);
  }

  function openEdit(e: EventItem) {
    setEditing(e);
    setForm({
      name: e.name,
      dateStart: e.dateStart.slice(0, 10),
      dateEnd: e.dateEnd?.slice(0, 10) ?? "",
      description: e.description,
      category: e.category,
      featured: e.featured,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      dateStart: form.dateStart,
      dateEnd: form.dateEnd || null,
      description: form.description || null,
      category: form.category || null,
      featured: form.featured,
    };
    const url = editing
      ? `/api/admin/events/${editing.id}`
      : "/api/admin/events";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) router.refresh();
  }

  async function handleToggleStatus(e: EventItem) {
    const newStatus = e.status === "hidden" ? "approved" : "hidden";
    setDeleting(e.id);
    const res = await fetch(`/api/admin/events/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setDeleting(null);
    if (res.ok) router.refresh();
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 bg-[#FAF8F5]";

  return (
    <div className="space-y-6">
      <button
        onClick={openCreate}
        className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#1B2E4B] font-semibold rounded-lg hover:bg-[#B8972A]"
      >
        <Plus className="w-4 h-4" />
        Add event
      </button>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
            {editing ? "Edit event" : "New event"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start date</label>
                <input
                  type="date"
                  required
                  value={form.dateStart}
                  onChange={(e) => setForm({ ...form, dateStart: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">End date (optional)</label>
                <input
                  type="date"
                  value={form.dateEnd}
                  onChange={(e) => setForm({ ...form, dateEnd: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Attractions"
                className={inputCls}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[#1B2E4B] text-white font-semibold rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-500 border border-gray-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-500">
        {events.filter((e) => e.source === "eventbrite").length} from Eventbrite ·{" "}
        {events.filter((e) => e.status === "hidden").length} hidden
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left py-3 px-6 font-semibold text-gray-600">Name</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">Start</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">End</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">Category</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">Source</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-600">Status</th>
              <th className="text-right py-3 px-6 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className={`border-b border-gray-50 last:border-0 ${e.status === "hidden" ? "opacity-60" : ""}`}
              >
                <td className="py-4 px-6">
                  <span className="font-medium text-[#1B2E4B]">{e.name}</span>
                  {e.featured && (
                    <span className="ml-2 text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(e.dateStart).toLocaleDateString("en-GB")}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {e.dateEnd ? new Date(e.dateEnd).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="py-4 px-6 text-gray-600">{e.category || "—"}</td>
                <td className="py-4 px-6 text-gray-600">
                  <span className="text-xs font-medium text-gray-500">{e.source}</span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  <span
                    className={`text-xs font-medium ${e.status === "hidden" ? "text-amber-600" : "text-emerald-600"}`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {e.source === "eventbrite" && (
                    <button
                      onClick={() => handleToggleStatus(e)}
                      disabled={deleting !== null}
                      className="p-2 text-gray-500 hover:text-amber-600 disabled:opacity-50"
                      title={e.status === "hidden" ? "Show on events page" : "Hide from events page"}
                    >
                      {deleting === e.id ? (
                        <span className="w-4 h-4 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin block" />
                      ) : e.status === "hidden" ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(e)}
                    className="p-2 text-gray-500 hover:text-[#C9A84C]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={deleting !== null}
                    className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
                  >
                    {deleting === e.id ? (
                      <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="px-6 py-8 text-gray-500 text-sm">No events.</p>
        )}
      </div>
    </div>
  );
}
