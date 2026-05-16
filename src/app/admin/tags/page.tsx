"use client";

import { useAuth } from "../layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/Modal";
import { EmptyState } from "@/components/EmptyState";
import { TableSkeleton } from "@/components/Skeleton";

type NFCTag = {
  id: string;
  token: string | null;
  label: string;
  active: boolean;
  scans: number;
  lastUsed: string | null;
  createdAt: string;
};

export default function TagsPage() {
  const { token } = useAuth();
  const [tags, setTags] = useState<NFCTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<NFCTag | null>(null);

  function loadTags() {
    if (!token) return;
    fetch(`/api/business/${token}/tags`)
      .then((r) => r.json())
      .then(setTags)
      .finally(() => setLoading(false));
  }

  useEffect(loadTags, [token]);

  async function createTag() {
    if (!token) return;
    await fetch(`/api/business/${token}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    toast.success("Tag NFC creato!");
    loadTags();
  }

  async function toggleActive(tag: NFCTag) {
    if (!token) return;
    await fetch(`/api/business/${token}/tags/${tag.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tag, active: !tag.active }),
    });
    toast.success(tag.active ? "Tag disattivato" : "Tag attivato");
    loadTags();
  }

  async function handleDelete() {
    if (!token || !deleteTarget) return;
    await fetch(`/api/business/${token}/tags/${deleteTarget.id}`, {
      method: "DELETE",
    });
    toast.success("Tag eliminato");
    setDeleteTarget(null);
    loadTags();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tag NFC</h1>
          <p className="text-gray-500 mt-1">
            Gestisci i tuoi tag NFC collegati
          </p>
        </div>
        <button
          onClick={createTag}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
        >
          + Nuovo tag
        </button>
      </div>

      {tags.length === 0 ? (
        <EmptyState
          icon="📡"
          title="Nessun tag NFC"
          description="Crea il tuo primo tag NFC per iniziare a tracciare le scansioni"
          action={
            <button
              onClick={createTag}
              className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
            >
              Crea tag
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {tags.map((tag) => {
            const tagUrl = tag.token
              ? `${typeof window !== "undefined" ? window.location.origin : ""}/t/${tag.token}`
              : null;
            return (
              <div
                key={tag.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        tag.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tag.active ? "Attivo" : "Disattivo"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tag.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(tag)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                      title={tag.active ? "Disattiva" : "Attiva"}
                    >
                      {tag.active ? "⏸" : "▶️"}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tag)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition"
                      title="Elimina"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {tagUrl && (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 border border-gray-200 truncate">
                      {tagUrl}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tagUrl);
                        toast.success("Link copiato!");
                      }}
                      className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition shrink-0"
                    >
                      Copia
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    Scansioni: <strong className="text-gray-900">{tag.scans}</strong>
                  </span>
                  <span>
                    Ultimo utilizzo:{" "}
                    {tag.lastUsed
                      ? new Date(tag.lastUsed).toLocaleString("it-IT", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Mai"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Elimina tag"
        message={`Sei sicuro di voler eliminare il tag "${deleteTarget?.label}"? Questa azione è irreversibile.`}
        confirmLabel="Elimina"
        danger
      />
    </div>
  );
}
