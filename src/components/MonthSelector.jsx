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
    <div className="w-full liquid-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5 border border-white/90 dark:border-white/10">
      
      {/* Top bar: Month stepper + Year dropdown + Jump to today */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        
        {/* Month Stepper */}
        <div className="flex items-center bg-white/95 dark:bg-slate-950/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-1 shadow-sm shrink-0">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors touch-target flex items-center justify-center"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-2.5 sm:px-3 py-0.5 flex flex-col items-center min-w-[100px] sm:min-w-[115px]">
            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight whitespace-nowrap">
              {t.months[selectedMonth - 1]}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              {selectedYear}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1.5 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors touch-target flex items-center justify-center"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Year Selector & Today Jump */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center bg-white/95 dark:bg-slate-950/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 px-2.5 py-1.5 shadow-sm">
            <CalendarIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 mr-1" />
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              {years.map(yr => (
                <option key={yr} value={yr} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleJumpToToday}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors touch-target shadow-sm"
            title="Jump to Today's Month"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden xs:inline">{t.jumpToToday}</span>
          </button>
        </div>

      </div>

      {/* Norm & Holiday Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold shadow-sm text-[11px]">
          <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{t.monthlyNorm}: <strong className="font-amount font-bold text-slate-900 dark:text-white">{normInfo.normHours}h</strong> ({normInfo.workingDays} {t.workingDays})</span>
        </div>

        {monthHolidays.length > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold shadow-sm text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{monthHolidays.length} {monthHolidays.length === 1 ? t.legalHoliday : t.legalHolidays}</span>
          </div>
        )}
      </div>

      {/* 12 Months Fast-Select Grid (Clean 6-cols / 4-cols with ample width, zero cutoffs) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
        {t.months.map((mName, idx) => {
          const mNum = idx + 1;
          const isSelected = mNum === selectedMonth;
          return (
            <button
              key={mName}
              onClick={() => onMonthChange(mNum)}
              className={`py-1.5 px-2 text-xs font-semibold rounded-xl transition-all duration-150 text-center truncate ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow-md shadow-cyan-600/25 scale-[1.03]'
                  : 'bg-white/90 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {mName.substring(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Sărbători Legale Preview Banner */}
      {monthHolidays.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-amber-500/5 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-amber-500/20 dark:border-slate-800/40">
          <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {t.publicHolidaysIn} {t.months[selectedMonth - 1]}:
          </span>
          {monthHolidays.map(h => {
            const dayNum = parseInt(h.dateStr.split('-')[2], 10);
            return (
              <span key={h.dateStr} className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/25 text-[10px]">
                <strong className="font-amount font-bold">{dayNum} {t.months[selectedMonth - 1].substring(0, 3)}:</strong> {h.shortName}
              </span>
            );
          })}
        </div>
      )}

    </div>
  );
}
