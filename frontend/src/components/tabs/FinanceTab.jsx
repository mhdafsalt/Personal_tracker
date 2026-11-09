import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank, ShoppingCart, Building, Upload, Printer, Trash2, Copy, Check, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const FinanceTab = () => {
    const { state, netFinanceAvailable, addReceivable, toggleReceivable, deleteReceivable, addPayable, togglePayable, deletePayable, addSaving, deleteSaving, addNeed, toggleNeed, deleteNeed, updateBankDetails, } = useWorkspace();
    // Receivables form
    const [recName, setRecName] = useState('');
    const [recAmt, setRecAmt] = useState('');
    const [recDate, setRecDate] = useState('');
    // Payables form
    const [payName, setPayName] = useState('');
    const [payAmt, setPayAmt] = useState('');
    const [payDate, setPayDate] = useState('');
    // Savings form
    const [savName, setSavName] = useState('');
    const [savAmt, setSavAmt] = useState('');
    // Needs form
    const [needName, setNeedName] = useState('');
    const [needAmt, setNeedAmt] = useState('');
    const [copiedField, setCopiedField] = useState(null);
    const totalReceivables = state.finance.receivables.filter((r) => !r.completed).reduce((s, r) => s + r.amount, 0);
    const totalPayables = state.finance.payables.filter((p) => !p.completed).reduce((s, p) => s + p.amount, 0);
    const totalSavings = state.finance.savings.reduce((s, x) => s + x.amount, 0);
    const totalNeeds = state.finance.needs.filter((n) => !n.completed).reduce((s, n) => s + n.amount, 0);
    const fmt = (num) => '₹' + num.toLocaleString('en-IN');
    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };
    const handleQRUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (dataUrl) {
                updateBankDetails({ qrCode: dataUrl });
            }
        };
        reader.readAsDataURL(file);
    };
    const handleAddRec = (e) => {
        e.preventDefault();
        if (!recName.trim() || !recAmt)
            return;
        addReceivable(recName.trim(), parseFloat(recAmt), recDate);
        setRecName('');
        setRecAmt('');
        setRecDate('');
    };
    const handleAddPay = (e) => {
        e.preventDefault();
        if (!payName.trim() || !payAmt)
            return;
        addPayable(payName.trim(), parseFloat(payAmt), payDate);
        setPayName('');
        setPayAmt('');
        setPayDate('');
    };
    const handleAddSav = (e) => {
        e.preventDefault();
        if (!savName.trim() || !savAmt)
            return;
        addSaving(savName.trim(), parseFloat(savAmt));
        setSavName('');
        setSavAmt('');
    };
    const handleAddNeed = (e) => {
        e.preventDefault();
        if (!needName.trim() || !needAmt)
            return;
        addNeed(needName.trim(), parseFloat(needAmt));
        setNeedName('');
        setNeedAmt('');
    };
    const bank = state.finance.bankDetails;
    return (<div className="space-y-8">
      {/* Top Banner & Net Tally */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e5dc] shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#141716] tracking-tight flex items-center gap-2.5">
              <Wallet className="w-8 h-8 text-emerald-800"/>
              <span>Financial Hub & Ledger</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#c4f223] text-[#141716] uppercase">
              Live Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Track money owed, payables, liquid savings, and your final calculated available net tally.
          </p>
        </div>

        {/* Highlighted Net Tally Badge */}
        <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 text-center shadow-2xs min-w-[220px]">
          <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest mb-0.5">
            Net Available Tally
          </p>
          <p className={`text-3xl font-black tracking-tight ${netFinanceAvailable >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {fmt(netFinanceAvailable)}
          </p>
          <p className="text-[9px] text-emerald-600 font-bold mt-1">
            (Savings + Receivables - Payables)
          </p>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#e2e5dc] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Receivables (To Receive)
            </p>
            <p className="text-xl font-black text-emerald-600">{fmt(totalReceivables)}</p>
          </div>
          <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <ArrowDownLeft className="w-5 h-5"/>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2e5dc] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Payables (To Pay)
            </p>
            <p className="text-xl font-black text-rose-500">{fmt(totalPayables)}</p>
          </div>
          <div className="h-11 w-11 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100">
            <ArrowUpRight className="w-5 h-5"/>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2e5dc] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Current Savings Vault
            </p>
            <p className="text-xl font-black text-blue-600">{fmt(totalSavings)}</p>
          </div>
          <div className="h-11 w-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <PiggyBank className="w-5 h-5"/>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2e5dc] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Future Needs & Goals
            </p>
            <p className="text-xl font-black text-amber-600">{fmt(totalNeeds)}</p>
          </div>
          <div className="h-11 w-11 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <ShoppingCart className="w-5 h-5"/>
          </div>
        </div>
      </div>

      {/* Main Two-Column Structure: Ledgers + Bank Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (6 cols): Receivables & Payables */}
        <div className="lg:col-span-6 space-y-6">
          {/* Receivables */}
          <div id="section-finance-receivables" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600"/>
                <span>Receivables (Money to Receive)</span>
              </h3>
              <button onClick={triggerPrint} className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer no-print">
                <Printer className="w-3 h-3"/>
                <span>Print A4</span>
              </button>
            </div>

            <form onSubmit={handleAddRec} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 space-y-2 no-print">
              <input type="text" required placeholder="Person / Source Name..." value={recName} onChange={(e) => setRecName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <div className="flex gap-2">
                <input type="number" required placeholder="Amount (₹)..." value={recAmt} onChange={(e) => setRecAmt(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <input type="date" value={recDate} onChange={(e) => setRecDate(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
              </div>
              <button type="submit" className="w-full btn-neon py-2 text-xs font-black shadow-xs cursor-pointer">
                Add Receivable Entry
              </button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {state.finance.receivables.length > 0 ? (state.finance.receivables.map((r) => (<div key={r.id} className={`flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs shadow-2xs ${r.completed ? 'opacity-60 bg-slate-100/60' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={r.completed} onChange={() => toggleReceivable(r.id)} className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"/>
                      <div>
                        <p className={`font-extrabold ${r.completed ? 'line-through text-slate-400' : 'text-[#141716]'}`}>
                          {r.name}
                        </p>
                        {r.date && (<span className="text-[10px] text-slate-500 font-semibold block">
                            Due: {r.date}
                          </span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-emerald-600 text-sm tabular-nums">
                        {fmt(r.amount)}
                      </span>
                      <button onClick={() => deleteReceivable(r.id)} className="text-slate-300 hover:text-rose-500 p-1">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>))) : (<p className="text-xs text-slate-400 italic py-2 text-center">No receivables recorded.</p>)}
            </div>
          </div>

          {/* Payables */}
          <div id="section-finance-payables" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-rose-500"/>
                <span>Payables (Money to Pay)</span>
              </h3>
              <button onClick={triggerPrint} className="text-[10px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer no-print">
                <Printer className="w-3 h-3"/>
                <span>Print A4</span>
              </button>
            </div>

            <form onSubmit={handleAddPay} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 space-y-2 no-print">
              <input type="text" required placeholder="Person / Purpose Name..." value={payName} onChange={(e) => setPayName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <div className="flex gap-2">
                <input type="number" required placeholder="Amount (₹)..." value={payAmt} onChange={(e) => setPayAmt(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium"/>
              </div>
              <button type="submit" className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer">
                Add Payable Entry
              </button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {state.finance.payables.length > 0 ? (state.finance.payables.map((p) => (<div key={p.id} className={`flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs shadow-2xs ${p.completed ? 'opacity-60 bg-slate-100/60' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={p.completed} onChange={() => togglePayable(p.id)} className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer"/>
                      <div>
                        <p className={`font-extrabold ${p.completed ? 'line-through text-slate-400' : 'text-[#141716]'}`}>
                          {p.name}
                        </p>
                        {p.date && (<span className="text-[10px] text-slate-500 font-semibold block">
                            Due: {p.date}
                          </span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-rose-500 text-sm tabular-nums">
                        {fmt(p.amount)}
                      </span>
                      <button onClick={() => deletePayable(p.id)} className="text-slate-300 hover:text-rose-500 p-1">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>))) : (<p className="text-xs text-slate-400 italic py-2 text-center">No payables recorded.</p>)}
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Bank Details Card, Savings & Needs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Bank & Payment Card */}
          <div id="section-finance-payment" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-800"/>
                <span>Bank & Payment Details</span>
              </h3>
              <button onClick={() => triggerPrint('Bank & Payment Details', '#section-finance-payment')} className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg flex items-center gap-1 no-print cursor-pointer">
                <Printer className="w-3 h-3"/>
                <span>Share PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Account Data Fields */}
              <div className="md:col-span-8 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Bank Name:</span>
                  <input type="text" value={bank.bankName} onChange={(e) => updateBankDetails({ bankName: e.target.value })} className="font-bold text-[#141716] bg-transparent text-right outline-none"/>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Account Holder:</span>
                  <input type="text" value={bank.accName} onChange={(e) => updateBankDetails({ accName: e.target.value })} className="font-bold text-[#141716] bg-transparent text-right outline-none"/>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Account Number:</span>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={bank.accNumber} onChange={(e) => updateBankDetails({ accNumber: e.target.value })} className="font-mono font-black text-indigo-700 bg-transparent text-right outline-none tracking-wider"/>
                    <button onClick={() => copyToClipboard(bank.accNumber, 'acc')} title="Copy Account Number" className="text-slate-400 hover:text-slate-700 no-print">
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600"/> : <Copy className="w-3.5 h-3.5"/>}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">IFSC Code:</span>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={bank.ifsc} onChange={(e) => updateBankDetails({ ifsc: e.target.value })} className="font-mono font-bold text-[#141716] bg-transparent text-right outline-none"/>
                    <button onClick={() => copyToClipboard(bank.ifsc, 'ifsc')} className="text-slate-400 hover:text-slate-700 no-print">
                      {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600"/> : <Copy className="w-3.5 h-3.5"/>}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 pt-2">
                  <span className="text-slate-400 font-bold">GPay / Phone Number:</span>
                  <input type="text" value={bank.gpayNumber} onChange={(e) => updateBankDetails({ gpayNumber: e.target.value })} className="font-mono font-bold text-[#141716] bg-transparent text-right outline-none"/>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">UPI ID:</span>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={bank.upiId} onChange={(e) => updateBankDetails({ upiId: e.target.value })} className="font-bold text-emerald-800 bg-transparent text-right outline-none"/>
                    <button onClick={() => copyToClipboard(bank.upiId, 'upi')} className="text-slate-400 hover:text-slate-700 no-print">
                      {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600"/> : <Copy className="w-3.5 h-3.5"/>}
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                <div className="relative group w-36 h-36 bg-white rounded-2xl border-2 border-slate-150 p-2 shadow-xs flex items-center justify-center overflow-hidden">
                  <img src={bank.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${encodeURIComponent(bank.upiId)}`} alt="Scan to Pay" className="w-full h-full object-contain"/>
                  <label className="absolute inset-0 bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold no-print">
                    <Upload className="w-4 h-4 mb-1"/>
                    <span>Upload QR</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleQRUpload}/>
                  </label>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Scan to Pay (UPI)
                </span>
              </div>
            </div>
          </div>

          {/* Savings Vault */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-blue-600"/>
                <span>Savings Vault & Deposits</span>
              </h3>
              <span className="text-xs font-black text-blue-600">{fmt(totalSavings)}</span>
            </div>

            <form onSubmit={handleAddSav} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 space-y-2 no-print">
              <input type="text" required placeholder="Savings Target / Source..." value={savName} onChange={(e) => setSavName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <div className="flex gap-2">
                <input type="number" required placeholder="Amount (₹)..." value={savAmt} onChange={(e) => setSavAmt(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <button type="submit" className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow-xs">
                  Save Deposit
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {state.finance.savings.map((s) => (<div key={s.id} className="flex justify-between items-center p-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-xs">
                  <span className="font-extrabold text-[#141716]">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-blue-700">{fmt(s.amount)}</span>
                    <button onClick={() => deleteSaving(s.id)} className="text-slate-300 hover:text-rose-500 p-1">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Future Needs */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-600"/>
                <span>Future Needs & Planned Purchases</span>
              </h3>
              <span className="text-xs font-black text-amber-600">{fmt(totalNeeds)}</span>
            </div>

            <form onSubmit={handleAddNeed} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 space-y-2 no-print">
              <input type="text" required placeholder="What do you need?..." value={needName} onChange={(e) => setNeedName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
              <div className="flex gap-2">
                <input type="number" required placeholder="Est. Amount (₹)..." value={needAmt} onChange={(e) => setNeedAmt(e.target.value)} className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                <button type="submit" className="w-1/2 btn-neon py-2 text-xs font-black cursor-pointer shadow-xs">
                  Add Need
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {state.finance.needs.map((n) => (<div key={n.id} className={`flex items-center justify-between p-3 rounded-2xl bg-amber-50/40 border border-amber-100 text-xs ${n.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={n.completed} onChange={() => toggleNeed(n.id)} className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"/>
                    <span className={`font-extrabold ${n.completed ? 'line-through text-slate-400' : 'text-[#141716]'}`}>
                      {n.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-amber-700">{fmt(n.amount)}</span>
                    <button onClick={() => deleteNeed(n.id)} className="text-slate-300 hover:text-rose-500 p-1">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
