"use client";

import { useAuth } from "./layout";
import { useEffect, useState } from "react";
import Link from "next/link";

type BusinessData = {
  name: string;
  discount: number;
  description: string;
  active: boolean;
  validUntil: string | null;
  cumulative: boolean;
  token: string;
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/business/${token}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-gray-500">Dati non disponibili.</p>;

  const promoUrl = `/promo/${data.token}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Panoramica del tuo sconto attivo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Sconto attuale"
          value={`${data.discount}%`}
          accent
        />
        <StatCard
          label="Stato"
          value={data.active ? "Attivo" : "Disattivato"}
          dot={data.active ? "green" : "red"}
        />
        <StatCard
          label="Cumulabile"
          value={data.cumulative ? "Sì" : "No"}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Link NFC</h2>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-gray-50 px-4 py-2.5 rounded-lg text-sm text-gray-700 border border-gray-200 truncate">
            {typeof window !== "undefined"
              ? window.location.origin + promoUrl
              : promoUrl}
          </code>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                window.location.origin + promoUrl
              )
            }
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shrink-0"
          >
            Copia
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Questo è il link da programmare nel tag NFC del portachiavi
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/discounts"
          className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
        >
          Modifica sconto
        </Link>
        <Link
          href="/admin/preview"
          className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Vedi anteprima
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  dot,
}: {
  label: string;
  value: string;
  accent?: boolean;
  dot?: "green" | "red";
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {dot && (
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              dot === "green" ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
        )}
        <p
          className={`text-2xl font-bold ${
            accent ? "text-amber-500" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
