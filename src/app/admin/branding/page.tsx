"use client";

import { useAuth } from "../layout";
import { useEffect, useState, useRef } from "react";
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

function ImageUpload({
  label,
  value,
  onChange,
  shape = "square",
}: {
  label: string;
  value: string | null;
  onChange: (val: string | null) => void;
  shape?: "circle" | "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Immagine troppo grande (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  const sizeClasses =
    shape === "circle"
      ? "w-28 h-28 rounded-full"
      : shape === "wide"
        ? "w-full h-36 rounded-xl"
        : "w-28 h-28 rounded-xl";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-start gap-4">
        <div
          className={`relative ${sizeClasses} border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-amber-400 transition group bg-gray-50`}
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <>
              <img
                src={value}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-xs font-medium">Cambia</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-2xl mb-1">📷</span>
              <span className="text-[10px]">Carica</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
          >
            Carica immagine
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 text-red-500 text-xs font-medium hover:bg-red-50 rounded-lg transition"
            >
              Rimuovi
            </button>
          )}
          <span className="text-[10px] text-gray-400">PNG, JPG — max 2MB</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

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
        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <h2 className="font-semibold text-gray-900">Immagine profilo e copertina</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <ImageUpload
              label="Logo / Immagine profilo"
              value={form.logo}
              onChange={(val) => setForm({ ...form, logo: val })}
              shape="circle"
            />
            <ImageUpload
              label="Immagine copertina"
              value={form.coverImage}
              onChange={(val) => setForm({ ...form, coverImage: val })}
              shape="wide"
            />
          </div>

          {/* Live mini preview */}
          {(form.logo || form.coverImage) && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Anteprima</p>
              <div className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                {form.coverImage && (
                  <div className="h-20 overflow-hidden">
                    <img
                      src={form.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className="px-4 py-5 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${form.secondaryColor}, ${form.secondaryColor}dd)`,
                    marginTop: form.coverImage ? 0 : undefined,
                  }}
                >
                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt=""
                      className="w-12 h-12 rounded-full mx-auto mb-2 object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: form.primaryColor }}
                    >
                      ?
                    </div>
                  )}
                  <p className="text-white text-sm font-semibold">La Tua Attività</p>
                </div>
              </div>
            </div>
          )}
        </div>

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
              <p className="text-[10px] text-gray-400 mt-1">
                Usato per accenti, pulsanti e badge
              </p>
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
              <p className="text-[10px] text-gray-400 mt-1">
                Usato per header e sfondo della pagina cliente
              </p>
            </div>
          </div>

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

        {/* Welcome message */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Messaggio</h2>
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
            <p className="text-[10px] text-gray-400 mt-1">
              Visibile sotto il nome dell&apos;attività nella pagina cliente
            </p>
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
