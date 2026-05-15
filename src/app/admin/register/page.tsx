"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    discount: 10,
    description: "su tutti i servizi",
    message: "Grazie per essere nostro cliente!",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    name: string;
    token: string;
    email: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante la registrazione");
        return;
      }

      setResult(data);
    } catch {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const promoUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/promo/${result.token}`
        : `/promo/${result.token}`;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Attività registrata!
            </h1>
            <p className="text-gray-500 text-sm">
              <strong>{result.name}</strong> è stata creata con successo.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Link NFC da programmare
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded-lg text-sm text-gray-700 border border-gray-200 truncate">
                    {promoUrl}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(promoUrl)}
                    className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition shrink-0"
                  >
                    Copia
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Credenziali dashboard
                </p>
                <p className="text-sm text-gray-700">
                  Email: <strong>{result.email}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Password: quella scelta in fase di registrazione
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <a
                href={`/promo/${result.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
              >
                Vedi pagina cliente
              </a>
              <Link
                href="/admin"
                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Vai alla dashboard
              </Link>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setForm({
                  name: "",
                  email: "",
                  password: "",
                  discount: 10,
                  description: "su tutti i servizi",
                  message: "Grazie per essere nostro cliente!",
                });
              }}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Registra un'altra attività
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Nuova attività commerciale
          </h1>
          <p className="text-gray-500 mt-1">
            Registra un'attività e genera il link NFC
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome attività *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="es. Pizzeria Da Mario"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="es. info@pizzeria.it"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Scegli una password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
              minLength={4}
            />
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sconto iniziale
              </label>
              <div className="relative">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  %
                </span>
              </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Messaggio per il cliente
            </label>
            <input
              type="text"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Registrazione..." : "Registra attività"}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Torna al login
          </Link>
        </p>
      </div>
    </div>
  );
}
