/**
 * Indonesian Currency and Number Formatters for Koperasi Ledger & Kwitansi
 */

export function formatRupiah(amount: number, withPrefix: boolean = true): string {
  const rounded = Math.round(amount || 0);
  const formatted = new Intl.NumberFormat('id-ID').format(rounded);
  return withPrefix ? `Rp ${formatted}` : formatted;
}

export function formatRupiahExact(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
  return `Rp ${formatted},-`;
}

/**
 * Converts a numeric amount to Indonesian spelled-out words (Terbilang).
 * Handles numbers up to Trillions accurately.
 * E.g., 1500000 -> "Satu Juta Lima Ratus Ribu Rupiah"
 */
export function terbilang(n: number): string {
  const bilangan: string[] = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function convert(num: number): string {
    const val = Math.floor(num);
    if (val < 12) {
      return bilangan[val];
    } else if (val < 20) {
      return bilangan[val - 10] + ' Belas';
    } else if (val < 100) {
      const sisa = val % 10;
      return bilangan[Math.floor(val / 10)] + ' Puluh' + (sisa > 0 ? ' ' + bilangan[sisa] : '');
    } else if (val < 200) {
      const sisa = val - 100;
      return 'Seratus' + (sisa > 0 ? ' ' + convert(sisa) : '');
    } else if (val < 1000) {
      const sisa = val % 100;
      return bilangan[Math.floor(val / 100)] + ' Ratus' + (sisa > 0 ? ' ' + convert(sisa) : '');
    } else if (val < 2000) {
      const sisa = val - 1000;
      return 'Seribu' + (sisa > 0 ? ' ' + convert(sisa) : '');
    } else if (val < 1000000) {
      const ribu = Math.floor(val / 1000);
      const sisa = val % 1000;
      return convert(ribu) + ' Ribu' + (sisa > 0 ? ' ' + convert(sisa) : '');
    } else if (val < 1000000000) {
      const juta = Math.floor(val / 1000000);
      const sisa = val % 1000000;
      return convert(juta) + ' Juta' + (sisa > 0 ? ' ' + convert(sisa) : '');
    } else if (val < 1000000000000) {
      const milyar = Math.floor(val / 1000000000);
      const sisa = val % 1000000000;
      return convert(milyar) + ' Miliar' + (sisa > 0 ? ' ' + convert(sisa) : '');
    } else if (val < 1000000000000000) {
      const triliun = Math.floor(val / 1000000000000);
      const sisa = val % 1000000000000;
      return convert(triliun) + ' Triliun' + (sisa > 0 ? ' ' + convert(sisa) : '');
    }
    return '';
  }

  if (n === 0) return 'Nol Rupiah';
  const cleanNum = Math.abs(n);
  const words = convert(cleanNum).trim();
  return `${words} Rupiah`;
}

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export function formatDateIndo(dateStr: string, withDay: boolean = false): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      
      const dayName = withDay ? `${DAYS_ID[d.getDay()]}, ` : '';
      return `${dayName}${day.toString().padStart(2, '0')} ${MONTHS_ID[month]} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = MONTHS_ID[parseInt(parts[1], 10) - 1].substring(0, 3);
      const day = parts[2].padStart(2, '0');
      return `${day} ${month} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function parseRupiahInput(value: string): number {
  const digitsOnly = value.replace(/[^\d]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

export function generateRefCode(seq: number, dateStr?: string): string {
  const today = dateStr ? dateStr.replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `TRX-${today}-${seq.toString().padStart(4, '0')}`;
}

export function generateBuktiKas(type: 'MASUK' | 'KELUAR', seq: number): string {
  const prefix = type === 'MASUK' ? 'BKM' : 'BKK';
  return `${prefix}-${seq.toString().padStart(4, '0')}`;
}

export function generateKwitansiNo(seq: number, dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  const year = d.getFullYear();
  const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const monthRoman = romawi[d.getMonth()] || 'XI';
  return `KWT/${year}/${monthRoman}/${seq.toString().padStart(4, '0')}`;
}
