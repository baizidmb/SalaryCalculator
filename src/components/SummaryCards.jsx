import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Percent, 
  ArrowRight,
  HelpCircle,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/salaryEngine';

export default function SummaryCards({ 
  calcResult, 
  currency, 
  onCurrencyToggle,
  onOpenTaxDetails 
}) {
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

  // Difference vs baseline net
  const netBonusDifference = calcResult.netSalary - calcResult.standardNetBase;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* 1. HERO NET PAY CARD */}
      <div className="glass-panel-elevated rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between space-y-6">
        
        {/* Background glow orb */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Salariu Net de Plată
              </span>
              <h2 className="text-sm font-semibold text-slate-300">
                Venit Curat În Mână
              </h2>
            </div>
          </div>

          {/* Currency Switcher RON / EUR */}
          <button
            onClick={onCurrencyToggle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            title="Schimbă Moneda (RON / EUR)"
          >
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currency}</span>
          </button>
        </div>

        {/* Big Glowing Amount Display */}
        <div className="space-y-2 py-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              {formatCurrency(calcResult.netSalary, currency)}
            </span>
          </div>

          {/* Bonus difference indicator */}
          <div className="flex items-center gap-2 text-xs">
            {netBonusDifference > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                <TrendingUp className="w-3.5 h-3.5" /> +{formatCurrency(netBonusDifference, currency)} sporuri & suplimentare
              </span>
            ) : netBonusDifference < 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> Sub normă: {formatCurrency(Math.abs(netBonusDifference), currency)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                Normă standard fixă (3.217,50 LEI net)
              </span>
            )}
          </div>
        </div>

        {/* Bottom stats & celebration button */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Brut Total: <strong className="font-mono text-slate-200">{formatCurrency(calcResult.totalGross, currency)}</strong>
          </div>

          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-all"
            title="Celebrează realizarea lunii"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Celebrare</span>
          </button>
        </div>

      </div>

      {/* 2. HOURS BREAKDOWN CARD */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-slate-800/80">
        
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                Pontaj & Ore Lucrate
              </span>
              <h3 className="text-sm font-semibold text-slate-300">
                Distribuție Lunar
              </h3>
            </div>
          </div>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border font-mono ${
            isNormFulfilled 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {normProgress}% Normă
          </span>
        </div>

        {/* Big hours counter & progress bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">
              {calcResult.totalWorkedHours} <span className="text-sm font-normal text-slate-400">/ {calcResult.normHours} ore</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {calcResult.totalDaysWorked} zile lucrate
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                isNormFulfilled 
                  ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${normProgress}%` }}
            />
          </div>
        </div>

        {/* Detailed Hours Category Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2">
          
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] text-slate-400">Ore Weekend (S/D):</span>
            <span className="font-mono font-bold text-cyan-300">{calcResult.weekendHours}h</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] text-slate-400">Sărbători Legale:</span>
            <span className="font-mono font-bold text-amber-300">{calcResult.holidayHours}h</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] text-slate-400">Ore Suplimentare:</span>
            <span className="font-mono font-bold text-emerald-300">{calcResult.overtimeHours}h</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] text-slate-400">Pauze Înregistrate:</span>
            <span className="font-mono font-bold text-slate-300">{calcResult.totalBreakHours}h</span>
          </div>

        </div>

      </div>

      {/* 3. TAXES & DEDUCTIONS WATERFALL CARD */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-slate-800/80">
        
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                Taxe & Rețineri Stat
              </span>
              <h3 className="text-sm font-semibold text-slate-300">
                Cascadă Fiscală (Cod Fiscal)
              </h3>
            </div>
          </div>

          <button
            onClick={onOpenTaxDetails}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 flex items-center gap-0.5"
          >
            Formula <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Itemized Deductions Waterfall Rows */}
        <div className="space-y-1.5 text-xs">
          
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-300 font-semibold">1. Venit Brut Total:</span>
            <span className="font-mono font-bold text-white">{formatCurrency(calcResult.totalGross, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-rose-400/90">
            <span className="flex items-center gap-1 text-[11px]">
              CAS Pensie (25%):
            </span>
            <span className="font-mono font-semibold">-{formatCurrency(calcResult.cas, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-rose-400/90">
            <span className="flex items-center gap-1 text-[11px]">
              CASS Sănătate (10%):
            </span>
            <span className="font-mono font-semibold">-{formatCurrency(calcResult.cass, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-slate-400">
            <span className="text-[11px]">Bază Impozabilă:</span>
            <span className="font-mono text-slate-300">{formatCurrency(calcResult.taxableBase, currency)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 text-rose-400/90">
            <span className="text-[11px]">Impozit pe Venit (10%):</span>
            <span className="font-mono font-semibold">-{formatCurrency(calcResult.impozit, currency)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-emerald-400 font-bold">
            <span>Net de Plată:</span>
            <span className="font-mono text-base">{formatCurrency(calcResult.netSalary, currency)}</span>
          </div>

        </div>

        {/* Employer Cost (CAM) footer note */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/40">
          <span>Cost Angajator (CAM 2.25%):</span>
          <span className="font-mono font-semibold text-slate-300">
            {formatCurrency(calcResult.totalEmployerCost, currency)}
          </span>
        </div>

      </div>

    </div>
  );
}
