import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Trash2, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ShiftRow from './ShiftRow';
import { calculateShiftDayHours } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function DutyGrid({
  days,
  shifts,
  onShiftChange,
  onClearMonth,
  onDuplicateRow,
  onCopyFromPrevious,
  lang = 'en'
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'filled' | 'pending' | 'holidays_weekends'
  const t = TRANSLATIONS[lang];

  // Global registry for cross-day Enter key auto-focus
  const inputsRegistry = useRef({});

  const handleRegisterInputRef = (dateStr, refObj) => {
    inputsRegistry.current[dateStr] = refObj;
  };

  const handleFocusNextDay = (currentDateStr) => {
    const currentIdx = days.findIndex(d => d.dateStr === currentDateStr);
    if (currentIdx >= 0 && currentIdx < days.length - 1) {
      const nextDay = days[currentIdx + 1];
      const nextShift = shifts[nextDay.dateStr];
      
      // If next day is OFF, activate it so user can type seamlessly
      if (nextShift?.isOff) {
        onShiftChange(nextDay.dateStr, { ...nextShift, isOff: false });
      }

      setTimeout(() => {
        if (inputsRegistry.current[nextDay.dateStr]) {
          inputsRegistry.current[nextDay.dateStr].focus();
        }
      }, 70);
    }
  };

  // Calculate day counts for filter badges
  let filledCount = 0;
  let pendingCount = 0;

  days.forEach(d => {
    const shift = shifts[d.dateStr] || { isOff: d.isWeekend };
    const { workedHours } = calculateShiftDayHours(shift);
    if (!shift.isOff && workedHours > 0) {
      filledCount++;
    } else if (!shift.isOff && workedHours === 0) {
      pendingCount++;
    }
  });

  // Filter days based on selected filterMode
  const filteredDays = days.filter(day => {
    const shift = shifts[day.dateStr] || { isOff: day.isWeekend };
    const { workedHours } = calculateShiftDayHours(shift);

    if (filterMode === 'filled') {
      return !shift.isOff && workedHours > 0;
    }
    if (filterMode === 'pending') {
      return !shift.isOff && workedHours === 0;
    }
    if (filterMode === 'holidays_weekends') {
      return day.isWeekend || day.isHoliday;
    }
    return true; // 'all'
  });

  return (
    <div className="w-full liquid-glass rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-4">
      
      {/* Top Toolbar: Title + Filter Tabs + Reset Month Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {t.dutySheetTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {t.dutySheetSubtitle}
            </p>
          </div>
        </div>

        {/* Filter Tabs & Reset Action */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full shadow-sm scrollbar-none">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 touch-target ${
                filterMode === 'all'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.allDays} ({days.length})
            </button>

            <button
              onClick={() => setFilterMode('filled')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 touch-target ${
                filterMode === 'filled'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.filledDaysFilter} ({filledCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('pending')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 touch-target ${
                filterMode === 'pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.pendingDaysFilter} ({pendingCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('holidays_weekends')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 touch-target ${
                filterMode === 'holidays_weekends'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.weekendHolidays}
            </button>
          </div>

          {/* Reset Month Button */}
          <button
            onClick={onClearMonth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors shadow-sm touch-target ml-auto sm:ml-0"
            title="Reset all days in current month"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.resetMonth}</span>
          </button>

        </div>

      </div>

      {/* Daily Shift Rows Grid */}
      <div className="space-y-2.5">
        {filteredDays.length > 0 ? (
          filteredDays.map((day, idx) => {
            const shiftData = shifts[day.dateStr] || {
              mode: 'split',
              isOff: day.isWeekend,
              start1: '',
              end1: '',
              start2: '',
              end2: '',
              continuousStart: '',
              continuousEnd: ''
            };

            const isNextAvailable = idx < filteredDays.length - 1;
            const isPrevAvailable = idx > 0;

            return (
              <ShiftRow
                key={day.dateStr}
                day={day}
                shiftData={shiftData}
                onChange={onShiftChange}
                onDuplicateToNext={onDuplicateRow}
                onCopyFromPrevious={onCopyFromPrevious}
                onFocusNextDay={handleFocusNextDay}
                registerInputRef={handleRegisterInputRef}
                isNextAvailable={isNextAvailable}
                isPrevAvailable={isPrevAvailable}
                lang={lang}
              />
            );
          })
        ) : (
          <div className="text-center py-10 liquid-glass rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
            <Filter className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold">{t.noDaysMatchingFilter}</p>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar & Auto-Save Notice */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
        <div>
          <span>{t.showingDays} <strong className="font-mono text-slate-800 dark:text-white">{filteredDays.length}</strong> {t.ofDays} {days.length} {t.daysInMonth}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.autoSaveNotice}</span>
        </div>
      </div>

    </div>
  );
}
