import React, { useState } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import {
  BookOpen,
  Receipt,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
  Coins,
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setQuickEntryModalOpen, stats, config } = useKoperasi();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const navItems = [
    {
      id: 'LEDGER' as const,
      label: 'Buku Kas Harian',
      sublabel: 'LKH & Mutasi',
      icon: BookOpen,
      badge: stats.pendingCount > 0 ? `${stats.pendingCount}` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'KWITANSI' as const,
      label: 'Penerbitan Kwitansi',
      sublabel: 'Dokumen Sah & Cetak',
      icon: Receipt,
    },
    {
      id: 'MEMBERS' as const,
      label: 'Daftar Anggota',
      sublabel: 'Buku Simpan Pinjam',
      icon: Users,
    },
    {
      id: 'REKAP' as const,
      label: 'Rekapitulasi Kas',
      sublabel: 'Arus Kas Bulanan',
      icon: BarChart3,
    },
    {
      id: 'COA' as const,
      label: 'Akun & Profil KSP',
      sublabel: 'Bagan Akun (COA)',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`no-print flex-shrink-0 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 transition-all duration-200 select-none ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-14 border-b border-slate-800 flex items-center px-3.5 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
            </div>
            {isExpanded && (
              <div className="leading-tight truncate">
                <span className="font-bold text-xs uppercase tracking-wider block text-white truncate">
                  {config.shortName}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-tight block truncate">
                  LKH & Kwitansi v2.4
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Kecilkan Menu' : 'Perluas Menu'}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Entry Action CTA */}
        <div className="p-2.5 border-b border-slate-800/80">
          <button
            onClick={() => setQuickEntryModalOpen(true)}
            className={`w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded text-xs flex items-center transition-colors shadow-xs ${
              isExpanded ? 'justify-between' : 'justify-center'
            }`}
            title="Catat Transaksi Baru (Ctrl+N)"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 flex-shrink-0" />
              {isExpanded && <span>Catat Transaksi</span>}
            </div>
            {isExpanded && (
              <kbd className="font-mono text-[9px] bg-emerald-800/70 px-1.5 py-0.5 rounded text-emerald-100">
                Ctrl+N
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Rail */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-colors font-medium text-left ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-300 border-l-3 border-emerald-500 font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                } ${!isExpanded ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {isExpanded && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="truncate">
                      <div className="truncate text-xs">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">{item.sublabel}</div>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Cash Balance Glance */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {isExpanded ? (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              <Coins className="w-3 h-3 text-emerald-400" />
              <span>Kas Fisik Saat Ini</span>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400 mt-1 tracking-tight">
              {formatRupiah(stats.saldoAkhir)}
            </div>
            <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
              <span>Buku: Rp {new Intl.NumberFormat('id-ID').format(stats.saldoAkhir)}</span>
              <span className="text-emerald-300">Seimbang</span>
            </div>
          </div>
        ) : (
          <div className="text-center" title={`Saldo Kas: ${formatRupiah(stats.saldoAkhir)}`}>
            <Coins className="w-5 h-5 text-emerald-400 mx-auto" />
          </div>
        )}
      </div>
    </aside>
  );
};
