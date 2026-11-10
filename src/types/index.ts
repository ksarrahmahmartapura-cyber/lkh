export type TransactionType = 'MASUK' | 'KELUAR';

export type ValidationStatus = 'TERVALIDASI' | 'MENUNGGU';

export type PaymentMethod = 'TUNAI' | 'TRANSFER_BRI' | 'TRANSFER_MANDIRI' | 'TRANSFER_BCA';

export interface Transaction {
  id: string;
  refCode: string; // e.g. TRX-20261109-0012
  buktiKasNo: string; // BKM-0492 or BKK-0219
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: TransactionType;
  accountCode: string;
  accountName: string;
  memberId?: string;
  memberName: string;
  memberNo?: string;
  description: string;
  amount: number;
  runningBalance: number;
  status: ValidationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  kwitansiNo?: string;
  kwitansiIssued?: boolean;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Member {
  id: string;
  memberNo: string; // e.g. ANG-0842
  name: string;
  nik: string;
  phone: string;
  email?: string;
  address: string;
  unit: string;
  joinDate: string;
  status: 'AKTIF' | 'NON_AKTIF';
  saldoSimpananPokok: number;
  saldoSimpananWajib: number;
  saldoSimpananSukarela: number;
  sisaPinjaman: number;
  tenorBulan?: number;
  angsuranPerBulan?: number;
}

export interface AccountCOA {
  code: string;
  name: string;
  category: 'ASET' | 'KEWAJIBAN' | 'EKUITAS' | 'PENDAPATAN' | 'BEBAN';
  type: TransactionType | 'BOTH';
  normalBalance: 'DEBIT' | 'KREDIT';
  description: string;
}

export interface KoperasiConfig {
  name: string;
  shortName: string;
  badanHukum: string;
  address: string;
  phone: string;
  email: string;
  ketua: string;
  bendahara: string;
  teller: string;
  kota: string;
  showStamp: boolean;
  defaultPrintFormat: 'A5' | 'THERMAL';
}

export interface KwitansiPrintData {
  noKwitansi: string;
  tanggal: string;
  sudahTerimaDari: string;
  nomorAnggota?: string;
  terbilang: string;
  untukPembayaran: string;
  nominal: number;
  refCode: string;
  buktiKasNo: string;
  metode: string;
  teller: string;
  bendahara: string;
  kota: string;
}
