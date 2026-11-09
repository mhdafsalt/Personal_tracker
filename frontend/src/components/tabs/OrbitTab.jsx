import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Users, Phone, CheckCircle2, Plus, Trash2, Printer, Calendar, Clock, MessageSquare, FolderCheck, Search, PhoneCall, History, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const OrbitTab = () => {
    const { state, addFamilyMember, deleteFamilyMember, logFamilyCallWithDetails, deleteCallLog, } = useWorkspace();
    const [relation, setRelation] = useState('');
    const [phone, setPhone] = useState('');
    const [freq, setFreq] = useState('Daily');
    // Call Logging Modal state
    const [loggingContact, setLoggingContact] = useState(null);
    const [logDate, setLogDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [logTime, setLogTime] = useState(() => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    const [logRemarks, setLogRemarks] = useState('');
    // Call Log search query
    const [searchLog, setSearchLog] = useState('');
    // Orbit Tab view switcher: 'nodes' (Contacts) | 'history' (Completed Calls)
    const [activeView, setActiveView] = useState('nodes');
    const handleAdd = (e) => {
        e.preventDefault();
        if (!relation.trim())
            return;
        addFamilyMember(relation.trim(), phone.trim(), freq);
        setRelation('');
        setPhone('');
    };
    const openLogModal = (contact) => {
        setLoggingContact(contact);
        setLogDate(new Date().toISOString().slice(0, 10));
        setLogTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setLogRemarks('');
    };
    const handleSaveCallLog = (e) => {
        e.preventDefault();
        if (!loggingContact)
            return;
        logFamilyCallWithDetails(loggingContact.id, logDate, logTime, logRemarks.trim() || 'Call completed successfully.');
        setLoggingContact(null);
        setLogRemarks('');
    };
    const filteredLogs = (state.callLogs || []).filter((l) => {
        if (!searchLog.trim())
            return true;
        const q = searchLog.toLowerCase();
        return (l.relation.toLowerCase().includes(q) ||
            (l.remarks && l.remarks.toLowerCase().includes(q)) ||
            (l.phone && l.phone.toLowerCase().includes(q)) ||
            (l.date && l.date.toLowerCase().includes(q)));
    });
    return (<div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e5dc] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-emerald-800"/>
            <span>Orbit Connections & Call Manager</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Stay closely connected with family, mentors, and associates. Record date, time, and remarks when calls are completed.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          {/* View switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
            <button type="button" onClick={() => setActiveView('nodes')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${activeView === 'nodes'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
              Contacts ({state.family.length})
            </button>
            <button type="button" onClick={() => setActiveView('history')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all ${activeView === 'history'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
              <History className="w-3.5 h-3.5"/>
              <span>📁 Completed Calls ({state.callLogs?.length || 0})</span>
            </button>
          </div>

          <button onClick={triggerPrint} className="btn-neon px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer rounded-xl" title="Export A4 PDF">
            <Printer className="w-3.5 h-3.5"/>
            <span>Print A4 PDF</span>
          </button>
        </div>
      </div>

      {/* Log Call Modal */}
      {loggingContact && (<div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-800 border-b border-slate-100 pb-3">
              <PhoneCall className="w-5 h-5"/>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">Log Call Details</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Record call for <strong className="text-[#141716]">{loggingContact.relation}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCallLog} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700"/>
                    <span>Call Date</span>
                  </label>
                  <input type="date" required value={logDate} onChange={(e) => setLogDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"/>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700"/>
                    <span>Call Time</span>
                  </label>
                  <input type="text" required placeholder="e.g. 04:30 PM" value={logTime} onChange={(e) => setLogTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"/>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700"/>
                  <span>Call Remarks & Notes</span>
                </label>
                <textarea rows={3} required placeholder="e.g. Spoke for 15 mins. Discussed studies, family health is good, planned next catch-up..." value={logRemarks} onChange={(e) => setLogRemarks(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setLoggingContact(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 btn-neon rounded-xl text-xs font-black shadow-xs cursor-pointer">
                  Save Call to History
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Main Content Area: Nodes vs Completed Calls */}
      {activeView === 'nodes' ? (<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (4 cols): Add Connection Form */}
          <div className="lg:col-span-4 space-y-4 no-print">
            <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-800"/>
                <span>Add Orbit Node</span>
              </h3>

              <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1 font-bold">Name / Relationship</label>
                  <input type="text" required placeholder="e.g. Mother, Mentor, Colleague..." value={relation} onChange={(e) => setRelation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-bold">Phone Number</label>
                  <input type="tel" placeholder="e.g. +91 9072289496..." value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"/>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-bold">Call Cadence / Frequency</label>
                  <select value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Fortnightly">Fortnightly</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>

                <button type="submit" className="w-full btn-neon py-2.5 text-xs font-black shadow-xs cursor-pointer">
                  Save Orbit Node
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (8 cols): Connection Cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.family.length > 0 ? (state.family.map((f) => {
                const isCalledToday = f.lastCalled?.toLowerCase().includes('today');
                return (<div key={f.id} className={`bg-white rounded-3xl p-5 border shadow-2xs flex flex-col justify-between items-center text-center space-y-4 transition-all ${isCalledToday ? 'border-emerald-300 bg-emerald-50/20' : 'border-[#e2e5dc]'}`}>
                      <div className="flex justify-between w-full text-[10px] text-slate-400 font-bold border-b border-slate-100 pb-2 no-print">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-800"/>
                          <span>Orbit Node</span>
                        </span>
                        <button onClick={() => deleteFamilyMember(f.id)} className="text-slate-300 hover:text-rose-500">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>

                      <div className="h-16 w-16 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-black">
                        {f.relation.slice(0, 1)}
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-[#141716]">{f.relation}</h4>
                        {f.phone && <p className="font-mono text-[11px] text-slate-500 mt-0.5">{f.phone}</p>}
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                            {f.freq}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCalledToday ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                            Last: {f.lastCalled}
                          </span>
                        </div>
                      </div>

                      <div className="w-full pt-2 flex gap-2 no-print">
                        {f.phone ? (<a href={`tel:${f.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 py-2 bg-[#141716] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
                            <Phone className="w-3 h-3"/>
                            <span>Direct Call</span>
                          </a>) : null}
                        <button onClick={() => openLogModal(f)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${isCalledToday
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'btn-neon text-[#141716]'}`} title="Record Call with Date, Time and Remarks">
                          <CheckCircle2 className="w-3.5 h-3.5"/>
                          <span>{isCalledToday ? 'Log Again' : 'Log Call'}</span>
                        </button>
                      </div>
                    </div>);
            })) : (<p className="text-xs text-slate-400 italic py-6 text-center col-span-2">
                  No orbit contacts logged.
                </p>)}
            </div>
          </div>
        </div>) : (
        /* Completed Calls History View */
        <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-emerald-700"/>
                <span>Completed Calls History Log</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Every logged call date, time, and conversation remarks are safely archived here.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-64 no-print">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
              <input type="text" placeholder="Search calls or remarks..." value={searchLog} onChange={(e) => setSearchLog(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium"/>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.length > 0 ? (filteredLogs.map((log) => (<div key={log.id} className="bg-slate-50/80 hover:bg-slate-100/70 p-4 rounded-2xl border border-slate-200 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#141716] text-sm">{log.relation}</span>
                      {log.phone && (<span className="text-[11px] font-mono text-slate-500">({log.phone})</span>)}
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.2 rounded-full">
                        ✓ Call Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-emerald-800 font-bold">
                        <Calendar className="w-3.5 h-3.5"/>
                        <span>{log.date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5"/>
                        <span>{log.time}</span>
                      </span>
                    </div>

                    {log.remarks && (<p className="text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 mt-1.5">
                        <strong className="text-slate-900">Remarks: </strong>
                        {log.remarks}
                      </p>)}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 no-print">
                    <button onClick={() => deleteCallLog(log.id)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50" title="Delete Record">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>))) : (<div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <History className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                <p className="text-xs font-bold text-slate-600">No completed call records found.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click 'Log Call' on any contact card to record date, time, and remarks.
                </p>
              </div>)}
          </div>
        </div>)}
    </div>);
};
