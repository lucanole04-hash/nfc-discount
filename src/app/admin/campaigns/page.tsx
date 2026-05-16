"use client";

import { useAuth } from "../layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal, ConfirmModal } from "@/components/Modal";
import { EmptyState } from "@/components/EmptyState";
import { TableSkeleton } from "@/components/Skeleton";

type Campaign = {
  id: string;
  title: string;
  discount: number;
  description: string;
  promoCode: string;
  color: string;
  active: boolean;
  startDate: string;
  endDate: string | null;
  _count: { usages: number };
};

type CampaignForm = {
  title: string;
  discount: number;
  description: string;
  promoCode: string;
  color: string;
  active: boolean;
  startDate: string;
  endDate: string;
};

const emptyForm: CampaignForm = {
  title: "",
  discount: 10,
  description: "",
  promoCode: "",
  color: "#f59e0b",
  active: true,
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
};

export default function CampaignsPage() {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CampaignForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  function loadCampaigns() {
    if (!token) return;
    fetch(`/api/business/${token}/campaigns`)
      .then((r) => r.json())
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }

  useEffect(loadCampaigns, [token]);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(c: Campaign) {
    setEditingId(c.id);
    setForm({
      title: c.title,
      discount: c.discount,
      description: c.description,
      promoCode: c.promoCode,
      color: c.color,
      active: c.active,
      startDate: c.startDate.split("T")[0],
      endDate: c.endDate ? c.endDate.split("T")[0] : "",
    });
    setModalOpen(true);
  }

  function openDuplicate(c: Campaign) {
    setEditingId(null);
    setForm({
      title: `${c.title} (copia)`,
      discount: c.discount,
      description: c.description,
      promoCode: "",
      color: c.color,
      active: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!token || !form.title.trim()) {
      toast.error("Il titolo è obbligatorio");
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      endDate: form.endDate || null,
    };

    if (editingId) {
      await fetch(`/api/business/${token}/campaigns/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Campagna aggiornata!");
    } else {
      await fetch(`/api/business/${token}/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Campagna creata!");
    }

    setSaving(false);
    setModalOpen(false);
    loadCampaigns();
  }

  async function handleDelete() {
    if (!token || !deleteTarget) return;
    await fetch(`/api/business/${token}/campaigns/${deleteTarget.id}`, {
      method: "DELETE",
    });
    toast.success("Campagna eliminata");
    setDeleteTarget(null);
    loadCampaigns();
  }

  async function toggleActive(c: Campaign) {
    if (!token) return;
    await fetch(`/api/business/${token}/campaigns/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, active: !c.active }),
    });
    toast.success(c.active ? "Campagna disattivata" : "Campagna attivata");
    loadCampaigns();
  }

  function isExpired(c: Campaign) {
    return c.endDate && new Date(c.endDate) < new Date();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campagne</h1>
          <p className="text-gray-500 mt-1">Gestisci le tue promozioni</p>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
        >
          + Nuova campagna
        </button>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon="📣"
          title="Nessuna campagna"
          description="Crea la tua prima campagna promozionale per iniziare"
          action={
            <button
              onClick={openNew}
              className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
            >
              Crea campagna
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {c.title}
                      </h3>
                      <span className="text-lg font-bold text-amber-500">
                        {c.discount}%
                      </span>
                      {c.promoCode && (
                        <code className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                          {c.promoCode}
                        </code>
                      )}
                      {isExpired(c) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          Scaduta
                        </span>
                      ) : c.active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          Attiva
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          Inattiva
                        </span>
                      )}
                    </div>
                    {c.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {c.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>
                        Dal{" "}
                        {new Date(c.startDate).toLocaleDateString("it-IT")}
                      </span>
                      {c.endDate && (
                        <span>
                          al{" "}
                          {new Date(c.endDate).toLocaleDateString("it-IT")}
                        </span>
                      )}
                      <span>{c._count.usages} utilizzi</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(c)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                    title={c.active ? "Disattiva" : "Attiva"}
                  >
                    {c.active ? "⏸" : "▶️"}
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                    title="Modifica"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => openDuplicate(c)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                    title="Duplica"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                    title="Elimina"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Modifica campagna" : "Nuova campagna"}
        actions={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {saving ? "Salvataggio..." : editingId ? "Aggiorna" : "Crea"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titolo
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="es. Promo Estate 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sconto %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Codice promo
              </label>
              <input
                type="text"
                value={form.promoCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    promoCode: e.target.value.toUpperCase(),
                  })
                }
                placeholder="es. NFC15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="es. su tutti i prodotti estivi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data inizio
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data fine
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colore
              </label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">Attiva subito</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Elimina campagna"
        message={`Sei sicuro di voler eliminare "${deleteTarget?.title}"? Questa azione è irreversibile.`}
        confirmLabel="Elimina"
        danger
      />
    </div>
  );
}
