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

type ViewsData = {
  total: number;
  today: number;
  week: number;
  month: number;
  chart: { date: string; count: number }[];
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<BusinessData | null>(null);
  const [views, setViews] = useState<ViewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`/api/business/${token}`).then((r) => r.json()),
      fetch(`/api/business/${token}/views`).then((r) => r.json()),
    ])
      .then(([biz, v]) => {
        setData(biz);
        setViews(v);
      })
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

      {/* Analytics */}
      {views && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Scansioni NFC
          </h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <ViewStatCard label="Oggi" value={views.today} />
            <ViewStatCard label="Questa settimana" value={views.week} />
            <ViewStatCard label="Questo mese" value={views.month} />
            <ViewStatCard label="Totali" value={views.total} highlight />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Ultimi 30 giorni
            </h3>
            <MiniChart data={views.chart} />
          </div>
        </div>
      )}

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

function ViewStatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "bg-gray-900 border-gray-900"
          : "bg-white border-gray-200"
      }`}
    >
      <p
        className={`text-sm mb-1 ${
          highlight ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MiniChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-[3px] h-32">
      {data.map((d) => {
        const height = Math.max((d.count / max) * 100, 2);
        const dateObj = new Date(d.date);
        const isToday =
          dateObj.toDateString() === new Date().toDateString();

        return (
          <div
            key={d.date}
            className="flex-1 group relative flex flex-col items-center justify-end h-full"
          >
            <div className="absolute -top-6 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
              {dateObj.toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
              })}
              : {d.count}
            </div>
            <div
              className={`w-full rounded-sm transition-all ${
                isToday ? "bg-amber-500" : "bg-gray-200 group-hover:bg-gray-400"
              }`}
              style={{ height: `${height}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
