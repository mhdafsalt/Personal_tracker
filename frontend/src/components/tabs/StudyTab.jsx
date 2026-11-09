import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { GraduationCap, Plus, Trash2, Calendar, CheckCircle2, Printer, Award, Check, FolderCheck, FileText, Layers, BookCheck, TrendingUp, SlidersHorizontal, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const StudyTab = () => {
    const { state, addStudyTrack, toggleStudyTrack, updateStudyTrackProgress, deleteStudyTrack, addStudyTrackModule, toggleStudyTrackModule, deleteStudyTrackModule, addExam, toggleExamStatus, deleteExam, addPastQualification, deletePastQualification, addCompletedStudyArea, deleteCompletedStudyArea, } = useWorkspace();
    const [newTrackName, setNewTrackName] = useState('');
    // Program Filter (Active vs Completed vs All)
    const [programFilter, setProgramFilter] = useState('active');
    // Program Progress Record state
    const [editingProgressTrackId, setEditingProgressTrackId] = useState(null);
    const [progressInput, setProgressInput] = useState('');
    // Assessment modal state
    const [selectedTrackForExam, setSelectedTrackForExam] = useState(null);
    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [examStatus, setExamStatus] = useState('Upcoming');
    // Work / Assignment modal state
    const [selectedTrackForWork, setSelectedTrackForWork] = useState(null);
    const [workTitle, setWorkTitle] = useState('');
    const [workCategory, setWorkCategory] = useState('Assignment');
    const [workDueDate, setWorkDueDate] = useState('');
    // Past Qualification Form State
    const [qualCourse, setQualCourse] = useState('');
    const [qualInst, setQualInst] = useState('');
    // Completed Area Form State
    const [completedAreaText, setCompletedAreaText] = useState('');
    const handleAddTrack = (e) => {
        e.preventDefault();
        if (!newTrackName.trim())
            return;
        addStudyTrack(newTrackName.trim());
        setNewTrackName('');
    };
    const handleSaveExam = (e) => {
        e.preventDefault();
        if (!selectedTrackForExam || !examName.trim())
            return;
        addExam({
            course: selectedTrackForExam,
            name: examName.trim(),
            date: examDate,
            status: examStatus,
        });
        setExamName('');
        setExamDate('');
        setSelectedTrackForExam(null);
    };
    const handleSaveWork = (e) => {
        e.preventDefault();
        if (!selectedTrackForWork || !workTitle.trim())
            return;
        addStudyTrackModule(selectedTrackForWork.id, workTitle.trim(), workDueDate, workCategory);
        setWorkTitle('');
        setWorkDueDate('');
        setWorkCategory('Assignment');
        setSelectedTrackForWork(null);
    };
    const handleAddQualification = (e) => {
        e.preventDefault();
        if (!qualCourse.trim())
            return;
        addPastQualification(qualCourse.trim(), qualInst.trim());
        setQualCourse('');
        setQualInst('');
    };
    const handleAddCompletedArea = (e) => {
        e.preventDefault();
        if (!completedAreaText.trim())
            return;
        addCompletedStudyArea(completedAreaText.trim());
        setCompletedAreaText('');
    };
    const activeTracks = state.studyTracks.filter((t) => !t.completed);
    const completedTracks = state.studyTracks.filter((t) => t.completed);
    const displayedTracks = programFilter === 'active'
        ? activeTracks
        : programFilter === 'completed'
            ? completedTracks
            : state.studyTracks;
    return (<div id="academic-study-portal" className="space-y-8">
      {/* Header bar with Add Course & Print */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2e5dc] shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-emerald-800"/>
            <span>Academic Study Tracks</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your active degree tracks, coursework assignments, and examination schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleAddTrack} className="flex gap-2 w-full sm:w-auto">
            <input type="text" value={newTrackName} onChange={(e) => setNewTrackName(e.target.value)} placeholder="New Course Name (e.g. B.Ed English)..." className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
            <button type="submit" className="btn-neon px-4 py-2 text-xs font-black shrink-0 cursor-pointer shadow-xs">
              Add Track
            </button>
          </form>

          <button onClick={() => triggerPrint('Academic Study Tracks Report', '#academic-study-portal')} className="p-2 text-slate-600 hover:text-[#141716] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 no-print cursor-pointer" title="Print or Save PDF">
            <Printer className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Program Status Filter Switcher (Active vs Completed vs All) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center bg-white p-1 rounded-2xl border border-[#e2e5dc] shadow-2xs gap-1">
          <button type="button" onClick={() => setProgramFilter('active')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${programFilter === 'active'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
            <Layers className="w-3.5 h-3.5"/>
            <span>Active Programs ({activeTracks.length})</span>
          </button>
          <button type="button" onClick={() => setProgramFilter('completed')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${programFilter === 'completed'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
            <FolderCheck className="w-3.5 h-3.5"/>
            <span>📁 Completed Programs ({completedTracks.length})</span>
          </button>
          <button type="button" onClick={() => setProgramFilter('all')} className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${programFilter === 'all'
            ? 'bg-[#141716] text-white shadow-xs'
            : 'text-slate-500 hover:text-slate-900'}`}>
            <span>All ({state.studyTracks.length})</span>
          </button>
        </div>

        {programFilter === 'completed' && completedTracks.length > 0 && (<span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            ✓ Showing archived completed degree programs
          </span>)}
      </div>

      {/* Course Track Grid Cards (Original Layout with Works & Tick Options) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedTracks.length > 0 ? (displayedTracks.map((track, idx) => {
            const trackExams = state.exams.filter((e) => e.course === track.name || e.course.includes(track.name.split(' ')[0]));
            const trackModules = track.modules || [];
            const isTrackCompleted = !!track.completed;
            const progress = isTrackCompleted ? 100 : Math.max(0, Math.min(100, track.progressPercentage ?? 0));
            return (<div key={track.id} className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all relative group ${isTrackCompleted ? 'border-emerald-300 bg-emerald-50/15' : 'border-[#e2e5dc] hover:border-[#c4f223]'}`}>
                <div>
                  {/* Track Header with Tick Option */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      {/* Course Track Tick Checkbox */}
                      <button type="button" onClick={() => toggleStudyTrack(track.id)} className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center transition-all cursor-pointer shrink-0 ${isTrackCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300 hover:border-emerald-600'}`} title={isTrackCompleted ? 'Mark Course as Active' : 'Tick to Mark Course as Completed'}>
                        {isTrackCompleted && <Check className="w-3.5 h-3.5"/>}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            Program {idx + 1}
                          </span>
                          {isTrackCompleted && (<span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.2 rounded-full">
                              ✓ Completed Track
                            </span>)}
                        </div>
                        <h3 className={`text-base font-black ${isTrackCompleted ? 'line-through text-slate-500' : 'text-[#141716]'}`}>
                          {track.name}
                        </h3>
                        {track.completedAt && (<span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                            Finished: {track.completedAt}
                          </span>)}
                      </div>
                    </div>

                    <button onClick={() => deleteStudyTrack(track.id)} className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 no-print" title="Delete Track">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>

                  {/* Program Completion Progress Tracker & Percentage Update */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 mb-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-800"/>
                        <span className="text-[11px] font-black uppercase text-[#141716] tracking-wider">
                          Program Completion Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border transition-colors ${progress >= 100
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : progress >= 50
                        ? 'bg-[#c4f223]/50 text-[#141716] border-[#b2db1f]'
                        : 'bg-white text-slate-700 border-slate-200'}`}>
                          {progress}% Completed
                        </span>
                        <button type="button" onClick={() => {
                    if (editingProgressTrackId === track.id) {
                        setEditingProgressTrackId(null);
                    }
                    else {
                        setEditingProgressTrackId(track.id);
                        setProgressInput(String(progress));
                    }
                }} className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#141716] text-[#c4f223] hover:bg-slate-800 transition-colors cursor-pointer no-print flex items-center gap-1" title="Record or update completion percentage">
                          <SlidersHorizontal className="w-2.5 h-2.5"/>
                          <span>{editingProgressTrackId === track.id ? 'Close' : 'Update %'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex items-center">
                      <div className={`h-full rounded-full transition-all duration-300 ${progress >= 100 ? 'bg-emerald-600' : 'bg-[#c4f223]'}`} style={{ width: `${progress}%` }}/>
                    </div>

                    {/* Inline Record Input or Quick Adjustments */}
                    {editingProgressTrackId === track.id ? (<div className="pt-2 border-t border-slate-200/80 space-y-2 no-print">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="text-[10px] font-bold text-slate-500 shrink-0">Record Progress %:</label>
                          <input type="number" min={0} max={100} value={progressInput} onChange={(e) => setProgressInput(e.target.value)} placeholder="0-100" className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-center focus:ring-1 focus:ring-[#c4f223]" autoFocus/>
                          <button type="button" onClick={() => {
                        const val = Number(progressInput);
                        if (!isNaN(val)) {
                            updateStudyTrackProgress(track.id, val);
                        }
                        setEditingProgressTrackId(null);
                    }} className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-black cursor-pointer shadow-2xs">
                            Save %
                          </button>
                          <button type="button" onClick={() => setEditingProgressTrackId(null)} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer">
                            Cancel
                          </button>
                        </div>

                        {/* Preset options */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold text-slate-400">Presets:</span>
                          {[10, 25, 50, 75, 90, 100].map((pct) => (<button key={pct} type="button" onClick={() => {
                            updateStudyTrackProgress(track.id, pct);
                            setProgressInput(String(pct));
                        }} className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${progress === pct
                            ? 'bg-[#141716] text-[#c4f223]'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'}`}>
                              {pct}%
                            </button>))}
                        </div>
                      </div>) : (<div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 no-print">
                        <span className="font-semibold text-slate-400">Quick adjust:</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => updateStudyTrackProgress(track.id, Math.max(0, progress - 5))} className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-600 transition-colors cursor-pointer" title="Decrease 5%">
                            -5%
                          </button>
                          <button type="button" onClick={() => updateStudyTrackProgress(track.id, Math.min(100, progress + 5))} className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-600 transition-colors cursor-pointer" title="Increase 5%">
                            +5%
                          </button>
                          <button type="button" onClick={() => updateStudyTrackProgress(track.id, Math.min(100, progress + 10))} className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-600 transition-colors cursor-pointer" title="Increase 10%">
                            +10%
                          </button>
                          <button type="button" onClick={() => updateStudyTrackProgress(track.id, 100)} className="px-2 py-0.5 bg-[#c4f223]/50 hover:bg-[#c4f223] text-[#141716] border border-[#b2db1f] rounded font-black transition-colors cursor-pointer" title="Mark 100% Completed">
                            100% Done
                          </button>
                        </div>
                      </div>)}
                  </div>

                  {/* Section 1: Assessments & Exams */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 mb-3 max-h-52 overflow-y-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">
                        Assessments & Exams ({trackExams.length})
                      </span>
                    </div>
                    {trackExams.length > 0 ? (trackExams.map((exam) => {
                    const isExamCompleted = exam.status === 'Completed';
                    return (<div key={exam.id} className={`flex justify-between items-center p-2.5 rounded-xl border text-xs transition-colors ${isExamCompleted ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-2.5">
                              {/* Tick to Complete Exam Checkbox */}
                              <button type="button" onClick={() => toggleExamStatus(exam.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${isExamCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-300 hover:border-emerald-600'}`} title={isExamCompleted ? 'Mark Assessment as Upcoming' : 'Tick to Mark as Completed'}>
                                {isExamCompleted && <Check className="w-3 h-3"/>}
                              </button>

                              <div>
                                <p className={`font-extrabold ${isExamCompleted ? 'line-through text-slate-500' : 'text-[#141716]'}`}>
                                  {exam.name}
                                </p>
                                <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3 h-3 text-emerald-700"/>
                                  <span>{exam.date || 'TBD'}</span>
                                  <span>·</span>
                                  <span className={`font-bold ${isExamCompleted ? 'text-emerald-700' : 'text-amber-600'}`}>
                                    {exam.status}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <button onClick={() => deleteExam(exam.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print" title="Delete Assessment">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>);
                })) : (<p className="text-[11px] text-slate-400 italic py-1">
                        No assessments registered yet.
                      </p>)}
                  </div>

                  {/* Section 2: Completed Works & Coursework inside this program */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 mb-4 max-h-56 overflow-y-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <BookCheck className="w-3.5 h-3.5 text-emerald-700"/>
                        <span>Course Works & Assignments ({trackModules.length})</span>
                      </span>
                      <span className="text-[9px] text-emerald-800 font-bold">
                        {trackModules.filter((m) => m.completed).length} Done
                      </span>
                    </div>

                    {trackModules.length > 0 ? (trackModules.map((mod) => {
                    const isModCompleted = mod.completed;
                    return (<div key={mod.id} className={`flex justify-between items-center p-2.5 rounded-xl border text-xs transition-colors ${isModCompleted ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-2.5">
                              {/* Tick to Complete Work Checkbox */}
                              <button type="button" onClick={() => toggleStudyTrackModule(track.id, mod.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${isModCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-300 hover:border-emerald-600'}`} title={isModCompleted ? 'Mark Work as Incomplete' : 'Tick to Mark Work Completed'}>
                                {isModCompleted && <Check className="w-3 h-3"/>}
                              </button>

                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`font-extrabold ${isModCompleted ? 'line-through text-slate-500' : 'text-[#141716]'}`}>
                                    {mod.title}
                                  </span>
                                  {mod.category && (<span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                                      {mod.category}
                                    </span>)}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                                  {mod.dueDate && (<span className="text-slate-500 font-semibold flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-slate-400"/>
                                      Due: {mod.dueDate}
                                    </span>)}
                                  {isModCompleted && (<span className="text-emerald-700 font-bold">
                                      ✓ Completed {mod.completedAt ? `· ${mod.completedAt}` : ''}
                                    </span>)}
                                </div>
                              </div>
                            </div>

                            <button onClick={() => deleteStudyTrackModule(track.id, mod.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print" title="Delete Work">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>);
                })) : (<p className="text-[11px] text-slate-400 italic py-1">
                        No coursework or assignments added yet.
                      </p>)}
                  </div>
                </div>

                {/* Action Buttons: Add Assessment & Add Coursework */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 no-print">
                  <button onClick={() => setSelectedTrackForExam(track.name)} className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-[#c4f223]/30 text-slate-800 hover:text-[#141716] font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5"/>
                    <span>+ Assessment</span>
                  </button>
                  <button onClick={() => setSelectedTrackForWork({ id: track.id, name: track.name })} className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-emerald-200/60">
                    <FileText className="w-3.5 h-3.5 text-emerald-700"/>
                    <span>+ Course Work</span>
                  </button>
                </div>
              </div>);
        })) : (<div className="col-span-2 py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
            <p className="text-sm font-bold text-slate-600">
              No {programFilter === 'completed' ? 'completed' : 'active'} academic programs found.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {programFilter === 'completed'
                ? 'Ticking a course checkbox will archive it here as a finished program.'
                : 'Add a new track using the input box above.'}
            </p>
            {programFilter !== 'all' && (<button type="button" onClick={() => setProgramFilter('all')} className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                View All Programs
              </button>)}
          </div>)}
      </div>

      {/* Qualifications Log & Completed Study Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Qualifications Log */}
        <div id="section-qualifications" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-800"/>
              <span>Qualifications Log (Academic History)</span>
            </h3>
            <button onClick={() => triggerPrint('Qualifications Log', '#section-qualifications')} className="text-[10px] font-bold text-slate-600 hover:text-[#141716] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg no-print cursor-pointer">
              <Printer className="w-3 h-3"/>
              <span>Print PDF</span>
            </button>
          </div>

          <form onSubmit={handleAddQualification} className="grid grid-cols-1 sm:grid-cols-3 gap-2 no-print bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <input type="text" placeholder="Course Name..." value={qualCourse} onChange={(e) => setQualCourse(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
            <input type="text" placeholder="Institution & Grade..." value={qualInst} onChange={(e) => setQualInst(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
            <button type="submit" className="btn-neon px-3 py-1.5 text-xs font-black cursor-pointer shadow-xs">
              Add History
            </button>
          </form>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {state.pastQualifications.map((q) => (<div key={q.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-150 text-xs">
                <div>
                  <p className="font-extrabold text-[#141716]">{q.course}</p>
                  <p className="text-[11px] text-slate-500">{q.institution}</p>
                </div>
                <button onClick={() => deletePastQualification(q.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>))}
          </div>
        </div>

        {/* Completed Study Areas */}
        <div id="section-completed-areas" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-800"/>
              <span>Completed Study Areas</span>
            </h3>
            <button onClick={() => triggerPrint('Completed Study Areas', '#section-completed-areas')} className="text-[10px] font-bold text-slate-600 hover:text-[#141716] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg no-print cursor-pointer">
              <Printer className="w-3 h-3"/>
              <span>Print PDF</span>
            </button>
          </div>

          <form onSubmit={handleAddCompletedArea} className="flex gap-2 no-print bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <input type="text" placeholder="Subject / Topic covered..." value={completedAreaText} onChange={(e) => setCompletedAreaText(e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
            <button type="submit" className="btn-neon px-4 py-1.5 text-xs font-black cursor-pointer shadow-xs">
              Add Done
            </button>
          </form>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {state.completedStudyAreas.map((c) => (<div key={c.id} className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0"/>
                  <span className="font-extrabold text-slate-800">{c.area}</span>
                </div>
                <button onClick={() => deleteCompletedStudyArea(c.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>))}
          </div>
        </div>
      </div>

      {/* Modal for Adding Assessment */}
      {selectedTrackForExam && (<div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-[#141716]">
                Add Assessment for {selectedTrackForExam}
              </h4>
              <button onClick={() => setSelectedTrackForExam(null)} className="text-slate-400 hover:text-slate-700 text-base">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Assessment / Exam Title</label>
                <input type="text" required placeholder="e.g. Mid-term Sem 1 Exam" value={examName} onChange={(e) => setExamName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Date</label>
                <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"/>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Status</label>
                <select value={examStatus} onChange={(e) => setExamStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setSelectedTrackForExam(null)} className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl btn-neon text-xs font-black shadow-sm">
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Modal for Adding Course Work / Assignment */}
      {selectedTrackForWork && (<div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-[#141716]">
                  Add Course Work / Assignment
                </h4>
                <p className="text-[11px] text-slate-500 font-bold">
                  Program: {selectedTrackForWork.name}
                </p>
              </div>
              <button onClick={() => setSelectedTrackForWork(null)} className="text-slate-400 hover:text-slate-700 text-base">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWork} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Work / Assignment Title</label>
                <input type="text" required placeholder="e.g. Term Paper on Romantic Literature" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Category</label>
                <select value={workCategory} onChange={(e) => setWorkCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold">
                  <option value="Assignment">Assignment</option>
                  <option value="Seminar">Seminar / Presentation</option>
                  <option value="Project">Project / Field Work</option>
                  <option value="Record">Practical Record</option>
                  <option value="Paper">Term Paper / Thesis</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Due Date</label>
                <input type="date" value={workDueDate} onChange={(e) => setWorkDueDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"/>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setSelectedTrackForWork(null)} className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm">
                  Save Work
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
