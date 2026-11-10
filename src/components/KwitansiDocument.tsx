import React from 'react';
import { KoperasiConfig, Transaction } from '../types';
import { formatDateIndo, formatRupiahExact, terbilang } from '../utils/formatters';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface KwitansiDocumentProps {
  transaction: Transaction;
  config: KoperasiConfig;
  format?: 'A5' | 'THERMAL';
}

export const KwitansiDocument: React.FC<KwitansiDocumentProps> = ({
  transaction,
  config,
  format = 'A5',
}) => {
  const isThermal = format === 'THERMAL';
  const amountWords = terbilang(transaction.amount);
  const formattedNominal = formatRupiahExact(transaction.amount);
  const isMasuk = transaction.type === 'MASUK';

  if (isThermal) {
    return (
      <div
        id="printable-document"
        className="thermal-mode bg-white text-slate-900 font-mono text-[11px] leading-tight p-4 mx-auto w-[80mm] max-w-full border border-slate-300 shadow-sm"
      >
        <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
          <p className="font-bold text-xs uppercase tracking-wide">{config.shortName}</p>
          <p className="text-[10px] text-slate-600 uppercase font-sans">{config.badanHukum}</p>
          <p className="text-[9px] text-slate-500 font-sans mt-0.5">{config.address}</p>
          <p className="text-[9px] text-slate-500 font-sans">{config.phone}</p>
        </div>

        <div className="text-center font-bold text-xs tracking-wider mb-2 uppercase">
          {isMasuk ? '*** BUKTI KAS MASUK (BKM) ***' : '*** BUKTI KAS KELUAR (BKK) ***'}
        </div>

        <div className="space-y-1 mb-3 text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-500">No. Kwitansi:</span>
            <span className="font-bold">{transaction.kwitansiNo || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">No. Bukti Kas:</span>
            <span className="font-bold">{transaction.buktiKasNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ref Code:</span>
            <span>{transaction.refCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tanggal:</span>
            <span>{formatDateIndo(transaction.date)} {transaction.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Metode:</span>
            <span>{transaction.paymentMethod}</span>
          </div>
        </div>

        <div className="border-t border-b border-dashed border-slate-400 py-2 mb-3 space-y-1 text-[10px]">
          <div>
            <span className="text-slate-500 block">
              {isMasuk ? 'Telah Diterima Dari:' : 'Telah Dibayarkan Kepada:'}
            </span>
            <span className="font-bold uppercase text-[11px]">{transaction.memberName}</span>
            {transaction.memberNo && (
              <span className="text-[9px] text-slate-600 block">({transaction.memberNo})</span>
            )}
          </div>
          <div className="pt-1">
            <span className="text-slate-500 block">Untuk Pembayaran:</span>
            <span className="text-slate-800">{transaction.description}</span>
          </div>
          <div className="pt-1">
            <span className="text-slate-500 block">Pos Akun:</span>
            <span className="text-slate-700">{transaction.accountCode} - {transaction.accountName}</span>
          </div>
        </div>

        <div className="bg-slate-100 p-2 text-center rounded mb-3">
          <div className="text-[10px] text-slate-600 uppercase font-sans">Jumlah Nominal:</div>
          <div className="font-bold text-sm tracking-wide">{formattedNominal}</div>
          <div className="text-[9px] italic text-slate-700 mt-1 font-serif px-1 leading-snug">
            "{amountWords}"
          </div>
        </div>

        <div className="border-t border-dashed border-slate-400 pt-3 text-center text-[9px] text-slate-600 space-y-1">
          <p className="font-bold uppercase tracking-wider text-emerald-800">
            [ STATUS: {transaction.status === 'TERVALIDASI' ? 'LUNAS / SAH' : 'MENUNGGU VERIFIKASI'} ]
          </p>
          <p>Petugas Teller: {config.teller}</p>
          <p className="text-[8px] italic text-slate-500 pt-1">
            Bukti pembayaran elektronik yang sah atas nama {config.name}. Simpan tanda terima ini sebagai bukti transaksi resmi.
          </p>
        </div>
      </div>
    );
  }

  // Formal A5 Landscape Document
  return (
    <div
      id="printable-document"
      className="bg-white text-slate-900 border-2 border-slate-900 p-8 shadow-md mx-auto w-full max-w-4xl relative print:border print:shadow-none print:p-6"
      style={{
        boxSizing: 'border-box',
        minHeight: '480px',
      }}
    >
      {/* Formal Header with Kop Surat */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Institutional Cooperative Emblem */}
          <div className="w-16 h-16 rounded border-2 border-emerald-800 bg-emerald-50 flex items-center justify-center p-2 text-emerald-800 flex-shrink-0">
            <div className="text-center font-serif leading-none">
              <span className="block font-bold text-lg tracking-tighter">KSP</span>
              <span className="text-[8px] font-sans font-semibold uppercase tracking-widest text-emerald-900">KOPERASI</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
              {config.name}
            </h1>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-0.5">
              {config.badanHukum}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {config.address} &bull; {config.phone}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0 pl-4 border-l border-slate-300">
          <div className="inline-block bg-slate-900 text-white font-mono text-xs font-bold px-3 py-1 uppercase tracking-wider mb-1">
            {isMasuk ? 'KWITANSI PENERIMAAN' : 'BUKTI PENGELUARAN'}
          </div>
          <div className="font-mono text-xs text-slate-700">
            <span className="text-slate-500 mr-1">No:</span>
            <span className="font-bold text-slate-900">{transaction.kwitansiNo || '-'}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500 mt-0.5">
            <span>Ref: {transaction.refCode}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            <span>Bukti Kas: {transaction.buktiKasNo}</span>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="space-y-3.5 my-5 text-sm">
        {/* Row 1: Sudah Terima Dari */}
        <div className="grid grid-cols-12 items-baseline">
          <div className="col-span-3 text-slate-700 font-medium tracking-tight">
            {isMasuk ? 'Sudah Terima Dari' : 'Dibayarkan Kepada'}
          </div>
          <div className="col-span-9 flex items-baseline">
            <span className="mr-3 font-semibold text-slate-400">:</span>
            <div className="flex-1 border-b border-dotted border-slate-600 pb-1 font-bold text-slate-900 uppercase tracking-wide flex items-baseline justify-between">
              <span>{transaction.memberName}</span>
              {transaction.memberNo && (
                <span className="font-mono text-xs font-normal text-slate-600">
                  (No. Anggota: {transaction.memberNo})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Terbilang / Banyaknya Uang */}
        <div className="grid grid-cols-12 items-baseline">
          <div className="col-span-3 text-slate-700 font-medium tracking-tight">
            Banyaknya Uang
          </div>
          <div className="col-span-9 flex items-baseline">
            <span className="mr-3 font-semibold text-slate-400">:</span>
            <div className="flex-1 border-b border-dotted border-slate-600 pb-1 font-serif italic text-slate-900 bg-slate-50 px-2 py-0.5 rounded-sm">
              "{amountWords}"
            </div>
          </div>
        </div>

        {/* Row 3: Untuk Pembayaran */}
        <div className="grid grid-cols-12 items-baseline">
          <div className="col-span-3 text-slate-700 font-medium tracking-tight">
            Untuk Pembayaran
          </div>
          <div className="col-span-9 flex items-baseline">
            <span className="mr-3 font-semibold text-slate-400">:</span>
            <div className="flex-1 border-b border-dotted border-slate-600 pb-1 text-slate-900 font-medium leading-relaxed">
              <span>{transaction.description}</span>
              <span className="ml-2 text-xs font-mono text-slate-500">
                [Akun: {transaction.accountCode} - {transaction.accountName}]
              </span>
            </div>
          </div>
        </div>

        {/* Row 4: Metode Bayar & Status */}
        <div className="grid grid-cols-12 items-baseline">
          <div className="col-span-3 text-slate-700 font-medium tracking-tight">
            Metode & Ketentuan
          </div>
          <div className="col-span-9 flex items-center gap-6">
            <span className="mr-3 font-semibold text-slate-400">:</span>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-700">
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-semibold">
                {transaction.paymentMethod === 'TUNAI' ? 'Pembayaran Kas Tunai' : `Transfer Bank (${transaction.paymentMethod})`}
              </span>
              <span className="text-slate-500">
                Waktu Transaksi: {transaction.time} WITA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Callout & Stamp & Signature Matrix */}
      <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-12 items-end gap-4">
        {/* Left Column: Bold Nominal Badge */}
        <div className="col-span-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Jumlah Terbayar
          </div>
          <div className="bg-emerald-950 text-white px-4 py-2.5 rounded-sm font-mono text-xl font-bold tracking-tight inline-block shadow-inner border border-emerald-900">
            {formattedNominal}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 italic">
            * Sah bila telah dibubuhi cap dan tanda tangan resmi
          </div>
        </div>

        {/* Center: Authentic Seal Container (Cap Legalisir Koperasi) */}
        <div className="col-span-3 flex flex-col items-center justify-center">
          {config.showStamp && (
            <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-emerald-700/80 p-1 flex items-center justify-center text-center select-none transform -rotate-6">
              <div className="w-full h-full rounded-full border border-emerald-700/60 flex flex-col items-center justify-center p-1 bg-emerald-50/40">
                <span className="text-[7.5px] font-bold text-emerald-900 uppercase tracking-tighter">
                  {config.shortName}
                </span>
                <div className="my-0.5 py-0.5 border-t border-b border-emerald-700/60 w-4/5 text-center">
                  <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest block">
                    {transaction.status === 'TERVALIDASI' ? 'LUNAS' : 'DIVERIFIKASI'}
                  </span>
                </div>
                <span className="text-[7px] text-emerald-800 uppercase tracking-tight">
                  {config.kota}
                </span>
                <span className="text-[6.5px] text-emerald-700 font-mono">
                  {transaction.date}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Signature Matrix */}
        <div className="col-span-5 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-[11px] text-slate-600 mb-1">
              {config.kota}, {formatDateIndo(transaction.date)}
            </div>
            <div className="text-xs font-semibold text-slate-800 mb-12">
              {isMasuk ? 'Penyetor / Anggota' : 'Penerima Pembayaran'}
            </div>
            <div className="border-b border-slate-800 pb-1 font-semibold text-xs text-slate-900">
              ( {transaction.memberName.length > 20 ? transaction.memberName.slice(0, 18) + '...' : transaction.memberName} )
            </div>
            <div className="text-[10px] text-slate-500">Anggota / Pihak Ke-3</div>
          </div>

          <div>
            <div className="text-[11px] text-slate-600 mb-1">
              Petugas Kasir / Teller
            </div>
            <div className="text-xs font-semibold text-slate-800 mb-12">
              {config.shortName}
            </div>
            <div className="border-b border-slate-800 pb-1 font-semibold text-xs text-slate-900">
              ( {config.teller} )
            </div>
            <div className="text-[10px] text-slate-500">Teller Pelayanan</div>
          </div>
        </div>
      </div>

      {/* Verification footer seal tag */}
      {transaction.status === 'TERVALIDASI' && (
        <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-800 font-sans font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tervalidasi Bendahara: {transaction.verifiedBy || config.bendahara}</span>
          </div>
          <div>
            Status Dokumen: <strong className="text-slate-800">ASLI / SAH</strong> &bull; Cetak Digital KSP BM
          </div>
        </div>
      )}
    </div>
  );
};
