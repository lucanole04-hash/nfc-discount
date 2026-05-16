"use client";

import { useAuth } from "../layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type BrandingData = {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  coverImage: string | null;
  welcomeMessage: string;
  phone: string | null;
  googleMaps: string | null;
  instagram: string | null;
  whatsapp: string | null;
  website: string | null;
};

export default function BrandingPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<BrandingData>({
    logo: null,
    primaryColor: "#f59e0b",
    secondaryColor: "#111827",
    coverImage: null,
    welcomeMessage: "",
    phone: null,
    googleMaps: null,
    instagram: null,
    whatsapp: null,
    website: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/business/${token}/branding`)
      .then((r) => r.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      });
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);

    await fetch(`/api/business/${token}/branding`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    toast.success("Branding aggiornato!");
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
        <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
        <p className="text-gray-500 mt-1">
          Personalizza l&apos;aspetto della tua pagina promo
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Colors */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Colori</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colore principale
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) =>
                    setForm({ ...form, primaryColor: e.target.value })
                  }
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) =>
                    setForm({ ...form, primaryColor: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colore secondario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.secondaryColor}
                  onChange={(e) =>
                    setForm({ ...form, secondaryColor: e.target.value })
                  }
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.secondaryColor}
                  onChange={(e) =>
                    setForm({ ...form, secondaryColor: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-16 h-8 rounded-lg border"
              style={{ backgroundColor: form.primaryColor }}
            />
            <div
              className="w-16 h-8 rounded-lg border"
              style={{ backgroundColor: form.secondaryColor }}
            />
            <span className="text-xs text-gray-400 ml-2">Anteprima colori</span>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Immagini</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Logo
            </label>
            <input
              type="url"
              value={form.logo || ""}
              onChange={(e) =>
                setForm({ ...form, logo: e.target.value || null })
              }
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Immagine copertina
            </label>
            <input
              type="url"
              value={form.coverImage || ""}
              onChange={(e) =>
                setForm({ ...form, coverImage: e.target.value || null })
              }
              placeholder="https://example.com/cover.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Messaggio di benvenuto
            </label>
            <textarea
              value={form.welcomeMessage}
              onChange={(e) =>
                setForm({ ...form, welcomeMessage: e.target.value })
              }
              rows={2}
              placeholder="es. Benvenuto nel nostro negozio!"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Business Buttons */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Pulsanti contatto</h2>
          <p className="text-sm text-gray-500">
            Configura i pulsanti che appariranno nella pagina promo del cliente
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📞 Telefono
              </label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value || null })
                }
                placeholder="+39 333 1234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💬 WhatsApp
              </label>
              <input
                type="tel"
                value={form.whatsapp || ""}
                onChange={(e) =>
                  setForm({ ...form, whatsapp: e.target.value || null })
                }
                placeholder="+39 333 1234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📍 Google Maps
              </label>
              <input
                type="url"
                value={form.googleMaps || ""}
                onChange={(e) =>
                  setForm({ ...form, googleMaps: e.target.value || null })
                }
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📸 Instagram
              </label>
              <input
                type="text"
                value={form.instagram || ""}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value || null })
                }
                placeholder="@nomeattivita"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🌐 Sito web
              </label>
              <input
                type="url"
                value={form.website || ""}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value || null })
                }
                placeholder="https://www.tuosito.it"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {saving ? "Salvataggio..." : "Salva branding"}
        </button>
      </form>
    </div>
  );
}
