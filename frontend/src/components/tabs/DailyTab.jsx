import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Clock, CheckCircle2, ListTodo, UserCheck, BookOpen, Trash2, ChevronUp, ChevronDown, Calendar, FolderCheck, RotateCcw, Check, FolderOpen, Printer, ChevronLeft, ChevronRight, TrendingUp, XCircle, Edit3, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const DailyTab = () => {
    const { state, addTodo, toggleTodo, deleteTodo, moveTodo, addFinishingTodo, toggleFinishingTodo, deleteFinishingTodo, addGeneralTodo, toggleRoutineForDate, deleteGeneralTodo, addMeeting, toggleMeeting, deleteMeeting, addBook, updateBookProgress, toggleBookCompleted, deleteBook, } = useWorkspace();
    // Active / Completed Folder tabs
    const [actionTab, setActionTab] = useState('active');
    const [finishingTab, setFinishingTab] = useState('active');
    const [meetingTab, setMeetingTab] = useState('active');
    const [bookFolder, setBookFolder] = useState('reading');
    // Daily Routine Recurring State & Date tracking
    const [selectedRoutineDate, setSelectedRoutineDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [routineViewMode, setRoutineViewMode] = useState('checklist');
    // Action Task form state
    const [taskText, setTaskText] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [taskPriority, setTaskPriority] = useState('Medium');
    // Finishing state
    const [finishingText, setFinishingText] = useState('');
    const [finishingDate, setFinishingDate] = useState('');
    const [finishingTime, setFinishingTime] = useState('');
    // Daily Routine item form state
    const [routineText, setRoutineText] = useState('');
    // Meeting state
    const [meetPerson, setMeetPerson] = useState('');
    const [meetPurpose, setMeetPurpose] = useState('');
    const [meetDate, setMeetDate] = useState('');
    const [meetTime, setMeetTime] = useState('');
    // Book state
    const [bookTitle, setBookTitle] = useState('');
    const [bookPages, setBookPages] = useState('');
    // Inline editing book reading progress state
    const [editingBookId, setEditingBookId] = useState(null);
    const [pagesInput, setPagesInput] = useState('');
    const todayStr = new Date().toISOString().slice(0, 10);
    // Filtering lists
    const activeTodos = state.todos.filter((t) => !t.completed);
    const completedTodos = state.todos.filter((t) => t.completed);
    const activeFinishing = state.finishingTodos.filter((t) => !t.completed);
    const completedFinishing = state.finishingTodos.filter((t) => t.completed);
    const activeMeetings = state.meetings.filter((m) => !m.completed);
    const completedMeetings = state.meetings.filter((m) => m.completed);
    // Routines stats for selectedRoutineDate
    const routinesDoneOnSelectedDate = state.generalTodos.filter((r) => (r.completedDates || []).includes(selectedRoutineDate));
    // Handlers
    const handleAddActionTask = (e) => {
        e.preventDefault();
        if (!taskText.trim())
            return;
        addTodo(taskText.trim(), taskPriority, taskDate, taskTime);
        setTaskText('');
        setTaskDate('');
        setTaskTime('');
        setActionTab('active');
    };
    const handleAddFinishing = (e) => {
        e.preventDefault();
        if (!finishingText.trim())
            return;
        addFinishingTodo(finishingText.trim(), finishingDate, finishingTime);
        setFinishingText('');
        setFinishingDate('');
        setFinishingTime('');
        setFinishingTab('active');
    };
    const handleAddRoutine = (e) => {
        e.preventDefault();
        if (!routineText.trim())
            return;
        addGeneralTodo(routineText.trim());
        setRoutineText('');
    };
    const handleAddMeeting = (e) => {
        e.preventDefault();
        if (!meetPerson.trim() || !meetPurpose.trim())
            return;
        addMeeting({
            person: meetPerson.trim(),
            purpose: meetPurpose.trim(),
            date: meetDate,
            time: meetTime,
        });
        setMeetPerson('');
        setMeetPurpose('');
        setMeetDate('');
        setMeetTime('');
        setMeetingTab('active');
    };
    const handleAddBook = (e) => {
        e.preventDefault();
        if (!bookTitle.trim())
            return;
        addBook(bookTitle.trim(), parseInt(bookPages) || 100, 0);
        setBookTitle('');
        setBookPages('');
    };
    const handleSaveBookProgress = (bookId) => {
        const pages = parseInt(pagesInput);
        if (!isNaN(pages)) {
            updateBookProgress(bookId, pages);
        }
        setEditingBookId(null);
        setPagesInput('');
    };
    const handleQuickAddPages = (bookId, currentRead, addCount) => {
        updateBookProgress(bookId, currentRead + addCount);
    };
    // Date shifting for daily recurring routine
    const shiftDate = (days) => {
        const current = new Date(selectedRoutineDate);
        current.setDate(current.getDate() + days);
        setSelectedRoutineDate(current.toISOString().slice(0, 10));
    };
    // Compile history of the last 7 dates for the recurring routine tracker
    const getRecentDates = () => {
        const list = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            list.push(d.toISOString().slice(0, 10));
        }
        return list;
    };
    const recentDates = getRecentDates();
    return (<div className="space-y-6">
      {/* Top Banner with Completed Archive Summary */}
      <div className="bg-[#141716] text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black tracking-tight text-white uppercase flex items-center gap-2">
              <FolderCheck className="w-5 h-5 text-[#c4f223]"/>
              <span>Daily Life & Task Management</span>
            </h2>
            <span className="text-[10px] bg-[#c4f223]/20 text-[#c4f223] font-bold px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Checked action tasks move directly to the Completed Folder. Daily routines repeat automatically every day.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-3.5 py-1.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending Actions</span>
            <span className="text-sm font-black text-amber-400">
              {activeTodos.length + activeFinishing.length + activeMeetings.length}
            </span>
          </div>
          <div className="bg-[#c4f223]/20 px-3.5 py-1.5 rounded-2xl border border-[#c4f223]/30 text-center">
            <span className="text-[10px] text-[#c4f223] uppercase font-bold block">📁 Completed Folder</span>
            <span className="text-sm font-black text-[#c4f223]">
              {completedTodos.length + completedFinishing.length + completedMeetings.length}
            </span>
          </div>
          <button onClick={triggerPrint} className="btn-neon px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer no-print" title="Print A4 PDF">
            <Printer className="w-3.5 h-3.5"/>
            <span>Print A4</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Action Tasks, Finishing Tasks, Daily Routines */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Task Scheduler */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800"/>
                <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider">
                  Action Task Scheduler (Priority Queues)
                </h3>
              </div>

              {/* Folder Switcher Pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 no-print">
                <button type="button" onClick={() => setActionTab('active')} className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${actionTab === 'active'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  Active ({activeTodos.length})
                </button>
                <button type="button" onClick={() => setActionTab('completed')} className={`px-3 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-all ${actionTab === 'completed'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  <FolderCheck className="w-3.5 h-3.5"/>
                  <span>📁 Completed Folder ({completedTodos.length})</span>
                </button>
              </div>
            </div>

            {/* Add form */}
            {actionTab === 'active' && (<form onSubmit={handleAddActionTask} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3 no-print">
                <input type="text" required placeholder="Task details (e.g. Prepare English Lesson plan)..." value={taskText} onChange={(e) => setTaskText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
                <div className="grid grid-cols-3 gap-2">
                  <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium"/>
                  <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium"/>
                  <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold">
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Mid Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#141716] hover:bg-slate-800 text-white rounded-xl text-xs font-black tracking-wide uppercase transition-colors shadow-xs">
                  Add Action Task
                </button>
              </form>)}

            {/* Tasks list */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {actionTab === 'active' ? (activeTodos.length > 0 ? (activeTodos.map((t, idx) => (<div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs shadow-2xs hover:bg-slate-100/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col no-print">
                          <button onClick={() => moveTodo(t.id, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-700 disabled:opacity-20" title="Move Up">
                            <ChevronUp className="w-3.5 h-3.5"/>
                          </button>
                          <button onClick={() => moveTodo(t.id, 'down')} disabled={idx === activeTodos.length - 1} className="text-slate-300 hover:text-slate-700 disabled:opacity-20" title="Move Down">
                            <ChevronDown className="w-3.5 h-3.5"/>
                          </button>
                        </div>

                        {/* Interactive Tick Checkbox that moves item to Completed Folder */}
                        <button type="button" onClick={() => toggleTodo(t.id)} className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-emerald-600 flex items-center justify-center transition-all bg-white hover:bg-emerald-50 cursor-pointer" title="Tick to Complete (moves to Completed Folder)"/>

                        <div>
                          <span className="font-bold text-[#141716]">{t.task}</span>
                          {t.date || t.time ? (<span className="text-[10px] text-rose-500 block font-semibold">
                              Due: {t.date} {t.time}
                            </span>) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${t.priority === 'High'
                ? 'bg-rose-100 text-rose-700'
                : t.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'}`}>
                          {t.priority}
                        </span>
                        <button onClick={() => deleteTodo(t.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print" title="Delete">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>))) : (<div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-semibold text-slate-500">No active action tasks scheduled.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Completed tasks are safely preserved in the{' '}
                      <button onClick={() => setActionTab('completed')} className="text-emerald-700 underline font-bold">
                        Completed Folder
                      </button>
                      .
                    </p>
                  </div>)) : (
        /* Completed Tasks Folder View */
        completedTodos.length > 0 ? (<div className="space-y-2">
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800 font-bold mb-2">
                      <span className="flex items-center gap-1.5">
                        <FolderCheck className="w-4 h-4 text-emerald-700"/>
                        <span>Completed Folder ({completedTodos.length} archived tasks)</span>
                      </span>
                      <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        Archive Stored
                      </span>
                    </div>

                    {completedTodos.map((t) => (<div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/30 border border-emerald-200 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5"/>
                          </div>
                          <div>
                            <span className="line-through text-slate-600 font-medium">{t.task}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-emerald-700 font-bold">
                                ✓ Completed {t.completedAt ? `at ${t.completedAt}` : ''}
                              </span>
                              {t.priority && (<span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-bold">
                                  {t.priority}
                                </span>)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 no-print">
                          <button type="button" onClick={() => toggleTodo(t.id)} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-2xs" title="Restore back to Active Tasks">
                            <RotateCcw className="w-3 h-3 text-slate-500"/>
                            <span>Restore</span>
                          </button>
                          <button onClick={() => deleteTodo(t.id)} className="text-slate-300 hover:text-rose-500 p-1" title="Delete Permanently">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>))}
                  </div>) : (<div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
                    <p className="text-xs text-slate-500 font-semibold">Completed Folder is empty.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      When you tick tasks in Active, they will be archived here.
                    </p>
                  </div>))}
            </div>
          </div>

          {/* Daily Recurring Routines & Habit Tracker (Daily Repeating Items with Date Logging) */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-blue-600"/>
                  <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider">
                    Daily Routines & Habits (Daily Recurring Checklist)
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Repeats automatically every day. Check off routines per day and track completion history by date.
                </p>
              </div>

              {/* View Switcher: Checklist vs History */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 no-print">
                <button type="button" onClick={() => setRoutineViewMode('checklist')} className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${routineViewMode === 'checklist'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  Checklist
                </button>
                <button type="button" onClick={() => setRoutineViewMode('history')} className={`px-3 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1 transition-all ${routineViewMode === 'history'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  <Calendar className="w-3.5 h-3.5"/>
                  <span>Date Logs</span>
                </button>
              </div>
            </div>

            {routineViewMode === 'checklist' ? (<div className="space-y-4">
                {/* Date Navigator Strip */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  <button type="button" onClick={() => shiftDate(-1)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer no-print" title="Previous Day">
                    <ChevronLeft className="w-4 h-4"/>
                  </button>

                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-4 h-4 text-blue-600"/>
                    <span className="font-extrabold text-[#141716]">
                      {selectedRoutineDate === todayStr ? 'Today' : selectedRoutineDate}
                    </span>
                    <input type="date" value={selectedRoutineDate} onChange={(e) => e.target.value && setSelectedRoutineDate(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-700"/>
                    {selectedRoutineDate !== todayStr && (<button type="button" onClick={() => setSelectedRoutineDate(todayStr)} className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md hover:bg-blue-200 no-print">
                        Back to Today
                      </button>)}
                  </div>

                  <button type="button" onClick={() => shiftDate(1)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer no-print" title="Next Day">
                    <ChevronRight className="w-4 h-4"/>
                  </button>
                </div>

                {/* Progress for this date */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500 font-bold">
                    Completed for {selectedRoutineDate === todayStr ? 'Today' : selectedRoutineDate}:
                  </span>
                  <span className="font-extrabold text-blue-700">
                    {routinesDoneOnSelectedDate.length} / {state.generalTodos.length} Done (
                    {state.generalTodos.length > 0
                ? Math.round((routinesDoneOnSelectedDate.length / state.generalTodos.length) * 100)
                : 0}
                    %)
                  </span>
                </div>

                {/* Add new routine form */}
                <form onSubmit={handleAddRoutine} className="flex gap-2 no-print bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                  <input type="text" required placeholder="Add new daily routine (e.g. Morning Walk, Read Quran 30m)..." value={routineText} onChange={(e) => setRoutineText(e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                  <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer">
                    Add Routine
                  </button>
                </form>

                {/* Routine items for the selected date */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {state.generalTodos.length > 0 ? (state.generalTodos.map((r) => {
                const isDoneOnDate = (r.completedDates || []).includes(selectedRoutineDate);
                return (<div key={r.id} className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-colors ${isDoneOnDate
                        ? 'bg-blue-50/50 border-blue-200 text-blue-900'
                        : 'bg-slate-50/80 border-slate-200 text-[#141716]'}`}>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => toggleRoutineForDate(r.id, selectedRoutineDate)} className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${isDoneOnDate
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-300 hover:border-blue-500'}`} title={isDoneOnDate ? 'Mark Pending for this Date' : 'Mark Completed for this Date'}>
                              {isDoneOnDate && <Check className="w-3.5 h-3.5"/>}
                            </button>
                            <div>
                              <span className={isDoneOnDate ? 'font-bold line-through text-slate-500' : 'font-bold'}>
                                {r.task}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Total Completed: {(r.completedDates || []).length} Days
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${isDoneOnDate ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
                              {isDoneOnDate ? 'Done Today' : 'Pending'}
                            </span>
                            <button onClick={() => deleteGeneralTodo(r.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print" title="Delete Routine">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </div>);
            })) : (<p className="text-xs text-slate-400 italic py-4 text-center">
                      No daily routines added. Add your daily recurring habits above.
                    </p>)}
                </div>
              </div>) : (
        /* Date History & Daily Completion Log (by Date) */
        <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600"/>
                    <span>Daily Completion Log by Date</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">Past 7 Days Audit</span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {recentDates.map((dateStr) => {
                const doneRoutines = state.generalTodos.filter((r) => (r.completedDates || []).includes(dateStr));
                const totalRoutines = state.generalTodos.length;
                const pct = totalRoutines > 0 ? Math.round((doneRoutines.length / totalRoutines) * 100) : 0;
                const isSelected = selectedRoutineDate === dateStr;
                return (<div key={dateStr} className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all ${isSelected ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[#141716] text-sm">
                              {dateStr === todayStr ? 'Today' : dateStr}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">({dateStr})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${pct === 100
                        ? 'bg-emerald-100 text-emerald-800'
                        : pct > 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'}`}>
                              {doneRoutines.length} / {totalRoutines} Done ({pct}%)
                            </span>
                            <button type="button" onClick={() => {
                        setSelectedRoutineDate(dateStr);
                        setRoutineViewMode('checklist');
                    }} className="text-[10px] font-bold text-blue-700 hover:underline no-print">
                              Open Day
                            </button>
                          </div>
                        </div>

                        {/* Breakdown of what was done and what was not done on this date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                          {state.generalTodos.map((r) => {
                        const done = (r.completedDates || []).includes(dateStr);
                        return (<div key={r.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${done ? 'text-emerald-800 bg-emerald-50/60' : 'text-slate-400 bg-slate-50'}`}>
                                {done ? (<Check className="w-3 h-3 text-emerald-600 shrink-0"/>) : (<XCircle className="w-3 h-3 text-slate-300 shrink-0"/>)}
                                <span className={done ? 'font-bold' : 'font-normal'}>{r.task}</span>
                              </div>);
                    })}
                        </div>
                      </div>);
            })}
                </div>
              </div>)}
          </div>

          {/* Finishing To Do */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600"/>
                <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider">
                  Finishing To Do (Near Completion)
                </h3>
              </div>

              {/* Folder Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 no-print">
                <button type="button" onClick={() => setFinishingTab('active')} className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all ${finishingTab === 'active'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  Active ({activeFinishing.length})
                </button>
                <button type="button" onClick={() => setFinishingTab('completed')} className={`px-2.5 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1 transition-all ${finishingTab === 'completed'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  <FolderCheck className="w-3 h-3"/>
                  <span>📁 Completed ({completedFinishing.length})</span>
                </button>
              </div>
            </div>

            {finishingTab === 'active' && (<form onSubmit={handleAddFinishing} className="flex flex-col sm:flex-row gap-2 no-print bg-slate-50 p-3 rounded-2xl border border-slate-150">
                <input type="text" required placeholder="Add finishing task..." value={finishingText} onChange={(e) => setFinishingText(e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <input type="date" value={finishingDate} onChange={(e) => setFinishingDate(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold cursor-pointer">
                  Add
                </button>
              </form>)}

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {finishingTab === 'active' ? (activeFinishing.length > 0 ? (activeFinishing.map((t) => (<div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/40 border border-amber-100 text-xs">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => toggleFinishingTodo(t.id)} className="w-5 h-5 rounded-lg border-2 border-amber-300 hover:border-amber-600 flex items-center justify-center transition-all bg-white hover:bg-amber-50 cursor-pointer" title="Tick to Complete (moves to Completed Folder)"/>
                        <span className="font-bold text-[#141716]">
                          {t.task} {t.date ? `(Due ${t.date})` : ''}
                        </span>
                      </div>
                      <button onClick={() => deleteFinishingTodo(t.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>))) : (<p className="text-xs text-slate-400 italic py-4 text-center">No active finishing tasks.</p>)) : (
        /* Completed Finishing */
        completedFinishing.length > 0 ? (completedFinishing.map((t) => (<div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/20 border border-amber-200 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5"/>
                        </div>
                        <div>
                          <span className="line-through text-slate-600 font-medium">{t.task}</span>
                          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
                            ✓ Completed {t.completedAt ? `at ${t.completedAt}` : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 no-print">
                        <button type="button" onClick={() => toggleFinishingTodo(t.id)} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-slate-500"/>
                          <span>Restore</span>
                        </button>
                        <button onClick={() => deleteFinishingTodo(t.id)} className="text-slate-300 hover:text-rose-500 p-1">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>))) : (<p className="text-xs text-slate-400 italic py-4 text-center">No completed finishing tasks yet.</p>))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Meetings & Reading Tracker */}
        <div className="lg:col-span-5 space-y-6">
          {/* Meetings & Appointments */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-800"/>
                  <span>Meetings & Appointments</span>
                </h3>
              </div>

              {/* Folder Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 no-print">
                <button type="button" onClick={() => setMeetingTab('active')} className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all ${meetingTab === 'active'
            ? 'bg-white text-[#141716] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  Upcoming ({activeMeetings.length})
                </button>
                <button type="button" onClick={() => setMeetingTab('completed')} className={`px-2.5 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1 transition-all ${meetingTab === 'completed'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
                  <FolderCheck className="w-3 h-3"/>
                  <span>📁 Completed ({completedMeetings.length})</span>
                </button>
              </div>
            </div>

            {meetingTab === 'active' && (<form onSubmit={handleAddMeeting} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2.5 no-print">
                <input type="text" required placeholder="Person / Organization name..." value={meetPerson} onChange={(e) => setMeetPerson(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <input type="text" required placeholder="Purpose of meeting..." value={meetPurpose} onChange={(e) => setMeetPurpose(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <div className="flex gap-2">
                  <input type="date" value={meetDate} onChange={(e) => setMeetDate(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
                  <input type="time" value={meetTime} onChange={(e) => setMeetTime(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
                </div>
                <button type="submit" className="w-full btn-neon py-2 text-xs font-black shadow-xs cursor-pointer">
                  Save Appointment
                </button>
              </form>)}

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {meetingTab === 'active' ? (activeMeetings.length > 0 ? (activeMeetings.map((m) => (<div key={m.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => toggleMeeting(m.id)} className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-emerald-600 flex items-center justify-center transition-all bg-white hover:bg-emerald-50 cursor-pointer" title="Tick to Complete (moves to Completed Folder)"/>
                        <div>
                          <p className="font-extrabold text-[#141716]">{m.person}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">{m.purpose}</p>
                          {m.date || m.time ? (<span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                              {m.date} at {m.time}
                            </span>) : null}
                        </div>
                      </div>
                      <button onClick={() => deleteMeeting(m.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>))) : (<p className="text-xs text-slate-400 italic py-4 text-center">No upcoming meetings scheduled.</p>)) : (
        /* Completed Meetings */
        completedMeetings.length > 0 ? (completedMeetings.map((m) => (<div key={m.id} className="flex justify-between items-center p-3 rounded-2xl bg-emerald-50/20 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5"/>
                        </div>
                        <div>
                          <p className="font-extrabold line-through text-slate-600">{m.person}</p>
                          <p className="text-[11px] text-slate-500">{m.purpose}</p>
                          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                            ✓ Done {m.completedAt ? `at ${m.completedAt}` : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 no-print">
                        <button type="button" onClick={() => toggleMeeting(m.id)} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-slate-500"/>
                          <span>Restore</span>
                        </button>
                        <button onClick={() => deleteMeeting(m.id)} className="text-slate-300 hover:text-rose-500 p-1">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>))) : (<p className="text-xs text-slate-400 italic py-4 text-center">No completed meetings archived yet.</p>))}
            </div>
          </div>

          {/* Reading Tracker with Dynamic Pages Read & Finished Books Folder */}
          {(() => {
            const activeBooks = state.books.filter((b) => !b.completed && (b.pagesRead || 0) < b.totalPages);
            const completedBooks = state.books.filter((b) => b.completed || (b.pagesRead || 0) >= b.totalPages);
            return (<div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-800"/>
                      <span>Reading & Book Progress Tracker</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Track daily pages read. Finished books automatically move into Completed Books.
                    </p>
                  </div>

                  {/* Folder Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 no-print shrink-0">
                    <button type="button" onClick={() => setBookFolder('reading')} className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all ${bookFolder === 'reading'
                    ? 'bg-white text-[#141716] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'}`}>
                      Reading ({activeBooks.length})
                    </button>
                    <button type="button" onClick={() => setBookFolder('completed')} className={`px-2.5 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1 transition-all ${bookFolder === 'completed'
                    ? 'bg-[#141716] text-[#c4f223] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'}`}>
                      <FolderCheck className="w-3 h-3"/>
                      <span>Completed ({completedBooks.length})</span>
                    </button>
                  </div>
                </div>

                {bookFolder === 'reading' ? (<>
                    <form onSubmit={handleAddBook} className="grid grid-cols-2 gap-2 no-print bg-slate-50 p-3 rounded-2xl border border-slate-150">
                      <input type="text" required placeholder="Book Title..." value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} className="col-span-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                      <input type="number" placeholder="Total Pages (e.g. 100)..." value={bookPages} onChange={(e) => setBookPages(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                      <button type="submit" className="btn-neon text-xs font-black py-1.5 cursor-pointer shadow-xs">
                        Add Book
                      </button>
                    </form>

                    <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                      {activeBooks.length > 0 ? (activeBooks.map((b) => {
                        const read = b.pagesRead || 0;
                        const total = b.totalPages || 100;
                        const progressPct = total > 0 ? Math.min(100, Math.round((read / total) * 100)) : 0;
                        const isEditing = editingBookId === b.id;
                        return (<div key={b.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-2.5">
                                  {/* Tick button to finish book directly */}
                                  <button type="button" onClick={() => toggleBookCompleted(b.id)} className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-emerald-600 flex items-center justify-center transition-all bg-white hover:bg-emerald-50 cursor-pointer mt-0.5" title="Tick to mark finished (moves to Completed Books)"/>
                                  <div>
                                    <p className="font-extrabold text-[#141716] text-sm">{b.title}</p>
                                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                                      {read} of {total} Pages Read · <strong className="text-emerald-700">{progressPct}%</strong>
                                    </p>
                                  </div>
                                </div>
                                <button onClick={() => deleteBook(b.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print" title="Delete Book">
                                  <Trash2 className="w-3.5 h-3.5"/>
                                </button>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-300 bg-[#c4f223]" style={{ width: `${progressPct}%` }}/>
                              </div>

                              {/* Pages Read Updater Controls */}
                              <div className="pt-1 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 no-print">
                                {isEditing ? (<div className="flex items-center gap-1.5 w-full">
                                    <input type="number" min={0} max={total} placeholder="Current Page..." value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold w-28"/>
                                    <button type="button" onClick={() => handleSaveBookProgress(b.id)} className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold">
                                      Save
                                    </button>
                                    <button type="button" onClick={() => {
                                    setEditingBookId(null);
                                    setPagesInput('');
                                }} className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold">
                                      Cancel
                                    </button>
                                  </div>) : (<div className="flex items-center justify-between w-full">
                                    {/* Quick Increment Buttons */}
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Add Today:</span>
                                      <button type="button" onClick={() => handleQuickAddPages(b.id, read, 5)} className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] font-extrabold text-slate-700 shadow-2xs" title="Add 5 pages">
                                        +5
                                      </button>
                                      <button type="button" onClick={() => handleQuickAddPages(b.id, read, 10)} className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] font-extrabold text-slate-700 shadow-2xs" title="Add 10 pages">
                                        +10
                                      </button>
                                      <button type="button" onClick={() => handleQuickAddPages(b.id, read, 20)} className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] font-extrabold text-slate-700 shadow-2xs" title="Add 20 pages">
                                        +20
                                      </button>
                                    </div>

                                    <button type="button" onClick={() => {
                                    setEditingBookId(b.id);
                                    setPagesInput(read.toString());
                                }} className="px-2.5 py-1 bg-[#141716] hover:bg-slate-800 text-[#c4f223] rounded-lg text-[10px] font-black flex items-center gap-1 shadow-2xs cursor-pointer">
                                      <Edit3 className="w-3 h-3"/>
                                      <span>Set Progress</span>
                                    </button>
                                  </div>)}
                              </div>
                            </div>);
                    })) : (<div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-xs font-semibold text-slate-500">No books currently being read.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Add a new book or check your{' '}
                            <button type="button" onClick={() => setBookFolder('completed')} className="text-emerald-700 underline font-bold">
                              Completed Books
                            </button>
                            .
                          </p>
                        </div>)}
                    </div>
                  </>) : (
                /* Completed Books Archive */
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-extrabold">
                      <span className="flex items-center gap-1.5">
                        <FolderCheck className="w-4 h-4 text-emerald-700"/>
                        <span>Completed Books Archive ({completedBooks.length} books finished)</span>
                      </span>
                      <span className="text-[10px] bg-emerald-200/70 text-emerald-950 px-2 py-0.5 rounded-full">
                        Saved in Archive
                      </span>
                    </div>

                    {completedBooks.length > 0 ? (completedBooks.map((b) => (<div key={b.id} className="bg-emerald-50/25 p-3.5 rounded-2xl border border-emerald-200 text-xs space-y-2.5 shadow-2xs">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <Check className="w-3.5 h-3.5"/>
                              </div>
                              <div>
                                <p className="font-extrabold text-[#141716] text-sm">{b.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-emerald-800 font-bold">
                                    ✓ Finished {b.completedAt ? `· ${b.completedAt}` : ''}
                                  </span>
                                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded">
                                    100% Complete ({b.totalPages} pages)
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 no-print">
                              <button type="button" onClick={() => toggleBookCompleted(b.id)} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-2xs" title="Restore back to currently reading">
                                <RotateCcw className="w-3 h-3 text-slate-500"/>
                                <span>Read Again</span>
                              </button>
                              <button onClick={() => deleteBook(b.id)} className="text-slate-300 hover:text-rose-500 p-1" title="Delete Permanently">
                                <Trash2 className="w-3.5 h-3.5"/>
                              </button>
                            </div>
                          </div>

                          {/* Full 100% Progress Bar */}
                          <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 w-full rounded-full"/>
                          </div>
                        </div>))) : (<div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs font-semibold text-slate-500">No completed books archived yet.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          When you finish a book (100% pages read or marked with tick), it will automatically appear here.
                        </p>
                      </div>)}
                  </div>)}
              </div>);
        })()}
        </div>
      </div>
    </div>);
};
