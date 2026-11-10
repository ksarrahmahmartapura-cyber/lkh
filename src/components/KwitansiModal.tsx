import React, { useState } from 'react';
import { useKoperasi } from '../context/KoperasiContext';
import { KwitansiDocument } from './KwitansiDocument';
import { Printer, X, FileText, CheckCircle2, Copy, Download } from 'lucide-react';
import { formatRupiahExact } from '../utils/formatters';

interface KwitansiModalProps {
  onClose: () => void;
}

export const KwitansiModal: React.FC<KwitansiModalProps> = ({ onClose }) => {
  const { selectedKwitansiTrx, config, validateTransaction } = useKoperasi();
  const [format, setFormat] = useState<'A5' | 'THERMAL'>(config.defaultPrintFormat || 'A5');
  const [copied, setCopied] = useState(false);

  if (!selectedKwitansiTrx) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const summary = `*** BUKTI KWITANSI RESMI ***
No: ${selectedKwitansiTrx.kwitansiNo || '-'}
Ref: ${selectedKwitansiTrx.refCode}
Koperasi: ${config.name}
Penyetor: ${selectedKwitansiTrx.memberName} (${selectedKwitansiTrx.memberNo || '-'})
Nominal: ${formatRupiahExact(selectedKwitansiTrx.amount)}
Untuk: ${selectedKwitansiTrx.description}
Tanggal: ${selectedKwitansiTrx.date} ${selectedKwitansiTrx.time} WITA
Status: ${selectedKwitansiTrx.status}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidateNow = () => {
    validateTransaction(selectedKwitansiTrx.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-transparent">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full border border-slate-300 flex flex-col max-h-[95vh] overflow-hidden print:max-w-none print:shadow-none print:border-none print:max-h-none print:overflow-visible">
        {/* Modal Top Bar - Hidden on print */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-600 rounded text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide">
                Penerbitan Kwitansi Sah Koperasi
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {selectedKwitansiTrx.kwitansiNo || selectedKwitansiTrx.refCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format switch: A5 vs Thermal */}
            <div className="bg-slate-800 p-0.5 rounded text-xs flex border border-slate-700">
              <button
                onClick={() => setFormat('A5')}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  format === 'A5' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                A5 Dokumen Sah
              </button>
              <button
                onClick={() => setFormat('THERMAL')}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  format === 'THERMAL' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                80mm Thermal Struk
              </button>
            </div>

            <button
              onClick={handleCopyText}
              title="Salin Rangkuman Teks"
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex items-center justify-center print:p-0 print:bg-white print:overflow-visible">
          <div className="w-full flex justify-center">
            <KwitansiDocument
              transaction={selectedKwitansiTrx}
              config={config}
              format={format}
            />
          </div>
        </div>

        {/* Modal Footer Controls - Hidden on print */}
        <div className="no-print px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {selectedKwitansiTrx.status === 'MENUNGGU' ? (
              <button
                onClick={handleValidateNow}
                className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded font-medium transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Validasi Sekarang oleh Bendahara
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Dokumen Telah Tervalidasi Sah
              </div>
            )}
            <span className="text-xs text-slate-500">
              Format: <strong className="text-slate-800">{format === 'A5' ? 'A5 Landscape (Rekomendasi Arsip)' : 'POS Thermal 80mm'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak / Print Dokumen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
