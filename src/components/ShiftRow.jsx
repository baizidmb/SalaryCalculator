import React from 'react';
import { 
  Sparkles, 
  Moon, 
  Coffee, 
  Copy, 
  Split, 
  AlignJustify,
  Check,
  Clock
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

  // Quick 1-tap preset handlers
  const handleApply8hStandard = () => {
    onChange(day.dateStr, {
      ...shiftData,
      mode: 'continuous',
      isOff: false,
      continuousStart: '09:00',
      continuousEnd: '17:00'
    });
  };

  const handleApplySplitPreset = () => {
    onChange(day.dateStr, {
      ...shiftData,
      mode: 'split',
      isOff: false,
      start1: '11:00',
      end1: '17:00',
      start2: '18:30',
      end2: '23:00'
    });
  };

  // Row background styles
  let cardBg = 'bg-white/70 dark:bg-slate-900/40 hover:bg-white/95 dark:hover:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/60 shadow-sm';
  if (day.isHoliday) {
    cardBg = 'bg-amber-500/10 dark:bg-amber-950/20 hover:bg-amber-500/15 dark:hover:bg-amber-950/30 border-amber-400/40 dark:border-amber-500/30 shadow-sm';
  } else if (day.isWeekend) {
    cardBg = 'bg-slate-50/80 dark:bg-slate-950/60 hover:bg-white/80 dark:hover:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80';
  }

  if (isOff) {
    cardBg += ' opacity-60';
  }

  return (
    <div className={`rounded-2xl border transition-all duration-150 ${cardBg}`}>
      
      {/* 📱 MOBILE VIEW (< md) - SPACIOUS TOUCH CARD */}
      <div className="md:hidden p-3.5 space-y-3">
        
        {/* Mobile Header: Day info + OFF Toggle */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl font-mono font-bold text-sm border shadow-sm shrink-0 ${
              day.isHoliday 
                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40' 
                : day.isWeekend 
                  ? 'bg-slate-200 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border-slate-300 dark:border-slate-700' 
                  : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800'
            }`}>
              <span>{String(day.dayNumber).padStart(2, '0')}</span>
              <span className="text-[8px] uppercase font-sans font-semibold tracking-wider text-slate-500">
                {day.dayNameShort}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {day.dayNameFull}
                </span>
                {day.isWeekend && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                    {t.weekendBadge}
                  </span>
                )}
              </div>
              {day.isHoliday ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 truncate">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  {day.holidayInfo?.shortName || t.legalHoliday}
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">
                  {day.isStandardWorkday ? t.standardWorkday : t.nonWorkday}
                </span>
              )}
            </div>
          </div>

          {/* Quick OFF Toggle */}
          <button
            onClick={handleToggleOff}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl border shadow-sm transition-all touch-target shrink-0 ${
              isOff
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800'
            }`}
          >
            {isOff ? t.activateDay : t.setOff}
          </button>

        </div>

        {/* Mobile Quick 1-Tap Preset Bar */}
        {!isOff && (
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] text-slate-400 font-semibold shrink-0 mr-1">{t.presetsLabel}</span>
            <button
              onClick={handleApply8hStandard}
              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 shrink-0"
            >
              {t.preset8h}
            </button>
            <button
              onClick={handleApplySplitPreset}
              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 shrink-0"
            >
              {t.presetSplit}
            </button>
            <button
              onClick={handleToggleOff}
              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 shrink-0"
            >
              {t.presetOff}
            </button>
          </div>
        )}

        {/* Mobile Inputs Section */}
        {!isOff ? (
          <div className="space-y-2.5 pt-1">
            
            {/* Mode Switcher Segmented Control */}
            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950/90 rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
              <button
                onClick={() => handleModeChange('split')}
                className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                  mode === 'split' 
                    ? 'bg-cyan-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>{t.splitMode}</span>
              </button>

              <button
                onClick={() => handleModeChange('continuous')}
                className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                  mode === 'continuous' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span>{t.continuousMode}</span>
              </button>
            </div>

            {/* Mobile Time Inputs Grid */}
            {mode === 'split' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                {/* Slot 1 */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{t.slot1}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="time"
                      value={shiftData?.start1 || ''}
                      onChange={(e) => handleFieldChange('start1', e.target.value)}
                      className="liquid-input text-xs font-mono font-bold px-1.5 py-1 rounded-lg outline-none"
                    />
                    <span className="text-slate-400 text-xs">→</span>
                    <input
                      type="time"
                      value={shiftData?.end1 || ''}
                      onChange={(e) => handleFieldChange('end1', e.target.value)}
                      className="liquid-input text-xs font-mono font-bold px-1.5 py-1 rounded-lg outline-none"
                    />
                  </div>
                </div>

                {/* Slot 2 */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{t.slot2}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="time"
                      value={shiftData?.start2 || ''}
                      onChange={(e) => handleFieldChange('start2', e.target.value)}
                      className="liquid-input text-xs font-mono font-bold px-1.5 py-1 rounded-lg outline-none"
                    />
                    <span className="text-slate-400 text-xs">→</span>
                    <input
                      type="time"
                      value={shiftData?.end2 || ''}
                      onChange={(e) => handleFieldChange('end2', e.target.value)}
                      className="liquid-input text-xs font-mono font-bold px-1.5 py-1 rounded-lg outline-none"
                    />
                  </div>
                </div>

              </div>
            ) : (
              // Continuous mode mobile
              <div className="flex items-center justify-between bg-white dark:bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.interval}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={shiftData?.continuousStart || ''}
                    onChange={(e) => handleFieldChange('continuousStart', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-2 py-1 rounded-lg outline-none"
                  />
                  <span className="text-slate-400 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.continuousEnd || ''}
                    onChange={(e) => handleFieldChange('continuousEnd', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-2 py-1 rounded-lg outline-none"
                  />
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="py-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.offDayLabel}</span>
          </div>
        )}

        {/* Mobile Footer: Break info & Total Hours & Copy */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <div>
            {breakHours > 0 && !isOff && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                <Coffee className="w-3 h-3 text-amber-500" />
                {t.breakPill} {decimalToTimeString(breakHours, true)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isNextAvailable && !isOff && workedHours > 0 && (
              <button
                onClick={() => onDuplicateToNext(day.dateStr)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                title={t.duplicateToNext}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            <div className={`min-w-[64px] text-center px-2.5 py-1 rounded-xl font-mono font-bold text-xs border shadow-sm ${
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


      {/* 🖥️ DESKTOP VIEW (md+) - STREAMLINED INLINE ROW */}
      <div className="hidden md:flex p-4 items-center justify-between gap-3">
        
        {/* Day & Date Column */}
        <div className="flex items-center gap-3 min-w-[190px]">
          <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl font-mono font-bold text-base border shadow-sm shrink-0 ${
            day.isHoliday 
              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40' 
              : day.isWeekend 
                ? 'bg-slate-200 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border-slate-300 dark:border-slate-700' 
                : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800'
          }`}>
            <span>{String(day.dayNumber).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase font-sans font-semibold tracking-wider text-slate-500">
              {day.dayNameShort}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
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
              <span className="text-[11px] text-slate-500">
                {day.isStandardWorkday ? t.standardWorkday : t.nonWorkday}
              </span>
            )}
          </div>
        </div>

        {/* Inputs */}
        {!isOff ? (
          <div className="flex-1 flex items-center gap-3">
            
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950/90 rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
              <button
                onClick={() => handleModeChange('split')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'split' 
                    ? 'bg-cyan-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>{t.splitMode}</span>
              </button>

              <button
                onClick={() => handleModeChange('continuous')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'continuous' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span>{t.continuousMode}</span>
              </button>
            </div>

            {/* Time inputs */}
            {mode === 'split' ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t.slot1}</span>
                  <input
                    type="time"
                    value={shiftData?.start1 || ''}
                    onChange={(e) => handleFieldChange('start1', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1.5 py-0.5 rounded-lg outline-none"
                  />
                  <span className="text-slate-400 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.end1 || ''}
                    onChange={(e) => handleFieldChange('end1', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1.5 py-0.5 rounded-lg outline-none"
                  />
                </div>

                {breakHours > 0 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-slate-700 font-mono shadow-sm">
                    <Coffee className="w-3 h-3 text-amber-500" />
                    <span>{t.breakPill} {decimalToTimeString(breakHours, true)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1 bg-white dark:bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t.slot2}</span>
                  <input
                    type="time"
                    value={shiftData?.start2 || ''}
                    onChange={(e) => handleFieldChange('start2', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1.5 py-0.5 rounded-lg outline-none"
                  />
                  <span className="text-slate-400 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.end2 || ''}
                    onChange={(e) => handleFieldChange('end2', e.target.value)}
                    className="liquid-input text-xs font-mono font-bold px-1.5 py-0.5 rounded-lg outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{t.interval}</span>
                <input
                  type="time"
                  value={shiftData?.continuousStart || ''}
                  onChange={(e) => handleFieldChange('continuousStart', e.target.value)}
                  className="liquid-input text-xs font-mono font-bold px-2 py-0.5 rounded-lg outline-none"
                />
                <span className="text-slate-400 text-xs">→</span>
                <input
                  type="time"
                  value={shiftData?.continuousEnd || ''}
                  onChange={(e) => handleFieldChange('continuousEnd', e.target.value)}
                  className="liquid-input text-xs font-mono font-bold px-2 py-0.5 rounded-lg outline-none"
                />
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <Moon className="w-3.5 h-3.5 text-slate-400" />
              {t.offDayLabel}
            </span>
          </div>
        )}

        {/* Desktop Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleToggleOff}
            className={`px-3 py-1 text-xs font-bold rounded-xl border shadow-sm transition-all touch-target ${
              isOff
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800'
            }`}
          >
            {isOff ? t.activateDay : t.setOff}
          </button>

          {isNextAvailable && !isOff && workedHours > 0 && (
            <button
              onClick={() => onDuplicateToNext(day.dateStr)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
              title={t.duplicateToNext}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          <div className={`min-w-[70px] text-center px-2.5 py-1 rounded-xl font-mono font-bold text-xs border shadow-sm ${
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
