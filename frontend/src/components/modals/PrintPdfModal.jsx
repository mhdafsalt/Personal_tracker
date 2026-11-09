import React, { useState } from 'react';
import { Printer, Download, ExternalLink, X, Loader2, CheckCircle2, } from 'lucide-react';
import { downloadElementAsPdf, openPrintableWindow } from '../../utils/pdfExport';
export const PrintPdfModal = ({ isOpen, onClose, title = 'PK Workspace Report', targetElementSelector = 'main', }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    if (!isOpen)
        return null;
    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        setDownloadSuccess(false);
        const cleanFileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
        const success = await downloadElementAsPdf(targetElementSelector, cleanFileName);
        setIsGeneratingPdf(false);
        if (success) {
            setDownloadSuccess(true);
            setTimeout(() => {
                setDownloadSuccess(false);
                onClose();
            }, 2000);
        }
    };
    const handleOpenPrintWindow = () => {
        openPrintableWindow(title, targetElementSelector);
        onClose();
    };
    const handleSystemPrint = () => {
        try {
            window.focus();
            setTimeout(() => {
                window.print();
            }, 100);
        }
        catch {
            handleDownloadPdf();
        }
    };
    return (<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 text-[#141716]">
            <div className="h-10 w-10 rounded-2xl bg-[#c4f223] text-[#141716] flex items-center justify-center font-black shadow-xs">
              <Printer className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Print & PDF Export</h3>
              <p className="text-xs text-slate-500 font-medium">Choose how you want to save or print this document</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {downloadSuccess && (<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/>
            <span>PDF file generated and downloaded successfully!</span>
          </div>)}

        {/* 3 Main Action Choices */}
        <div className="space-y-3">
          {/* Option 1: Direct PDF File Download (Guaranteed to work in iframe) */}
          <button type="button" onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="w-full p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 hover:border-emerald-300 text-left transition-all group flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                {isGeneratingPdf ? (<Loader2 className="w-5 h-5 animate-spin"/>) : (<Download className="w-5 h-5"/>)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-[#141716] text-sm">Download A4 PDF File</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.2 rounded-full uppercase">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Directly downloads a clean .pdf file to your computer. Never blocked by iframe sandboxes.
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Open in Standalone Print Window */}
          <button type="button" onClick={handleOpenPrintWindow} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-left transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#141716] text-white flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5"/>
              </div>
              <div>
                <span className="font-extrabold text-[#141716] text-sm block">Open in New Window to Print</span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Opens a full-page clean A4 layout in a new tab where browser printing is unrestricted.
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Browser Native Print Dialog */}
          <button type="button" onClick={handleSystemPrint} className="w-full p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-left transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4"/>
              </div>
              <div>
                <span className="font-bold text-[#141716] text-xs block">System Print Dialog</span>
                <p className="text-[11px] text-slate-400 font-medium">Triggers standard browser print (Ctrl+P / Cmd+P)</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
            Close
          </button>
        </div>
      </div>
    </div>);
};
