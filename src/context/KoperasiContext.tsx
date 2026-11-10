import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountCOA, KoperasiConfig, Member, Transaction, TransactionType } from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_COA,
  INITIAL_MEMBERS,
  INITIAL_SALDO_AWAL,
  INITIAL_TRANSACTIONS,
} from '../utils/mockData';
import { generateBuktiKas, generateKwitansiNo, generateRefCode } from '../utils/formatters';

interface KoperasiContextType {
  transactions: Transaction[];
  members: Member[];
  coa: AccountCOA[];
  config: KoperasiConfig;
  saldoAwal: number;
  activeTab: 'LEDGER' | 'KWITANSI' | 'MEMBERS' | 'REKAP' | 'COA';
  setActiveTab: (tab: 'LEDGER' | 'KWITANSI' | 'MEMBERS' | 'REKAP' | 'COA') => void;
  isDense: boolean;
  toggleDense: () => void;
  quickEntryModalOpen: boolean;
  setQuickEntryModalOpen: (open: boolean) => void;
  selectedKwitansiTrx: Transaction | null;
  setSelectedKwitansiTrx: (trx: Transaction | null) => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'refCode' | 'buktiKasNo' | 'runningBalance' | 'kwitansiNo'> & { autoIssueKwitansi?: boolean }) => Transaction;
  validateTransaction: (id: string) => void;
  voidTransaction: (id: string, reason?: string) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  addMember: (data: Omit<Member, 'id' | 'memberNo' | 'saldoSimpananPokok' | 'saldoSimpananWajib' | 'saldoSimpananSukarela' | 'sisaPinjaman'>) => Member;
  updateConfig: (newConfig: Partial<KoperasiConfig>) => void;
  resetToDefaultData: () => void;
  exportToCSV: () => void;
  stats: {
    saldoAwal: number;
    totalMasuk: number;
    totalKeluar: number;
    saldoAkhir: number;
    pendingCount: number;
    todayTransactionsCount: number;
  };
}

const KoperasiContext = createContext<KoperasiContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'koperasi_lkh_transactions_v2',
  MEMBERS: 'koperasi_lkh_members_v2',
  COA: 'koperasi_lkh_coa_v2',
  CONFIG: 'koperasi_lkh_config_v2',
  SALDO_AWAL: 'koperasi_lkh_saldo_awal_v2',
  DENSE: 'koperasi_lkh_dense_v2',
};

// Recalculates running balance for sequential list of transactions
function recalculateRunningBalances(items: Transaction[], startingBalance: number): Transaction[] {
  let currentBalance = startingBalance;
  return items.map((item) => {
    if (item.type === 'MASUK') {
      currentBalance += item.amount;
    } else {
      currentBalance -= item.amount;
    }
    return {
      ...item,
      runningBalance: currentBalance,
    };
  });
}

export const KoperasiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [saldoAwal, setSaldoAwal] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALDO_AWAL);
    return saved ? Number(saved) : INITIAL_SALDO_AWAL;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return recalculateRunningBalances(parsed, INITIAL_SALDO_AWAL);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MEMBERS;
      }
    }
    return INITIAL_MEMBERS;
  });

  const [coa, setCoa] = useState<AccountCOA[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COA;
      }
    }
    return INITIAL_COA;
  });

  const [config, setConfig] = useState<KoperasiConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CONFIG;
      }
    }
    return INITIAL_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'LEDGER' | 'KWITANSI' | 'MEMBERS' | 'REKAP' | 'COA'>('LEDGER');
  const [isDense, setIsDense] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.DENSE) === 'true';
  });
  const [quickEntryModalOpen, setQuickEntryModalOpen] = useState(false);
  const [selectedKwitansiTrx, setSelectedKwitansiTrx] = useState<Transaction | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALDO_AWAL, saldoAwal.toString());
  }, [saldoAwal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DENSE, isDense.toString());
  }, [isDense]);

  const toggleDense = () => setIsDense((prev) => !prev);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N or Cmd+N for quick entry
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setQuickEntryModalOpen(true);
      }
      // Esc to close modal
      if (e.key === 'Escape' && quickEntryModalOpen) {
        setQuickEntryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickEntryModalOpen]);

  // Compute stats
  const totalMasuk = transactions
    .filter((t) => t.type === 'MASUK')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalKeluar = transactions
    .filter((t) => t.type === 'KELUAR')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoAkhir = saldoAwal + totalMasuk - totalKeluar;
  const pendingCount = transactions.filter((t) => t.status === 'MENUNGGU').length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTransactionsCount = transactions.filter((t) => t.date === todayStr).length;

  const stats = {
    saldoAwal,
    totalMasuk,
    totalKeluar,
    saldoAkhir,
    pendingCount,
    todayTransactionsCount,
  };

  // Add Transaction
  const addTransaction = (
    data: Omit<Transaction, 'id' | 'refCode' | 'buktiKasNo' | 'runningBalance' | 'kwitansiNo'> & {
      autoIssueKwitansi?: boolean;
    }
  ): Transaction => {
    const nextSeq = transactions.length + 1;
    const refCode = generateRefCode(nextSeq, data.date);
    const buktiKasNo = generateBuktiKas(data.type, nextSeq + 489);
    const kwitansiNo = generateKwitansiNo(nextSeq + 489, data.date);

    const newTrx: Transaction = {
      id: `trx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      refCode,
      buktiKasNo,
      date: data.date,
      time: data.time || new Date().toTimeString().slice(0, 5),
      type: data.type,
      accountCode: data.accountCode,
      accountName: data.accountName,
      memberId: data.memberId,
      memberName: data.memberName,
      memberNo: data.memberNo,
      description: data.description,
      amount: data.amount,
      runningBalance: 0, // will be computed in recalculateRunningBalances
      status: data.status || 'TERVALIDASI',
      verifiedBy: data.status === 'TERVALIDASI' ? config.bendahara : undefined,
      verifiedAt: data.status === 'TERVALIDASI' ? `${data.date} ${data.time}` : undefined,
      kwitansiNo,
      kwitansiIssued: data.autoIssueKwitansi ?? true,
      paymentMethod: data.paymentMethod || 'TUNAI',
      notes: data.notes,
    };

    const updatedList = recalculateRunningBalances([...transactions, newTrx], saldoAwal);
    setTransactions(updatedList);

    // If transaction belongs to a registered member, update member balance
    if (data.memberId) {
      setMembers((prevMembers) =>
        prevMembers.map((m) => {
          if (m.id !== data.memberId) return m;

          const updated = { ...m };
          // Check COA account code
          if (data.accountCode === '3-101') {
            updated.saldoSimpananPokok += data.amount;
          } else if (data.accountCode === '3-102') {
            updated.saldoSimpananWajib += data.amount;
          } else if (data.accountCode === '2-101' || data.accountCode === '2-102') {
            if (data.type === 'MASUK') {
              updated.saldoSimpananSukarela += data.amount;
            } else {
              updated.saldoSimpananSukarela = Math.max(0, updated.saldoSimpananSukarela - data.amount);
            }
          } else if (data.accountCode === '1-201') {
            if (data.type === 'MASUK') {
              // Repayment
              updated.sisaPinjaman = Math.max(0, updated.sisaPinjaman - data.amount);
            } else {
              // Loan disbursement
              updated.sisaPinjaman += data.amount;
            }
          }
          return updated;
        })
      );
    }

    return newTrx;
  };

  // Validate transaction
  const validateTransaction = (id: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'TERVALIDASI',
              verifiedBy: config.bendahara,
              verifiedAt: timeStr,
            }
          : t
      )
    );
  };

  // Void / delete transaction
  const voidTransaction = (id: string, reason?: string) => {
    const filtered = transactions.filter((t) => t.id !== id);
    const recalculated = recalculateRunningBalances(filtered, saldoAwal);
    setTransactions(recalculated);
  };

  // Member CRUD
  const addMember = (
    data: Omit<
      Member,
      'id' | 'memberNo' | 'saldoSimpananPokok' | 'saldoSimpananWajib' | 'saldoSimpananSukarela' | 'sisaPinjaman'
    >
  ): Member => {
    const nextNum = 842 + members.length;
    const newMember: Member = {
      id: `m-${Date.now()}`,
      memberNo: `ANG-${nextNum.toString().padStart(4, '0')}`,
      ...data,
      saldoSimpananPokok: 500000,
      saldoSimpananWajib: 0,
      saldoSimpananSukarela: 0,
      sisaPinjaman: 0,
    };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const updateConfig = (newConfig: Partial<KoperasiConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetToDefaultData = () => {
    if (window.confirm('Reset data ke kondisi bawaan contoh Koperasi Berkah Makmur? Semua perubahan lokal akan dikembalikan.')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setMembers(INITIAL_MEMBERS);
      setCoa(INITIAL_COA);
      setConfig(INITIAL_CONFIG);
      setSaldoAwal(INITIAL_SALDO_AWAL);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.MEMBERS);
      localStorage.removeItem(STORAGE_KEYS.COA);
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      localStorage.removeItem(STORAGE_KEYS.SALDO_AWAL);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'No Bukti',
      'Ref Code',
      'Tanggal',
      'Waktu',
      'Tipe',
      'Kode Akun',
      'Nama Akun',
      'Nama Anggota / Penyetor',
      'No Anggota',
      'Uraian Keterangan',
      'Kas Masuk (Rp)',
      'Kas Keluar (Rp)',
      'Saldo Berjalan (Rp)',
      'Status Validasi',
      'Divalidasi Oleh',
      'No Kwitansi',
    ];

    const rows = transactions.map((t) => [
      `"${t.buktiKasNo}"`,
      `"${t.refCode}"`,
      `"${t.date}"`,
      `"${t.time}"`,
      `"${t.type}"`,
      `"${t.accountCode}"`,
      `"${t.accountName}"`,
      `"${t.memberName.replace(/"/g, '""')}"`,
      `"${t.memberNo || '-'}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.type === 'MASUK' ? t.amount : 0,
      t.type === 'KELUAR' ? t.amount : 0,
      t.runningBalance,
      `"${t.status}"`,
      `"${t.verifiedBy || '-'}"`,
      `"${t.kwitansiNo || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Kas_Harian_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <KoperasiContext.Provider
      value={{
        transactions,
        members,
        coa,
        config,
        saldoAwal,
        activeTab,
        setActiveTab,
        isDense,
        toggleDense,
        quickEntryModalOpen,
        setQuickEntryModalOpen,
        selectedKwitansiTrx,
        setSelectedKwitansiTrx,
        addTransaction,
        validateTransaction,
        voidTransaction,
        updateMember,
        addMember,
        updateConfig,
        resetToDefaultData,
        exportToCSV,
        stats,
      }}
    >
      {children}
    </KoperasiContext.Provider>
  );
};

export const useKoperasi = () => {
  const context = useContext(KoperasiContext);
  if (!context) {
    throw new Error('useKoperasi must be used within a KoperasiProvider');
  }
  return context;
};
