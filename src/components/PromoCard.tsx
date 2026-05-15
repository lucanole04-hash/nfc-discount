export type PromoBusinessData = {
  name: string;
  logo: string | null;
  discount: number;
  description: string;
  message: string;
  active: boolean;
  validUntil: string | null;
  cumulative: boolean;
};

export function PromoCard({ business }: { business: PromoBusinessData }) {
  const isExpired =
    business.validUntil && new Date(business.validUntil) < new Date();
  const isActive = business.active && !isExpired;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-8 text-center">
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
              {business.name.charAt(0)}
            </div>
          )}
          <h1 className="text-white text-lg font-semibold tracking-wide">
            {business.name}
          </h1>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isActive ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <span className="text-gray-300 text-xs uppercase tracking-widest">
              {isActive ? "Sconto attivo" : "Sconto non attivo"}
            </span>
          </div>
        </div>

        {/* Discount */}
        <div className="px-6 py-10 text-center">
          {isActive ? (
            <>
              <div className="text-7xl font-black text-gray-900 tracking-tight">
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

        {/* Info */}
        {isActive && (
          <div className="px-6 pb-6 space-y-3">
            {business.message && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-center">
                <p className="text-amber-800 text-sm">{business.message}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
              <p className="text-gray-600 text-sm font-medium">
                📱 Mostra questa pagina al personale
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>
                {business.validUntil
                  ? `Valido fino al ${new Date(business.validUntil).toLocaleDateString("it-IT")}`
                  : "Validità illimitata"}
              </span>
              <span>
                {business.cumulative ? "Cumulabile" : "Non cumulabile"}
              </span>
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
