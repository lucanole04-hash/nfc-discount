"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export type PromoCampaign = {
  id: string;
  title: string;
  discount: number;
  description: string;
  promoCode: string;
  color: string;
  active: boolean;
  startDate: string;
  endDate: string | null;
};

export type PromoBusinessData = {
  name: string;
  logo: string | null;
  discount: number;
  description: string;
  message: string;
  active: boolean;
  validUntil: string | null;
  cumulative: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  coverImage?: string | null;
  welcomeMessage?: string;
  phone?: string | null;
  googleMaps?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  website?: string | null;
};

type PromoCardProps = {
  business: PromoBusinessData;
  campaigns?: PromoCampaign[];
  token?: string;
};

export function PromoCard({ business, campaigns, token }: PromoCardProps) {
  const isExpired =
    business.validUntil && new Date(business.validUntil) < new Date();
  const isActive = business.active && !isExpired;
  const primary = business.primaryColor || "#f59e0b";
  const secondary = business.secondaryColor || "#111827";

  const activeCampaigns = campaigns?.filter((c) => {
    if (!c.active) return false;
    const now = new Date();
    if (c.endDate && new Date(c.endDate) < now) return false;
    if (new Date(c.startDate) > now) return false;
    return true;
  });

  const expiredCampaigns = campaigns?.filter((c) => {
    return c.endDate && new Date(c.endDate) < new Date();
  });

  const hasButtons =
    business.phone ||
    business.googleMaps ||
    business.instagram ||
    business.whatsapp ||
    business.website;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Cover Image */}
        {business.coverImage && (
          <div className="h-32 overflow-hidden">
            <img
              src={business.coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div
          className="px-6 py-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${secondary}, ${secondary}dd)`,
          }}
        >
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-white/20"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: primary }}
            >
              {business.name.charAt(0)}
            </div>
          )}
          <h1 className="text-white text-lg font-semibold tracking-wide">
            {business.name}
          </h1>
          {business.welcomeMessage && (
            <p className="text-white/70 text-sm mt-1">
              {business.welcomeMessage}
            </p>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: isActive ? "#10b981" : "#ef4444" }}
            />
            <span className="text-gray-300 text-xs uppercase tracking-widest">
              {isActive ? "Sconto attivo" : "Sconto non attivo"}
            </span>
          </div>
        </div>

        {/* Main Discount */}
        <div className="px-6 py-10 text-center">
          {isActive ? (
            <>
              <div
                className="text-7xl font-black tracking-tight"
                style={{ color: secondary }}
              >
                {business.discount}
                <span className="text-4xl">%</span>
              </div>
              <p className="mt-2 text-gray-500 text-base">
                {business.description}
              </p>
            </>
          ) : (
            <div className="py-4">
              <p className="text-gray-400 text-lg">
                Nessuno sconto attivo al momento
              </p>
            </div>
          )}
        </div>

        {/* Active Campaigns */}
        {activeCampaigns && activeCampaigns.length > 0 && (
          <div className="px-6 pb-4 space-y-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              Promozioni attive
            </p>
            {activeCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                token={token}
                primary={primary}
                secondary={secondary}
              />
            ))}
          </div>
        )}

        {/* Expired Campaigns Badge */}
        {expiredCampaigns && expiredCampaigns.length > 0 && (
          <div className="px-6 pb-4 space-y-2">
            {expiredCampaigns.map((c) => (
              <div
                key={c.id}
                className="bg-gray-100 rounded-xl px-4 py-3 text-center"
              >
                <span className="text-xs text-gray-400 font-medium">
                  Promo terminata: {c.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {isActive && (
          <div className="px-6 pb-4 space-y-3">
            {business.message && (
              <div
                className="rounded-2xl px-4 py-3 text-center border"
                style={{
                  backgroundColor: `${primary}10`,
                  borderColor: `${primary}30`,
                }}
              >
                <p style={{ color: primary }} className="text-sm font-medium">
                  {business.message}
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
              <p className="text-gray-600 text-sm font-medium">
                📱 Mostra questa pagina al personale
              </p>
            </div>

            {/* Mark as Used button */}
            {token && (
              <MarkUsedButton token={token} primary={primary} secondary={secondary} />
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>
                {business.validUntil
                  ? `Valido fino al ${new Date(
                      business.validUntil
                    ).toLocaleDateString("it-IT")}`
                  : "Validità illimitata"}
              </span>
              <span>
                {business.cumulative ? "Cumulabile" : "Non cumulabile"}
              </span>
            </div>
          </div>
        )}

        {/* Business Buttons */}
        {hasButtons && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap justify-center gap-2">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border"
                  style={{
                    color: secondary,
                    borderColor: `${secondary}20`,
                    backgroundColor: `${secondary}08`,
                  }}
                >
                  📞 Chiama
                </a>
              )}
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border"
                  style={{
                    color: secondary,
                    borderColor: `${secondary}20`,
                    backgroundColor: `${secondary}08`,
                  }}
                >
                  💬 WhatsApp
                </a>
              )}
              {business.googleMaps && (
                <a
                  href={business.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border"
                  style={{
                    color: secondary,
                    borderColor: `${secondary}20`,
                    backgroundColor: `${secondary}08`,
                  }}
                >
                  📍 Mappa
                </a>
              )}
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border"
                  style={{
                    color: secondary,
                    borderColor: `${secondary}20`,
                    backgroundColor: `${secondary}08`,
                  }}
                >
                  📸 Instagram
                </a>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border"
                  style={{
                    color: secondary,
                    borderColor: `${secondary}20`,
                    backgroundColor: `${secondary}08`,
                  }}
                >
                  🌐 Sito web
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 text-center">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest">
            Digital Pass • NFC Discount
          </p>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({
  campaign,
  token,
  primary,
  secondary,
}: {
  campaign: PromoCampaign;
  token?: string;
  primary: string;
  secondary: string;
}) {
  const [copied, setCopied] = useState(false);
  const storageKey = `nfc_used_campaign_${campaign.id}`;
  const [used, setUsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });

  const isExpired =
    campaign.endDate && new Date(campaign.endDate) < new Date();

  function copyPromoCode() {
    navigator.clipboard.writeText(campaign.promoCode);
    setCopied(true);
    toast.success("Codice copiato!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function markUsed() {
    if (!token || used) return;
    await fetch(`/api/business/${token}/usage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id }),
    });
    localStorage.setItem(storageKey, "true");
    setUsed(true);
    toast.success("Sconto segnato come utilizzato!");
  }

  if (isExpired) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
        <span className="text-xs text-gray-400 font-medium">
          Promo terminata
        </span>
        <p className="text-sm font-semibold text-gray-500 mt-1">
          {campaign.title}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        backgroundColor: `${primary}08`,
        borderColor: `${primary}20`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {campaign.title}
          </p>
          {campaign.description && (
            <p className="text-xs text-gray-500 mt-0.5">
              {campaign.description}
            </p>
          )}
        </div>
        <span
          className="text-2xl font-black"
          style={{ color: primary }}
        >
          {campaign.discount}%
        </span>
      </div>

      {campaign.promoCode && (
        <div className="mt-3 flex items-center gap-2">
          <code
            className="flex-1 bg-white/80 text-center py-2 rounded-lg text-sm font-mono font-bold tracking-wider border"
            style={{ borderColor: `${primary}30`, color: secondary }}
          >
            {campaign.promoCode}
          </code>
          <button
            onClick={copyPromoCode}
            className="px-3 py-2 rounded-lg text-xs font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            {copied ? "✓" : "Copia"}
          </button>
        </div>
      )}

      {campaign.endDate && (
        <p className="text-xs text-gray-400 mt-2">
          Valido fino al{" "}
          {new Date(campaign.endDate).toLocaleDateString("it-IT")}
        </p>
      )}

      {token && (
        <button
          onClick={markUsed}
          disabled={used}
          className={`mt-3 w-full py-2 rounded-xl text-xs font-medium transition ${
            used ? "cursor-default" : "text-white hover:opacity-90"
          }`}
          style={
            used
              ? { backgroundColor: `${primary}15`, color: primary }
              : { backgroundColor: primary }
          }
        >
          {used ? "✓ Già utilizzato" : "✓ Segna come utilizzato"}
        </button>
      )}
    </div>
  );
}

function MarkUsedButton({
  token,
  primary,
  secondary,
}: {
  token: string;
  primary: string;
  secondary: string;
}) {
  const storageKey = `nfc_used_${token}`;
  const [used, setUsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });

  async function handleUse() {
    if (used) return;
    await fetch(`/api/business/${token}/usage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    localStorage.setItem(storageKey, "true");
    setUsed(true);
    toast.success("Sconto segnato come utilizzato!");
  }

  return (
    <button
      onClick={handleUse}
      disabled={used}
      className={`w-full py-3 rounded-2xl text-sm font-medium transition ${
        used ? "cursor-default" : "text-white hover:opacity-90"
      }`}
      style={
        used
          ? { backgroundColor: `${primary}15`, color: primary }
          : { backgroundColor: secondary }
      }
    >
      {used ? "✓ Già utilizzato" : "Segna come utilizzato"}
    </button>
  );
}
