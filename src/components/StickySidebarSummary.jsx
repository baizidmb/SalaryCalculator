import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Coins, 
  CalendarDays, 
  Sparkles, 
  Sliders, 
  FileText, 
  Download, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function StickySidebarSummary({
  calcResult,
  currency = 'RON',
  onCurrencyToggle,
  toggles,
  onToggleChange,
  overtimeMode = 'daily',
  onOvertimeModeChange,
  onOpenTaxDetails,
  onExportPDF,
  isExporting,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#10b981', '#ffffff']
    });
  };

  const isNormFulfilled = calcResult.totalWorkedHours >= calcResult.normHours;
  const normProgress = Math.min(100, Math.round((calcResult.totalWorkedHours / calcResult.normHours) * 100));
  const netBonusDifference = calcResult.netSalary - calcResult.standardNetBase;

  return (
    <div className="space-y-4">
      
      {/* 🌟 1. HERO FINANCIAL CARD (STICKY HEADLINER) */}
      <div className="liquid-glass-elevated rounded-3xl p-5 relative overflow-hidden shadow-md">
        
        {/* Subtle glowing ambient accent */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header: Title + Currency Switcher */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 shadow-sm">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 block">
                {t.netTakeHome}
              </span>
              <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t.cleanNetIncome}
              </h3>
            </div>
          </div>

          <button
            onClick={onCurrencyToggle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm transition-all hover-float touch-target"
            title="Toggle Currency (RON / EUR)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{currency}</span>
          </button>
        </div>

        {/* Big Glowing Net Salary */}
        <div className="space-y-1.5 py-1">
          <div className="text-3xl xl:text-4xl font-extrabold tracking-tight font-mono text-gold-gradient">
            {formatCurrency(calcResult.netSalary, currency)}
          </div>

          {/* Bonus / Deficit Subtitle */}
          <div>
            {netBonusDifference > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-400/40 font-semibold font-mono text-[11px]">
                <TrendingUp className="w-3 h-3 text-amber-600 dark:text-amber-400" /> +{formatCurrency(netBonusDifference, currency)} {t.bonusesAndOvertime}
              </span>
            ) : netBonusDifference < 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-400/30 font-semibold font-mono text-[11px]">
                <AlertCircle className="w-3 h-3 text-rose-500" /> {t.belowNormBy}: {formatCurrency(Math.abs(netBonusDifference), currency)}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.standardFixedNorm}
              </span>
            )}
          </div>
        </div>

        {/* Gross Breakdown Footer */}
        <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">{t.totalGrossLabel}</span>
          <strong className="font-mono text-slate-900 dark:text-slate-100 font-bold">
            {formatCurrency(calcResult.totalGross, currency)}
          </strong>
        </div>

      </div>


      {/* ⏱️ 2. MONTHLY WORKED HOURS & NORM PROGRESS */}
      <div className="liquid-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {t.normProgress} ({normProgress}%)
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            {calcResult.totalWorkedHours}h <span className="text-slate-400 font-normal">/ {calcResult.normHours}h</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isNormFulfilled 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
            }`}
            style={{ width: `${normProgress}%` }}
          />
        </div>

        {/* Metrics Pill Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          
          <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Weekend:</span>
            <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
              {calcResult.weekendHours}h <span className="text-[10px] text-slate-500">({formatCurrency(calcResult.weekendBonus, currency)})</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Holiday:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
              {calcResult.holidayHours}h <span className="text-[10px] text-slate-500">({formatCurrency(calcResult.holidayBonus, currency)})</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 col-span-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">{t.overtimeHours}:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {calcResult.overtimeHours}h ({formatCurrency(calcResult.overtimePay, currency)})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block">Rate/hr:</span>
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                {calcResult.hourlyBaseRate.toFixed(2)} RON/h
              </span>
            </div>
          </div>

        </div>

      </div>


      {/* 🎛️ 3. INTERACTIVE SALARY ALLOWANCES TOGGLES */}
      <div className="liquid-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              {t.activeAllowancesTitle}
            </span>
          </div>
        </div>

        {/* Quick Compact Toggle Switches */}
        <div className="space-y-2 text-xs">
          
          {/* Weekend Toggle */}
          <div 
            onClick={() => onToggleChange('weekend')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              toggles.weekend 
                ? 'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-500/40 shadow-sm' 
                : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <CalendarDays className={`w-3.5 h-3.5 ${toggles.weekend ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
              <div className="min-w-0">
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {t.weekendToggleTitle}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  +30% ({calcResult.weekendHours}h = {formatCurrency(calcResult.weekendBonus, currency)})
                </span>
              </div>
            </div>

            <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${toggles.weekend ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 ${toggles.weekend ? 'left-4' : 'left-0.5'}`} />
            </div>
          </div>

          {/* Holiday Toggle */}
          <div 
            onClick={() => onToggleChange('holiday')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              toggles.holiday 
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/40 shadow-sm' 
                : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className={`w-3.5 h-3.5 ${toggles.holiday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
              <div className="min-w-0">
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {t.holidayToggleTitle}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  +100% ({calcResult.holidayHours}h = {formatCurrency(calcResult.holidayBonus, currency)})
                </span>
              </div>
            </div>

            <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${toggles.holiday ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 ${toggles.holiday ? 'left-4' : 'left-0.5'}`} />
            </div>
          </div>

          {/* Overtime Toggle */}
          <div 
            onClick={() => onToggleChange('overtime')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              toggles.overtime 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm' 
                : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <TrendingUp className={`w-3.5 h-3.5 ${toggles.overtime ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <div className="min-w-0">
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {t.overtimeToggleTitle}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  +75% ({calcResult.overtimeHours}h = {formatCurrency(calcResult.overtimePay, currency)})
                </span>
              </div>
            </div>

            <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${toggles.overtime ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 ${toggles.overtime ? 'left-4' : 'left-0.5'}`} />
            </div>
          </div>

        </div>

        {/* Overtime Calculation Basis Switcher */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            {t.overtimeModeLabel}
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
            <button
              onClick={() => onOvertimeModeChange('daily')}
              className={`py-1 rounded-lg font-bold transition-all ${
                overtimeMode === 'daily'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'ro' ? 'Zilnic >8h' : 'Daily >8h'}
            </button>
            <button
              onClick={() => onOvertimeModeChange('weekly')}
              className={`py-1 rounded-lg font-bold transition-all ${
                overtimeMode === 'weekly'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'ro' ? 'Săpt. >40h' : 'Weekly >40h'}
            </button>
            <button
              onClick={() => onOvertimeModeChange('monthly')}
              className={`py-1 rounded-lg font-bold transition-all ${
                overtimeMode === 'monthly'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'ro' ? 'Normă' : 'Monthly'}
            </button>
          </div>
        </div>

      </div>


      {/* ⚡ 4. ACTION BUTTONS (EXPORT & FORMULA) */}
      <div className="grid grid-cols-2 gap-2.5">
        
        <button
          onClick={onOpenTaxDetails}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all hover-float shadow-sm"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>{t.viewFormula}</span>
        </button>

        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold transition-all hover-float shadow-md disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExporting ? t.generatingPdf : t.exportPdf}</span>
        </button>

      </div>

    </div>
  );
}
