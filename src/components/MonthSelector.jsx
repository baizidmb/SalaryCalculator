import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Sun,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { getMonthlyNormInfo, getRomanianHolidays } from '../utils/romanianCalendar';
import { TRANSLATIONS } from '../utils/i18n';

export default function MonthSelector({ 
  selectedYear, 
  selectedMonth, 
  onYearChange, 
  onMonthChange,
  lang = 'en' 
}) {
  const t = TRANSLATIONS[lang];
  const normInfo = getMonthlyNormInfo(selectedYear, selectedMonth, lang);
  const monthHolidays = getRomanianHolidays(selectedYear, lang).filter(h => {
    const [, m] = h.dateStr.split('-');
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

  const handleJumpToToday = () => {
    const now = new Date();
    onYearChange(now.getFullYear());
    onMonthChange(now.getMonth() + 1);
  };

  return (
    <div className="w-full liquid-glass rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3.5">
      
      {/* Top bar: Year picker & Main Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Current Month & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center bg-white/90 dark:bg-slate-950/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors touch-target flex items-center justify-center"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="px-3 sm:px-4 py-0.5 sm:py-1 flex flex-col items-center min-w-[110px] sm:min-w-[130px]">
              <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                {t.months[selectedMonth - 1]}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                {selectedYear}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors touch-target flex items-center justify-center"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Year selector dropdown */}
          <div className="flex items-center bg-white/90 dark:bg-slate-950/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
            <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 mr-1.5" />
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              {years.map(yr => (
                <option key={yr} value={yr} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Jump to Today Button */}
          <button
            onClick={handleJumpToToday}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors touch-target shadow-sm"
            title="Jump to Today's Month"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.jumpToToday}</span>
          </button>
        </div>

        {/* Dynamic Norm & Holiday Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs font-semibold shadow-sm">
            <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{t.monthlyNorm}: <strong className="font-mono text-slate-900 dark:text-white font-bold">{normInfo.normHours}h</strong> ({normInfo.workingDays} {t.workingDays})</span>
          </div>

          {monthHolidays.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-sm">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{monthHolidays.length} {monthHolidays.length === 1 ? t.legalHoliday : t.legalHolidays}</span>
            </div>
          )}
        </div>

      </div>

      {/* 12 Months Fast-Select Pill Row */}
      <div className="flex overflow-x-auto pb-1 sm:pb-0 sm:grid sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 scrollbar-none">
        {t.months.map((mName, idx) => {
          const mNum = idx + 1;
          const isSelected = mNum === selectedMonth;
          return (
            <button
              key={mName}
              onClick={() => onMonthChange(mNum)}
              className={`py-1.5 px-2.5 sm:px-2 text-xs font-semibold rounded-xl transition-all duration-150 text-center shrink-0 sm:shrink ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow-md shadow-cyan-600/20 scale-[1.02]'
                  : 'bg-white/80 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800/60'
              }`}
            >
              {mName.substring(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Sărbători Legale Preview Banner */}
      {monthHolidays.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-500/5 dark:bg-slate-950/40 p-2.5 rounded-xl border border-amber-500/20 dark:border-slate-800/40">
          <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t.publicHolidaysIn} {t.months[selectedMonth - 1]}:
          </span>
          {monthHolidays.map(h => {
            const dayNum = parseInt(h.dateStr.split('-')[2], 10);
            return (
              <span key={h.dateStr} className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/25 text-[11px]">
                <strong className="font-mono">{dayNum} {t.months[selectedMonth - 1].substring(0, 3)}:</strong> {h.shortName}
              </span>
            );
          })}
        </div>
      )}

    </div>
  );
}
