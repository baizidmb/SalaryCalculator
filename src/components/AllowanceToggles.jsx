import React from 'react';
import { 
  Sliders, 
  CalendarDays, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  HelpCircle 
} from 'lucide-react';
import { formatCurrency } from '../utils/salaryEngine';

export default function AllowanceToggles({ 
  toggles, 
  onToggleChange, 
  calcResult,
  currency = 'RON'
}) {
  const toggleItems = [
    {
      id: 'weekend',
      label: 'Spor Weekend (S / D)',
      subtext: 'Art. 137 Codul Muncii',
      rateText: '+30%',
      rateBadgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: CalendarDays,
      activeColor: 'from-cyan-500 to-blue-500',
      activeBorder: 'border-cyan-500/40',
      hours: calcResult.weekendHours,
      earned: calcResult.weekendBonus,
      description: 'Majorare de 30% la tariful orar de bază pentru orele lucrate sâmbăta și duminica.'
    },
    {
      id: 'holiday',
      label: 'Spor Sărbători Legale',
      subtext: 'Art. 142 Codul Muncii',
      rateText: '+100%',
      rateBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Sparkles,
      activeColor: 'from-amber-500 to-orange-500',
      activeBorder: 'border-amber-500/40',
      hours: calcResult.holidayHours,
      earned: calcResult.holidayBonus,
      description: 'Spor de 100% (dublu) din tariful orar de bază pentru orele lucrate în zilele de sărbătoare legală.'
    },
    {
      id: 'overtime',
      label: 'Spor Ore Suplimentare',
      subtext: 'Art. 120 Codul Muncii',
      rateText: '+75%',
      rateBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: TrendingUp,
      activeColor: 'from-emerald-500 to-teal-500',
      activeBorder: 'border-emerald-500/40',
      hours: calcResult.overtimeHours,
      earned: calcResult.overtimePay,
      description: 'Orele ce depășesc norma standard a lunii sunt plătite cu un spor legal de 75% (175% tarif orar).'
    }
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800/80 shadow-card-glass space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Sporuri & Sporuri Salariale Active
            </h3>
            <p className="text-xs text-slate-400">
              Comutatoare independente de calcul conform legislației muncii din România
            </p>
          </div>
        </div>

        {/* Tarife Orare Baseline pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="text-slate-400">Tarif Orar Bază:</span>
          <span className="font-mono font-bold text-cyan-400">
            {calcResult.hourlyBaseRate.toFixed(2)} LEI/oră
          </span>
        </div>
      </div>

      {/* 3 Toggle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {toggleItems.map((item) => {
          const Icon = item.icon;
          const isActive = !!toggles[item.id];

          return (
            <div
              key={item.id}
              onClick={() => onToggleChange(item.id, !isActive)}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                isActive 
                  ? `bg-slate-900/90 ${item.activeBorder} shadow-lg shadow-cyan-950/20` 
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Info & Label */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-200">
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

                {/* Custom Glassmorphic Switch */}
                <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-gradient-to-r ' + item.activeColor : 'bg-slate-800'
                }`}>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Live earnings preview for this specific allowance */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Ore înregistrate: <strong className="font-mono text-slate-200">{item.hours}h</strong>
                </span>
                <span className="font-mono font-bold text-emerald-400 text-xs">
                  {isActive && item.earned > 0 ? `+${formatCurrency(item.earned, currency)}` : (isActive ? '0,00 LEI' : 'Dezactivat')}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
