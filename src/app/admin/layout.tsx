"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

type AuthContextType = {
  token: string | null;
  businessName: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  businessName: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function LoginForm({ onLogin }: { onLogin: (token: string, name: string) => void }) {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore di login");
        return;
      }

      onLogin(data.token, data.name);
    } catch {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">NFC Discount</h1>
          <p className="text-gray-500 mt-1">Accedi alla dashboard</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
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
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: demo@example.com / demo1234
        </p>
        <p className="text-center mt-3">
          <Link
            href="/admin/register"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Registra una nuova attività
          </Link>
        </p>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { businessName, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/campaigns", label: "Campagne", icon: "📣" },
    { href: "/admin/discounts", label: "Sconti", icon: "🏷️" },
    { href: "/admin/branding", label: "Branding", icon: "🎨" },
    { href: "/admin/tags", label: "Tag NFC", icon: "📡" },
    { href: "/admin/preview", label: "Anteprima", icon: "👁️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-gray-900 dark:text-white">
              NFC Discount
            </Link>
            <span className="text-sm text-gray-400 hidden sm:inline">
              {businessName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? "border-amber-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    const savedName = sessionStorage.getItem("admin_name");
    if (savedToken) {
      setToken(savedToken);
      setBusinessName(savedName);
    }
    setMounted(true);
  }, []);

  function login(t: string, name: string) {
    sessionStorage.setItem("admin_token", t);
    sessionStorage.setItem("admin_name", name);
    setToken(t);
    setBusinessName(name);
  }

  function logout() {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_name");
    setToken(null);
    setBusinessName(null);
  }

  if (pathname === "/admin/register") {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ token, businessName, login, logout }}>
      <AdminShell>{children}</AdminShell>
    </AuthContext.Provider>
  );
}
