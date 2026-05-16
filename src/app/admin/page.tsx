"use client";

import { useAuth } from "./layout";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { StatCardSkeleton, ChartSkeleton } from "@/components/Skeleton";

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
  lastTap: string | null;
  usageCount: number;
  activeCampaigns: number;
  chart: { date: string; count: number }[];
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<BusinessData | null>(null);
  const [views, setViews] = useState<ViewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrReady, setQrReady] = useState(false);

  const promoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/promo/${data?.token || token}`
      : `/promo/${token}`;

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

  useEffect(() => {
    if (!data || !qrCanvasRef.current) return;
    const url = `${window.location.origin}/promo/${data.token}`;
    QRCode.toCanvas(qrCanvasRef.current, url, {
      width: 200,
      margin: 2,
      color: { dark: "#111827", light: "#ffffff" },
    }).then(() => setQrReady(true));
  }, [data]);

  async function downloadQR(format: "png" | "svg") {
    if (!data) return;
    const url = `${window.location.origin}/promo/${data.token}`;

    if (format === "png") {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: { dark: "#111827", light: "#ffffff" },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qr-${data.token}.png`;
      a.click();
    } else {
      const svgStr = await QRCode.toString(url, {
        type: "svg",
        width: 512,
        margin: 2,
        color: { dark: "#111827", light: "#ffffff" },
      });
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `qr-${data.token}.svg`;
      a.click();
    }
    toast.success("QR code scaricato!");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (!data) return <p className="text-gray-500">Dati non disponibili.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Panoramica del tuo sconto attivo</p>
      </div>

      {/* Main stats */}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ViewStatCard label="Oggi" value={views.today} />
            <ViewStatCard label="Ultimi 7 giorni" value={views.week} />
            <ViewStatCard label="Questo mese" value={views.month} />
            <ViewStatCard label="Totali" value={views.total} highlight />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard
              label="Ultimo tap NFC"
              value={
                views.lastTap
                  ? new Date(views.lastTap).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Nessuno"
              }
              icon="📡"
            />
            <InfoCard
              label="Utilizzi sconto"
              value={String(views.usageCount)}
              icon="🎟️"
            />
            <InfoCard
              label="Campagne attive"
              value={String(views.activeCampaigns)}
              icon="📣"
            />
          </div>

          {/* Recharts chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Visite ultimi 30 giorni
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={views.chart}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => {
                    const dt = new Date(d);
                    return dt.toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                    });
                  }}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  labelFormatter={(d) =>
                    new Date(String(d)).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                    })
                  }
                  formatter={(value) => [value, "Visite"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* QR Code */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">QR Code</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <canvas ref={qrCanvasRef} className="block" />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-gray-500">
              QR code per la pagina promo. Scaricalo e stampalo o usalo nel tuo
              materiale marketing.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadQR("png")}
                disabled={!qrReady}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                Scarica PNG
              </button>
              <button
                onClick={() => downloadQR("svg")}
                disabled={!qrReady}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Scarica SVG
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promoUrl);
                  toast.success("Link copiato!");
                }}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Copia link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NFC Link */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Link NFC</h2>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-gray-50 px-4 py-2.5 rounded-lg text-sm text-gray-700 border border-gray-200 truncate">
            {promoUrl}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(promoUrl);
              toast.success("Link copiato!");
            }}
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
          href="/admin/campaigns"
          className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
        >
          Gestisci campagne
        </Link>
        <Link
          href="/admin/discounts"
          className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
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

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
