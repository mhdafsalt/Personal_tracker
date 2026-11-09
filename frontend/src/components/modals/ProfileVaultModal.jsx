import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { IdCard, Camera, Upload, Printer, Trash2, X, FileText, ShieldCheck, Share2, Copy, Check, ExternalLink, Download, } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
export const ProfileVaultModal = ({ isOpen, onClose }) => {
    const { state, updateProfile, addVaultDocument, deleteVaultDocument, updateVaultDocumentImage, } = useWorkspace();
    const [docName, setDocName] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [docImagePreview, setDocImagePreview] = useState(null);
    const [selectedDocForShare, setSelectedDocForShare] = useState(null);
    const [copiedShare, setCopiedShare] = useState(false);
    if (!isOpen)
        return null;
    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (dataUrl)
                updateProfile({ photo: dataUrl });
        };
        reader.readAsDataURL(file);
    };
    const handleSignatureUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (dataUrl)
                updateProfile({ signature: dataUrl });
        };
        reader.readAsDataURL(file);
    };
    const handleDocImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (dataUrl)
                setDocImagePreview(dataUrl);
        };
        reader.readAsDataURL(file);
    };
    const handleSaveDoc = (e) => {
        e.preventDefault();
        if (!docName.trim() || !docNumber.trim())
            return;
        addVaultDocument(docName.trim(), docNumber.trim(), docImagePreview);
        setDocName('');
        setDocNumber('');
        setDocImagePreview(null);
    };
    const handleDocFileChange = (id, e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (dataUrl)
                updateVaultDocumentImage(id, dataUrl);
        };
        reader.readAsDataURL(file);
    };
    const myself = state.myself;
    return (<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-[#f4f5f0] max-w-5xl w-full rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#e2e5dc]">
        {/* Modal Header */}
        <div className="bg-[#141716] text-white p-4 sm:p-5 flex justify-between items-center no-print">
          <div className="flex items-center gap-2.5">
            <IdCard className="w-5 h-5 text-[#c4f223]"/>
            <h3 className="text-sm font-black tracking-wider uppercase">
              Profile & Visual Document Vault
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (4 cols): Personal Info Card */}
            <div className="lg:col-span-4 space-y-6">
              <div id="section-personal-info" className="bg-white rounded-3xl p-6 border border-[#e2e5dc] text-center shadow-xs relative">
                <button onClick={triggerPrint} className="absolute top-4 right-4 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 no-print">
                  <Printer className="w-3 h-3"/>
                  <span>Print A4</span>
                </button>

                {/* Avatar with Photo Upload */}
                <div className="relative w-24 h-24 mx-auto mb-3 mt-3">
                  <img src={myself.photo || 'https://via.placeholder.com/150'} alt={myself.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-[#c4f223] shadow-md bg-white"/>
                  <label title="Change Profile Photo" className="absolute bottom-0 right-0 bg-[#141716] hover:bg-slate-800 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors no-print">
                    <Camera className="w-3.5 h-3.5"/>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
                  </label>
                </div>

                <h3 className="text-base font-black text-[#141716]">{myself.fullName}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Workspace Owner · Calicut, Kerala
                </p>

                {/* Inputs */}
                <div className="text-left space-y-3 text-xs border-t border-slate-100 pt-4 mt-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">Full Name</label>
                    <input type="text" value={myself.fullName} onChange={(e) => updateProfile({ fullName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-[#141716]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">Date of Birth</label>
                    <input type="date" value={myself.dob} onChange={(e) => updateProfile({ dob: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-[#141716]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">Phone Number</label>
                    <input type="text" value={myself.phone} onChange={(e) => updateProfile({ phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-[#141716]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">Blood Group</label>
                    <input type="text" value={myself.bloodGroup} onChange={(e) => updateProfile({ bloodGroup: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-[#141716]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">Permanent Address</label>
                    <textarea rows={3} value={myself.address} onChange={(e) => updateProfile({ address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-[#141716]"/>
                  </div>

                  {/* Digital Signature */}
                  <div className="pt-3 border-t border-slate-100 relative group">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1 text-center">
                      Official Signature
                    </label>
                    <div className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                      {myself.signature ? (<img src={myself.signature} alt="Signature" className="max-h-full max-w-full object-contain"/>) : (<span className="text-slate-400 text-xs">No signature uploaded</span>)}
                      <label className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold no-print">
                        <Upload className="w-3.5 h-3.5 mr-1"/>
                        <span>Upload Signature</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload}/>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (8 cols): Official Documents Vault */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#e2e5dc] shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-[#141716] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-800"/>
                    <span>Visual Document Vault ({myself.documents?.length || 0})</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Stored Securely
                  </span>
                </div>

                {/* Add Document Form */}
                <form onSubmit={handleSaveDoc} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3 no-print">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" required placeholder="Doc Name (e.g. Voter ID, PAN Card)..." value={docName} onChange={(e) => setDocName(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                    <input type="text" required placeholder="ID / Registration Number..." value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium"/>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="flex-grow bg-white border border-dashed border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-slate-400"/>
                      <span>{docImagePreview ? 'Document Image Selected' : 'Choose Document Scan/Photo'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleDocImageUpload}/>
                    </label>
                    <button type="submit" className="btn-neon px-5 py-2 text-xs font-black shadow-xs cursor-pointer shrink-0">
                      Save Document
                    </button>
                  </div>
                </form>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
                  {myself.documents && myself.documents.length > 0 ? (myself.documents.map((d) => (<div key={d.id} id={`vault-doc-${d.id}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs shadow-2xs space-y-3 flex flex-col justify-between relative group">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="font-black text-[#141716] uppercase text-[11px] truncate">
                            {d.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => setSelectedDocForShare(d)} className="text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg no-print flex items-center gap-1 font-black text-[10px] cursor-pointer shadow-2xs" title="Share Document with Photo, ID & Name">
                              <Share2 className="w-3.5 h-3.5 text-emerald-700"/>
                              <span>Share</span>
                            </button>
                            <button onClick={() => deleteVaultDocument(d.id)} className="text-slate-300 hover:text-rose-500 p-1 no-print" title="Delete">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </div>

                        {/* Image scan or placeholder */}
                        <div className="relative w-full h-32 bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                          {d.image ? (<img src={d.image} alt={d.name} className="w-full h-full object-contain"/>) : (<div className="text-center p-2 text-slate-400 space-y-1">
                              <FileText className="w-6 h-6 mx-auto text-slate-300"/>
                              <span className="text-[10px] block">No image attached</span>
                            </div>)}

                          <label className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold no-print">
                            <Upload className="w-3.5 h-3.5 mr-1"/>
                            <span>Upload Scan</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileChange(d.id, e)}/>
                          </label>
                        </div>

                        <div className="pt-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">
                            Document Number
                          </span>
                          <p className="font-mono font-black text-[#141716] text-xs tracking-wider truncate">
                            {d.number}
                          </p>
                        </div>
                      </div>))) : (<p className="text-xs text-slate-400 italic py-6 text-center col-span-2">
                      No documents stored in the vault.
                    </p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Document Modal (With Photo, ID, and Doc Name) */}
      {selectedDocForShare && (<div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-[#141716] flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-700"/>
                  <span>Share Document</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Share document photo, ID number, and official details
                </p>
              </div>
              <button onClick={() => setSelectedDocForShare(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>

            {/* Document Card Preview (With Photo, ID, Doc Name) */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                    Document Name
                  </span>
                  <h3 className="font-black text-[#141716] text-base">{selectedDocForShare.name}</h3>
                </div>
                <span className="text-[10px] bg-[#c4f223] text-[#141716] font-black px-2 py-0.5 rounded-full uppercase">
                  Vault ID
                </span>
              </div>

              {/* Document Photo / Scan */}
              <div className="w-full h-44 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                {selectedDocForShare.image ? (<img src={selectedDocForShare.image} alt={selectedDocForShare.name} className="w-full h-full object-contain"/>) : (<div className="text-center p-3 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-1"/>
                    <span className="text-xs">No scan image attached</span>
                  </div>)}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Document ID / Number
                  </span>
                  <span className="font-mono font-black text-[#141716] tracking-wider">
                    {selectedDocForShare.number}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Holder Name
                  </span>
                  <span className="font-bold text-slate-800">
                    {myself.fullName}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Action Buttons */}
            <div className="space-y-2 pt-1">
              <button type="button" onClick={async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: `${selectedDocForShare.name} - ${myself.fullName}`,
                            text: `📄 Document: ${selectedDocForShare.name}\n🔢 ID Number: ${selectedDocForShare.number}\n👤 Holder: ${myself.fullName}`,
                            url: selectedDocForShare.image || undefined,
                        });
                    }
                    catch (err) {
                        // user cancelled or share unsupported
                    }
                }
                else {
                    const details = `Document: ${selectedDocForShare.name}\nID / Number: ${selectedDocForShare.number}\nHolder: ${myself.fullName}`;
                    navigator.clipboard.writeText(details);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                }
            }} className="w-full btn-neon py-2.5 text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                <Share2 className="w-4 h-4"/>
                <span>Share Document (Device / Apps)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => {
                const text = `*Official Document Details*\n\n📄 *Document:* ${selectedDocForShare.name}\n🔢 *ID Number:* ${selectedDocForShare.number}\n👤 *Holder:* ${myself.fullName}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }} className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5"/>
                  <span>WhatsApp</span>
                </button>

                <button type="button" onClick={() => {
                const details = `Document: ${selectedDocForShare.name}\nID / Number: ${selectedDocForShare.number}\nHolder: ${myself.fullName}`;
                navigator.clipboard.writeText(details);
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 2000);
            }} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                  {copiedShare ? (<>
                      <Check className="w-3.5 h-3.5 text-emerald-700"/>
                      <span className="text-emerald-700 font-black">Copied!</span>
                    </>) : (<>
                      <Copy className="w-3.5 h-3.5"/>
                      <span>Copy Details</span>
                    </>)}
                </button>
              </div>

              {selectedDocForShare.image && (<button type="button" onClick={() => {
                    if (!selectedDocForShare?.image)
                        return;
                    const a = document.createElement('a');
                    a.href = selectedDocForShare.image;
                    a.download = `${selectedDocForShare.name.replace(/\s+/g, '_')}_Scan.png`;
                    a.click();
                }} className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer">
                  <Download className="w-3.5 h-3.5 text-slate-500"/>
                  <span>Download Photo / Scan File</span>
                </button>)}
            </div>
          </div>
        </div>)}
    </div>);
};
