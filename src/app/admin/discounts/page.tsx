"use client";

import { useAuth } from "../layout";
import { useEffect, useState } from "react";

type FormData = {
  discount: number;
  description: string;
  message: string;
  active: boolean;
  validUntil: string;
  cumulative: boolean;
};

type HistoryEntry = {
  id: string;
  discount: number;
  description: string;
  active: boolean;
  cumulative: boolean;
  validUntil: string | null;
  changedAt: string;
};

export default function DiscountsPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<FormData>({
    discount: 0,
    description: "",
    message: "",
    active: true,
    validUntil: "",
    cumulative: false,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`/api/business/${token}`).then((r) => r.json()),
      fetch(`/api/business/${token}/history`).then((r) => r.json()),
    ]).then(([biz, hist]) => {
      setForm({
        discount: biz.discount,
        description: biz.description,
        message: biz.message,
        active: biz.active,
        validUntil: biz.validUntil || "",
        cumulative: biz.cumulative,
      });
      setHistory(hist);
      setLoading(false);
    });
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaved(false);

    await fetch(`/api/business/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        validUntil: form.validUntil || null,
      }),
    });

    const hist = await fetch(`/api/business/${token}/history`).then((r) =>
      r.json()
    );
    setHistory(hist);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione sconti</h1>
        <p className="text-gray-500 mt-1">
          Modifica lo sconto mostrato ai clienti
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentuale sconto
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validità (opzionale)
            </label>
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) =>
                setForm({ ...form, validUntil: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrizione sconto
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="es. su tutti i servizi"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Messaggio per il cliente
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={2}
            placeholder="es. Grazie per essere nostro cliente!"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Sconto attivo</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.cumulative}
              onChange={(e) =>
                setForm({ ...form, cumulative: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Cumulabile</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 font-medium">
              ✓ Salvato con successo
            </span>
          )}
        </div>
      </form>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Storico modifiche
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">Nessuna modifica registrata.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Data
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Sconto
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">
                      Descrizione
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Stato
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(entry.changedAt).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {entry.discount}%
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {entry.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            entry.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {entry.active ? "Attivo" : "Disattivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
