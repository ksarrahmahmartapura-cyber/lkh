import React, { useState } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { Transaction } from '../types';
import { KwitansiDocument } from '../components/KwitansiDocument';
import {
  Printer,
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Receipt,
  Eye,
  Plus,
} from 'lucide-react';
import { formatDateIndo, formatRupiah, formatRupiahExact } from '../utils/formatters';

export const KwitansiView: React.FC = () => {
  const { transactions, config, setSelectedKwitansiTrx, setQuickEntryModalOpen } = useKoperasi();
  const [selectedTrxId, setSelectedTrxId] = useState<string>(() => {
    return transactions.length > 0 ? transactions[0].id : '';
  });
  const [format, setFormat] = useState<'A5' | 'THERMAL'>('A5');
  const [searchArchive, setSearchArchive] = useState('');

  const currentTrx = transactions.find((t) => t.id === selectedTrxId) || transactions[0];

  const filteredArchive = transactions.filter((t) => {
    if (!searchArchive) return true;
    const q = searchArchive.toLowerCase();
    return (
      (t.kwitansiNo && t.kwitansiNo.toLowerCase().includes(q)) ||
      t.buktiKasNo.toLowerCase().includes(q) ||
      t.memberName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Pusat Penerbitan Kwitansi Sah
            </h2>
            <p className="text-xs text-slate-500">
              Dokumen sah tanda terima kas dengan cap legalisir & matriks tanda tangan resmi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Toggle */}
          <div className="bg-slate-100 p-0.5 rounded border border-slate-300 flex text-xs">
            <button
              onClick={() => setFormat('A5')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                format === 'A5'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Format Formal A5 Landscape
            </button>
            <button
              onClick={() => setFormat('THERMAL')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                format === 'THERMAL'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Format Struk Thermal 80mm
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Terpilih</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Transaction Selector & Details (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded border border-slate-200 shadow-2xs p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pilih Mutasi untuk Kwitansi
              </span>
              <button
                onClick={() => setQuickEntryModalOpen(true)}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Baru
              </button>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {transactions.map((t) => {
                const isSelected = t.id === selectedTrxId;
                const isMasuk = t.type === 'MASUK';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrxId(t.id)}
                    className={`p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-semibold text-slate-900">
                        {t.kwitansiNo || t.buktiKasNo}
                      </span>
                      <span
                        className={`font-mono font-bold text-[11px] ${
                          isMasuk ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isMasuk ? '+' : '-'}{formatRupiah(t.amount)}
                      </span>
                    </div>

                    <div className="font-medium text-slate-800 mt-1 truncate">
                      {t.memberName}
                    </div>

                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {t.description}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/80 text-[10px] text-slate-400">
                      <span>{t.date} &bull; {t.time}</span>
                      <span
                        className={`font-semibold ${
                          t.status === 'TERVALIDASI' ? 'text-emerald-700' : 'text-amber-600'
                        }`}
                      >
                        {t.status === 'TERVALIDASI' ? 'Tervalidasi' : 'Menunggu'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800">Petunjuk Cetak Dokumen:</div>
            <p className="text-[11px] leading-relaxed">
              Gunakan kertas <strong>HVS A5 (Landscape)</strong> untuk arsip tanda terima resmi koperasi atau pilih printer thermal kasir 80mm untuk struk cepat nasabah.
            </p>
            <p className="text-[11px] text-emerald-800 font-medium">
              &bull; Cap stempel otomatis disematkan bila status transaksi tervalidasi.
            </p>
          </div>
        </div>

        {/* Right Side: High Fidelity Live Kwitansi Paper Preview (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-100 p-4 sm:p-6 rounded border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[500px]">
          {currentTrx ? (
            <div className="w-full">
              <div className="mb-2 text-right text-xs text-slate-500 flex justify-between items-center px-1">
                <span>Pratinjau Kertas Langsung (What You See Is What You Print)</span>
                <button
                  onClick={() => setSelectedKwitansiTrx(currentTrx)}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Buka Modal Layar Penuh
                </button>
              </div>
              <KwitansiDocument
                transaction={currentTrx}
                config={config}
                format={format}
              />
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12">
              Pilih transaksi di kolom sebelah kiri untuk memuat kwitansi.
            </div>
          )}
        </div>
      </div>

      {/* Kwitansi Archive Table */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Buku Registrasi Kwitansi Terbit
            </h3>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchArchive}
              onChange={(e) => setSearchArchive(e.target.value)}
              placeholder="Cari nomor kwitansi / nama..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2 px-3">No. Kwitansi</th>
                <th className="py-2 px-3">No. Bukti Kas</th>
                <th className="py-2 px-3">Tanggal & Waktu</th>
                <th className="py-2 px-3">Nama Pihak Penyetor</th>
                <th className="py-2 px-3">Uraian Pembayaran</th>
                <th className="py-2 px-3 text-right">Nominal</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredArchive.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    {t.kwitansiNo || '-'}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-600">
                    {t.buktiKasNo}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                    {t.date} {t.time}
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-900">
                    {t.memberName}
                  </td>
                  <td className="py-2 px-3 text-slate-600 max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {formatRupiah(t.amount)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.status === 'TERVALIDASI'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {t.status === 'TERVALIDASI' ? 'Tervalidasi' : 'Menunggu'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedTrxId(t.id);
                        setSelectedKwitansiTrx(t);
                      }}
                      className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Cetak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
