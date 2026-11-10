---
name: Koperasi Ledger & Kwitansi
colors:
  surface: '#f5fbf5'
  surface-dim: '#d5dcd6'
  surface-bright: '#f5fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5ef'
  surface-container: '#e9efe9'
  surface-container-high: '#e4eae4'
  surface-container-highest: '#dee4de'
  on-surface: '#171d19'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2c322e'
  inverse-on-surface: '#ecf2ec'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#b61722'
  on-tertiary: '#ffffff'
  tertiary-container: '#da3437'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#f5fbf5'
  on-background: '#171d19'
  surface-variant: '#dee4de'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  num-display:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  num-table:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  num-table-bold:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for Indonesian cooperative (*Koperasi*) administrators, treasurers (*Bendahara*), and financial officers who manage high-frequency daily cash ledgers (*Laporan Kas Harian - LKH*) and generate verified transaction receipts (*Kwitansi*). 

The emotional signature is rooted in financial integrity, collective stewardship, transparency, and operational velocity. The interface strips away consumer-fintech hyperbole in favor of an uncluttered, spreadsheet-adjacent productivity engine.

The visual direction embraces **Minimalist Utilitarianism** fused with **Tactile Institutional Document Design**:
- Surfaces prioritize dense numerical scannability, rapid cursor navigation, and unadorned structural clarity.
- Interactive screens emulate high-precision bookkeeping software.
- The print and export view transitions into an authoritative, physically grounded Indonesian corporate document layout complete with two-tier validation stamps (*Cap Legalisir*) and institutional signature matrices (*Tanda Tangan Pengurus & Penyetor*).

## Colors

The color architecture is built strictly for day-long ledger audit sessions under harsh office lighting or desktop monitors. It maintains high functional contrast while avoiding visual fatigue:

- **Primary (`#059669` / `#10B981`):** Represents institutional stability, growth, and cash inflow (*Kas Masuk / Penerimaan*). Used for affirmative actions, primary ledger balance tallies, and active navigation nodes.
- **Secondary (`#0F172A` / `#334155`):** Deep Slate serves as the visual anchor for balance headers, formal receipt borders, and core fiscal typography.
- **Tertiary / Outflow (`#EF4444`):** Indicates cash outflow (*Kas Keluar / Pengeluaran*), debt amortizations, and negative reconciliation variances.
- **Surface Foundations:** Background canvas utilizes `#F8FAFC` (Slate-50) to prevent retina strain, while data tables and modal entry surfaces use crisp `#FFFFFF` to separate operational workspaces.
- **Borders & Dividers:** Subtle `#E2E8F0` hairline strokes provide strict spreadsheet tabular discipline without visual noise.

## Typography

The type system is divided into two distinct engines:
1. **System & Narrative Type (Inter):** Clean grotesque sans-serif chosen for UI controls, navigation labels, and standard narrative text. Font weights are kept tightly between 400 (body/reading), 500 (table headers/meta labels), and 600–700 (ledger summaries/balance displays).
2. **Tabular Financial Engine (JetBrains Mono):** Strict monospaced sizing with uniform tabular figures across all currency values, transaction reference codes (`TRX-YYYYMMDD-XXXX`), account codes (*Nomor Rekening / Bukti Kas*), and running balances (*Saldo Akhir*).

All numerical strings within tables must enforce CSS `font-variant-numeric: tabular-nums` or rely directly on the `JetBrains Mono` token set to guarantee exact vertical digit alignment across thousands of ledger rows.

## Layout & Spacing

The application enforces a dense **Fluid Workbench Grid** designed to maximize vertical data density on 13" to 27" screens while maintaining responsive reflow for tablet audit verification:

- **Desktop Shell (≥ 1024px):** Fixed compact sidebar (64px collapsed icon-rail or 220px expanded text-rail) married to an edge-to-edge flexible workbench with `1.5rem` outer margins.
- **Ledger Grid Dynamics:** 12-column grid prioritizing dynamic data columns: 2 columns for metadata/timestamps, 4 columns for transaction description and member ID, 2 columns each for *Masuk* and *Keluar*, and 2 columns for the *Saldo Berjalan* (Running Balance).
- **Vertical Rhythm:** 4px baseline system. Table cell padding is explicitly compact: `space-sm` (8px) vertical padding by default, with an optional dense toggle of `space-xs` (4px) vertical padding for bulk auditing.
- **Mobile/Tablet Viewports (< 1024px):** Grid collapses into single-column summary cards with horizontal-scrolling table views preserved for transaction ledgers to prevent data truncation.

## Elevation & Depth

Visual hierarchy uses **Flat Hairline Precision with Low-Contrast Tonal Tiers**:

- **No Heavy Drop Shadows:** Deep fuzzy box-shadows are strictly prohibited to maintain clear visual boundaries during intensive accounting work.
- **Layer 0 (Canvas):** `#F8FAFC` base application background.
- **Layer 1 (Card & Table Surface):** Solid `#FFFFFF` enclosed by a 1px crisp border of `#E2E8F0`.
- **Layer 2 (Header Sticky Bars & Popovers):** `#FFFFFF` paired with an ultra-diffused micro shadow (`box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`).
- **Layer 3 (Modal Entry Forms & Audit Drawers):** High-opacity white modal surfaces elevated by a sharp drop overlay (`box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`) over a backdrop tint of `rgba(15, 23, 42, 0.4)`.
- **Document Elevation (Kwitansi Print Mode):** Stripped of all screen-oriented drop shadows. Enclosed within crisp `#0F172A` hairline frames (0.75pt–1.5pt solid borders) formatted for standard A5 landscape or 80mm POS thermal printing.

## Shapes

The geometric personality is **Slightly Softened Precision (`roundedness: 1`)**. 

- **Inputs, Buttons, and Badges:** Enforce `0.25rem` (4px) corner radii. This maintains strict geometric alignment against table cells and grid rows, reinforcing a serious, enterprise accounting character.
- **Cards and Dialog Surfaces:** Enforce `0.5rem` (8px) corner radii for `rounded-lg` containers.
- **Kwitansi Document Boundaries:** Strictly 0px (sharp square edges) when rendered in receipt print preview or physical paper simulation to mirror standard physical financial documents.

## Components

### 1. Data Tables (Laporan Kas Harian - LKH)
- **Cell Architecture:** Height fixed at 36px (compact) or 44px (default). Monospaced numbers aligned strictly to the right; textual descriptions aligned to the left; dates, transaction IDs, and category badges centered or left-aligned.
- **Row Alternation:** Clear 1px horizontal bottom borders (`#E2E8F0`). Optional subtle zebra striping (`#F8FAFC` on even rows).
- **Running Balance Highlighting:** The final *Saldo* column features a soft neutral highlight (`#F1F5F9`) with bold monospaced typography to allow the treasurer to track balance continuity at a glance.
- **Debit / Credit Styling:**
  - *Masuk (Debit/Inflow):* Text colored `#059669`, prefixed with `+Rp`. Hover reveals green-tinted micro-badge.
  - *Keluar (Credit/Outflow):* Text colored `#EF4444`, prefixed with `-Rp`.

### 2. Buttons & Actions
- **Primary Button:** Solid `#059669` background, white label, 4px radius, 36px height. Active states trigger `#047857`.
- **Secondary / Utility Button:** Crisp `#FFFFFF` surface, 1px `#E2E8F0` border, `#334155` text. Keyboard shortcut indicators (e.g., `Ctrl+N` for new entry) rendered in small `JetBrains Mono` badges inside the button.
- **Danger Action:** `#FEE2E2` background with `#DC2626` text for voids/cancellations (*Pembatalan Transaksi*).

### 3. Quick-Entry Forms (Keyboard-Driven)
- High-velocity input workflow optimized for numeric keypad (`Numpad`) operation.
- Focus states utilize a crisp 2px primary focus ring (`#10B981`) with zero offset.
- Currency fields automatically format thousand separators (`.` period for IDR: e.g., `1.500.000,00`) as the user types, displaying Indonesian Rupiah nomenclature (`Rp`) as a non-editable prefix.

### 4. Status Chips & Badges
- **Masuk:** Background `#ECFDF5`, text `#065F46`, border `#A7F3D0`.
- **Keluar:** Background `#FEF2F2`, text `#991B1B`, border `#FECACA`.
- **Status Validasi (Verified/Pending):** Compact pill with a solid 6px status dot. Emerald for *Tervalidasi Bendahara*, Amber for *Menunggu Verifikasi*.

### 5. Kwitansi Receipt Component (Physical & Digital)
- **Document Architecture:** Two-column formal Indonesian header containing the cooperative's legal entity registration (*Badan Hukum No.*), full name, address, and logo.
- **Core Receipt Body:** 
  - Standard fields: *Sudah Terima Dari* (Payer), *Banyaknya Uang* (Spelled-out amount in Indonesian words / *Terbilang* italicized), and *Untuk Pembayaran* (Transaction narrative).
  - Bold bottom callout box displaying the numerical amount (`Rp [Nominal],-`).
- **Authentication Matrix:** Multi-column signature footer featuring:
  1. *Penyetor / Penerima Uang* (Member/Payer)
  2. *Petugas Kasir / Teller* (Cashier)
  3. *Bendahara Koperasi* (Treasurer)
  - An authentic circular cooperative seal container (*Tempat Cap Koperasi*) rendered with a faint emerald-tinted or slate dashed border for digital preview, converting to clean hairline borders on print.

### 6. Compact Sidebar Navigation
- 64px width when iconized; 220px when pinned open.
- Slate-900 background or crisp pure white with `#E2E8F0` right border.
- Features quick access to: *Buku Kas Harian*, *Penerbitan Kwitansi*, *Daftar Anggota*, *Rekapitulasi Bulanan*, and *Pengaturan Akun Akuntansi (COA)*.