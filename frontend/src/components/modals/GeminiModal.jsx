import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sparkles, Send, Plus, Trash2, X, MessageSquare, Bot, User, Menu, } from 'lucide-react';
export const GeminiModal = ({ isOpen, onClose }) => {
    const { state, currentGeminiSessionId, setCurrentGeminiSessionId, createGeminiSession, deleteGeminiSession, addChatMessage, clearSessionMessages, } = useWorkspace();
    const [inputQuery, setInputQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const currentSession = state.geminiSessions.find((s) => s.id === currentGeminiSessionId) || state.geminiSessions[0];
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentSession?.messages, isLoading]);
    if (!isOpen)
        return null;
    const handleSend = async (e) => {
        if (e)
            e.preventDefault();
        const query = inputQuery.trim();
        if (!query || isLoading || !currentSession)
            return;
        setInputQuery('');
        // Add user message to state
        addChatMessage(currentSession.id, { role: 'user', text: query });
        setIsLoading(true);
        try {
            // Build updated conversation array
            const allMessages = [...currentSession.messages, { role: 'user', text: query }];
            const workspaceContext = {
                myself: {
                    fullName: state.myself.fullName,
                    dob: state.myself.dob,
                    phone: state.myself.phone,
                },
                studyTracks: state.studyTracks,
                exams: state.exams,
                todos: state.todos.filter((t) => !t.completed),
                designProjects: state.designProjects,
                finance: {
                    netAvailableTally: state.finance.savings.reduce((a, b) => a + b.amount, 0) +
                        state.finance.receivables.filter((r) => !r.completed).reduce((a, b) => a + b.amount, 0) -
                        state.finance.payables.filter((p) => !p.completed).reduce((a, b) => a + b.amount, 0),
                    receivablesPending: state.finance.receivables.filter((r) => !r.completed),
                    payablesPending: state.finance.payables.filter((p) => !p.completed),
                    savingsVault: state.finance.savings,
                },
                travels: state.travels,
                events: state.events,
            };
            const res = await fetch('/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: allMessages,
                    workspaceContext,
                }),
            });
            const data = await res.json();
            const reply = data.reply || "Sorry, I couldn't generate a response.";
            addChatMessage(currentSession.id, { role: 'model', text: reply });
        }
        catch (err) {
            console.error('Failed to query Gemini assistant', err);
            addChatMessage(currentSession.id, {
                role: 'model',
                text: 'Sorry Anas, a connection error occurred while contacting the Gemini service. Please check your network or API settings.',
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const formatText = (text) => {
        // Simple clean markdown formatter
        const lines = text.split('\n');
        return lines.map((line, idx) => {
            let content = line;
            // Bold **text**
            const boldParts = content.split(/(\*\*.*?\*\*)/g);
            return (<span key={idx} className="block min-h-[1.2em]">
          {boldParts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={pIdx} className="font-extrabold text-[#141716]">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
        </span>);
        });
    };
    return (<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 no-print">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl flex flex-col h-[90vh] sm:h-[86vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-white px-4 py-3.5 border-b border-slate-200 flex justify-between items-center text-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
              <Menu className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#c4f223] text-[#141716] flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4"/>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#141716] flex items-center gap-1.5">
                  <span>PK's Gemini Advanced Assistant</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.2 rounded-full uppercase">
                    Live
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content body with sidebar & chat box */}
        <div className="flex flex-grow overflow-hidden relative">
          {/* Chat Sessions Sidebar */}
          <div className={`absolute lg:relative z-20 w-64 h-full bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-3 border-b border-slate-200 bg-white">
              <button onClick={() => {
            createGeminiSession();
            setIsSidebarOpen(false);
        }} className="w-full bg-white border border-slate-200 hover:border-[#c4f223] text-[#141716] font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-xs cursor-pointer">
                <Plus className="w-4 h-4 text-emerald-700"/>
                <span>New Chat Session</span>
              </button>
            </div>

            <div className="px-3.5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Recent Chats
            </div>

            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              {state.geminiSessions.map((session) => {
            const isActive = session.id === currentGeminiSessionId;
            return (<div key={session.id} onClick={() => {
                    setCurrentGeminiSessionId(session.id);
                    setIsSidebarOpen(false);
                }} className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? 'bg-[#c4f223] text-[#141716] shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200/60'}`}>
                    <div className="flex items-center gap-2 truncate pr-1">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0"/>
                      <span className="truncate">{session.title}</span>
                    </div>
                    {state.geminiSessions.length > 1 && (<button onClick={(e) => {
                        e.stopPropagation();
                        deleteGeminiSession(session.id);
                    }} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 p-0.5">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>)}
                  </div>);
        })}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-grow flex flex-col h-full bg-white relative">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 truncate max-w-sm">
                {currentSession?.title}
              </span>
              <button onClick={() => {
            if (confirm('Clear messages in this session?')) {
                clearSessionMessages(currentSession.id);
            }
        }} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors">
                Clear Messages
              </button>
            </div>

            {/* Messages box */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm bg-slate-50/30">
              {currentSession?.messages && currentSession.messages.length > 0 ? (currentSession.messages.map((msg, idx) => (<div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                ? 'bg-[#141716] text-white'
                : 'bg-[#c4f223] text-[#141716]'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4"/> : <Bot className="w-4 h-4"/>}
                    </div>

                    <div className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] text-xs sm:text-[13px] leading-relaxed shadow-2xs ${msg.role === 'user'
                ? 'bg-[#141716] text-white rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      {formatText(msg.text)}
                    </div>
                  </div>))) : (<div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#c4f223] text-[#141716] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6"/>
                  </div>
                  <h4 className="text-sm font-black text-[#141716]">
                    How can I assist you today, Anas?
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Ask questions about your finances, check upcoming exams or tasks, calculate budgets, or brainstorm ideas. Both Malayalam & English are supported!
                  </p>
                </div>)}

              {isLoading && (<div className="flex gap-3 items-center text-slate-400 text-xs italic">
                  <div className="w-8 h-8 rounded-full bg-[#c4f223] text-[#141716] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-spin"/>
                  </div>
                  <span>Gemini is thinking with workspace context...</span>
                </div>)}

              <div ref={messagesEndRef}/>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
              <input type="text" placeholder="Ask anything, calculate finances, or search workspace..." value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c4f223]"/>
              <button type="submit" disabled={isLoading || !inputQuery.trim()} className="btn-neon px-5 py-2.5 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer shrink-0">
                <Send className="w-4 h-4"/>
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);
};
