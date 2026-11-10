import React from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { formatDateIndo } from '../utils/formatters';
import { Plus, Bell, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, stats, setQuickEntryModalOpen, config, setActiveTab } = useKoperasi();

  const todayStr = new Date().toISOString().slice(0, 10);
  const formattedToday = formatDateIndo(todayStr, true);

  const getTitle = () => {
    switch (activeTab) {
      case 'LEDGER':
        return {
          title: 'Laporan Kas Harian (LKH)',
          subtitle: 'Buku kas mutasi penerimaan, pengeluaran, dan saldo berjalan realtime',
        };
      case 'KWITANSI':
        return {
          title: 'Penerbitan Kwitansi Terverifikasi',
          subtitle: 'Cetak tanda terima transaksi sah dengan stempel legalisir & matriks pengurus',
        };
      case 'MEMBERS':
        return {
          title: 'Buku Induk Anggota Koperasi',
          subtitle: 'Daftar anggota aktif, saldo simpanan pokok/wajib/sukarela, dan sisa pinjaman',
        };
      case 'REKAP':
        return {
          title: 'Rekapitulasi Arus Kas Bulanan',
          subtitle: 'Ikhtisar pemasukan & pengeluaran menurut bagan akun standar serta rekonsiliasi brankas',
        };
      case 'COA':
        return {
          title: 'Bagan Akun (COA) & Profil Lembaga',
          subtitle: 'Konfigurasi identitas resmi badan hukum, pejabat penandatangan, dan kode rekening',
        };
    }
  };

  const headerInfo = getTitle();

  return (
    <header className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {headerInfo.title}
          </h1>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
            LKH-RESMI
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
          {headerInfo.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Verification alert pill if any pending */}
        {stats.pendingCount > 0 && (
          <button
            onClick={() => setActiveTab('LEDGER')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>{stats.pendingCount} Menunggu Validasi</span>
          </button>
        )}

        {/* Live Date Badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded text-xs text-slate-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>{formattedToday}</span>
        </div>

        {/* Quick action button */}
        <button
          onClick={() => setQuickEntryModalOpen(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Transaksi</span>
          <kbd className="font-mono text-[9px] bg-emerald-800/80 px-1 py-0.5 rounded text-emerald-100">
            Ctrl+N
          </kbd>
        </button>
      </div>
    </header>
  );
};
