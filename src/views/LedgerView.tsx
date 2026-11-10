import React, { useState, useMemo } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { Transaction, TransactionType } from '../types';
import { formatDateIndo, formatDateShort, formatRupiah, formatRupiahExact } from '../utils/formatters';
import {
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Trash2,
  FileText,
  Calendar,
  Layers,
  Check,
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const {
    transactions,
    stats,
    isDense,
    toggleDense,
    setQuickEntryModalOpen,
    setSelectedKwitansiTrx,
    validateTransaction,
    voidTransaction,
    exportToCSV,
    config,
  } = useKoperasi();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'TERVALIDASI' | 'MENUNGGU'>('ALL');
  const [dateRange, setDateRange] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [customDate, setCustomDate] = useState<string>('');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('ALL');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.refCode.toLowerCase().includes(q) ||
          t.buktiKasNo.toLowerCase().includes(q) ||
          t.memberName.toLowerCase().includes(q) ||
          (t.memberNo && t.memberNo.toLowerCase().includes(q)) ||
          t.description.toLowerCase().includes(q) ||
          t.accountName.toLowerCase().includes(q) ||
          (t.kwitansiNo && t.kwitansiNo.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Type
      if (filterType !== 'ALL' && t.type !== filterType) return false;

      // Status
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;

      // Account
      if (selectedAccountFilter !== 'ALL' && t.accountCode !== selectedAccountFilter) return false;

      // Date range
      if (customDate) {
        if (t.date !== customDate) return false;
      } else if (dateRange !== 'ALL') {
        const today = new Date().toISOString().slice(0, 10);
        if (dateRange === 'TODAY') {
          if (t.date !== today) return false;
        } else if (dateRange === 'MONTH') {
          const currentMonth = today.slice(0, 7);
          if (!t.date.startsWith(currentMonth)) return false;
        }
      }

      return true;
    });
  }, [transactions, searchQuery, filterType, filterStatus, selectedAccountFilter, dateRange, customDate]);

  // Distinct account list for filter dropdown
  const accountOptions = useMemo(() => {
    const map = new Map<string, string>();
    transactions.forEach((t) => {
      map.set(t.accountCode, `[${t.accountCode}] ${t.accountName}`);
    });
    return Array.from(map.entries());
  }, [transactions]);

  const handlePrintLKH = () => {
    window.print();
  };

  const handleVoidClick = (t: Transaction) => {
    if (window.confirm(`Yakin membatalkan transaksi ${t.buktiKasNo} (${t.memberName} - ${formatRupiah(t.amount)})? Saldo kas akan disesuaikan otomatis.`)) {
      voidTransaction(t.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Saldo Awal */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Saldo Awal Buku</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-800 tracking-tight">
            {formatRupiah(stats.saldoAwal)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Posisi dasar pembukuan periode
          </div>
        </div>

        {/* Card 2: Kas Masuk */}
        <div className="bg-white p-3.5 rounded border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Kas Masuk (Penerimaan)</span>
            <div className="p-1 rounded bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-emerald-700 tracking-tight">
            +{formatRupiah(stats.totalMasuk)}
          </div>
          <div className="text-[11px] text-emerald-800 mt-0.5">
            Total setoran simpanan & angsuran
          </div>
        </div>

        {/* Card 3: Kas Keluar */}
        <div className="bg-white p-3.5 rounded border border-rose-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Kas Keluar (Pengeluaran)</span>
            <div className="p-1 rounded bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-rose-600 tracking-tight">
            -{formatRupiah(stats.totalKeluar)}
          </div>
          <div className="text-[11px] text-rose-700 mt-0.5">
            Pencairan kredit, operasional & beban
          </div>
        </div>

        {/* Card 4: Saldo Akhir Berjalan */}
        <div className="bg-emerald-900 text-white p-3.5 rounded shadow-2xs border border-emerald-950">
          <div className="flex items-center justify-between text-emerald-200 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Kas Akhir</span>
            <Coins className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="font-mono text-xl font-bold text-white tracking-tight">
            {formatRupiah(stats.saldoAkhir)}
          </div>
          <div className="text-[11px] text-emerald-300 mt-0.5 flex items-center justify-between">
            <span>Fisik Kas Teller Seimbang</span>
            <span className="text-[10px] bg-emerald-800 px-1.5 py-0.2 rounded font-mono">
              100% Cocok
            </span>
          </div>
        </div>
      </div>

      {/* Action and Filter Workbench Bar */}
      <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. Bukti, Nama Anggota, Uraian, Ref..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Quick Date Filters */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => {
                setDateRange('ALL');
                setCustomDate('');
              }}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                dateRange === 'ALL' && !customDate
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => {
                setDateRange('TODAY');
                setCustomDate('');
              }}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                dateRange === 'TODAY' && !customDate
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => {
                setDateRange('MONTH');
                setCustomDate('');
              }}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                dateRange === 'MONTH' && !customDate
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bulan Ini
            </button>
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setDateRange('ALL');
              }}
              title="Pilih tanggal spesifik"
              className="px-2 py-0.8 text-xs bg-slate-50 border border-slate-300 rounded font-mono text-slate-700"
            />
          </div>

          {/* Control Utilities */}
          <div className="flex items-center gap-2">
            {/* Dense toggle */}
            <button
              onClick={toggleDense}
              title={isDense ? 'Ganti ke Mode Normal (44px)' : 'Ganti ke Mode Padat (36px)'}
              className={`px-2.5 py-1.5 border rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDense
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isDense ? 'Mode Padat' : 'Mode Normal'}</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportToCSV}
              title="Unduh format spreadsheet CSV"
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV Excel</span>
            </button>

            {/* Print LKH */}
            <button
              onClick={handlePrintLKH}
              title="Cetak Laporan Kas Harian"
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak LKH</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setQuickEntryModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Transaksi</span>
              <kbd className="font-mono text-[9px] bg-emerald-800/80 px-1 py-0.5 rounded text-emerald-100 ml-0.5">
                Ctrl+N
              </kbd>
            </button>
          </div>
        </div>

        {/* Secondary Filter Row: Type, Status, Account */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Arus:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'ALL')}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-700 text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">Semua Arus Kas</option>
              <option value="MASUK">Kas Masuk (Penerimaan)</option>
              <option value="KELUAR">Kas Keluar (Pengeluaran)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Validasi:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'TERVALIDASI' | 'MENUNGGU')}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-700 text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">Semua Status</option>
              <option value="TERVALIDASI">Tervalidasi Bendahara</option>
              <option value="MENUNGGU">Menunggu Verifikasi</option>
            </select>
          </div>

          {/* Account Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Akun:</span>
            <select
              value={selectedAccountFilter}
              onChange={(e) => setSelectedAccountFilter(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-700 text-xs focus:ring-1 focus:ring-emerald-600 max-w-xs truncate"
            >
              <option value="ALL">Semua Pos Akun</option>
              {accountOptions.map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-slate-500 font-mono text-[11px]">
            Menampilkan <strong>{filteredTransactions.length}</strong> dari {transactions.length} mutasi
          </div>
        </div>
      </div>

      {/* Main LKH Ledger Table */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-medium uppercase tracking-wider text-[11px] select-none">
                <th className="py-2.5 px-3 whitespace-nowrap">Waktu & Tgl</th>
                <th className="py-2.5 px-3 whitespace-nowrap">No. Bukti / Ref</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Pos Akun</th>
                <th className="py-2.5 px-3 min-w-[200px]">Uraian & Anggota</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Kas Masuk (+Rp)</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Kas Keluar (-Rp)</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap bg-slate-200/60 font-bold">
                  Saldo Berjalan
                </th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-medium text-sm">Tidak ada transaksi yang cocok dengan filter</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau rentang tanggal</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => {
                  const isMasuk = t.type === 'MASUK';
                  const rowPadding = isDense ? 'py-1 px-3' : 'py-2 px-3';

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/90 transition-colors ${
                        idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                      }`}
                    >
                      {/* Date & Time */}
                      <td className={`${rowPadding} whitespace-nowrap text-slate-600 font-mono text-[11px]`}>
                        <div>{formatDateShort(t.date)}</div>
                        <div className="text-slate-400 text-[10px]">{t.time} WITA</div>
                      </td>

                      {/* Bukti Kas & Ref Code */}
                      <td className={`${rowPadding} whitespace-nowrap font-mono`}>
                        <div className="font-semibold text-slate-900">{t.buktiKasNo}</div>
                        <div className="text-[10px] text-slate-500">{t.refCode}</div>
                      </td>

                      {/* Account Code & Category */}
                      <td className={`${rowPadding} whitespace-nowrap`}>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5 font-medium">
                          {t.accountCode}
                        </span>
                        <span className="text-slate-800 font-medium truncate max-w-[130px] inline-block align-middle">
                          {t.accountName}
                        </span>
                      </td>

                      {/* Description & Member */}
                      <td className={`${rowPadding}`}>
                        <div className="font-medium text-slate-900 leading-snug">
                          {t.description}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700">{t.memberName}</span>
                          {t.memberNo && (
                            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-1 rounded border border-emerald-200">
                              {t.memberNo}
                            </span>
                          )}
                          <span className="text-slate-400">&bull;</span>
                          <span className="text-slate-500 text-[10px]">{t.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Kas Masuk (+Rp) */}
                      <td className={`${rowPadding} text-right font-mono whitespace-nowrap font-semibold tabular-nums text-emerald-600`}>
                        {isMasuk ? `+${new Intl.NumberFormat('id-ID').format(t.amount)}` : '-'}
                      </td>

                      {/* Kas Keluar (-Rp) */}
                      <td className={`${rowPadding} text-right font-mono whitespace-nowrap font-semibold tabular-nums text-rose-600`}>
                        {!isMasuk ? `-${new Intl.NumberFormat('id-ID').format(t.amount)}` : '-'}
                      </td>

                      {/* Saldo Berjalan (Running Balance Highlighted) */}
                      <td className={`${rowPadding} text-right font-mono whitespace-nowrap font-bold tabular-nums text-slate-900 bg-slate-100/70 border-l border-r border-slate-200/80`}>
                        {new Intl.NumberFormat('id-ID').format(t.runningBalance)}
                      </td>

                      {/* Status Validasi Badge */}
                      <td className={`${rowPadding} text-center whitespace-nowrap`}>
                        {t.status === 'TERVALIDASI' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Tervalidasi
                          </span>
                        ) : (
                          <button
                            onClick={() => validateTransaction(t.id)}
                            title="Klik untuk validasi sekarang oleh Bendahara"
                            className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Menunggu Verifikasi
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className={`${rowPadding} text-center whitespace-nowrap no-print`}>
                        <div className="flex items-center justify-center gap-1">
                          {/* Cetak Kwitansi */}
                          <button
                            onClick={() => setSelectedKwitansiTrx(t)}
                            title="Cetak Dokumen Kwitansi Sah"
                            className="p-1 hover:bg-emerald-50 text-emerald-700 rounded transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Quick Validate if pending */}
                          {t.status === 'MENUNGGU' && (
                            <button
                              onClick={() => validateTransaction(t.id)}
                              title="Setujui & Validasi Transaksi"
                              className="p-1 hover:bg-amber-50 text-amber-600 rounded transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {/* Void / Delete action */}
                          <button
                            onClick={() => handleVoidClick(t)}
                            title="Batalkan Transaksi (Void)"
                            className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-300 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 font-mono">
          <div>
            Saldo Awal: <strong className="text-slate-900">{formatRupiah(stats.saldoAwal)}</strong>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-emerald-700">
              Total Masuk: <strong>+{formatRupiah(stats.totalMasuk)}</strong>
            </span>
            <span className="text-rose-600">
              Total Keluar: <strong>-{formatRupiah(stats.totalKeluar)}</strong>
            </span>
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
              Saldo Akhir: {formatRupiah(stats.saldoAkhir)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
