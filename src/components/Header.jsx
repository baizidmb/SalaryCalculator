import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Download, 
  Info, 
  Settings, 
  Sparkles, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export default function Header({ 
  onOpenInfo, 
  onOpenSettings, 
  onExportPDF, 
  baseGross, 
  employeeName,
  isExporting 
}) {
  const [bucharestTime, setBucharestTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Europe/Bucharest timezone
      const timeStr = new Intl.DateTimeFormat('ro-RO', {
        timeZone: 'Europe/Bucharest',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(now);
      setBucharestTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/30 shadow-glow-cyan">
            <Briefcase className="w-6 h-6 text-cyan-400 animate-pulse-subtle" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                ZidBhai ShiftPay
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-3 h-3" /> Cod Fiscal RO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden xs:block">
              Romanian Duty Sheet & Smart Salary Calculator
            </p>
          </div>
        </div>

        {/* Live Bucharest Clock & Quick Stats */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-medium text-slate-200">{bucharestTime || 'București Time'}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="text-xs text-slate-400">
            Contract Brut: <span className="font-mono font-semibold text-emerald-400">{baseGross.toLocaleString('ro-RO')} LEI</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenInfo}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-cyan-300 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-all duration-150"
            title="Ghid Codul Muncii & Fiscal"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Ghid Fiscal</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-emerald-300 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-all duration-150"
            title="Configurare Salariu & Angajat"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Setări</span>
          </button>

          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg shadow-glow-cyan hover:shadow-glow-emerald transition-all duration-200 active:scale-95 disabled:opacity-50"
            title="Exportă Foaie de Pontaj & Fluturaș Salariu PDF"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generare...' : 'Export PDF'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
