import Link from "next/link";

export default function PromoNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 text-2xl">
          🔍
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Promozione non trovata
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Il link che hai utilizzato non è valido o l&apos;attività non è più
          registrata nel sistema.
        </p>
        <Link
          href="/"
          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          Torna alla home
        </Link>
      </div>
    </main>
  );
}
