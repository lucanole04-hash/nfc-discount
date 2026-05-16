"use client";

import { useAuth } from "../layout";
import { useEffect, useState } from "react";
import { PromoCard, type PromoBusinessData, type PromoCampaign } from "@/components/PromoCard";

export default function PreviewPage() {
  const { token } = useAuth();
  const [data, setData] = useState<PromoBusinessData | null>(null);
  const [campaigns, setCampaigns] = useState<PromoCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`/api/business/${token}`).then((r) => r.json()),
      fetch(`/api/business/${token}/campaigns`).then((r) => r.json()),
    ])
      .then(([biz, camps]) => {
        setData(biz);
        setCampaigns(camps);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Anteprima</h1>
        <p className="text-gray-500 mt-1">
          Ecco come vedranno la pagina i tuoi clienti
        </p>
      </div>

      <div className="bg-gray-100 rounded-2xl p-8 flex justify-center">
        <div className="w-[375px]">
          <div className="bg-gray-800 rounded-t-2xl px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-[10px] text-gray-400 text-center truncate">
              {typeof window !== "undefined"
                ? `${window.location.origin}/promo/${token}`
                : `/promo/${token}`}
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-2xl p-4 border border-t-0 border-gray-200">
            <PromoCard business={data} campaigns={campaigns} token={token || undefined} />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <a
          href={`/promo/${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Apri pagina reale ↗
        </a>
      </div>
    </div>
  );
}
