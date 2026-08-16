import React, { useState } from 'react';
import { 
  Calendar, 
  Wand2, 
  Trash2, 
  Sun, 
  Split, 
  Clock 
} from 'lucide-react';
import ShiftRow from './ShiftRow';
import { calculateShiftDayHours } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function DutyGrid({
  days,
  shifts,
  onShiftChange,
  onBulkFillWeekdaysStandard,
  onBulkFillSplitTemplate,
  onSetWeekendsOff,
  onClearMonth,
  onDuplicateRow,
  lang = 'en'
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'worked' | 'holidays_weekends'
  const t = TRANSLATIONS[lang];

  const filteredDays = days.filter(d => {
    if (filterMode === 'all') return true;
    const shift = shifts[d.dateStr] || { isOff: d.isWeekend };
    const { workedHours } = calculateShiftDayHours(shift);

    if (filterMode === 'worked') {
      return !shift.isOff && workedHours > 0;
    }
    if (filterMode === 'holidays_weekends') {
      return d.isWeekend || d.isHoliday;
    }
    return true;
  });

  return (
    <div className="w-full liquid-glass rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Top Toolbar: Title & Filter Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {t.dutySheetTitle}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {t.dutySheetSubtitle}
            </p>
          </div>
        </div>

        {/* Filter Tabs (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 self-start xl:self-auto overflow-x-auto max-w-full shadow-sm scrollbar-none">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 touch-target ${
              filterMode === 'all'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.allDays} ({days.length})
          </button>

          <button
            onClick={() => setFilterMode('worked')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 touch-target ${
              filterMode === 'worked'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.workedDays}
          </button>

          <button
            onClick={() => setFilterMode('holidays_weekends')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 touch-target ${
              filterMode === 'holidays_weekends'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.weekendHolidays}
          </button>
        </div>

      </div>

      {/* Bulk Action Toolbar (Horizontal scroll / responsive wrap) */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-white/50 dark:bg-slate-950/40 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/50 shadow-sm">
        <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 pr-1">
          <Wand2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> {t.quickActions}
        </span>

        <button
          onClick={onBulkFillWeekdaysStandard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors touch-target"
          title="Auto-fill 8h standard weekdays"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.fillStandardWeekdays}</span>
        </button>

        <button
          onClick={onBulkFillSplitTemplate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors touch-target"
          title="Apply split shift template"
        >
          <Split className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{t.fillSplitTemplate}</span>
        </button>

        <button
          onClick={onSetWeekendsOff}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors touch-target"
          title="Mark all weekends as OFF"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.setWeekendsOff}</span>
        </button>

        <div className="w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0">
          <button
            onClick={onClearMonth}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 transition-colors touch-target"
            title="Reset month logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.resetMonth}</span>
          </button>
        </div>
      </div>

      {/* Grid of Days */}
      <div className="space-y-2.5">
        {filteredDays.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
            {t.noDaysMatchingFilter}
          </div>
        ) : (
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

            const isNextAvailable = idx < days.length - 1;

            return (
              <ShiftRow
                key={day.dateStr}
                day={day}
                shiftData={shiftData}
                onChange={onShiftChange}
                onDuplicateToNext={onDuplicateRow}
                isNextAvailable={isNextAvailable}
                lang={lang}
              />
            );
          })
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div>
          {t.showingDays} <strong className="text-slate-800 dark:text-slate-200">{filteredDays.length}</strong> {t.ofDays} <strong className="text-slate-800 dark:text-slate-200">{days.length}</strong> {t.daysInMonth}
        </div>
        <div>
          <span>{t.autoSaveNotice}</span>
        </div>
      </div>

    </div>
  );
}
