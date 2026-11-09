import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { BookOpen, Calendar, Clock, Image as ImageIcon, Trash2, X, Edit3, Search, Check, Printer, Maximize2, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const JournalModal = ({ isOpen, onClose }) => {
    const { state, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useWorkspace();
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const [activeView, setActiveView] = useState('write');
    const [editingEntryId, setEditingEntryId] = useState(null);
    // Form State
    const [entryDate, setEntryDate] = useState(todayStr);
    const [entryTime, setEntryTime] = useState(currentTimeStr);
    const [entryTitle, setEntryTitle] = useState('');
    const [entryContent, setEntryContent] = useState('');
    const [entryMood, setEntryMood] = useState('Productive');
    const [entryTags, setEntryTags] = useState('');
    const [attachedPhotos, setAttachedPhotos] = useState([]);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMood, setFilterMood] = useState('All');
    if (!isOpen)
        return null;
    const moods = [
        { label: 'Happy', icon: '😊', bg: 'bg-amber-100', text: 'text-amber-800' },
        { label: 'Productive', icon: '⚡', bg: 'bg-[#c4f223]/40', text: 'text-slate-900' },
        { label: 'Calm', icon: '🌿', bg: 'bg-emerald-100', text: 'text-emerald-800' },
        { label: 'Reflective', icon: '🧠', bg: 'bg-indigo-100', text: 'text-indigo-800' },
        { label: 'Grateful', icon: '🙏', bg: 'bg-rose-100', text: 'text-rose-800' },
        { label: 'Peaceful', icon: '🌙', bg: 'bg-blue-100', text: 'text-blue-800' },
    ];
    const handlePhotoUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0)
            return;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result;
                if (dataUrl) {
                    setAttachedPhotos((prev) => [...prev, dataUrl]);
                }
            };
            reader.readAsDataURL(file);
        });
        // reset input
        e.target.value = '';
    };
    const handleRemovePhoto = (index) => {
        setAttachedPhotos((prev) => prev.filter((_, idx) => idx !== index));
    };
    const handleSaveEntry = (e) => {
        e.preventDefault();
        if (!entryTitle.trim() && !entryContent.trim())
            return;
        const parsedTags = entryTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        if (editingEntryId) {
            updateJournalEntry(editingEntryId, {
                date: entryDate,
                time: entryTime,
                title: entryTitle.trim() || 'Untitled Reflection',
                content: entryContent.trim(),
                mood: entryMood,
                tags: parsedTags,
                photos: attachedPhotos,
            });
            setEditingEntryId(null);
        }
        else {
            addJournalEntry({
                date: entryDate,
                time: entryTime,
                title: entryTitle.trim() || 'Daily Reflection',
                content: entryContent.trim(),
                mood: entryMood,
                tags: parsedTags,
                photos: attachedPhotos,
            });
        }
        // Reset form
        setEntryTitle('');
        setEntryContent('');
        setEntryTags('');
        setAttachedPhotos([]);
        setActiveView('history');
    };
    const handleEditClick = (entry) => {
        setEditingEntryId(entry.id);
        setEntryDate(entry.date);
        setEntryTime(entry.time || currentTimeStr);
        setEntryTitle(entry.title);
        setEntryContent(entry.content);
        setEntryMood(entry.mood || 'Productive');
        setEntryTags((entry.tags || []).join(', '));
        setAttachedPhotos(entry.photos || []);
        setActiveView('write');
    };
    const handleCancelEdit = () => {
        setEditingEntryId(null);
        setEntryTitle('');
        setEntryContent('');
        setEntryTags('');
        setAttachedPhotos([]);
        setEntryDate(todayStr);
    };
    const entries = state.journalEntries || [];
    const filteredEntries = entries.filter((item) => {
        const matchesSearch = searchQuery.trim() === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.date.includes(searchQuery) ||
            (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesMood = filterMood === 'All' || item.mood === filterMood;
        return matchesSearch && matchesMood;
    });
    return (<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-[#f4f5f0] max-w-5xl w-full rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#e2e5dc]">
        {/* Header */}
        <div className="bg-[#141716] text-white p-4 sm:p-5 flex justify-between items-center no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c4f223] text-[#141716] flex items-center justify-center font-black shadow-sm">
              <BookOpen className="w-5 h-5 text-[#141716]"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wider uppercase text-white">
                  Personal Journal & Diary
                </h3>
                <span className="text-[10px] bg-[#c4f223]/20 text-[#c4f223] px-2 py-0.2 rounded-full font-bold">
                  {entries.length} Memories Saved
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Record your daily reflections, thoughts, and attach memorable photos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => triggerPrint('Personal Diary & Journal', '#journal-entries-container')} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1.5" title="Print Journal A4">
              <Printer className="w-4 h-4"/>
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-[#e2e5dc] px-6 py-2.5 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
            <button type="button" onClick={() => setActiveView('write')} className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeView === 'write'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
              <Edit3 className="w-3.5 h-3.5"/>
              <span>{editingEntryId ? 'Edit Entry' : 'Write Entry'}</span>
            </button>
            <button type="button" onClick={() => setActiveView('history')} className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeView === 'history'
            ? 'bg-[#141716] text-[#c4f223] shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
              <BookOpen className="w-3.5 h-3.5"/>
              <span>Past Entries ({entries.length})</span>
            </button>
          </div>

          <div className="text-xs font-bold text-slate-500 hidden sm:flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-800"/>
            <span>Today: {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
          {activeView === 'write' ? (
        /* Write / Edit View */
        <form onSubmit={handleSaveEntry} className="space-y-5 max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
                {editingEntryId && (<div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-900">
                      ✏️ Editing existing diary entry for {entryDate}
                    </span>
                    <button type="button" onClick={handleCancelEdit} className="text-amber-800 hover:text-amber-950 font-black underline cursor-pointer">
                      Cancel Edit
                    </button>
                  </div>)}

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                      Diary Entry Date
                    </label>
                    <div className="relative">
                      <input type="date" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#141716]"/>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                      Time
                    </label>
                    <input type="text" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} placeholder="e.g. 08:30 PM" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#141716]"/>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                      Quick Set
                    </label>
                    <button type="button" onClick={() => setEntryDate(todayStr)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">
                      Set to Today
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                    Entry Title / Today's Theme
                  </label>
                  <input type="text" required placeholder="e.g. Focused morning at library, evening walk & design work..." value={entryTitle} onChange={(e) => setEntryTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-extrabold text-[#141716] focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
                </div>

                {/* Mood Selector */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1.5">
                    How was your mood today?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => {
                const isSelected = entryMood === m.label;
                return (<button key={m.label} type="button" onClick={() => setEntryMood(m.label)} className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${isSelected
                        ? 'bg-[#141716] text-[#c4f223] border-[#141716] shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}>
                          <span>{m.icon}</span>
                          <span>{m.label}</span>
                        </button>);
            })}
                  </div>
                </div>

                {/* Content / Thoughts */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                    Journal Content & Reflections
                  </label>
                  <textarea rows={8} required placeholder="Write your day's thoughts, experiences, academic progress, conversations, or lessons learned..." value={entryContent} onChange={(e) => setEntryContent(e.target.value)} className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-[#141716] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
                </div>

                {/* Attached Pictures / Photos ("PICTURE ATTACH CHEYYAN PATTANAM") */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-800"/>
                      <span>Attached Pictures & Photos ({attachedPhotos.length})</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Attach photos from camera or device</span>
                  </div>

                  {/* Photo Thumbnails */}
                  {attachedPhotos.length > 0 && (<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {attachedPhotos.map((photo, idx) => (<div key={idx} className="relative group w-full h-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs">
                          <img src={photo} alt={`Attached ${idx + 1}`} className="w-full h-full object-cover"/>
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button type="button" onClick={() => setPreviewPhoto(photo)} className="p-1 bg-white text-slate-800 rounded-lg shadow-sm hover:bg-slate-100" title="View Full Size">
                              <Maximize2 className="w-3.5 h-3.5"/>
                            </button>
                            <button type="button" onClick={() => handleRemovePhoto(idx)} className="p-1 bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-700" title="Delete Photo">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </div>))}
                    </div>)}

                  {/* Add Picture Button */}
                  <label className="w-full border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20">
                    <ImageIcon className="w-5 h-5 text-emerald-800"/>
                    <span className="text-xs font-bold text-slate-700">
                      + Attach Photos to this Diary Entry
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      (PNG, JPG, Camera Snaps)
                    </span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
                  </label>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input type="text" placeholder="e.g. Study, Design, Family, Trip, Ideas" value={entryTags} onChange={(e) => setEntryTags(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-[#141716]"/>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex gap-3">
                  <button type="submit" className="w-full btn-neon py-3 text-xs font-black tracking-wider uppercase rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2">
                    <Check className="w-4 h-4"/>
                    <span>{editingEntryId ? 'Update Diary Entry' : 'Save To Diary Portal'}</span>
                  </button>
                </div>
              </div>
            </form>) : (
        /* History & Memories View */
        <div id="journal-entries-container" className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-3xl border border-[#e2e5dc] shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
                  <input type="text" placeholder="Search memories, dates, tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold"/>
                </div>

                {/* Mood Pills */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                  <button type="button" onClick={() => setFilterMood('All')} className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${filterMood === 'All'
                ? 'bg-[#141716] text-[#c4f223] shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    All Moods
                  </button>
                  {moods.map((m) => (<button key={m.label} type="button" onClick={() => setFilterMood(m.label)} className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${filterMood === m.label
                    ? 'bg-[#141716] text-[#c4f223] shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      <span>{m.icon}</span>
                      <span className="hidden md:inline">{m.label}</span>
                    </button>))}
                </div>
              </div>

              {/* Entries Timeline List */}
              <div className="space-y-4">
                {filteredEntries.length > 0 ? (filteredEntries.map((entry) => {
                const moodConfig = moods.find((m) => m.label === entry.mood);
                return (<div key={entry.id} className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4 hover:border-emerald-300 transition-colors">
                        {/* Entry Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="flex items-center gap-1.5 bg-[#141716] text-[#c4f223] px-3 py-1 rounded-xl text-xs font-black shadow-2xs">
                              <Calendar className="w-3.5 h-3.5"/>
                              <span>{entry.date}</span>
                            </span>
                            {entry.time && (<span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3"/>
                                <span>{entry.time}</span>
                              </span>)}
                            {moodConfig && (<span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${moodConfig.bg} ${moodConfig.text}`}>
                                <span>{moodConfig.icon}</span>
                                <span>{moodConfig.label}</span>
                              </span>)}
                          </div>

                          <div className="flex items-center gap-1.5 no-print">
                            <button type="button" onClick={() => handleEditClick(entry)} className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer" title="Edit Entry">
                              <Edit3 className="w-3.5 h-3.5"/>
                              <span className="text-[10px]">Edit</span>
                            </button>
                            <button type="button" onClick={() => deleteJournalEntry(entry.id)} className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-lg cursor-pointer" title="Delete Entry">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </div>

                        {/* Title & Body */}
                        <div>
                          <h4 className="text-base font-black text-[#141716] tracking-tight mb-2">
                            {entry.title}
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        </div>

                        {/* Attached Photos Gallery */}
                        {entry.photos && entry.photos.length > 0 && (<div className="pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-2">
                              Photo Memories ({entry.photos.length})
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {entry.photos.map((imgUrl, i) => (<div key={i} onClick={() => setPreviewPhoto(imgUrl)} className="relative group w-full h-32 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-shadow">
                                  <img src={imgUrl} alt={`Memory ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="w-4 h-4 text-white"/>
                                  </div>
                                </div>))}
                            </div>
                          </div>)}

                        {/* Tags */}
                        {entry.tags && entry.tags.length > 0 && (<div className="flex flex-wrap gap-1.5 pt-1">
                            {entry.tags.map((tag, tIdx) => (<span key={tIdx} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                #{tag}
                              </span>))}
                          </div>)}
                      </div>);
            })) : (<div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                    <p className="text-sm font-bold text-slate-600">No diary entries found.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Start writing today's memories and reflections in the "Write Entry" tab.
                    </p>
                    <button type="button" onClick={() => setActiveView('write')} className="mt-3 btn-neon px-4 py-2 text-xs font-black rounded-xl cursor-pointer">
                      Write First Memory
                    </button>
                  </div>)}
              </div>
            </div>)}
        </div>
      </div>

      {/* Full Photo Preview Modal */}
      {previewPhoto && (<div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" onClick={() => setPreviewPhoto(null)}>
          <div className="relative max-w-3xl max-h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl p-2">
            <button onClick={() => setPreviewPhoto(null)} className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full cursor-pointer z-10">
              <X className="w-5 h-5"/>
            </button>
            <img src={previewPhoto} alt="Enlarged Memory" className="max-h-[80vh] w-auto max-w-full object-contain mx-auto rounded-2xl"/>
          </div>
        </div>)}
    </div>);
};
