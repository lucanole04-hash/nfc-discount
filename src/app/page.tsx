import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          NFC Discount Platform
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
          Sconti digitali
          <br />
          <span className="text-amber-500">con un tocco</span>
        </h1>

        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Trasforma un semplice portachiavi NFC in una tessera sconto digitale.
          I tuoi clienti avvicinano il telefono e vedono subito la promozione
          attiva.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/promo/demo-abc123"
            className="px-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-900/10"
          >
            Vedi demo cliente
          </Link>
          <Link
            href="/admin"
            className="px-8 py-3.5 bg-white text-gray-700 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            Accedi alla dashboard
          </Link>
          <Link
            href="/admin/register"
            className="px-8 py-3.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition shadow-lg shadow-amber-500/10"
          >
            Registra la tua attività
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-6">
          <FeatureCard
            icon="📱"
            title="Zero app da scaricare"
            desc="Il cliente avvicina il telefono al portachiavi NFC e vede subito lo sconto. Nessun login, nessuna app."
          />
          <FeatureCard
            icon="⚡"
            title="Aggiornamento in tempo reale"
            desc="Cambi lo sconto dalla dashboard e il cliente vede subito la nuova promozione al prossimo tap."
          />
          <FeatureCard
            icon="🎯"
            title="Semplice da gestire"
            desc="Dashboard intuitiva per modificare sconti, validità e messaggi personalizzati per i tuoi clienti."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-sm text-gray-400">
          NFC Discount &mdash; Digital pass per attività commerciali
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
