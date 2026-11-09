import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Calendar, CalendarCheck, Plus, Trash2, Printer, FolderCheck, RotateCcw, CheckCircle2, FolderOpen, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const EventsTab = () => {
    const { state, addEvent, toggleEvent, deleteEvent, addEventIncome, deleteEventIncome, addEventExpense, deleteEventExpense, } = useWorkspace();
    const [eventTab, setEventTab] = useState('active');
    const [eventTitle, setEventTitle] = useState('');
    const [eventConcept, setEventConcept] = useState('');
    const [eventDate, setEventDate] = useState('');
    // Per-event input state
    const [incomeInputs, setIncomeInputs] = useState({});
    const [expenseInputs, setExpenseInputs] = useState({});
    // Completion modal/remarks prompt state
    const [completingEventId, setCompletingEventId] = useState(null);
    const [completionRemarks, setCompletionRemarks] = useState('');
    const activeEvents = state.events.filter((e) => !e.completed);
    const completedEvents = state.events.filter((e) => e.completed);
    const handleCreateEvent = (e) => {
        e.preventDefault();
        if (!eventTitle.trim())
            return;
        addEvent(eventTitle.trim(), eventConcept.trim(), eventDate);
        setEventTitle('');
        setEventConcept('');
        setEventDate('');
        setEventTab('active');
    };
    const handleAddIncome = (eventId) => {
        const data = incomeInputs[eventId];
        if (!data?.desc || !data?.amount)
            return;
        addEventIncome(eventId, data.desc, parseFloat(data.amount));
        setIncomeInputs((prev) => ({ ...prev, [eventId]: { desc: '', amount: '' } }));
    };
    const handleAddExpense = (eventId) => {
        const data = expenseInputs[eventId];
        if (!data?.desc || !data?.amount)
            return;
        addEventExpense(eventId, data.desc, parseFloat(data.amount));
        setExpenseInputs((prev) => ({ ...prev, [eventId]: { desc: '', amount: '' } }));
    };
    const handleConfirmCompletion = (eventId) => {
        toggleEvent(eventId, completionRemarks.trim() || undefined);
        setCompletingEventId(null);
        setCompletionRemarks('');
    };
    const fmt = (num) => '₹' + num.toLocaleString('en-IN');
    return (<div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e5dc] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-8 h-8 text-purple-700"/>
            <span>Programs & Events Portal</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Coordinate campus programs and workshops. Completed events are securely moved into the Completed Events Folder.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          {/* Folder Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
            <button type="button" onClick={() => setEventTab('active')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${eventTab === 'active'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
              Active Programs ({activeEvents.length})
            </button>
            <button type="button" onClick={() => setEventTab('completed')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all ${eventTab === 'completed'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
              <FolderCheck className="w-3.5 h-3.5"/>
              <span>📁 Completed Archive ({completedEvents.length})</span>
            </button>
          </div>

          <button onClick={triggerPrint} className="btn-neon px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer rounded-xl" title="Export A4 PDF">
            <Printer className="w-3.5 h-3.5"/>
            <span>Print A4 PDF</span>
          </button>
        </div>
      </div>

      {/* Completion Modal Prompt */}
      {completingEventId !== null && (<div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle2 className="w-6 h-6"/>
              <h3 className="text-sm font-black uppercase tracking-wider">Mark Program as Completed</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              This will mark the event finished and move it from Active to the{' '}
              <strong className="text-purple-800">Completed Archive</strong> folder. All financial tallies are preserved.
            </p>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Completion Remarks & Notes (Optional)
              </label>
              <textarea rows={3} placeholder="e.g. Conducted successfully with 65 participants, all sessions completed on time..." value={completionRemarks} onChange={(e) => setCompletionRemarks(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"/>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => {
                setCompletingEventId(null);
                setCompletionRemarks('');
            }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="button" onClick={() => handleConfirmCompletion(completingEventId)} className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold shadow-xs">
                Confirm & Archive Event
              </button>
            </div>
          </div>
        </div>)}

      {/* Register New Event Form (Only visible in active tab) */}
      {eventTab === 'active' && (<div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4 no-print">
          <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-700"/>
            <span>Register New Program / Event</span>
          </h3>

          <form onSubmit={handleCreateEvent} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col md:flex-row gap-3">
            <input type="text" required placeholder="Event Name (e.g. Campus Leadership Fest)..." value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full md:w-1/3 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"/>
            <input type="text" placeholder="Concept / Purpose of Event..." value={eventConcept} onChange={(e) => setEventConcept(e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"/>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"/>
            <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-xs shrink-0 cursor-pointer">
              Create Event
            </button>
          </form>
        </div>)}

      {/* Events List Cards */}
      <div className="space-y-6">
        {eventTab === 'active' ? (activeEvents.length > 0 ? (activeEvents.map((e) => {
            const incomeList = e.income || [];
            const expenseList = e.expense || [];
            const totalInc = incomeList.reduce((s, x) => s + x.amount, 0);
            const totalExp = expenseList.reduce((s, x) => s + x.amount, 0);
            const balance = totalInc - totalExp;
            return (<div key={e.id} id={`event-card-${e.id}`} className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-5">
                  {/* Event header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#141716]">{e.title}</h3>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full">
                          Ongoing
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {e.concept}{' '}
                        {e.date && (<span className="ml-2 font-bold text-purple-700">
                            <Calendar className="w-3.5 h-3.5 inline mr-1"/>
                            {e.date}
                          </span>)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 no-print">
                      {/* Mark Completed Button */}
                      <button onClick={() => {
                    setCompletingEventId(e.id);
                    setCompletionRemarks('');
                }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer" title="Tick to Complete Event (moves to Completed Archive)">
                        <CheckCircle2 className="w-3.5 h-3.5"/>
                        <span>✓ Mark Completed</span>
                      </button>

                      <button onClick={triggerPrint} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50" title="Print Event A4">
                        <Printer className="w-4 h-4"/>
                      </button>
                      <button onClick={() => deleteEvent(e.id)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50" title="Delete Event">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  {/* 3 Metrics Strip */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Total Income</span>
                      <p className="text-base font-black text-emerald-700 tabular-nums">{fmt(totalInc)}</p>
                    </div>
                    <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Total Expense</span>
                      <p className="text-base font-black text-rose-600 tabular-nums">{fmt(totalExp)}</p>
                    </div>
                    <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
                      <span className="text-[10px] text-purple-800 font-bold uppercase">Net Balance</span>
                      <p className={`text-base font-black tabular-nums ${balance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {fmt(balance)}
                      </p>
                    </div>
                  </div>

                  {/* Income & Expense Two Column logs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Incomes */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-1">
                        Income Log ({incomeList.length})
                      </h4>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {incomeList.length > 0 ? (incomeList.map((inc) => (<div key={inc.id} className="flex justify-between items-center bg-emerald-50/50 p-2 rounded-xl border border-emerald-100 text-xs">
                              <span className="font-bold text-slate-800">{inc.desc}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-700 font-black tabular-nums">+{fmt(inc.amount)}</span>
                                <button onClick={() => deleteEventIncome(e.id, inc.id)} className="text-slate-300 hover:text-rose-500 p-0.5 no-print">
                                  ✕
                                </button>
                              </div>
                            </div>))) : (<p className="text-[11px] text-slate-400 italic py-1">No income entries logged.</p>)}
                      </div>

                      {/* Add Income Form */}
                      <div className="flex gap-1.5 pt-2 no-print">
                        <input type="text" placeholder="Source description..." value={incomeInputs[e.id]?.desc || ''} onChange={(event) => setIncomeInputs((prev) => ({
                    ...prev,
                    [e.id]: { ...prev[e.id], desc: event.target.value },
                }))} className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs"/>
                        <input type="number" placeholder="₹ Amount" value={incomeInputs[e.id]?.amount || ''} onChange={(event) => setIncomeInputs((prev) => ({
                    ...prev,
                    [e.id]: { ...prev[e.id], amount: event.target.value },
                }))} className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs"/>
                        <button onClick={() => handleAddIncome(e.id)} className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black px-2 cursor-pointer">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Expenses */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-1">
                        Expense Log ({expenseList.length})
                      </h4>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {expenseList.length > 0 ? (expenseList.map((exp) => (<div key={exp.id} className="flex justify-between items-center bg-rose-50/50 p-2 rounded-xl border border-rose-100 text-xs">
                              <span className="font-bold text-slate-800">{exp.desc}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-rose-600 font-black tabular-nums">-{fmt(exp.amount)}</span>
                                <button onClick={() => deleteEventExpense(e.id, exp.id)} className="text-slate-300 hover:text-rose-500 p-0.5 no-print">
                                  ✕
                                </button>
                              </div>
                            </div>))) : (<p className="text-[11px] text-slate-400 italic py-1">No expense entries logged.</p>)}
                      </div>

                      {/* Add Expense Form */}
                      <div className="flex gap-1.5 pt-2 no-print">
                        <input type="text" placeholder="Purpose description..." value={expenseInputs[e.id]?.desc || ''} onChange={(event) => setExpenseInputs((prev) => ({
                    ...prev,
                    [e.id]: { ...prev[e.id], desc: event.target.value },
                }))} className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs"/>
                        <input type="number" placeholder="₹ Amount" value={expenseInputs[e.id]?.amount || ''} onChange={(event) => setExpenseInputs((prev) => ({
                    ...prev,
                    [e.id]: { ...prev[e.id], amount: event.target.value },
                }))} className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs"/>
                        <button onClick={() => handleAddExpense(e.id)} className="flex-grow bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black px-2 cursor-pointer">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>);
        })) : (<div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
              <p className="text-sm font-bold text-slate-600">No active events currently scheduled.</p>
              <p className="text-xs text-slate-400 mt-1">
                Create a new program above or view previous programs in the{' '}
                <button onClick={() => setEventTab('completed')} className="text-purple-700 underline font-bold">
                  Completed Archive
                </button>
                .
              </p>
            </div>)) : (
        /* Completed Events Archive View */
        completedEvents.length > 0 ? (<div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderCheck className="w-5 h-5 text-purple-700"/>
                  <span className="text-xs font-black text-purple-900">
                    Completed Events Archive ({completedEvents.length} events archived)
                  </span>
                </div>
                <span className="text-[11px] text-purple-700 font-bold bg-white px-3 py-1 rounded-full border border-purple-200">
                  Full Financial Audit Saved
                </span>
              </div>

              {completedEvents.map((e) => {
                const incomeList = e.income || [];
                const expenseList = e.expense || [];
                const totalInc = incomeList.reduce((s, x) => s + x.amount, 0);
                const totalExp = expenseList.reduce((s, x) => s + x.amount, 0);
                const balance = totalInc - totalExp;
                return (<div key={e.id} className="bg-white rounded-3xl p-6 border-2 border-purple-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-[#141716] line-through text-slate-600">{e.title}</h3>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3"/>
                            <span>COMPLETED</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {e.concept} {e.date && `• Scheduled: ${e.date}`}
                        </p>
                        {e.completedAt && (<p className="text-[11px] text-emerald-700 font-bold mt-1">
                            ✓ Archived on: {e.completedAt}
                          </p>)}
                        {e.remarks && (<div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                            <strong className="text-slate-900">Remarks: </strong>
                            {e.remarks}
                          </div>)}
                      </div>

                      <div className="flex items-center gap-2 no-print">
                        {/* Restore Button */}
                        <button type="button" onClick={() => toggleEvent(e.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5" title="Restore back to Active Events">
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500"/>
                          <span>Reopen Event</span>
                        </button>
                        <button onClick={() => deleteEvent(e.id)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg" title="Delete Permanently">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>

                    {/* Final Financial Summary */}
                    <div className="grid grid-cols-3 gap-3 text-center bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Final Income</span>
                        <p className="text-sm font-black text-emerald-700">{fmt(totalInc)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Final Expense</span>
                        <p className="text-sm font-black text-rose-600">{fmt(totalExp)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-900 font-bold uppercase">Final Balance</span>
                        <p className={`text-sm font-black ${balance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {fmt(balance)}
                        </p>
                      </div>
                    </div>
                  </div>);
            })}
            </div>) : (<div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
              <p className="text-sm font-bold text-slate-600">Completed Events Archive is empty.</p>
              <p className="text-xs text-slate-400 mt-1">
                Completed programs and workshops will be archived here.
              </p>
            </div>))}
      </div>
    </div>);
};
