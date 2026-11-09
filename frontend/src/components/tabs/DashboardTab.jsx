import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { GraduationCap, CheckCircle2, PhoneCall, PiggyBank, PieChart, Clock, ArrowRight, BookOpen, } from 'lucide-react';
export const DashboardTab = ({ onSwitchTab, onOpenProgress, onOpenProfile, }) => {
    const { state, calculatedAge, netFinanceAvailable, toggleTodo, updateBookProgress, toggleBookCompleted, } = useWorkspace();
    const pendingTodos = state.todos.filter((t) => !t.completed);
    const pendingCalls = state.family.filter((f) => f.lastCalled !== 'Today');
    const fmtCurrency = (val) => '₹' + val.toLocaleString('en-IN');
    return (<div className="space-y-8">
      {/* Hero Welcome Banner in Neon & Dark Theme from HTML */}
      <div className="relative rounded-[32px] p-6 sm:p-8 bg-[#c4f223] text-[#141716] shadow-md border border-[#b2db1f] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-40 rounded-full blur-3xl pointer-events-none"/>

        <div className="flex items-center space-x-4 relative z-10">
          <button onClick={onOpenProgress} className="h-16 w-16 rounded-full bg-[#141716] text-[#c4f223] flex items-center justify-center hover:scale-105 transition-transform shadow-xl cursor-pointer" title="Click to view overall progress assessment">
            <PieChart className="w-8 h-8"/>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#141716]">
                PK Workspace Live
              </h2>
              <span className="px-2 py-0.5 text-[10px] bg-[#141716] text-[#c4f223] rounded-full font-bold uppercase">
                Active
              </span>
            </div>
            <p className="text-xs font-extrabold text-[#141716]/80 uppercase tracking-wider mt-1">
              Muhammed Anas P K · Calicut, Kerala
            </p>
          </div>
        </div>

        {/* DOB & Age Widget */}
        <div className="flex items-center bg-[#141716] text-white p-3.5 sm:p-4 rounded-3xl shadow-xl relative z-10 border border-neutral-800">
          <div className="text-center px-4 sm:px-6">
            <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider mb-0.5">
              DOB
            </span>
            <span className="font-extrabold text-xs sm:text-sm">{state.myself.dob || '13-02-2004'}</span>
          </div>
          <div className="h-8 w-px bg-gray-700"/>
          <div className="text-center px-4 sm:px-6">
            <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider mb-0.5">
              Age Today
            </span>
            <span className="text-[#c4f223] font-black text-xs sm:text-sm">
              {calculatedAge} Years Old
            </span>
          </div>
        </div>
      </div>


      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onSwitchTab('study')} className="bg-white p-5 rounded-2xl border border-[#e2e5dc] hover:border-[#c4f223] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Academic Tracks
            </p>
            <p className="text-lg font-black text-[#141716] group-hover:text-emerald-700 transition-colors">
              {state.studyTracks.length} Active Courses
            </p>
          </div>
          <div className="h-11 w-11 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center border border-emerald-100">
            <GraduationCap className="w-5 h-5"/>
          </div>
        </div>

        <div onClick={() => onSwitchTab('daily')} className="bg-white p-5 rounded-2xl border border-[#e2e5dc] hover:border-[#c4f223] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Today's Schedule
            </p>
            <p className="text-lg font-black text-[#141716] group-hover:text-emerald-700 transition-colors">
              {pendingTodos.length} Actions Left
            </p>
          </div>
          <div className="h-11 w-11 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center border border-amber-100">
            <CheckCircle2 className="w-5 h-5"/>
          </div>
        </div>

        <div onClick={() => onSwitchTab('orbit')} className="bg-white p-5 rounded-2xl border border-[#e2e5dc] hover:border-[#c4f223] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Orbit Connections
            </p>
            <p className="text-lg font-black text-[#141716] group-hover:text-emerald-700 transition-colors">
              {pendingCalls.length} Calls Pending
            </p>
          </div>
          <div className="h-11 w-11 bg-sky-50 text-sky-700 rounded-xl flex items-center justify-center border border-sky-100">
            <PhoneCall className="w-5 h-5"/>
          </div>
        </div>

        <div onClick={() => onSwitchTab('finance')} className="bg-white p-5 rounded-2xl border border-[#e2e5dc] hover:border-[#c4f223] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Net Finance Tally
            </p>
            <p className={`text-lg font-black ${netFinanceAvailable >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {fmtCurrency(netFinanceAvailable)}
            </p>
          </div>
          <div className="h-11 w-11 bg-[#c4f223]/30 text-[#141716] rounded-xl flex items-center justify-center border border-[#c4f223]">
            <PiggyBank className="w-5 h-5"/>
          </div>
        </div>
      </div>

      {/* Two Column Quick Glance: Urgent Tasks & Orbit Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e5dc] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-[#141716] flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700"/>
              <span>Pending Action Tasks</span>
            </h3>
            <button onClick={() => onSwitchTab('daily')} className="text-xs font-bold text-slate-500 hover:text-[#141716] flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {pendingTodos.length > 0 ? (pendingTodos.slice(0, 5).map((todo) => (<div key={todo.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"/>
                    <div>
                      <span className="font-bold text-[#141716]">{todo.task}</span>
                      {todo.date || todo.time ? (<span className="text-[10px] text-rose-500 block font-semibold mt-0.5">
                          Due: {todo.date} {todo.time}
                        </span>) : null}
                    </div>
                  </div>
                  {todo.priority && (<span className={`px-2 py-0.5 rounded text-[10px] font-bold ${todo.priority === 'High'
                    ? 'bg-rose-100 text-rose-700'
                    : todo.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'}`}>
                      {todo.priority}
                    </span>)}
                </div>))) : (<p className="text-xs text-slate-400 italic py-4 text-center">All caught up! No pending tasks.</p>)}
          </div>
        </div>

        {/* Reading & Book Progress Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e5dc] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#141716] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700"/>
                <span>Reading & Book Progress Tracker</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Live page logs & daily reading milestones
              </p>
            </div>
            <button onClick={() => onSwitchTab('daily')} className="text-xs font-bold text-slate-500 hover:text-[#141716] flex items-center gap-1 transition-colors">
              <span>Manage Books</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {state.books.filter((b) => !b.completed && (b.pagesRead || 0) < b.totalPages).length > 0 ? (state.books
            .filter((b) => !b.completed && (b.pagesRead || 0) < b.totalPages)
            .map((b) => {
            const read = b.pagesRead || 0;
            const total = b.totalPages || 100;
            const progressPct = total > 0 ? Math.min(100, Math.round((read / total) * 100)) : 0;
            return (<div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2 hover:bg-slate-100/70 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <button type="button" onClick={() => toggleBookCompleted(b.id)} className="w-4 h-4 rounded border border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0" title="Tick to mark finished (moves to Completed Books)"/>
                          <div>
                            <p className="font-extrabold text-[#141716] text-xs leading-snug">{b.title}</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                              {read} / {total} pages read
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#c4f223]/50 text-[#141716] border border-[#b2db1f]/60 shrink-0">
                          {progressPct}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300 bg-[#c4f223]" style={{ width: `${progressPct}%` }}/>
                      </div>

                      {/* Quick page increment buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                        <span className="text-slate-400 font-medium">Quick page log:</span>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => updateBookProgress(b.id, Math.min(total, read + 5))} className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded text-slate-700 font-bold transition-colors cursor-pointer" title="Add 5 pages read">
                            +5 pgs
                          </button>
                          <button type="button" onClick={() => updateBookProgress(b.id, Math.min(total, read + 10))} className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded text-slate-700 font-bold transition-colors cursor-pointer" title="Add 10 pages read">
                            +10 pgs
                          </button>
                          <button type="button" onClick={() => toggleBookCompleted(b.id)} className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold transition-colors cursor-pointer" title="Mark finished">
                            Finish
                          </button>
                        </div>
                      </div>
                    </div>);
        })) : (<div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1.5">
                <p className="text-xs font-semibold text-slate-500">No active books currently being read.</p>
                {state.books.some((b) => b.completed || (b.pagesRead || 0) >= b.totalPages) && (<p className="text-[11px] text-emerald-700 font-bold">
                    ✓ Books completed and stored in archive!
                  </p>)}
                <button type="button" onClick={() => onSwitchTab('daily')} className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1 cursor-pointer">
                  <span>Add or manage reading in Daily Life</span>
                  <ArrowRight className="w-3 h-3"/>
                </button>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
