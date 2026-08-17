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
  let offCount = 0;

  days.forEach(d => {
    const shift = shifts[d.dateStr] || { isOff: d.isWeekend };
    const { workedHours } = calculateShiftDayHours(shift);
    if (!shift.isOff && workedHours > 0) {
      filledCount++;
    } else if (!shift.isOff && workedHours === 0) {
      pendingCount++;
    } else if (shift.isOff || d.isWeekend || d.isHoliday) {
      offCount++;
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
    <div className="w-full liquid-glass rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3.5 border border-white/90 dark:border-white/10">
      
      {/* 🌟 2-TIER CLEAN TOOLBAR: 100% CONTAINED, ZERO OVERFLOW ON MOBILE & PC */}
      <div className="space-y-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        
        {/* Tier 1: Title & Subtitle + Reset Month Button */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
                {t.dutySheetTitle}
              </h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden xs:inline shrink-0">
                • {days.length} {t.daysInMonth}
              </span>
            </div>
          </div>

          {/* Reset Month Button - Neatly Placed in Top Right */}
          <button
            onClick={onClearMonth}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all shadow-sm touch-target shrink-0"
            title="Reset all days in current month"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="font-bold">{t.resetMonth}</span>
          </button>

        </div>

        {/* Tier 2: Responsive Full-Width Filter Tabs */}
        <div className="w-full flex items-center gap-1 bg-slate-100/90 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-inner text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl font-bold transition-all text-center ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.allDays} <span className="text-[10px] font-normal opacity-70">({days.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('filled')}
            className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              filterMode === 'filled'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>{t.filledDaysFilter}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-black/10">
              {filledCount}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('pending')}
            className={`flex-1 min-w-[85px] py-1.5 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              filterMode === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{t.pendingDaysFilter}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-black/10">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('holidays_weekends')}
            className={`flex-1 min-w-[100px] py-1.5 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
              filterMode === 'holidays_weekends'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            <Sun className="w-3 h-3 shrink-0" />
            <span>{lang === 'ro' ? 'WE & Sărbători' : 'WE & Holidays'}</span>
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
