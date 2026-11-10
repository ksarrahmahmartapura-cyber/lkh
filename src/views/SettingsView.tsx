import React, { useState } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import {
  Settings,
  Building2,
  ListOrdered,
  Save,
  RotateCcw,
  CheckCircle2,
  Download,
  Shield,
  Layers,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, coa, resetToDefaultData, exportToCSV } = useKoperasi();
  const [formData, setFormData] = useState(config);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Pengaturan Profil Koperasi & Bagan Akun (COA)
            </h2>
            <p className="text-xs text-slate-500">
              Kelola legalitas lembaga, pejabat otorisasi tanda tangan, dan standar akuntansi.
            </p>
          </div>
        </div>

        {savedNotice && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Pengaturan Berhasil Disimpan
          </span>
        )}
      </div>

      {/* Cooperative Identity Form */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-800" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Identitas Lembaga & Pejabat Kwitansi
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nama Resmi Lembaga Koperasi
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nama Singkat / Brand
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nomor Akta / SK Pengesahan Badan Hukum
              </label>
              <input
                type="text"
                value={formData.badanHukum}
                onChange={(e) => setFormData({ ...formData, badanHukum: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Kota Domisili (Untuk Penanggalan Kwitansi)
              </label>
              <input
                type="text"
                value={formData.kota}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Alamat Kantor Sekretariat Lengkap
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nomor Kontak / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Email Resmi Lembaga
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>
          </div>

          {/* Pejabat Otorisasi */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5">
              Matriks Tanda Tangan & Pejabat Berwenang
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Ketua Pengurus
                </label>
                <input
                  type="text"
                  value={formData.ketua}
                  onChange={(e) => setFormData({ ...formData, ketua: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Bendahara (Verifikator Sah)
                </label>
                <input
                  type="text"
                  value={formData.bendahara}
                  onChange={(e) => setFormData({ ...formData, bendahara: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Petugas Kasir / Teller
                </label>
                <input
                  type="text"
                  value={formData.teller}
                  onChange={(e) => setFormData({ ...formData, teller: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={formData.showStamp}
                onChange={(e) => setFormData({ ...formData, showStamp: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300"
              />
              <span className="font-medium">
                Tampilkan Cap Stempel Legalisir Koperasi pada Cetakan Kwitansi
              </span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>

      {/* Chart of Accounts (COA) Table */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Bagan Akun Standar Koperasi Simpan Pinjam (COA)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {coa.length} Akun Standar Kemenkop UKM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Kode Akun</th>
                <th className="py-2.5 px-3">Nama Akun Akuntansi</th>
                <th className="py-2.5 px-3">Golongan / Klasifikasi</th>
                <th className="py-2.5 px-3">Saldo Normal</th>
                <th className="py-2.5 px-3">Keterangan Fungsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {coa.map((item) => (
                <tr key={item.code} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-900">{item.code}</td>
                  <td className="py-2 px-3 font-sans font-medium text-slate-800">{item.name}</td>
                  <td className="py-2 px-3 font-sans">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.category === 'ASET'
                          ? 'bg-blue-50 text-blue-800'
                          : item.category === 'KEWAJIBAN'
                          ? 'bg-amber-50 text-amber-800'
                          : item.category === 'EKUITAS'
                          ? 'bg-emerald-50 text-emerald-800'
                          : item.category === 'PENDAPATAN'
                          ? 'bg-teal-50 text-teal-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-600 text-[11px]">
                    {item.normalBalance}
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="p-4 bg-slate-50 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800 block">Cadangkan & Reset Data</span>
          <span className="text-slate-500 text-[11px]">
            Data tersimpan lokal di peramban (localStorage).
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={resetToDefaultData}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Contoh KSP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
