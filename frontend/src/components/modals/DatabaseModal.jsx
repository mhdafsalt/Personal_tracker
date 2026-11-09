import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, Server, Layers, Code2, X, ExternalLink, Sparkles, } from 'lucide-react';
export const DatabaseModal = ({ isOpen, onClose }) => {
    const { mongoStatus, refreshMongoStatus, syncNowWithDatabase } = useWorkspace();
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncFeedback, setSyncFeedback] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);
    const [activeTab, setActiveTab] = useState('status');
    if (!isOpen)
        return null;
    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };
    const handleSyncNow = async () => {
        setIsSyncing(true);
        setSyncFeedback(null);
        try {
            const res = await syncNowWithDatabase();
            setSyncFeedback(res.message);
        }
        finally {
            setIsSyncing(false);
        }
    };
    const sampleUri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/pk_workspace?retryWrites=true&w=majority';
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2e5dc] flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#141716] text-white p-6 rounded-t-3xl border-b border-slate-800 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c4f223] text-[#141716] flex items-center justify-center font-black">
              <Database className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white uppercase">
                  Full-Stack Architecture & MongoDB Hub
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${mongoStatus.connected
            ? 'bg-emerald-400 text-emerald-950'
            : mongoStatus.configured
                ? 'bg-amber-400 text-amber-950'
                : 'bg-slate-700 text-slate-200'}`}>
                  {mongoStatus.connected
            ? 'Connected'
            : mongoStatus.configured
                ? 'Connecting'
                : 'Local Buffer Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Frontend: Next.js/React · Backend: Node.js (Express) · Database: MongoDB Atlas
              </p>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-150 bg-slate-50">
          <button type="button" onClick={() => setActiveTab('status')} className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'status'
            ? 'border-[#141716] text-[#141716] bg-white'
            : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Server className="w-3.5 h-3.5"/>
            <span>Connection & Sync</span>
          </button>
          <button type="button" onClick={() => setActiveTab('setup')} className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'setup'
            ? 'border-[#141716] text-[#141716] bg-white'
            : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Database className="w-3.5 h-3.5"/>
            <span>MongoDB Atlas Setup Guide</span>
          </button>
          <button type="button" onClick={() => setActiveTab('nextjs')} className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'nextjs'
            ? 'border-[#141716] text-[#141716] bg-white'
            : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Layers className="w-3.5 h-3.5"/>
            <span>Next.js Deployment Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {activeTab === 'status' && (<div className="space-y-6">
              {/* Architecture 3-Tier Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                    Tier 1 · Frontend
                  </span>
                  <p className="text-sm font-black text-[#141716] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700"/>
                    <span>Next.js / React 19</span>
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tailwind CSS, dynamic client state, and responsive component UI.
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 mt-1">
                    Live Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                    Tier 2 · Backend
                  </span>
                  <p className="text-sm font-black text-[#141716] flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-700"/>
                    <span>Node.js & Express</span>
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Active server (`server.ts`), Mongoose ODM, and REST API endpoints.
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 mt-1">
                    Live on Port 3000
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                    Tier 3 · Database
                  </span>
                  <p className="text-sm font-black text-[#141716] flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-700"/>
                    <span>MongoDB (Atlas)</span>
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Cloud NoSQL document database for complete workspace persistence.
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black mt-1 ${mongoStatus.connected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'}`}>
                    {mongoStatus.connected ? 'Cloud Connected' : 'Local Buffer Active'}
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${mongoStatus.connected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
                <div className="flex items-start gap-3">
                  {mongoStatus.connected ? (<CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"/>) : (<AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0"/>)}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      {mongoStatus.connected
                ? 'MongoDB Cloud Database is Connected & Active'
                : 'Operating with Local Buffer & Browser Storage'}
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90">
                      {mongoStatus.connected
                ? `Connected to database "${mongoStatus.database || 'pk_workspace'}" at host: ${mongoStatus.host || 'MongoDB Atlas'}. All changes auto-sync to cloud.`
                : 'Your data is safely stored in local browser storage. To enable cloud MongoDB persistence across all devices, follow the setup guide below to add your MONGODB_URI.'}
                    </p>
                    {mongoStatus.error && (<p className="text-[11px] text-rose-700 font-bold mt-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                        Connection warning: {mongoStatus.error}
                      </p>)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => refreshMongoStatus()} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer" title="Refresh connection status">
                    <RefreshCw className="w-4 h-4"/>
                  </button>
                  <button type="button" onClick={handleSyncNow} disabled={isSyncing} className="btn-neon px-3.5 py-2 text-xs font-black cursor-pointer shadow-xs disabled:opacity-50">
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              </div>

              {syncFeedback && (<div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                  {syncFeedback}
                </div>)}

              {/* API Endpoints Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#141716] tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-800"/>
                  <span>Configured Node.js Backend API Endpoints</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-emerald-700">GET /api/workspace</span>
                    <span className="text-slate-500 font-sans text-[11px]">
                      Loads complete workspace state from MongoDB
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-blue-700">POST /api/workspace</span>
                    <span className="text-slate-500 font-sans text-[11px]">
                      Upserts and auto-saves tasks, study tracks, & journals to MongoDB
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-purple-700">GET /api/mongodb/status</span>
                    <span className="text-slate-500 font-sans text-[11px]">
                      Live health & connection check for MongoDB
                    </span>
                  </div>
                </div>
              </div>
            </div>)}

          {activeTab === 'setup' && (<div className="space-y-5 text-xs">
              <div className="bg-[#c4f223]/20 p-4 rounded-2xl border border-[#c4f223]/50">
                <h4 className="font-black text-[#141716] text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800"/>
                  <span>How to connect your MongoDB Atlas (Free Tier)</span>
                </h4>
                <p className="text-slate-700 text-xs mt-1">
                  Follow these 5 simple steps to get your free cloud database and connect it to your
                  workspace:
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#141716] text-xs">
                    Step 1: Sign up for Free MongoDB Atlas
                  </span>
                  <a href="https://www.mongodb.com/cloud/atlas/register" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline">
                    <span>mongodb.com</span>
                    <ExternalLink className="w-3 h-3"/>
                  </a>
                </div>
                <p className="text-slate-600">
                  Go to MongoDB Atlas and create a free account. Select the <strong>M0 Free Cluster</strong> (512 MB free storage, lifetime free).
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-black text-[#141716] text-xs block">
                  Step 2: Create a Database User & Password
                </span>
                <p className="text-slate-600">
                  In MongoDB Atlas, navigate to <strong>Security → Database Access</strong>. Click <strong>Add New Database User</strong>. Set a username (e.g. <code>anas_admin</code>) and a secure password. Choose <strong>Read and write to any database</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-black text-[#141716] text-xs block">
                  Step 3: Allow Network Access (IP Access List)
                </span>
                <p className="text-slate-600">
                  Go to <strong>Security → Network Access</strong>. Click <strong>Add IP Address</strong>, then select <strong>Allow Access from Anywhere</strong> (<code>0.0.0.0/0</code>) so your backend can reach the cluster from any cloud host.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-black text-[#141716] text-xs block">
                  Step 4: Copy the Connection String (URI)
                </span>
                <p className="text-slate-600">
                  Click <strong>Connect → Drivers (Node.js)</strong>. Copy the connection string. It looks like this:
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-[#c4f223] font-mono text-[11px] overflow-x-auto">
                  <span className="truncate pr-2">{sampleUri}</span>
                  <button type="button" onClick={() => handleCopy(sampleUri, 'uri')} className="p-1 rounded hover:bg-slate-800 text-white shrink-0 cursor-pointer" title="Copy sample connection string">
                    {copiedKey === 'uri' ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
                  </button>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="font-black text-emerald-950 text-xs block">
                  Step 5: Set MONGODB_URI in Environment / Secrets
                </span>
                <p className="text-emerald-900">
                  Replace <code>&lt;username&gt;</code> and <code>&lt;password&gt;</code> with your actual database credentials and paste into your <code>.env</code> file or AI Studio Secrets panel:
                </p>
                <div className="p-2.5 rounded-xl bg-[#141716] text-white font-mono text-[11px] flex items-center justify-between">
                  <span>MONGODB_URI=&quot;{sampleUri}&quot;</span>
                  <button type="button" onClick={() => handleCopy(`MONGODB_URI="${sampleUri}"`, 'env')} className="p-1 rounded hover:bg-slate-800 text-[#c4f223] shrink-0 cursor-pointer">
                    {copiedKey === 'env' ? <Check className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>}
                  </button>
                </div>
                <p className="text-[11px] text-emerald-800 font-bold mt-1">
                  ✓ Once set, restart your dev server. The app will immediately display &ldquo;Connected&rdquo; and persist all your data directly in MongoDB!
                </p>
              </div>
            </div>)}

          {activeTab === 'nextjs' && (<div className="space-y-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-black text-[#141716] text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-800"/>
                  <span>Next.js Compatibility & Export Guide</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Every component in this application is authored in standard <strong>React 19, TypeScript, and Tailwind CSS</strong>.
                  If you deploy this project with Next.js (App Router or Pages Router) outside AI Studio (e.g. on Vercel or your own VPS), it works seamlessly:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <span className="font-black text-[#141716] text-xs block">
                  How Next.js routes map to this codebase:
                </span>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-150 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong>Frontend (`app/page.tsx`):</strong>
                      <p className="text-[11px] text-slate-500">
                        Add <code>&quot;use client&quot;;</code> at the top of <code>src/App.tsx</code> to render as a client component with our interactive tabs and context provider.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-150 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong>Backend (`app/api/workspace/route.ts`):</strong>
                      <p className="text-[11px] text-slate-500">
                        Next.js Route Handlers map 1:1 to our Node.js Express endpoints (<code>GET</code> and <code>POST</code>) using the same Mongoose model.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-150 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong>Database (`mongoose`):</strong>
                      <p className="text-[11px] text-slate-500">
                        The same <code>MONGODB_URI</code> environment variable connects to your MongoDB cluster both in development and production.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Sample Next.js route snippet */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#c4f223] font-bold">
                    Next.js App Router API Route (`app/api/workspace/route.ts`):
                  </span>
                  <button type="button" onClick={() => handleCopy(`import { NextResponse } from 'next/server';\nimport mongoose from 'mongoose';\n// Connects to MongoDB and returns or saves workspace state`, 'code')} className="p-1 rounded hover:bg-slate-800 text-white cursor-pointer">
                    {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
                  </button>
                </div>
                <pre className="font-mono text-[10px] leading-relaxed overflow-x-auto text-slate-300 p-2 bg-black/40 rounded-xl">
            {`export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const data = await WorkspaceModel.findOne({ workspaceId: 'muhammed_anas_default' });
  return NextResponse.json({ state: data?.state });
}

export async function POST(req: Request) {
  const { state } = await req.json();
  await mongoose.connect(process.env.MONGODB_URI!);
  await WorkspaceModel.findOneAndUpdate(
    { workspaceId: 'muhammed_anas_default' },
    { state, updatedAt: new Date() },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}`}
                </pre>
              </div>
            </div>)}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-150 rounded-b-3xl flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">
            Status: {mongoStatus.connected ? 'Connected to MongoDB Atlas' : 'Local Storage Mode'}
          </span>
          <button type="button" onClick={onClose} className="px-5 py-2 bg-[#141716] text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>);
};
