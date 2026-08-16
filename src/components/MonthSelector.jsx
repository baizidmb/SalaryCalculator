import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles,
  Sun
} from 'lucide-react';
import { MONTH_NAMES_RO, MONTH_NAMES_EN, getMonthlyNormInfo, getRomanianHolidays } from '../utils/romanianCalendar';

export default function MonthSelector({ 
  selectedYear, 
  selectedMonth, 
  onYearChange, 
  onMonthChange 
}) {
  const normInfo = getMonthlyNormInfo(selectedYear, selectedMonth);
  const monthHolidays = getRomanianHolidays(selectedYear).filter(h => {
    const [y, m] = h.dateStr.split('-');
    return parseInt(m, 10) === selectedMonth;
  });

  const years = [2024, 2025, 2026, 2027];

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      onYearChange(selectedYear - 1);
      onMonthChange(12);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      onYearChange(selectedYear + 1);
      onMonthChange(1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800/80 shadow-card-glass space-y-4">
      
      {/* Top bar: Year picker & Main Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Current Month & Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950/80 rounded-xl border border-slate-800 p-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Luna Anterioară"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-4 py-1 flex flex-col items-center min-w-[140px]">
              <span className="text-lg font-bold text-slate-100 tracking-wide">
                {MONTH_NAMES_RO[selectedMonth - 1]}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {MONTH_NAMES_EN[selectedMonth - 1]}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Luna Următoare"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Year selector dropdown */}
          <div className="flex items-center bg-slate-950/80 rounded-xl border border-slate-800 px-3 py-1.5">
            <CalendarIcon className="w-4 h-4 text-cyan-400 mr-2" />
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="bg-transparent text-sm font-bold text-slate-200 outline-none cursor-pointer"
            >
              {years.map(yr => (
                <option key={yr} value={yr} className="bg-slate-900 text-slate-200">
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Norm & Holiday Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Normă: <strong className="text-white font-mono">{normInfo.normHours}h</strong> ({normInfo.workingDays} zile lucrătoare)</span>
          </div>

          {monthHolidays.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{monthHolidays.length} {monthHolidays.length === 1 ? 'Sărbătoare Legală' : 'Sărbători Legale'}</span>
            </div>
          )}
        </div>

      </div>

      {/* 12 Months Fast-Select Pill Row */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-2 border-t border-slate-800/60">
        {MONTH_NAMES_RO.map((mName, idx) => {
          const mNum = idx + 1;
          const isSelected = mNum === selectedMonth;
          return (
            <button
              key={mName}
              onClick={() => onMonthChange(mNum)}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all duration-150 text-center ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-glow-cyan scale-[1.03]'
                  : 'bg-slate-950/40 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/50'
              }`}
            >
              {mName.substring(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Sărbători Legale Preview Banner for the selected month */}
      {monthHolidays.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Zile Libere {MONTH_NAMES_RO[selectedMonth - 1]}:
          </span>
          {monthHolidays.map(h => {
            const dayNum = parseInt(h.dateStr.split('-')[2], 10);
            return (
              <span key={h.dateStr} className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20 text-[11px]">
                <strong className="font-mono">{dayNum} {MONTH_NAMES_RO[selectedMonth - 1].substring(0, 3)}:</strong> {h.shortName}
              </span>
            );
          })}
        </div>
      )}

    </div>
  );
}
