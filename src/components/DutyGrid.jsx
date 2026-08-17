import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sun 
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
  
  // 🌟 EXACTLY ONE GLOBAL ACTIVE FIELD ACROSS THE ENTIRE MONTH
  const [activeDayField, setActiveDayField] = useState(null); // { dateStr: string, field: string } | null
  
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
    } else {
      setActiveDayField(null);
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
      return day.isWeekend || day.isHoliday || shift.isOff;
    }
    return true; // 'all'
  });

  return (
    <div className="w-full liquid-glass rounded-3xl p-3 sm:p-5 shadow-sm space-y-3.5 border border-white/90 dark:border-white/10">
      
      {/* 🌟 ONE SINGLE SLEEK HORIZONTAL TOOLBAR: TITLE + INLINE FILTERS + RESET BUTTON */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        
        {/* Left: Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight whitespace-nowrap">
            {t.dutySheetTitle}
          </h2>
        </div>

        {/* Middle: Horizontal Filter Pills (Single Row, No Stacking) */}
        <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-xs overflow-x-auto whitespace-nowrap scrollbar-none min-w-0">
          
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs shrink-0 ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.allDays} <span className="text-[10px] opacity-70">({days.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('filled')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 shrink-0 ${
              filterMode === 'filled'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>{t.filledDaysFilter}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-black/10">{filledCount}</span>
          </button>

          <button
            onClick={() => setFilterMode('pending')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 shrink-0 ${
              filterMode === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{t.pendingDaysFilter}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-black/10">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilterMode('holidays_weekends')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 shrink-0 ${
              filterMode === 'holidays_weekends'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            <Sun className="w-3 h-3 shrink-0" />
            <span>{lang === 'ro' ? 'WE / Libere' : 'WE / Off'}</span>
          </button>

        </div>

        {/* Right: Reset Month Button */}
        <button
          onClick={onClearMonth}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all shadow-sm touch-target shrink-0 flex items-center gap-1"
          title="Reset all days in current month"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-bold">{t.resetMonth}</span>
        </button>

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

            const isCurrentDayActive = activeDayField?.dateStr === day.dateStr;

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
                activeField={isCurrentDayActive ? activeDayField.field : null}
                onSetActiveField={(field) => {
                  if (field) {
                    setActiveDayField({ dateStr: day.dateStr, field });
                  } else {
                    setActiveDayField(null);
                  }
                }}
                isNextAvailable={idx < filteredDays.length - 1}
                isPrevAvailable={idx > 0}
                lang={lang}
              />
            );
          })
        ) : (
          <div className="text-center py-12 liquid-glass rounded-2xl text-slate-500 dark:text-slate-400 space-y-2">
            <p className="text-sm font-semibold">
              {t.noDaysMatchingFilter}
            </p>
            <button
              onClick={() => setFilterMode('all')}
              className="text-xs text-cyan-600 dark:text-cyan-400 font-bold underline"
            >
              Show all days
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
