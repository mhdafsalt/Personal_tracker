import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Bell } from 'lucide-react';
export const AlarmBanner = () => {
    const { activeAlarm, dismissAlarm } = useWorkspace();
    if (!activeAlarm)
        return null;
    return (<div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 animate-bounce no-print">
      <div className="flex items-center gap-3 text-rose-900">
        <div className="h-10 w-10 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 animate-spin"/>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-rose-800">
            DUE NOW / UPCOMING DEADLINE
          </h4>
          <p className="text-xs font-bold text-rose-700">{activeAlarm}</p>
        </div>
      </div>
      <button onClick={dismissAlarm} className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-colors shrink-0 shadow-sm">
        Dismiss
      </button>
    </div>);
};
