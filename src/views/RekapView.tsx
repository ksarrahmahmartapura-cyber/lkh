import React, { useState, useMemo } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { formatRupiah, formatRupiahExact } from '../utils/formatters';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Scale,
  FileSpreadsheet,
} from 'lucide-react';

export const RekapView: React.FC = () => {
  const { transactions, stats, config, exportToCSV } = useKoperasi();

  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [brankasFisik, setBrankasFisik] = useState<number>(stats.saldoAkhir);

  // Group transactions by category for this period
  const breakdown = useMemo(() => {
    const masukMap = new Map<string, { code: string; name: string; total: number; count: number }>();
    const keluarMap = new Map<string, { code: string; name: string; total: number; count: number }>();

    transactions.forEach((t) => {
      const targetMap = t.type === 'MASUK' ? masukMap : keluarMap;
      const key = t.accountCode;
      const existing = targetMap.get(key) || {
        code: t.accountCode,
        name: t.accountName,
        total: 0,
        count: 0,
      };

      existing.total += t.amount;
      existing.count += 1;
      targetMap.set(key, existing);
    });

    return {
      masukList: Array.from(masukMap.values()).sort((a, b) => b.total - a.total),
      keluarList: Array.from(keluarMap.values()).sort((a, b) => b.total - a.total),
    };
  }, [transactions]);

  const variance = brankasFisik - stats.saldoAkhir;
  const isBalanced = variance === 0;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Rekapitulasi Arus Kas & Rekonsiliasi Audit
            </h2>
            <p className="text-xs text-slate-500">
              Ringkasan pergerakan kas masuk, kas keluar, dan penutupan buku harian (LKH).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Rekapitulasi</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara Kas</span>
          </button>
        </div>
      </div>

      {/* Audit Reconciliation Box */}
      <div className="bg-white rounded border border-slate-300 shadow-2xs p-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Berita Acara Rekonsiliasi Fisik Kas vs Saldo Buku
            </h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              isBalanced
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}
          >
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SEIMBANG (0 Selisih)</span>
              </>
            ) : (
              <span>SELISIH: {formatRupiah(variance)}</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 block mb-1">Saldo Menurut Buku Kas (LKH)</span>
            <div className="font-mono text-lg font-bold text-slate-900">
              {formatRupiah(stats.saldoAkhir)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Hasil kalkulasi seluruh mutasi berjalan</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-500">Hitungan Fisik Uang di Brankas</span>
              <button
                onClick={() => setBrankasFisik(stats.saldoAkhir)}
                className="text-[10px] text-emerald-700 hover:underline font-semibold"
              >
                Samakan
              </button>
            </div>
            <div className="font-mono text-lg font-bold text-slate-900">
              {formatRupiah(brankasFisik)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Uang kertas & logam di kasir/teller</div>
          </div>

          <div className={`p-3 rounded border ${isBalanced ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <span className="text-slate-600 block mb-1 font-medium">Status Audit Rekonsiliasi</span>
            <div className={`font-mono text-lg font-bold ${isBalanced ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isBalanced ? 'Rp 0 (Klop)' : formatRupiah(Math.abs(variance))}
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              {isBalanced
                ? 'Tidak ada selisih lebih atau kurang pada tutup buku hari ini.'
                : 'Periksa kembali nota fisik atau setoran pending yang belum tercatat.'}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Breakdown: Inflows vs Outflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inflows (Penerimaan Kas) */}
        <div className="bg-white rounded border border-emerald-200/80 shadow-2xs p-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Rincian Kas Masuk (Penerimaan)
              </h3>
            </div>
            <span className="font-mono font-bold text-xs text-emerald-700">
              +{formatRupiah(stats.totalMasuk)}
            </span>
          </div>

          <div className="space-y-2.5">
            {breakdown.masukList.map((item) => {
              const percent = stats.totalMasuk > 0 ? (item.total / stats.totalMasuk) * 100 : 0;
              return (
                <div key={item.code} className="text-xs">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-medium text-slate-800">
                      <span className="font-mono text-[10px] bg-slate-100 px-1 rounded mr-1">
                        {item.code}
                      </span>
                      {item.name}
                    </div>
                    <div className="font-mono font-bold text-emerald-700 text-right">
                      {formatRupiah(item.total)}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        ({percent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outflows (Pengeluaran Kas) */}
        <div className="bg-white rounded border border-rose-200/80 shadow-2xs p-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Rincian Kas Keluar (Pengeluaran)
              </h3>
            </div>
            <span className="font-mono font-bold text-xs text-rose-600">
              -{formatRupiah(stats.totalKeluar)}
            </span>
          </div>

          <div className="space-y-2.5">
            {breakdown.keluarList.map((item) => {
              const percent = stats.totalKeluar > 0 ? (item.total / stats.totalKeluar) * 100 : 0;
              return (
                <div key={item.code} className="text-xs">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-medium text-slate-800">
                      <span className="font-mono text-[10px] bg-slate-100 px-1 rounded mr-1">
                        {item.code}
                      </span>
                      {item.name}
                    </div>
                    <div className="font-mono font-bold text-rose-600 text-right">
                      {formatRupiah(item.total)}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        ({percent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
