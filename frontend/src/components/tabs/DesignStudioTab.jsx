import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Palette, PenTool, Phone, Printer, Trash2, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const DesignStudioTab = () => {
    const { state, addDesignProject, updateDesignStatus, deleteDesignProject, addDesignClient, deleteDesignClient, } = useWorkspace();
    // Status Filter state
    const [statusFilter, setStatusFilter] = useState('All');
    // Project form
    const [projectTitle, setProjectTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [projectDate, setProjectDate] = useState('');
    const [projectTime, setProjectTime] = useState('');
    const [projectStatus, setProjectStatus] = useState('Pending');
    // Client form
    const [newClientName, setNewClientName] = useState('');
    const [newClientPhone, setNewClientPhone] = useState('');
    const [newClientNotes, setNewClientNotes] = useState('');
    const handleAddProject = (e) => {
        e.preventDefault();
        if (!projectTitle.trim())
            return;
        addDesignProject({
            title: projectTitle.trim(),
            client: clientName.trim() || 'Internal',
            date: projectDate,
            time: projectTime,
            status: projectStatus,
        });
        setProjectTitle('');
        setClientName('');
        setProjectDate('');
        setProjectTime('');
    };
    const handleAddClient = (e) => {
        e.preventDefault();
        if (!newClientName.trim())
            return;
        addDesignClient(newClientName.trim(), newClientPhone.trim(), newClientNotes.trim());
        setNewClientName('');
        setNewClientPhone('');
        setNewClientNotes('');
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Designing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Review':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };
    return (<div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e5dc] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
            <Palette className="w-8 h-8 text-emerald-800"/>
            <span>Graphic Design Studio</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Manage your graphic design freelance projects, clients, and design delivery deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#c4f223] text-[#141716] rounded-full text-xs font-black uppercase tracking-wider">
            {state.designProjects.length} Projects Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Projects Tracker */}
        <div className="lg:col-span-7 space-y-6">
          <div id="section-design-projects" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-800"/>
                <span>Design Projects Tracker</span>
              </h3>
              <button onClick={() => triggerPrint('Design Projects Report', '#section-design-projects')} className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 no-print cursor-pointer">
                <Printer className="w-3 h-3"/>
                <span>PDF</span>
              </button>
            </div>

            {/* Add Project Form */}
            <form onSubmit={handleAddProject} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3 no-print">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" required placeholder="Project Name (e.g. Logo & Brand Identity)..." value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <input type="text" placeholder="Client Name..." value={clientName} onChange={(e) => setClientName(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
                <input type="time" value={projectTime} onChange={(e) => setProjectTime(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
                <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold">
                  <option value="Pending">🕒 Pending</option>
                  <option value="Designing">🎨 Designing</option>
                  <option value="Review">👀 Client Review</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>

              <button type="submit" className="w-full btn-neon py-2 text-xs font-black shadow-xs cursor-pointer">
                Add Design Project
              </button>
            </form>

            {/* Status Filter Tabs (All, Pending, Designing, Client Review, Completed) */}
            {(() => {
            const counts = {
                All: state.designProjects.length,
                Pending: state.designProjects.filter((p) => p.status === 'Pending').length,
                Designing: state.designProjects.filter((p) => p.status === 'Designing').length,
                Review: state.designProjects.filter((p) => p.status === 'Review').length,
                Completed: state.designProjects.filter((p) => p.status === 'Completed').length,
            };
            const filteredProjects = statusFilter === 'All'
                ? state.designProjects
                : state.designProjects.filter((p) => p.status === statusFilter);
            return (<>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-print">
                    {['All', 'Pending', 'Designing', 'Review', 'Completed'].map((filterKey) => {
                    const label = filterKey === 'Review' ? 'Client Review' : filterKey;
                    const count = counts[filterKey];
                    const isActive = statusFilter === filterKey;
                    return (<button key={filterKey} type="button" onClick={() => setStatusFilter(filterKey)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${isActive
                            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                          <span>{label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-[#c4f223]/20 text-[#c4f223]' : 'bg-slate-200 text-slate-700'}`}>
                            {count}
                          </span>
                        </button>);
                })}
                  </div>

                  {/* Projects List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {filteredProjects.length > 0 ? (filteredProjects.map((p) => (<div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs shadow-2xs space-y-2.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-sm text-[#141716]">{p.title}</h4>
                              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                                Client: <span className="text-emerald-800">{p.client}</span>
                                {p.date && (<span className="text-rose-500 font-bold ml-2">
                                    Due: {p.date} {p.time}
                                  </span>)}
                              </p>
                            </div>
                            <button onClick={() => deleteDesignProject(p.id)} className="text-slate-300 hover:text-rose-500 p-1">
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-bold">Status:</span>
                              <select value={p.status} onChange={(e) => updateDesignStatus(p.id, e.target.value)} className={`text-[10px] font-black rounded-lg px-2.5 py-1 border outline-none ${getStatusBadge(p.status)}`}>
                                <option value="Pending">🕒 Pending</option>
                                <option value="Designing">🎨 Designing</option>
                                <option value="Review">👀 Client Review</option>
                                <option value="Completed">✅ Completed</option>
                              </select>
                            </div>
                          </div>
                        </div>))) : (<div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs font-semibold text-slate-500">
                          No {statusFilter === 'All' ? '' : `${statusFilter} `}design projects found.
                        </p>
                        {statusFilter !== 'All' && (<button type="button" onClick={() => setStatusFilter('All')} className="text-xs text-emerald-700 font-bold underline mt-1 cursor-pointer">
                            Show all projects
                          </button>)}
                      </div>)}
                  </div>
                </>);
        })()}
          </div>
        </div>

        {/* Right Column (5 cols): Client Registry */}
        <div className="lg:col-span-5 space-y-6">
          <div id="section-design-clients" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-800"/>
                <span>Client Registry</span>
              </h3>
              <button onClick={() => triggerPrint('Client Registry', '#section-design-clients')} className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 no-print cursor-pointer">
                <Printer className="w-3 h-3"/>
                <span>PDF</span>
              </button>
            </div>

            {/* Add Client Form */}
            <form onSubmit={handleAddClient} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2.5 no-print">
              <input type="text" required placeholder="Client / Brand Name..." value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <input type="tel" placeholder="Phone Number (e.g. +91 9072289496)..." value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <input type="text" placeholder="Project requirements notes..." value={newClientNotes} onChange={(e) => setNewClientNotes(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <button type="submit" className="w-full btn-neon py-2 text-xs font-black shadow-xs cursor-pointer">
                Save Client
              </button>
            </form>

            {/* Clients List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {state.designClients.length > 0 ? (state.designClients.map((c) => (<div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center shadow-2xs">
                    <div>
                      <h4 className="font-extrabold text-[#141716]">{c.name}</h4>
                      {c.phone && <p className="font-mono text-[11px] text-slate-500 font-semibold">{c.phone}</p>}
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.notes || 'No specific notes'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {c.phone ? (<a href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`} className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors" title="Call Client">
                          <Phone className="w-3.5 h-3.5"/>
                        </a>) : null}
                      <button onClick={() => deleteDesignClient(c.id)} className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>))) : (<p className="text-xs text-slate-400 italic py-2 text-center">No clients saved.</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
