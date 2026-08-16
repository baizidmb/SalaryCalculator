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
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#10b981', '#ffffff']
    });
  };

  const isNormFulfilled = calcResult.totalWorkedHours >= calcResult.normHours;
  const normProgress = Math.min(100, Math.round((calcResult.totalWorkedHours / calcResult.normHours) * 100));

  const netBonusDifference = calcResult.netSalary - calcResult.standardNetBase;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      
      {/* 1. HERO NET PAY CARD - GOLDEN WHITE LIQUID GLASS */}
      <div className="liquid-glass-elevated rounded-3xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between space-y-5">
        
        {/* Golden ambient liquid glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-gradient-to-br from-amber-400/20 to-yellow-300/20 dark:from-amber-500/20 dark:to-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-400/15 border border-amber-300/60 text-amber-600 dark:text-amber-400 shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400">
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400/60 shadow-sm transition-all hover-float touch-target"
            title="Toggle Currency (RON / EUR)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{currency}</span>
          </button>
        </div>

        {/* Big Glowing Amount with Gold Gradient */}
        <div className="space-y-2 py-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-gold-gradient">
              {formatCurrency(calcResult.netSalary, currency)}
            </span>
          </div>

          {/* Bonus difference indicator */}
          <div className="flex items-center gap-2 text-xs">
            {netBonusDifference > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-400/40 font-semibold font-mono text-[11px] sm:text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> +{formatCurrency(netBonusDifference, currency)} {t.bonusesAndOvertime}
              </span>
            ) : netBonusDifference < 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-400/30 font-semibold font-mono text-[11px] sm:text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> {t.belowNormBy}: {formatCurrency(Math.abs(netBonusDifference), currency)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-amber-500/10 dark:bg-slate-800 text-amber-800 dark:text-slate-400 border border-amber-300/40 dark:border-slate-700 text-[11px]">
                {t.standardFixedNorm}
              </span>
            )}
          </div>
        </div>

        {/* Bottom stats & celebration button */}
        <div className="pt-3.5 border-t border-amber-200/60 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {t.totalGrossLabel} <strong className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatCurrency(calcResult.totalGross, currency)}</strong>
          </div>

          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 bg-gradient-to-r from-amber-200/80 to-yellow-200/80 dark:from-amber-950/40 dark:to-yellow-950/40 hover:from-amber-300 hover:to-yellow-300 border border-amber-400/50 rounded-xl transition-all hover-float touch-target shadow-sm"
            title="Celebrate achievement"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.celebrate}</span>
          </button>
        </div>

      </div>

      {/* 2. HOURS BREAKDOWN CARD */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                {t.timesheetAndHours}
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.monthlyDistribution}
              </h3>
            </div>
          </div>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border font-mono ${
            isNormFulfilled 
              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30'
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

          <div className="w-full h-2.5 bg-amber-100/80 dark:bg-slate-950 rounded-full overflow-hidden border border-amber-200/60 dark:border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                isNormFulfilled 
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${normProgress}%` }}
            />
          </div>
        </div>

        {/* Detailed Hours Category Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          
          <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-amber-200/60 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.weekendHours}:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{calcResult.weekendHours}h</span>
          </div>

          <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-amber-200/60 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.holidayHours}:</span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-300">{calcResult.holidayHours}h</span>
          </div>

          <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-amber-200/60 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.overtimeHours}:</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{calcResult.overtimeHours}h</span>
          </div>

          <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-amber-200/60 dark:border-slate-800 flex flex-col shadow-sm">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.breakHoursTracked}:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{calcResult.totalBreakHours}h</span>
          </div>

        </div>

      </div>

      {/* 3. TAXES & DEDUCTIONS WATERFALL CARD */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 shadow-sm">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                {t.taxesAndDeductions}
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.fiscalWaterfall}
              </h3>
            </div>
          </div>

          <button
            onClick={onOpenTaxDetails}
            className="text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-0.5 touch-target"
          >
            {t.viewFormula} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Deductions Waterfall Rows */}
        <div className="space-y-1.5 text-xs">
          
          <div className="flex justify-between items-center py-1 border-b border-amber-200/60 dark:border-slate-800/80">
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

          <div className="flex justify-between items-center pt-2 border-t border-amber-200/80 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-bold">
            <span>{t.netPayable}:</span>
            <span className="font-mono text-sm sm:text-base">{formatCurrency(calcResult.netSalary, currency)}</span>
          </div>

        </div>

        {/* Employer Cost (CAM) */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-slate-800/80 shadow-sm">
          <span>{t.employerCostCAM}</span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            {formatCurrency(calcResult.totalEmployerCost, currency)}
          </span>
        </div>

      </div>

    </div>
  );
}
