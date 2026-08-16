import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function SummaryCards({ 
  calcResult, 
  currency, 
  onCurrencyToggle,
  onOpenTaxDetails,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#38bdf8', '#fbbf24', '#ffffff']
    });
  };

  const isNormFulfilled = calcResult.totalWorkedHours >= calcResult.normHours;
  const normProgress = Math.min(100, Math.round((calcResult.totalWorkedHours / calcResult.normHours) * 100));

  const netBonusDifference = calcResult.netSalary - calcResult.standardNetBase;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      
      {/* 1. HERO NET PAY CARD */}
      <div className="liquid-glass-elevated rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between space-y-5">
        
        {/* Ambient liquid glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-gradient-to-br from-cyan-400/15 to-emerald-400/15 dark:from-cyan-500/20 dark:to-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                {t.netTakeHome}
              </span>
              <h2 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.cleanNetIncome}
              </h2>
            </div>
          </div>

          {/* Currency Switcher RON / EUR */}
          <button
            onClick={onCurrencyToggle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 shadow-sm transition-all hover-float touch-target"
            title="Toggle Currency (RON / EUR)"
          >
            <Coins className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{currency}</span>
          </button>
        </div>

        {/* Big Glowing Amount */}
        <div className="space-y-2 py-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight font-mono bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300 bg-clip-text text-transparent">
              {formatCurrency(calcResult.netSalary, currency)}
            </span>
          </div>

          {/* Bonus difference indicator */}
          <div className="flex items-center gap-2 text-xs">
            {netBonusDifference > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 font-semibold font-mono text-[11px] sm:text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> +{formatCurrency(netBonusDifference, currency)} {t.bonusesAndOvertime}
              </span>
            ) : netBonusDifference < 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 font-semibold font-mono text-[11px] sm:text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> {t.belowNormBy}: {formatCurrency(Math.abs(netBonusDifference), currency)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[11px]">
                {t.standardFixedNorm}
              </span>
            )}
          </div>
        </div>

        {/* Bottom stats & celebration button */}
        <div className="pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t.totalGrossLabel} <strong className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatCurrency(calcResult.totalGross, currency)}</strong>
          </div>

          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all hover-float touch-target"
            title="Celebrate achievement"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{t.celebrate}</span>
          </button>
        </div>

      </div>

      {/* 2. HOURS BREAKDOWN CARD */}
      <div className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                {t.timesheetAndHours}
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.monthlyDistribution}
              </h3>
            </div>
          </div>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border font-mono ${
            isNormFulfilled 
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
          }`}>
            {normProgress}% {t.normProgress}
          </span>
        </div>

        {/* Big hours counter & bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {calcResult.totalWorkedHours} <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">/ {calcResult.normHours} {t.loggedHoursVsNorm}</span>
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {calcResult.totalDaysWorked} {t.daysWorked}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                isNormFulfilled 
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${normProgress}%` }}
            />
          </div>
        </div>

        {/* Detailed Hours Category Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          
          <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.weekendHours}:</span>
            <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">{calcResult.weekendHours}h</span>
          </div>

          <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.holidayHours}:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{calcResult.holidayHours}h</span>
          </div>

          <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.overtimeHours}:</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{calcResult.overtimeHours}h</span>
          </div>

          <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.breakHoursTracked}:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{calcResult.totalBreakHours}h</span>
          </div>

        </div>

      </div>

      {/* 3. TAXES & DEDUCTIONS WATERFALL CARD */}
      <div className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shadow-sm">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-700 dark:text-purple-400">
                {t.taxesAndDeductions}
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.fiscalWaterfall}
              </h3>
            </div>
          </div>

          <button
            onClick={onOpenTaxDetails}
            className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold underline underline-offset-2 flex items-center gap-0.5 touch-target"
          >
            {t.viewFormula} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Deductions Waterfall Rows */}
        <div className="space-y-1.5 text-xs">
          
          <div className="flex justify-between items-center py-1 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{t.totalGrossRealized}:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(calcResult.totalGross, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-rose-600 dark:text-rose-400">
            <span className="text-[11px]">{t.casPension}:</span>
            <span className="font-mono font-semibold">-{formatCurrency(calcResult.cas, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-rose-600 dark:text-rose-400">
            <span className="text-[11px]">{t.cassHealth}:</span>
            <span className="font-mono font-semibold">-{formatCurrency(calcResult.cass, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-slate-500 dark:text-slate-400">
            <span className="text-[11px]">{t.taxableIncomeBase}:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{formatCurrency(calcResult.taxableBase, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-rose-600 dark:text-rose-400">
            <span className="text-[11px]">{t.incomeTax}:</span>
            <span className="font-mono font-semibold">-{formatCurrency(calcResult.impozit, currency)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
            <span>{t.netPayable}:</span>
            <span className="font-mono text-sm sm:text-base">{formatCurrency(calcResult.netSalary, currency)}</span>
          </div>

        </div>

        {/* Employer Cost (CAM) */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span>{t.employerCostCAM}</span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            {formatCurrency(calcResult.totalEmployerCost, currency)}
          </span>
        </div>

      </div>

    </div>
  );
}
