import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Download, 
  Info, 
  Settings, 
  Clock, 
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  Sparkles
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

export default function Header({ 
  lang = 'en',
  onLangToggle,
  theme = 'light',
  onThemeToggle,
  onOpenInfo, 
  onOpenSettings, 
  onExportPDF, 
  baseGross, 
  isExporting 
}) {
  const [bucharestTime, setBucharestTime] = useState('');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat(lang === 'ro' ? 'ro-RO' : 'en-GB', {
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
  }, [lang]);

  return (
    <header className="sticky top-0 z-30 w-full liquid-glass border-b border-amber-200/50 dark:border-amber-500/20 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400/25 via-white dark:via-slate-900 to-amber-500/15 border border-amber-300/80 dark:border-amber-500/30 shadow-md shadow-amber-500/10 shrink-0">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-950 shadow-sm" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-gold-gradient truncate">
                {t.appTitle}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 shrink-0">
                <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" /> {t.roFiscalBadge}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate hidden xs:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Live Bucharest Clock (Desktop) */}
        <div className="hidden xl:flex items-center gap-4 bg-white/80 dark:bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-amber-200/60 dark:border-slate-800/80 shadow-sm text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono font-medium">{bucharestTime || t.bucharestTime}</span>
          </div>
          <div className="h-3.5 w-px bg-amber-200/80 dark:bg-slate-800" />
          <div className="text-slate-500 dark:text-slate-400">
            {t.contractGross}: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{baseGross.toLocaleString()} LEI</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* 1-Tap Language Changer Pill */}
          <button
            onClick={onLangToggle}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-sm transition-all hover-float touch-target"
            title={lang === 'en' ? 'Schimbă în Română' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="uppercase tracking-wider">{lang === 'en' ? 'EN 🇬🇧' : 'RO 🇷🇴'}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 sm:px-2.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-sm transition-all hover-float touch-target"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700 hover:text-amber-600 transition-colors" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
            )}
          </button>

          {/* Fiscal Guide */}
          <button
            onClick={onOpenInfo}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 bg-white/90 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl border border-amber-200/80 dark:border-slate-700/80 transition-all hover-float touch-target"
            title={t.fiscalGuide}
          >
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden lg:inline">{t.fiscalGuide}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-2.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 bg-white/90 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl border border-amber-200/80 dark:border-slate-700/80 transition-all hover-float touch-target"
            title={t.settings}
          >
            <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          {/* PDF Export with Golden Glow */}
          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl shadow-md shadow-amber-500/25 active:scale-95 transition-all duration-200 disabled:opacity-50 touch-target"
            title={t.exportPdf}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isExporting ? t.generatingPdf : t.exportPdf}</span>
          </button>

        </div>

      </div>
    </header>
  );
}
