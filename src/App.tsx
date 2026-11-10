import React from 'react';
import { KoperasiProvider, useKoperasi } from './context/KoperasiContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LedgerView } from './views/LedgerView';
import { KwitansiView } from './views/KwitansiView';
import { MembersView } from './views/MembersView';
import { RekapView } from './views/RekapView';
import { SettingsView } from './views/SettingsView';
import { QuickEntryModal } from './components/QuickEntryModal';
import { KwitansiModal } from './components/KwitansiModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    quickEntryModalOpen,
    setQuickEntryModalOpen,
    selectedKwitansiTrx,
    setSelectedKwitansiTrx,
  } = useKoperasi();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Workbench Views */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'LEDGER' && <LedgerView />}
            {activeTab === 'KWITANSI' && <KwitansiView />}
            {activeTab === 'MEMBERS' && <MembersView />}
            {activeTab === 'REKAP' && <RekapView />}
            {activeTab === 'COA' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Quick Entry Modal */}
      {quickEntryModalOpen && (
        <QuickEntryModal onClose={() => setQuickEntryModalOpen(false)} />
      )}

      {/* Kwitansi Fullscreen / Print Modal */}
      {selectedKwitansiTrx && (
        <KwitansiModal onClose={() => setSelectedKwitansiTrx(null)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <KoperasiProvider>
      <AppContent />
    </KoperasiProvider>
  );
}
