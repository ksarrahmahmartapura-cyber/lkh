import React, { useState } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { Member } from '../types';
import { formatRupiah } from '../utils/formatters';
import {
  Users,
  Search,
  Plus,
  FileText,
  CreditCard,
  Building,
  Phone,
  Calendar,
  X,
  Check,
  ChevronRight,
  TrendingUp,
  Receipt,
} from 'lucide-react';

export const MembersView: React.FC = () => {
  const { members, transactions, addMember, setSelectedKwitansiTrx, setQuickEntryModalOpen } = useKoperasi();
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New member form
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [unit, setUnit] = useState('Unit Perdagangan');
  const [address, setAddress] = useState('');

  const filteredMembers = members.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.memberNo.toLowerCase().includes(q) ||
      m.nik.includes(q) ||
      m.unit.toLowerCase().includes(q)
    );
  });

  // Calculate totals
  const totalSimpananAll = members.reduce(
    (acc, m) => acc + m.saldoSimpananPokok + m.saldoSimpananWajib + m.saldoSimpananSukarela,
    0
  );
  const totalPinjamanAll = members.reduce((acc, m) => acc + m.sisaPinjaman, 0);

  const memberTransactions = selectedMember
    ? transactions.filter((t) => t.memberId === selectedMember.id)
    : [];

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMember({
      name: name.trim(),
      nik: nik.trim() || '6303000000000000',
      phone: phone.trim() || '0812-0000-0000',
      unit,
      address: address.trim() || 'Martapura',
      joinDate: new Date().toISOString().slice(0, 10),
      status: 'AKTIF',
    });

    setName('');
    setNik('');
    setPhone('');
    setAddress('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Anggota Aktif</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-800">
            {members.length} <span className="text-xs text-slate-400 font-sans font-normal">Orang</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Pemegang hak suara resmi KSP</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Simpanan Anggota</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-xl font-bold text-emerald-700">
            {formatRupiah(totalSimpananAll)}
          </div>
          <div className="text-[11px] text-emerald-800 mt-0.5">Pokok, Wajib & Tabungan Sukarela</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Pinjaman</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono text-xl font-bold text-amber-700">
            {formatRupiah(totalPinjamanAll)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sisa saldo piutang beredar</div>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama anggota, nomor anggota, NIK, unit..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800"
          />
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Anggota Baru</span>
        </button>
      </div>

      {/* Main Members Grid / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Members Table */}
        <div className={`${selectedMember ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded border border-slate-200 shadow-2xs overflow-hidden transition-all`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-medium uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">No. Anggota</th>
                  <th className="py-2.5 px-3">Nama Anggota</th>
                  <th className="py-2.5 px-3">Unit Usaha</th>
                  <th className="py-2.5 px-3 text-right">Total Simpanan</th>
                  <th className="py-2.5 px-3 text-right">Sisa Pinjaman</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredMembers.map((m) => {
                  const isSelected = selectedMember?.id === m.id;
                  const totalSimpanan =
                    m.saldoSimpananPokok + m.saldoSimpananWajib + m.saldoSimpananSukarela;

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/70' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {m.memberNo}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{m.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{m.phone}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {m.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        {formatRupiah(totalSimpanan)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800 tabular-nums">
                        {m.sisaPinjaman > 0 ? (
                          <span className="text-amber-700 font-bold">{formatRupiah(m.sisaPinjaman)}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {m.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(m);
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Member Detail Ledger Drawer */}
        {selectedMember && (
          <div className="lg:col-span-5 bg-white rounded border border-slate-300 shadow-md p-4 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedMember.memberNo}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{selectedMember.name}</h3>
                <p className="text-xs text-slate-500">{selectedMember.unit}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simpanan Breakdown */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
                Rincian Saldo Simpanan
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Simpanan Pokok:</span>
                <span className="font-mono font-semibold">{formatRupiah(selectedMember.saldoSimpananPokok)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Simpanan Wajib:</span>
                <span className="font-mono font-semibold">{formatRupiah(selectedMember.saldoSimpananWajib)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Simpanan Sukarela:</span>
                <span className="font-mono font-semibold">{formatRupiah(selectedMember.saldoSimpananSukarela)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-emerald-800">
                <span>Total Ekuitas Simpanan:</span>
                <span className="font-mono">
                  {formatRupiah(
                    selectedMember.saldoSimpananPokok +
                      selectedMember.saldoSimpananWajib +
                      selectedMember.saldoSimpananSukarela
                  )}
                </span>
              </div>
            </div>

            {/* Pinjaman Info */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
                Status Pembiayaan / Pinjaman
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sisa Pokok Pinjaman:</span>
                <span className="font-mono font-bold text-amber-700">
                  {formatRupiah(selectedMember.sisaPinjaman)}
                </span>
              </div>
              {selectedMember.angsuranPerBulan && selectedMember.angsuranPerBulan > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Angsuran / Bulan:</span>
                    <span className="font-mono">{formatRupiah(selectedMember.angsuranPerBulan)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tenor:</span>
                    <span className="font-mono">{selectedMember.tenorBulan} Bulan</span>
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-emerald-800 font-medium">
                  Tidak ada kewajiban angsuran berjalan
                </div>
              )}
            </div>

            {/* Member Transaction History */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>Riwayat Transaksi Anggota</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {memberTransactions.length} Mutasi
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {memberTransactions.length === 0 ? (
                  <div className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded">
                    Belum ada riwayat mutasi untuk anggota ini
                  </div>
                ) : (
                  memberTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="p-2 rounded bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-slate-900 truncate max-w-[180px]">
                          {t.description}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {t.date} &bull; {t.buktiKasNo}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-mono font-bold ${
                            t.type === 'MASUK' ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {t.type === 'MASUK' ? '+' : '-'}{formatRupiah(t.amount)}
                        </div>
                        <button
                          onClick={() => setSelectedKwitansiTrx(t)}
                          className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5 ml-auto"
                        >
                          <Receipt className="w-3 h-3" /> Kwitansi
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CTA: Catat transaksi baru untuk anggota ini */}
            <button
              onClick={() => setQuickEntryModalOpen(true)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pembayaran Simpanan / Angsuran</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-300 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-semibold text-sm">Registrasi Anggota Koperasi Baru</span>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Syafi'i"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK 16 Digit)
                </label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="63030..."
                  maxLength={16}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nomor Handphone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Unit Usaha / Kelompok Kerja
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white"
                >
                  <option value="Unit Perdagangan Pasar">Unit Perdagangan Pasar</option>
                  <option value="Unit UMKM & Kuliner">Unit UMKM & Kuliner</option>
                  <option value="Unit Pertanian & Perkebunan">Unit Pertanian & Perkebunan</option>
                  <option value="Unit Pegawai Guru / ASN">Unit Pegawai Guru / ASN</option>
                  <option value="Unit Jasa & Angkutan">Unit Jasa & Angkutan</option>
                  <option value="Unit Umum / Mandiri">Unit Umum / Mandiri</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Alamat Domisili
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kelurahan, Kecamatan, Kota"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-slate-700 text-[11px]">
                Anggota baru akan otomatis dibuatkan Simpanan Pokok awal <strong>Rp 500.000</strong> dan Nomor Anggota resmi.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
