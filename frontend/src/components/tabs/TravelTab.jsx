import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plane, Plus, Trash2, Calendar, Printer, FolderCheck, RotateCcw, CheckCircle2, FolderOpen, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const TravelTab = () => {
    const { state, addTravel, toggleTravel, deleteTravel, addTravelExpense, deleteTravelExpense, } = useWorkspace();
    const [travelTab, setTravelTab] = useState('active');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');
    // Per-trip expense form state
    const [expDesc, setExpDesc] = useState({});
    const [expAmt, setExpAmt] = useState({});
    // Completion modal state
    const [completingTripId, setCompletingTripId] = useState(null);
    const [completionRemarks, setCompletionRemarks] = useState('');
    const activeTrips = state.travels.filter((t) => !t.completed);
    const completedTrips = state.travels.filter((t) => t.completed);
    const handleStartPlan = (e) => {
        e.preventDefault();
        if (!destination.trim() || !budget)
            return;
        addTravel(destination.trim(), date, parseFloat(budget));
        setDestination('');
        setDate('');
        setBudget('');
        setTravelTab('active');
    };
    const handleAddExpense = (travelId) => {
        const desc = expDesc[travelId];
        const amt = expAmt[travelId];
        if (!desc || !amt)
            return;
        addTravelExpense(travelId, desc, parseFloat(amt));
        setExpDesc((prev) => ({ ...prev, [travelId]: '' }));
        setExpAmt((prev) => ({ ...prev, [travelId]: '' }));
    };
    const handleConfirmCompletion = (tripId) => {
        toggleTravel(tripId, completionRemarks.trim() || undefined);
        setCompletingTripId(null);
        setCompletionRemarks('');
    };
    const fmt = (num) => '₹' + num.toLocaleString('en-IN');
    return (<div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e5dc] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
            <Plane className="w-8 h-8 text-teal-700"/>
            <span>Travel Planner & Itineraries</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Plan your travel budgets, cash in hand, and track ongoing trip expenses. Completed journeys are stored in the Completed Trips Folder.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          {/* Folder Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
            <button type="button" onClick={() => setTravelTab('active')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${travelTab === 'active'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
              Active Trips ({activeTrips.length})
            </button>
            <button type="button" onClick={() => setTravelTab('completed')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all ${travelTab === 'completed'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
              <FolderCheck className="w-3.5 h-3.5"/>
              <span>📁 Completed Trips ({completedTrips.length})</span>
            </button>
          </div>

          <button onClick={triggerPrint} className="btn-neon px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer rounded-xl" title="Export A4 PDF">
            <Printer className="w-3.5 h-3.5"/>
            <span>Print A4 PDF</span>
          </button>
        </div>
      </div>

      {/* Completion Modal Prompt */}
      {completingTripId !== null && (<div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-teal-700">
              <CheckCircle2 className="w-6 h-6"/>
              <h3 className="text-sm font-black uppercase tracking-wider">Mark Journey as Completed</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              This will mark the journey completed and move it from Active to the{' '}
              <strong className="text-teal-800">Completed Trips Folder</strong>. All budgets and expense entries are safely archived.
            </p>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Trip Memories & Remarks (Optional)
              </label>
              <textarea rows={3} placeholder="e.g. Visited Chembra peak, enjoyable trip, stayed strictly within ₹5,000 budget..." value={completionRemarks} onChange={(e) => setCompletionRemarks(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"/>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => {
                setCompletingTripId(null);
                setCompletionRemarks('');
            }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="button" onClick={() => handleConfirmCompletion(completingTripId)} className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-xs">
                Confirm & Archive Trip
              </button>
            </div>
          </div>
        </div>)}

      {/* Plan New Trip Form (only on active tab) */}
      {travelTab === 'active' && (<div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4 no-print">
          <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-700"/>
            <span>Plan New Trip / Journey</span>
          </h3>

          <form onSubmit={handleStartPlan} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col md:flex-row gap-3">
            <input type="text" required placeholder="Destination (e.g. Wayanad, Bangalore)..." value={destination} onChange={(e) => setDestination(e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"/>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"/>
            <input type="number" required placeholder="Cash in Hand (₹ Budget)..." value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full md:w-44 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"/>
            <button type="submit" className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold transition-colors shadow-xs shrink-0 cursor-pointer">
              Start Plan
            </button>
          </form>
        </div>)}

      {/* Travel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {travelTab === 'active' ? (activeTrips.length > 0 ? (activeTrips.map((trip) => {
            const expenses = trip.expenses || [];
            const totalExp = expenses.reduce((s, x) => s + x.amount, 0);
            const remaining = trip.budget - totalExp;
            return (<div key={trip.id} id={`travel-card-${trip.id}`} className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs flex flex-col justify-between space-y-4">
                  {/* Trip Header */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#141716] uppercase tracking-wide">
                          {trip.destination}
                        </h3>
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded-full">
                          Upcoming
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-700"/>
                        <span>{trip.date || 'Date Pending'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 no-print">
                      {/* Mark Completed Button */}
                      <button onClick={() => {
                    setCompletingTripId(trip.id);
                    setCompletionRemarks('');
                }} className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-2xs cursor-pointer" title="Tick to Complete Trip (moves to Completed Folder)">
                        <CheckCircle2 className="w-3.5 h-3.5"/>
                        <span>✓ Done</span>
                      </button>

                      <button onClick={triggerPrint} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg" title="Print Plan A4">
                        <Printer className="w-4 h-4"/>
                      </button>
                      <button onClick={() => deleteTravel(trip.id)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg" title="Delete Trip">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  {/* 3 Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Budget</span>
                      <p className="text-xs font-black text-[#141716] tabular-nums">{fmt(trip.budget)}</p>
                    </div>
                    <div className="bg-rose-50/60 p-2.5 rounded-2xl border border-rose-100">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Spent</span>
                      <p className="text-xs font-black text-rose-600 tabular-nums">{fmt(totalExp)}</p>
                    </div>
                    <div className={`p-2.5 rounded-2xl border ${remaining >= 0 ? 'bg-emerald-50/70 border-emerald-100' : 'bg-rose-50/70 border-rose-200'}`}>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Remaining</span>
                      <p className={`text-xs font-black tabular-nums ${remaining >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {fmt(remaining)}
                      </p>
                    </div>
                  </div>

                  {/* Expense items */}
                  <div className="space-y-2 flex-grow">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-1">
                      Trip Expenses Log ({expenses.length})
                    </h4>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {expenses.length > 0 ? (expenses.map((e) => (<div key={e.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150 text-xs">
                            <span className="font-bold text-slate-800">{e.desc}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-rose-500 font-black tabular-nums">-{fmt(e.amount)}</span>
                              <button onClick={() => deleteTravelExpense(trip.id, e.id)} className="text-slate-300 hover:text-rose-500 no-print">
                                ✕
                              </button>
                            </div>
                          </div>))) : (<p className="text-[11px] text-slate-400 italic py-1">No expenses logged yet.</p>)}
                    </div>
                  </div>

                  {/* Add Expense Form */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100 no-print">
                    <input type="text" placeholder="Expense item (fuel, food, tickets)..." value={expDesc[trip.id] || ''} onChange={(e) => setExpDesc((prev) => ({ ...prev, [trip.id]: e.target.value }))} className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs"/>
                    <input type="number" placeholder="₹ Amount" value={expAmt[trip.id] || ''} onChange={(e) => setExpAmt((prev) => ({ ...prev, [trip.id]: e.target.value }))} className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs"/>
                    <button onClick={() => handleAddExpense(trip.id)} className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black cursor-pointer">
                      +
                    </button>
                  </div>
                </div>);
        })) : (<div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 col-span-2">
              <Plane className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
              <p className="text-sm font-bold text-slate-600">No active trips planned right now.</p>
              <p className="text-xs text-slate-400 mt-1">
                Plan a new journey above or browse finished trips in the{' '}
                <button onClick={() => setTravelTab('completed')} className="text-teal-700 underline font-bold">
                  Completed Trips Folder
                </button>
                .
              </p>
            </div>)) : (
        /* Completed Trips Archive View */
        completedTrips.length > 0 ? (completedTrips.map((trip) => {
            const expenses = trip.expenses || [];
            const totalExp = expenses.reduce((s, x) => s + x.amount, 0);
            const remaining = trip.budget - totalExp;
            return (<div key={trip.id} className="bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#141716] uppercase tracking-wide line-through text-slate-600">
                          {trip.destination}
                        </h3>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3"/>
                          <span>COMPLETED</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Date: {trip.date || 'N/A'}
                      </p>
                      {trip.completedAt && (<p className="text-[11px] text-teal-700 font-bold mt-1">
                          ✓ Completed on: {trip.completedAt}
                        </p>)}
                      {trip.remarks && (<div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                          <strong className="text-slate-900">Notes & Memories: </strong>
                          {trip.remarks}
                        </div>)}
                    </div>

                    <div className="flex items-center gap-2 no-print">
                      <button type="button" onClick={() => toggleTravel(trip.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5" title="Restore back to Active Journeys">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500"/>
                        <span>Restore</span>
                      </button>
                      <button onClick={() => deleteTravel(trip.id)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg" title="Delete Permanently">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Initial Budget</span>
                      <p className="text-xs font-black text-[#141716]">{fmt(trip.budget)}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Total Spent</span>
                      <p className="text-xs font-black text-rose-600">{fmt(totalExp)}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Net Remaining</span>
                      <p className={`text-xs font-black ${remaining >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {fmt(remaining)}
                      </p>
                    </div>
                  </div>
                </div>);
        })) : (<div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 col-span-2">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
              <p className="text-sm font-bold text-slate-600">Completed Trips Folder is empty.</p>
              <p className="text-xs text-slate-400 mt-1">
                Completed journeys will be archived here.
              </p>
            </div>))}
      </div>
    </div>);
};
