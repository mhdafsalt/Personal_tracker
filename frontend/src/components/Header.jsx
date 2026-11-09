import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Sparkles, Home, GraduationCap, CalendarCheck, Wallet, Calendar, Rocket, Palette, Plane, Users, Download, Upload, RotateCcw, Printer, BookOpen, Database, } from 'lucide-react';
import { triggerPrint } from '../utils/printHelper';
export const Header = ({ activeTab, setActiveTab, openGeminiModal, openProfileModal, openJournalModal, openDatabaseModal, }) => {
    const { state, exportJSONBackup, importJSONBackup, resetToDefaults, mongoStatus } = useWorkspace();
    const fileInputRef = React.useRef(null);
    const tabs = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'study', label: 'Study Hub', icon: GraduationCap },
        { id: 'daily', label: 'Daily Life', icon: CalendarCheck },
        { id: 'finance', label: 'Finance Hub', icon: Wallet },
        { id: 'events', label: 'Events Portal', icon: Calendar },
        { id: 'design', label: 'Design Studio', icon: Palette },
        { id: 'travel', label: 'Travels', icon: Plane },
        { id: 'orbit', label: 'Orbit', icon: Users },
        { id: 'extra', label: 'Extra', icon: Rocket },
    ];
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (content) {
                const ok = importJSONBackup(content);
                if (ok) {
                    alert('Workspace backup successfully restored!');
                }
                else {
                    alert('Invalid backup file format.');
                }
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    return (<header className="sticky top-0 z-40 w-full bg-[#f4f5f0]/90 backdrop-blur-md border-b border-[#e2e5dc] transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & User Profile */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div onClick={openProfileModal} className="flex items-center space-x-3 cursor-pointer group" title="Click to view Profile & Document Vault">
            <div className="relative h-11 w-11 rounded-full bg-[#c4f223] text-[#141716] flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-105 overflow-hidden border-2 border-white">
              {state.myself.photo ? (<img src={state.myself.photo} alt={state.myself.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => {
                e.target.style.display = 'none';
            }}/>) : null}
              <span className={state.myself.photo ? 'hidden' : 'block'}>PK</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#141716] tracking-tight group-hover:text-emerald-950 transition-colors">
                  {state.myself.fullName || 'Muhammed Anas P K'}
                </span>
                <span className="px-2 py-0.5 text-[9px] bg-[#c4f223] text-[#141716] rounded-full font-extrabold uppercase tracking-wider hidden sm:inline-block">
                  Workspace
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                Academic & Life Manager
              </p>
            </div>
          </div>

          {/* Quick AI, Diary & MongoDB Mobile */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button onClick={openDatabaseModal} className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-xl font-black border transition-colors cursor-pointer ${mongoStatus.connected
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-white text-slate-700 border-slate-200'}`} title="MongoDB Cloud Database Hub">
              <Database className="w-3.5 h-3.5 text-emerald-800"/>
            </button>
            <button onClick={openJournalModal} className="flex items-center gap-1 bg-[#141716] text-[#c4f223] border border-[#c4f223]/30 text-xs px-2.5 py-1.5 rounded-xl font-black shadow-xs cursor-pointer" title="Open Personal Journal & Diary">
              <BookOpen className="w-3.5 h-3.5"/>
              <span>Diary</span>
            </button>
            <button onClick={openGeminiModal} className="flex items-center gap-1.5 btn-neon text-xs px-2.5 py-1.5 shadow-sm cursor-pointer">
              <Sparkles className="w-3.5 h-3.5"/>
              <span>AI</span>
            </button>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full lg:w-auto max-w-full">
          <nav className="flex items-center gap-1 p-1 bg-white border border-[#e2e5dc] rounded-full shadow-xs min-w-max">
            {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${isActive
                    ? 'bg-[#c4f223] text-[#141716] shadow-sm'
                    : 'text-slate-600 hover:text-[#141716] hover:bg-slate-100/80'}`}>
                  <Icon className="w-3.5 h-3.5"/>
                  <span>{tab.label}</span>
                </button>);
        })}
          </nav>
        </div>

        {/* Right Action Tools: Backup & Ask Gemini */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 border border-[#e2e5dc] bg-white rounded-full p-1 shadow-xs">
            <button onClick={exportJSONBackup} title="Export JSON Backup" className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4"/>
            </button>
            <label title="Import JSON Backup" className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="w-4 h-4"/>
              <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload}/>
            </label>
            <button onClick={resetToDefaults} title="Reset To Defaults" className="p-1.5 text-slate-500 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors">
              <RotateCcw className="w-4 h-4"/>
            </button>
            <div className="w-px h-4 bg-slate-200 mx-0.5"/>
            <button onClick={triggerPrint} title="Print Active View (A4 Size PDF)" className="p-1.5 text-slate-700 hover:text-[#141716] rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-bold">
              <Printer className="w-4 h-4"/>
              <span className="hidden xl:inline">A4 Print</span>
            </button>
          </div>

          {/* Full-Stack Database & MongoDB Trigger */}
          <button onClick={openDatabaseModal} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${mongoStatus.connected
            ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
            : mongoStatus.configured
                ? 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs'}`} title="Full-Stack MongoDB & Database Hub">
            <Database className="w-3.5 h-3.5 text-emerald-800"/>
            <span className="hidden xl:inline">MongoDB:</span>
            <span>{mongoStatus.connected ? 'Connected' : 'Local / Setup'}</span>
          </button>

          <button onClick={openJournalModal} className="flex items-center gap-2 bg-[#141716] hover:bg-slate-800 text-[#c4f223] border border-[#c4f223]/30 px-3.5 py-2 rounded-2xl text-xs font-black tracking-wide uppercase shadow-sm cursor-pointer transition-all hover:scale-[1.02]" title="Open Personal Journal & Diary Portal">
            <BookOpen className="w-4 h-4 text-[#c4f223]"/>
            <span>Diary Portal</span>
          </button>

          <button onClick={openGeminiModal} className="flex items-center gap-2 btn-neon px-4 py-2 text-xs font-extrabold tracking-wide uppercase shadow-sm cursor-pointer">
            <Sparkles className="w-4 h-4"/>
            <span>Ask Gemini</span>
          </button>
        </div>
      </div>
    </header>);
};
