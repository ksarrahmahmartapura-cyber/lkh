import React, { useState, useEffect, useRef } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { PaymentMethod, TransactionType, ValidationStatus } from '../types';
import { parseRupiahInput, formatRupiah, terbilang } from '../utils/formatters';
import { X, ArrowDownRight, ArrowUpRight, Check, Printer, UserCheck } from 'lucide-react';

interface QuickEntryModalProps {
  onClose: () => void;
}

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ onClose }) => {
  const { coa, members, addTransaction, setSelectedKwitansiTrx } = useKoperasi();

  const [type, setType] = useState<TransactionType>('MASUK');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>(() => new Date().toTimeString().slice(0, 5));
  const [accountCode, setAccountCode] = useState<string>('3-102'); // Default to Simpanan Wajib
  const [memberId, setMemberId] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [rawAmount, setRawAmount] = useState<string>('100000');
  const [description, setDescription] = useState<string>('Setoran Simpanan Wajib');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TUNAI');
  const [autoValidate, setAutoValidate] = useState<boolean>(true);
  const [autoPrintKwitansi, setAutoPrintKwitansi] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Filter COA accounts that fit the selected type
  const availableAccounts = coa.filter((a) => a.type === 'BOTH' || a.type === type);

  // On type change, adjust default account if needed
  useEffect(() => {
    if (type === 'MASUK') {
      setAccountCode('3-102');
      setDescription('Setoran Simpanan Wajib');
    } else {
      setAccountCode('5-101');
      setDescription('Beban Operasional Kantor & ATK');
    }
  }, [type]);

  // Focus amount input on open
  useEffect(() => {
    setTimeout(() => {
      amountInputRef.current?.focus();
      amountInputRef.current?.select();
    }, 100);
  }, []);

  const numAmount = parseRupiahInput(rawAmount);

  const handleMemberChange = (id: string) => {
    setMemberId(id);
    if (id) {
      const selected = members.find((m) => m.id === id);
      if (selected) {
        setCustomName(selected.name);
        if (type === 'MASUK' && accountCode === '1-201' && selected.angsuranPerBulan) {
          setRawAmount(selected.angsuranPerBulan.toString());
          setDescription(`Pembayaran Angsuran Pinjaman Pokok & Jasa - ${selected.name}`);
        }
      }
    }
  };

  const handleAccountChange = (code: string) => {
    setAccountCode(code);
    const selectedAcc = coa.find((a) => a.code === code);
    if (selectedAcc) {
      if (code === '3-102') setDescription('Setoran Simpanan Wajib');
      else if (code === '3-101') setDescription('Setoran Simpanan Pokok Anggota Baru');
      else if (code === '2-101') setDescription('Setoran Tabungan Sukarela');
      else if (code === '1-201') {
        setDescription(type === 'MASUK' ? 'Angsuran Pelunasan Pokok Pinjaman' : 'Pencairan Dana Pinjaman Anggota');
      } else {
        setDescription(selectedAcc.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (numAmount <= 0) {
      alert('Nominal transaksi harus lebih dari Rp 0');
      return;
    }

    const selectedAcc = coa.find((a) => a.code === accountCode);
    const selectedMember = members.find((m) => m.id === memberId);

    const memberName = selectedMember ? selectedMember.name : (customName.trim() || 'Penyetor / Pihak Ke-3');
    const memberNo = selectedMember ? selectedMember.memberNo : undefined;

    const newTrx = addTransaction({
      date,
      time,
      type,
      accountCode,
      accountName: selectedAcc?.name || 'Kas Transaksi',
      memberId: memberId || undefined,
      memberName,
      memberNo,
      description: description.trim() || `${selectedAcc?.name || 'Transaksi Kas'}`,
      amount: numAmount,
      status: (autoValidate ? 'TERVALIDASI' : 'MENUNGGU') as ValidationStatus,
      paymentMethod,
      autoIssueKwitansi: autoPrintKwitansi,
      notes: notes.trim() || undefined,
    });

    onClose();

    if (autoPrintKwitansi) {
      setSelectedKwitansiTrx(newTrx);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide">
              Catat Transaksi Buku Kas (LKH)
            </span>
            <span className="text-[11px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
              Ctrl+N
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Transaction Type Radio Selector */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              Jenis Arus Kas <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('MASUK')}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 font-semibold transition-all border ${
                  type === 'MASUK'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600 ring-1 ring-emerald-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                <span>KAS MASUK (Penerimaan)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('KELUAR')}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 font-semibold transition-all border ${
                  type === 'KELUAR'
                    ? 'bg-rose-50 text-rose-800 border-rose-600 ring-1 ring-rose-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                <span>KAS KELUAR (Pengeluaran)</span>
              </button>
            </div>
          </div>

          {/* Amount Input with Auto-formatting & Terbilang Preview */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-300">
            <div className="flex justify-between items-baseline mb-1">
              <label className="font-semibold text-slate-800">
                Nominal Jumlah (Rp) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Keyboard Numpad Ready
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm select-none">
                Rp
              </span>
              <input
                ref={amountInputRef}
                type="text"
                required
                value={numAmount ? new Intl.NumberFormat('id-ID').format(numAmount) : ''}
                onChange={(e) => setRawAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-11 pr-3 py-2 text-base font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600 text-right tracking-wide"
              />
            </div>

            {/* Live Terbilang Words */}
            <div className="mt-2 text-[11px] italic font-serif text-slate-700 bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-400 not-italic font-sans text-[10px] block mb-0.5">
                Terbilang:
              </span>
              "{terbilang(numAmount)}"
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Tanggal Pembukuan
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Waktu Transaksi
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Account COA Selection */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Pos Akun / Kategori Transaksi <span className="text-red-500">*</span>
            </label>
            <select
              value={accountCode}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
            >
              {availableAccounts.map((a) => (
                <option key={a.code} value={a.code}>
                  [{a.code}] {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>

          {/* Member Picker or Custom Payee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Pilih Anggota Terdaftar (Opsional)
              </label>
              <select
                value={memberId}
                onChange={(e) => handleMemberChange(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                <option value="">-- Non-Anggota / Pihak Luar --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberNo} - {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nama Penyetor / Penerima (Di Kwitansi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Nama jelas pihak penyetor / penerima"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Uraian Keterangan */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Uraian / Keterangan Transaksi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Setoran Simpanan Wajib Bulan November 2026"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Metode Bayar & Catatan Audit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                <option value="TUNAI">Kas Tunai di Meja Teller</option>
                <option value="TRANSFER_BRI">Transfer Bank BRI</option>
                <option value="TRANSFER_MANDIRI">Transfer Bank Mandiri</option>
                <option value="TRANSFER_BCA">Transfer Bank BCA</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nomor Referensi / Catatan Internal
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="No. Nota / Rekening fisik..."
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Checkboxes: Auto validate & direct Kwitansi preview */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={autoValidate}
                onChange={(e) => setAutoValidate(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium">
                Tervalidasi langsung oleh Bendahara (Status Sah)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={autoPrintKwitansi}
                onChange={(e) => setAutoPrintKwitansi(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium">
                Langsung buka pratinjau Kwitansi untuk dicetak
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Tekan <kbd className="font-mono bg-slate-100 border border-slate-300 px-1 py-0.5 rounded">Ctrl+Enter</kbd> untuk simpan cepat
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Simpan ke Buku Kas
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
