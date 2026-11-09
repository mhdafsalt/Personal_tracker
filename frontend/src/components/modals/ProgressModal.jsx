import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PieChart, CheckCircle2, Rocket, GraduationCap, X, BookOpen, } from 'lucide-react';
export const ProgressModal = ({ isOpen, onClose }) => {
    const { state } = useWorkspace();
    if (!isOpen)
        return null;
    const tasksCount = state.todos.filter((t) => t.completed).length +
        state.finishingTodos.filter((t) => t.completed).length +
        state.generalTodos.filter((t) => t.completed).length;
    const projectsCount = state.projects.length + state.designProjects.length;
    const examsCount = state.exams.filter((e) => e.status === 'Completed').length;
    const totalCompleted = tasksCount + projectsCount + examsCount || 1;
    // Simple clean SVG Doughnut math
    const taskPct = Math.round((tasksCount / totalCompleted) * 100);
    const projPct = Math.round((projectsCount / totalCompleted) * 100);
    const examPct = Math.round((examsCount / totalCompleted) * 100);
    return (<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div className="bg-[#f4f5f0] max-w-4xl w-full rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#e2e5dc]">
        {/* Header */}
        <div className="bg-[#141716] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <PieChart className="w-5 h-5 text-[#c4f223]"/>
            <h3 className="text-sm font-black tracking-wider uppercase">
              Overall Progress & Life Assessment
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Doughnut Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs flex flex-col items-center justify-center text-center space-y-4">
              <h4 className="text-xs font-black text-[#141716] uppercase tracking-wider w-full text-left">
                Activity Distribution
              </h4>

              {/* Responsive SVG Doughnut */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path className="text-slate-100" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  {/* Tasks Ring */}
                  <path className="text-emerald-500" strokeDasharray={`${taskPct}, 100`} strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  {/* Projects Ring */}
                  <path className="text-blue-500" strokeDasharray={`${projPct}, 100`} strokeDashoffset={`-${taskPct}`} strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-[#141716] tabular-nums">
                    {tasksCount + projectsCount + examsCount}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Completed
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-3 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"/>
                  <span>Tasks ({tasksCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"/>
                  <span>Projects ({projectsCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"/>
                  <span>Exams ({examsCount})</span>
                </div>
              </div>
            </div>

            {/* Achievement Summary */}
            <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs flex flex-col justify-center space-y-3">
              <h4 className="text-xs font-black text-[#141716] uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
                Achievement Metrics
              </h4>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-150 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
                  <span>Tasks Finished:</span>
                </span>
                <span className="font-black text-emerald-700 text-sm tabular-nums">{tasksCount}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-150 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-blue-600"/>
                  <span>Projects Launched:</span>
                </span>
                <span className="font-black text-blue-700 text-sm tabular-nums">{projectsCount}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-150 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-600"/>
                  <span>Assessments Completed:</span>
                </span>
                <span className="font-black text-amber-600 text-sm tabular-nums">{examsCount}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-150 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600"/>
                  <span>Study Topics Cleared:</span>
                </span>
                <span className="font-black text-indigo-700 text-sm tabular-nums">
                  {state.completedStudyAreas.length}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Completed Logs */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-3">
            <h4 className="text-xs font-black text-[#141716] uppercase tracking-wider border-b border-slate-100 pb-2">
              Detailed Completed Logs
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-xs">
              {state.completedStudyAreas.map((c) => (<div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                  <span className="font-bold text-slate-700">Studied: {c.area}</span>
                </div>))}
              {state.todos
            .filter((t) => t.completed)
            .map((t) => (<div key={t.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                    <span className="font-bold text-slate-700">Task: {t.task}</span>
                  </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
