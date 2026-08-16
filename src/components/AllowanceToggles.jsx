import React from 'react';
import { 
  Sliders, 
  CalendarDays, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';
import { formatCurrency } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function AllowanceToggles({ 
  toggles, 
  onToggleChange, 
  calcResult,
  currency = 'RON',
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang];

  const toggleItems = [
    {
      id: 'weekend',
      label: t.weekendToggleTitle,
      subtext: t.weekendLegalRef,
      rateText: '+30%',
      rateBadgeClass: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30',
      icon: CalendarDays,
      activeColor: 'from-cyan-500 to-blue-500',
      activeBorder: 'border-cyan-500/40 shadow-cyan-500/10',
      hours: calcResult.weekendHours,
      earned: calcResult.weekendBonus,
      description: t.weekendToggleDesc
    },
    {
      id: 'holiday',
      label: t.holidayToggleTitle,
      subtext: t.holidayLegalRef,
      rateText: '+100%',
      rateBadgeClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
      icon: Sparkles,
      activeColor: 'from-amber-500 to-orange-500',
      activeBorder: 'border-amber-500/40 shadow-amber-500/10',
      hours: calcResult.holidayHours,
      earned: calcResult.holidayBonus,
      description: t.holidayToggleDesc
    },
    {
      id: 'overtime',
      label: t.overtimeToggleTitle,
      subtext: t.overtimeLegalRef,
      rateText: '+75%',
      rateBadgeClass: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
      icon: TrendingUp,
      activeColor: 'from-emerald-500 to-teal-500',
      activeBorder: 'border-emerald-500/40 shadow-emerald-500/10',
      hours: calcResult.overtimeHours,
      earned: calcResult.overtimePay,
      description: t.overtimeToggleDesc
    }
  ];

  return (
    <div className="w-full liquid-glass rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              {t.activeAllowancesTitle}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {t.activeAllowancesSubtitle}
            </p>
          </div>
        </div>

        {/* Base Hourly Rate Pill */}
        <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
          <span className="text-slate-500 dark:text-slate-400">{t.hourlyBaseRate}</span>
          <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
            {calcResult.hourlyBaseRate.toFixed(2)} {t.perHour}
          </span>
        </div>
      </div>

      {/* 3 Toggle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {toggleItems.map((item) => {
          const Icon = item.icon;
          const isActive = !!toggles[item.id];

          return (
            <div
              key={item.id}
              onClick={() => onToggleChange(item.id, !isActive)}
              className={`group relative p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 border hover-float ${
                isActive 
                  ? `bg-white/90 dark:bg-slate-900/90 ${item.activeBorder} shadow-md` 
                  : 'bg-white/40 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Info & Label */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${item.rateBadgeClass}`}>
                      {item.rateText}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item.subtext}
                    </span>
                  </div>
                </div>

                {/* Glassmorphic Switch */}
                <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isActive ? 'bg-gradient-to-r ' + item.activeColor : 'bg-slate-300 dark:bg-slate-800'
                }`}>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Live earnings preview for this allowance */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {t.hoursLogged} <strong className="font-mono text-slate-800 dark:text-slate-200">{item.hours}h</strong>
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  {isActive && item.earned > 0 ? `+${formatCurrency(item.earned, currency)}` : (isActive ? '0.00 LEI' : t.disabled)}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
