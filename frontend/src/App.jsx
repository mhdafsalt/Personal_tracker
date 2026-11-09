'use client';
import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/Header';
import { AlarmBanner } from './components/AlarmBanner';
import { DashboardTab } from './components/tabs/DashboardTab';
import { StudyTab } from './components/tabs/StudyTab';
import { DailyTab } from './components/tabs/DailyTab';
import { FinanceTab } from './components/tabs/FinanceTab';
import { EventsTab } from './components/tabs/EventsTab';
import { DesignStudioTab } from './components/tabs/DesignStudioTab';
import { TravelTab } from './components/tabs/TravelTab';
import { OrbitTab } from './components/tabs/OrbitTab';
import { ExtraTab } from './components/tabs/ExtraTab';
import { ProfileVaultModal } from './components/modals/ProfileVaultModal';
import { GeminiModal } from './components/modals/GeminiModal';
import { ProgressModal } from './components/modals/ProgressModal';
import { PrintPdfModal } from './components/modals/PrintPdfModal';
import { JournalModal } from './components/modals/JournalModal';
import { DatabaseModal } from './components/modals/DatabaseModal';
function MainWorkspace() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
    const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
    const [printModalState, setPrintModalState] = useState({
        isOpen: false,
        title: 'PK Workspace Report',
        selector: 'main',
    });
    React.useEffect(() => {
        const handleOpenPrintModal = (e) => {
            const customEvent = e;
            setPrintModalState({
                isOpen: true,
                title: customEvent.detail?.title || 'PK Workspace Report',
                selector: customEvent.detail?.selector || 'main',
            });
        };
        window.addEventListener('open-print-modal', handleOpenPrintModal);
        return () => {
            window.removeEventListener('open-print-modal', handleOpenPrintModal);
        };
    }, []);
    const { state } = useWorkspace();
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return (<DashboardTab onSwitchTab={setActiveTab} onOpenProgress={() => setIsProgressModalOpen(true)} onOpenProfile={() => setIsProfileModalOpen(true)}/>);
            case 'study':
                return <StudyTab />;
            case 'daily':
                return <DailyTab />;
            case 'finance':
                return <FinanceTab />;
            case 'events':
                return <EventsTab />;
            case 'design':
                return <DesignStudioTab />;
            case 'travel':
                return <TravelTab />;
            case 'orbit':
                return <OrbitTab />;
            case 'extra':
                return <ExtraTab />;
            default:
                return (<DashboardTab onSwitchTab={setActiveTab} onOpenProgress={() => setIsProgressModalOpen(true)} onOpenProfile={() => setIsProfileModalOpen(true)}/>);
        }
    };
    return (<div className="min-h-screen flex flex-col bg-[#f4f5f0] text-[#141716]">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} openGeminiModal={() => setIsGeminiModalOpen(true)} openProfileModal={() => setIsProfileModalOpen(true)} openJournalModal={() => setIsJournalModalOpen(true)} openDatabaseModal={() => setIsDatabaseModalOpen(true)}/>

      {/* Floating Alarm Banner */}
      <AlarmBanner />

      {/* Main Viewport Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveTab()}
      </main>

      {/* Subtle Footer */}
      <footer className="w-full border-t border-[#e2e5dc] bg-white/60 py-6 text-center text-xs text-slate-500 font-bold no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Muhammed Anas P K · PK Workspace & Full-Stack MERN Architecture</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap justify-center">
            <button onClick={() => setIsDatabaseModalOpen(true)} className="hover:text-emerald-800 font-black text-emerald-700 underline flex items-center gap-1">
              <span>MongoDB Hub</span>
            </button>
            <span>·</span>
            <span>Next.js / React 19</span>
            <span>·</span>
            <span>Node.js Backend</span>
            <span>·</span>
            <button onClick={() => setIsJournalModalOpen(true)} className="hover:text-[#141716] font-bold text-slate-700 underline">
              Diary Portal
            </button>
            <span>·</span>
            <button onClick={() => setIsGeminiModalOpen(true)} className="hover:text-[#141716] font-bold text-emerald-800">
              Ask Gemini AI
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DatabaseModal isOpen={isDatabaseModalOpen} onClose={() => setIsDatabaseModalOpen(false)}/>
      <JournalModal isOpen={isJournalModalOpen} onClose={() => setIsJournalModalOpen(false)}/>
      <ProfileVaultModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}/>
      <GeminiModal isOpen={isGeminiModalOpen} onClose={() => setIsGeminiModalOpen(false)}/>
      <ProgressModal isOpen={isProgressModalOpen} onClose={() => setIsProgressModalOpen(false)}/>
      <PrintPdfModal isOpen={printModalState.isOpen} onClose={() => setPrintModalState((prev) => ({ ...prev, isOpen: false }))} title={printModalState.title} targetElementSelector={printModalState.selector}/>
    </div>);
}
export default function App() {
    return (<WorkspaceProvider>
      <MainWorkspace />
    </WorkspaceProvider>);
}
