import React from 'react';
import { 
  Sparkles, 
  Moon, 
  Coffee, 
  Copy, 
  Split, 
  AlignJustify 
} from 'lucide-react';
import { calculateShiftDayHours, decimalToTimeString } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function ShiftRow({
  day,
  shiftData,
  onChange,
  onDuplicateToNext,
  isNextAvailable,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang];
  const isOff = !!shiftData?.isOff;
  const mode = shiftData?.mode || 'split';

  const { workedHours, breakHours } = calculateShiftDayHours(shiftData);

  const handleFieldChange = (field, value) => {
    onChange(day.dateStr, {
      ...shiftData,
      isOff: false,
      [field]: value
    });
  };

  const handleToggleOff = () => {
    onChange(day.dateStr, {
      ...shiftData,
      isOff: !isOff
    });
  };

  const handleModeChange = (newMode) => {
    onChange(day.dateStr, {
      ...shiftData,
      mode: newMode,
      isOff: false
    });
  };

  // Row background according to day type
  let rowBg = 'bg-white/60 dark:bg-slate-900/40 hover:bg-white/90 dark:hover:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/60 shadow-sm';
  if (day.isHoliday) {
    rowBg = 'bg-amber-500/10 dark:bg-amber-950/20 hover:bg-amber-500/15 dark:hover:bg-amber-950/30 border-amber-500/30 shadow-sm';
  } else if (day.isWeekend) {
    rowBg = 'bg-slate-50/80 dark:bg-slate-950/60 hover:bg-white/80 dark:hover:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80';
  }

  if (isOff) {
    rowBg += ' opacity-55';
  }

  return (
    <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-150 ${rowBg}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Day & Date & Badges Column */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-[180px]">
          
          {/* Day Number Box */}
          <div className={`flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-mono font-bold text-sm sm:text-base border shadow-sm shrink-0 ${
            day.isHoliday 
              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40' 
              : day.isWeekend 
                ? 'bg-slate-200 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border-slate-300 dark:border-slate-700' 
                : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800'
          }`}>
            <span>{String(day.dayNumber).padStart(2, '0')}</span>
            <span className="text-[8px] sm:text-[9px] uppercase font-sans font-semibold tracking-wider text-slate-500 dark:text-slate-400">
              {day.dayNameShort}
            </span>
          </div>

          {/* Day Details & Holiday Badge */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {day.dayNameFull}
              </span>
              
              {day.isWeekend && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                  {t.weekendBadge}
                </span>
              )}
            </div>

            {day.isHoliday ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 truncate">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                {day.holidayInfo?.shortName || t.legalHoliday}
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                {day.isStandardWorkday ? t.standardWorkday : t.nonWorkday}
              </span>
            )}
          </div>

        </div>

        {/* Shift Mode & Inputs Controls */}
        {!isOff ? (
          <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Mode Switcher Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950/90 rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
              <button
                onClick={() => handleModeChange('split')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all touch-target ${
                  mode === 'split' 
                    ? 'bg-cyan-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Split Shift with break"
              >
                <Split className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs">{t.splitMode}</span>
              </button>

              <button
                onClick={() => handleModeChange('continuous')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all touch-target ${
                  mode === 'continuous' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Continuous Shift"
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs">{t.continuousMode}</span>
              </button>
            </div>

            {/* Time Input Fields based on mode */}
            {mode === 'split' ? (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                
                {/* Slot 1: Start 1 -> End 1 / Break Start */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">{t.slot1}</span>
                  <input
                    type="time"
                    value={shiftData?.start1 || ''}
                    onChange={(e) => handleFieldChange('start1', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1 py-0.5 rounded-lg outline-none"
                    placeholder="11:00"
                  />
                  <span className="text-slate-400 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.end1 || ''}
                    onChange={(e) => handleFieldChange('end1', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1 py-0.5 rounded-lg outline-none"
                    placeholder="17:00"
                  />
                </div>

                {/* Break Indicator Pill */}
                {breakHours > 0 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-slate-700 font-mono shadow-sm" title="Break duration">
                    <Coffee className="w-3 h-3 text-amber-500" />
                    <span>{t.breakPill} {decimalToTimeString(breakHours, true)}</span>
                  </div>
                )}

                {/* Slot 2: Break End -> End 2 */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">{t.slot2}</span>
                  <input
                    type="time"
                    value={shiftData?.start2 || ''}
                    onChange={(e) => handleFieldChange('start2', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1 py-0.5 rounded-lg outline-none"
                    placeholder="18:30"
                  />
                  <span className="text-slate-400 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.end2 || ''}
                    onChange={(e) => handleFieldChange('end2', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1 py-0.5 rounded-lg outline-none"
                    placeholder="23:00"
                  />
                </div>

              </div>
            ) : (
              // Continuous mode
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">{t.interval}</span>
                <input
                  type="time"
                  value={shiftData?.continuousStart || ''}
                  onChange={(e) => handleFieldChange('continuousStart', e.target.value)}
                  className="liquid-input text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-lg outline-none"
                  placeholder="12:00"
                />
                <span className="text-slate-400 text-xs">→</span>
                <input
                  type="time"
                  value={shiftData?.continuousEnd || ''}
                  onChange={(e) => handleFieldChange('continuousEnd', e.target.value)}
                  className="liquid-input text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-lg outline-none"
                  placeholder="23:30"
                />
              </div>
            )}

          </div>
        ) : (
          /* Day marked as OFF display */
          <div className="flex-1 flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <Moon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              {t.offDayLabel}
            </span>
          </div>
        )}

        {/* Action Controls & Total Hours Pill */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/60">
          
          {/* Quick OFF Toggle Button */}
          <button
            onClick={handleToggleOff}
            className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-xl border shadow-sm transition-all touch-target ${
              isOff
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800'
            }`}
            title="Toggle Day Off"
          >
            {isOff ? t.activateDay : t.setOff}
          </button>

          {/* Duplicate to Next Day Button */}
          {isNextAvailable && !isOff && workedHours > 0 && (
            <button
              onClick={() => onDuplicateToNext(day.dateStr)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-sm touch-target flex items-center justify-center"
              title={t.duplicateToNext}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Daily Total Hours Tag */}
          <div className={`min-w-[64px] sm:min-w-[70px] text-center px-2 sm:px-2.5 py-1 rounded-xl font-mono font-bold text-xs border shadow-sm ${
            workedHours >= 8 
              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
              : workedHours > 0 
                ? 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30' 
                : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
          }`}>
            {workedHours > 0 ? `${workedHours.toFixed(1)}h` : '0.0h'}
          </div>

        </div>

      </div>
    </div>
  );
}
