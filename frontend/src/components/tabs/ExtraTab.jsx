import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Rocket, Instagram, Mic, Trash2, } from 'lucide-react';
export const ExtraTab = () => {
    const { state, addProject, deleteProject, addReel, deleteReel, addTrainingClass, deleteTrainingClass, } = useWorkspace();
    // Project state
    const [projTitle, setProjTitle] = useState('');
    const [projType, setProjType] = useState('Academic');
    const [projDeadline, setProjDeadline] = useState('');
    // Reel state
    const [reelIdea, setReelIdea] = useState('');
    // Training class state
    const [classTopic, setClassTopic] = useState('');
    const [classAudience, setClassAudience] = useState('');
    const handleAddProject = (e) => {
        e.preventDefault();
        if (!projTitle.trim())
            return;
        addProject(projTitle.trim(), projType, projDeadline);
        setProjTitle('');
        setProjDeadline('');
    };
    const handleAddReel = (e) => {
        e.preventDefault();
        if (!reelIdea.trim())
            return;
        addReel(reelIdea.trim());
        setReelIdea('');
    };
    const handleAddTraining = (e) => {
        e.preventDefault();
        if (!classTopic.trim())
            return;
        addTrainingClass(classTopic.trim(), classAudience.trim());
        setClassTopic('');
        setClassAudience('');
    };
    return (<div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e5dc] shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
          <Rocket className="w-8 h-8 text-emerald-800"/>
          <span>Extracurricular & Creative Projects</span>
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Track high-impact student projects, Instagram content pipeline, and speaking/training classes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Advanced Projects Hub */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
          <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Rocket className="w-4 h-4 text-emerald-800"/>
            <span>Advanced Projects Hub</span>
          </h3>

          <form onSubmit={handleAddProject} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2.5 no-print">
            <input type="text" required placeholder="Project Title..." value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
            <div className="grid grid-cols-2 gap-2">
              <select value={projType} onChange={(e) => setProjType(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold">
                <option value="Academic">📚 Academic</option>
                <option value="Creative">🎨 Creative</option>
                <option value="Social">🤝 Social</option>
              </select>
              <input type="date" value={projDeadline} onChange={(e) => setProjDeadline(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
            </div>
            <button type="submit" className="w-full btn-neon py-2 text-xs font-black shadow-xs cursor-pointer">
              Launch Project
            </button>
          </form>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {state.projects.length > 0 ? (state.projects.map((p) => (<div key={p.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#141716]">{p.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-200 text-slate-700">
                        {p.type}
                      </span>
                    </div>
                    {p.deadline && (<span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                        Deadline: {p.deadline}
                      </span>)}
                  </div>
                  <button onClick={() => deleteProject(p.id)} className="text-slate-300 hover:text-rose-500 p-1">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>))) : (<p className="text-xs text-slate-400 italic py-4 text-center">No projects registered.</p>)}
          </div>
        </div>

        {/* Right Column: Reels Studio & Training Classes */}
        <div className="space-y-6">
          {/* Reel Planning Studio */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Instagram className="w-4 h-4 text-pink-600"/>
              <span>Instagram Reel Planning Studio</span>
            </h3>

            <form onSubmit={handleAddReel} className="flex gap-2 no-print bg-slate-50 p-3 rounded-2xl border border-slate-150">
              <input type="text" required placeholder="Reel hook / video concept..." value={reelIdea} onChange={(e) => setReelIdea(e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <button type="submit" className="btn-neon px-4 py-1.5 text-xs font-black shadow-xs cursor-pointer">
                Save
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {state.reels.map((r) => (<div key={r.id} className="flex justify-between items-center p-3 rounded-2xl bg-pink-50/30 border border-pink-100 text-xs">
                  <span className="font-extrabold text-[#141716]">{r.idea}</span>
                  <button onClick={() => deleteReel(r.id)} className="text-slate-300 hover:text-rose-500 p-1">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>))}
            </div>
          </div>

          {/* Training Classes Conducted */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Mic className="w-4 h-4 text-emerald-800"/>
              <span>Training Classes & Public Workshops</span>
            </h3>

            <form onSubmit={handleAddTraining} className="grid grid-cols-2 gap-2 no-print bg-slate-50 p-3 rounded-2xl border border-slate-150">
              <input type="text" required placeholder="Session Topic..." value={classTopic} onChange={(e) => setClassTopic(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <input type="text" placeholder="Audience / Batch..." value={classAudience} onChange={(e) => setClassAudience(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <button type="submit" className="col-span-2 btn-neon py-1.5 text-xs font-black shadow-xs cursor-pointer">
                Log Workshop
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {state.trainingClasses.map((t) => (<div key={t.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <p className="font-extrabold text-[#141716]">{t.topic}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">{t.audience}</p>
                  </div>
                  <button onClick={() => deleteTrainingClass(t.id)} className="text-slate-300 hover:text-rose-500 p-1">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
