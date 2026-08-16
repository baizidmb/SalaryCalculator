import React, { useRef, useEffect, useState } from 'react';
import { 
  Sparkles, 
  Moon, 
  Coffee, 
  Copy, 
  Split, 
  AlignJustify,
  CheckCircle2,
  RotateCcw,
  Sun,
  Plus,
  Clock
} from 'lucide-react';
import SmartTimeInput from './SmartTimeInput';
import { calculateShiftDayHours, decimalToTimeString } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

// Field-specific suggestion time arrays requested by user
const SUGGESTIONS = {
  start1: {
    label: 'Slot 1 Start (7 - 12)',
    times: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00']
  },
  end1: {
    label: 'Slot 1 End (3 - 6 PM)',
    times: ['15:00', '16:00', '17:00', '18:00']
  },
  start2: {
    label: 'Slot 2 Start (5 - 8 PM)',
    times: ['17:00', '18:00', '18:30', '19:00', '20:00']
  },
  end2: {
    label: 'Slot 2 End (9 - 12 PM)',
    times: ['21:00', '22:00', '23:00', '00:00']
  },
  continuousStart: {
    label: 'Start (7 - 11)',
    times: ['07:00', '08:00', '09:00', '10:00', '11:00']
  },
  continuousEnd: {
    label: 'End (3 - 7 PM)',
    times: ['15:00', '16:00', '17:00', '18:00', '19:00']
  }
};

export default function ShiftRow({
  day,
  shiftData,
  onChange,
  onDuplicateToNext,
  onCopyFromPrevious,
  onFocusNextDay,
  registerInputRef,
  isNextAvailable,
  isPrevAvailable,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang];
  const isOff = !!shiftData?.isOff;
  const mode = shiftData?.mode || 'split';

  // Active focused field for rendering floating suggestions
  const [activeField, setActiveField] = useState(null);

  // Input refs for automatic focus advancing
  const start1Ref = useRef(null);
  const end1Ref = useRef(null);
  const start2Ref = useRef(null);
  const end2Ref = useRef(null);

  const continuousStartRef = useRef(null);
  const continuousEndRef = useRef(null);

  // Helper to focus input reliably across desktop and mobile devices
  const focusInput = (ref, fieldName) => {
    setActiveField(fieldName);
    if (ref && ref.current) {
      ref.current.focus();
      if (typeof ref.current.select === 'function') {
        ref.current.select();
      }
    }
  };

  // Register primary input ref so other days can jump to this day on Enter
  useEffect(() => {
    if (registerInputRef) {
      registerInputRef(day.dateStr, {
        focus: () => {
          if (mode === 'continuous') {
            focusInput(continuousStartRef, 'continuousStart');
          } else {
            focusInput(start1Ref, 'start1');
          }
        }
      });
    }
  }, [day.dateStr, mode, registerInputRef]);

  const { workedHours, breakHours } = calculateShiftDayHours(shiftData);
  const isFilled = !isOff && workedHours > 0;
  const isPending = !isOff && workedHours === 0;

  const handleFieldChange = (field, value) => {
    onChange(day.dateStr, {
      ...shiftData,
      isOff: false,
      [field]: value
    });
  };

  // Advance focus to next input field
  const advanceFromField = (fromField) => {
    if (mode === 'split') {
      if (fromField === 'start1') {
        focusInput(end1Ref, 'end1');
      } else if (fromField === 'end1') {
        focusInput(start2Ref, 'start2');
      } else if (fromField === 'start2') {
        focusInput(end2Ref, 'end2');
      } else if (fromField === 'end2') {
        setActiveField(null);
        if (onFocusNextDay) onFocusNextDay(day.dateStr);
      }
    } else {
      if (fromField === 'continuousStart') {
        focusInput(continuousEndRef, 'continuousEnd');
      } else if (fromField === 'continuousEnd') {
        setActiveField(null);
        if (onFocusNextDay) onFocusNextDay(day.dateStr);
      }
    }
  };

  const handleSelectSuggestionTime = (timeStr) => {
    if (!activeField) return;
    const currentField = activeField;
    handleFieldChange(currentField, timeStr);
    advanceFromField(currentField);
  };

  const handleToggleOff = () => {
    const nextIsOff = !isOff;
    setActiveField(null);
    onChange(day.dateStr, {
      ...shiftData,
      isOff: nextIsOff
    });
  };

  const handleActivateDay = () => {
    onChange(day.dateStr, {
      ...shiftData,
      isOff: false
    });
    setTimeout(() => {
      if (mode === 'continuous') {
        focusInput(continuousStartRef, 'continuousStart');
      } else {
        focusInput(start1Ref, 'start1');
      }
    }, 50);
  };

  const handleModeChange = (newMode) => {
    onChange(day.dateStr, {
      ...shiftData,
      mode: newMode,
      isOff: false
    });
  };

  // Visual state styling
  let cardBorderAndBg = 'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 shadow-sm';
  
  if (isFilled) {
    cardBorderAndBg = 'border-emerald-400/80 dark:border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/5';
  } else if (isPending && day.isStandardWorkday) {
    cardBorderAndBg = 'border-dashed border-amber-300 dark:border-amber-600/60 bg-amber-50/25 dark:bg-amber-950/10';
  } else if (isOff) {
    cardBorderAndBg = 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 opacity-75';
  }

  if (day.isHoliday && isFilled) {
    cardBorderAndBg = 'border-amber-400 dark:border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-md shadow-amber-500/10';
  }

  // Get active suggestion config
  const activeSuggestionConfig = activeField ? SUGGESTIONS[activeField] : null;

  return (
    <div className={`rounded-2xl border transition-all duration-200 relative ${cardBorderAndBg}`}>
      
      {/* 📱 MOBILE VIEW (< md) */}
      <div className="md:hidden p-3.5 space-y-3">
        
        {/* Header: Day number + Day Name + Status Pill + OFF Toggle */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl font-mono font-bold text-sm border shadow-sm shrink-0 ${
              isFilled
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                : day.isHoliday 
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
                
                {/* Visual Status Indicator Pill */}
                {isFilled ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {t.filledBadge}
                  </span>
                ) : isPending && day.isStandardWorkday ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    {t.pendingBadge}
                  </span>
                ) : isOff ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t.restBadge}
                  </span>
                ) : null}

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

          {/* Quick OFF / Activate Toggle */}
          <button
            onClick={handleToggleOff}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl border shadow-sm transition-all touch-target shrink-0 flex items-center gap-1 ${
              isOff
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-rose-300 border-slate-200 dark:border-slate-800'
            }`}
            title={isOff ? 'Turn day ON' : 'Set as OFF day'}
          >
            {isOff ? (
              <>
                <Sun className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.activateDay}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.setOff}</span>
              </>
            )}
          </button>

        </div>

        {/* TIME INPUTS SECTION WITH FLOATING SUGGESTIONS */}
        {!isOff ? (
          <div className="space-y-2.5 pt-1 relative">
            
            {/* Mode Switcher */}
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

            {/* Inputs Container with Relative Anchor */}
            <div className="relative">
              
              {/* 🌟 FLOATING SUPER GLOSSY SUGGESTION CAPSULE (FLOATS DIRECTLY ABOVE THE INPUTS) */}
              {activeSuggestionConfig && (
                <div 
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="absolute bottom-full mb-2 left-0 right-0 z-40 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="w-full max-w-full p-2 rounded-2xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-white/90 dark:border-white/20 shadow-[0_12px_36px_rgba(6,182,212,0.28)] shadow-cyan-500/15">
                    <div className="flex items-center justify-between gap-1 mb-1.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-300">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-600" />
                        <span>{activeSuggestionConfig.label}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-normal">Tap to fill & advance</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
                      {activeSuggestionConfig.times.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectSuggestionTime(time);
                          }}
                          className="px-2.5 py-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-500 hover:text-white dark:hover:text-white rounded-xl border border-white/80 dark:border-slate-700 shadow-sm active:scale-95 transition-all duration-150 shrink-0 touch-manipulation"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Micro notch pointing down */}
                  <div className="w-2.5 h-2.5 rotate-45 -mt-1 bg-white/95 dark:bg-slate-900/95 border-r border-b border-white/90 dark:border-white/20 shadow-sm" />
                </div>
              )}

              {/* Time Inputs */}
              {mode === 'split' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  
                  {/* Slot 1 */}
                  <div className={`flex items-center justify-between bg-white dark:bg-slate-950/80 px-2.5 py-1.5 rounded-xl border transition-all shadow-sm ${
                    activeField === 'start1' || activeField === 'end1' 
                      ? 'border-cyan-500/80 ring-2 ring-cyan-500/10' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t.slot1}</span>
                    <div className="flex items-center gap-1">
                      <SmartTimeInput
                        ref={start1Ref}
                        value={shiftData?.start1 || ''}
                        onChange={(val) => handleFieldChange('start1', val)}
                        onComplete={() => advanceFromField('start1')}
                        onEnterPress={() => advanceFromField('start1')}
                        onFocus={() => setActiveField('start1')}
                        placeholder="00:00"
                        className={`w-16 ${activeField === 'start1' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                      />
                      <span className="text-slate-400 text-xs font-bold">→</span>
                      <SmartTimeInput
                        ref={end1Ref}
                        value={shiftData?.end1 || ''}
                        onChange={(val) => handleFieldChange('end1', val)}
                        onComplete={() => advanceFromField('end1')}
                        onEnterPress={() => advanceFromField('end1')}
                        onFocus={() => setActiveField('end1')}
                        placeholder="00:00"
                        className={`w-16 ${activeField === 'end1' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Slot 2 */}
                  <div className={`flex items-center justify-between bg-white dark:bg-slate-950/80 px-2.5 py-1.5 rounded-xl border transition-all shadow-sm ${
                    activeField === 'start2' || activeField === 'end2' 
                      ? 'border-cyan-500/80 ring-2 ring-cyan-500/10' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t.slot2}</span>
                    <div className="flex items-center gap-1">
                      <SmartTimeInput
                        ref={start2Ref}
                        value={shiftData?.start2 || ''}
                        onChange={(val) => handleFieldChange('start2', val)}
                        onComplete={() => advanceFromField('start2')}
                        onEnterPress={() => advanceFromField('start2')}
                        onFocus={() => setActiveField('start2')}
                        placeholder="00:00"
                        className={`w-16 ${activeField === 'start2' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                      />
                      <span className="text-slate-400 text-xs font-bold">→</span>
                      <SmartTimeInput
                        ref={end2Ref}
                        value={shiftData?.end2 || ''}
                        onChange={(val) => handleFieldChange('end2', val)}
                        onComplete={() => advanceFromField('end2')}
                        onEnterPress={() => advanceFromField('end2')}
                        onFocus={() => setActiveField('end2')}
                        placeholder="00:00"
                        className={`w-16 ${activeField === 'end2' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                      />
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`flex items-center justify-between bg-white dark:bg-slate-950/80 px-3 py-2 rounded-xl border transition-all shadow-sm ${
                  activeField === 'continuousStart' || activeField === 'continuousEnd' 
                    ? 'border-cyan-500/80 ring-2 ring-cyan-500/10' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{t.interval}</span>
                  <div className="flex items-center gap-2">
                    <SmartTimeInput
                      ref={continuousStartRef}
                      value={shiftData?.continuousStart || ''}
                      onChange={(val) => handleFieldChange('continuousStart', val)}
                      onComplete={() => advanceFromField('continuousStart')}
                      onEnterPress={() => advanceFromField('continuousStart')}
                      onFocus={() => setActiveField('continuousStart')}
                      placeholder="00:00"
                      className="w-20"
                    />
                    <span className="text-slate-400 text-xs font-bold">→</span>
                    <SmartTimeInput
                      ref={continuousEndRef}
                      value={shiftData?.continuousEnd || ''}
                      onChange={(val) => handleFieldChange('continuousEnd', val)}
                      onComplete={() => advanceFromField('continuousEnd')}
                      onEnterPress={() => advanceFromField('continuousEnd')}
                      onFocus={() => setActiveField('continuousEnd')}
                      placeholder="00:00"
                      className="w-20"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          // DISABLED REST DAY BANNER
          <div className="py-3 px-4 rounded-xl bg-slate-100/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <Moon className="w-4 h-4 text-slate-400" />
              <span>{t.offDayLabel}</span>
            </div>
            <button
              onClick={handleActivateDay}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.activateDay}</span>
            </button>
          </div>
        )}

        {/* Mobile Footer: Break + Actions + Hours Tag */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <div>
            {breakHours > 0 && !isOff && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                <Coffee className="w-3 h-3 text-amber-500" />
                {t.breakPill} {decimalToTimeString(breakHours, true)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isPrevAvailable && (
              <button
                onClick={() => onCopyFromPrevious(day.dateStr)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                title={t.copyPrevious}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {isNextAvailable && !isOff && workedHours > 0 && (
              <button
                onClick={() => onDuplicateToNext(day.dateStr)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                title={t.duplicateToNext}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            <div className={`min-w-[68px] text-center px-2.5 py-1 rounded-xl font-mono font-bold text-xs border shadow-sm ${
              workedHours >= 8 
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40' 
                : workedHours > 0 
                  ? 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30' 
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
            }`}>
              {workedHours > 0 && !isOff ? `${workedHours.toFixed(1)}h` : '0.0h'}
            </div>
          </div>
        </div>

      </div>


      {/* 🖥️ DESKTOP VIEW (md+) */}
      <div className="hidden md:block p-3.5 relative">
        
        <div className="flex items-center justify-between gap-3">
          
          {/* Day & Date Column */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl font-mono font-bold text-base border shadow-sm shrink-0 ${
              isFilled
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                : day.isHoliday 
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
                
                {/* Visual Status Indicator Pill */}
                {isFilled ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {t.filledBadge}
                  </span>
                ) : isPending && day.isStandardWorkday ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    {t.pendingBadge}
                  </span>
                ) : isOff ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t.restBadge}
                  </span>
                ) : null}

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

          {/* INPUTS / DISABLED VIEW */}
          {!isOff ? (
            <div className="flex-1 flex flex-wrap items-center gap-2.5 relative">
              
              {/* 🌟 DESKTOP FLOATING GLOSSY SUGGESTION CAPSULE */}
              {activeSuggestionConfig && (
                <div 
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="absolute bottom-full mb-2 left-0 z-40 flex flex-col items-start animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-white/90 dark:border-white/20 shadow-[0_12px_36px_rgba(6,182,212,0.28)] shadow-cyan-500/15">
                    <div className="flex items-center gap-1 text-xs font-bold text-cyan-800 dark:text-cyan-300 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{activeSuggestionConfig.label}:</span>
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none">
                      {activeSuggestionConfig.times.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectSuggestionTime(time);
                          }}
                          className="px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-500 hover:text-white dark:hover:text-white rounded-xl border border-white/80 dark:border-slate-700 shadow-sm active:scale-95 transition-all duration-150 shrink-0"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rotate-45 ml-6 -mt-1 bg-white/95 dark:bg-slate-900/95 border-r border-b border-white/90 dark:border-white/20 shadow-sm" />
                </div>
              )}

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

              {/* Time inputs with auto-advance */}
              {mode === 'split' ? (
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Slot 1 */}
                  <div className={`flex items-center gap-1 bg-white dark:bg-slate-950/80 px-2 py-1 rounded-xl border transition-all shadow-sm ${
                    activeField === 'start1' || activeField === 'end1' ? 'border-cyan-500/80 ring-2 ring-cyan-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.slot1}</span>
                    <SmartTimeInput
                      ref={start1Ref}
                      value={shiftData?.start1 || ''}
                      onChange={(val) => handleFieldChange('start1', val)}
                      onComplete={() => advanceFromField('start1')}
                      onEnterPress={() => advanceFromField('start1')}
                      onFocus={() => setActiveField('start1')}
                      placeholder="00:00"
                      className={`w-16 ${activeField === 'start1' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                    />
                    <span className="text-slate-400 text-xs font-bold">→</span>
                    <SmartTimeInput
                      ref={end1Ref}
                      value={shiftData?.end1 || ''}
                      onChange={(val) => handleFieldChange('end1', val)}
                      onComplete={() => advanceFromField('end1')}
                      onEnterPress={() => advanceFromField('end1')}
                      onFocus={() => setActiveField('end1')}
                      placeholder="00:00"
                      className={`w-16 ${activeField === 'end1' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                    />
                  </div>

                  {breakHours > 0 && !isOff && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-slate-700 font-mono shadow-sm">
                      <Coffee className="w-3 h-3 text-amber-500" />
                      <span>{t.breakPill} {decimalToTimeString(breakHours, true)}</span>
                    </div>
                  )}

                  {/* Slot 2 */}
                  <div className={`flex items-center gap-1 bg-white dark:bg-slate-950/80 px-2 py-1 rounded-xl border transition-all shadow-sm ${
                    activeField === 'start2' || activeField === 'end2' ? 'border-cyan-500/80 ring-2 ring-cyan-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.slot2}</span>
                    <SmartTimeInput
                      ref={start2Ref}
                      value={shiftData?.start2 || ''}
                      onChange={(val) => handleFieldChange('start2', val)}
                      onComplete={() => advanceFromField('start2')}
                      onEnterPress={() => advanceFromField('start2')}
                      onFocus={() => setActiveField('start2')}
                      placeholder="00:00"
                      className={`w-16 ${activeField === 'start2' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                    />
                    <span className="text-slate-400 text-xs font-bold">→</span>
                    <SmartTimeInput
                      ref={end2Ref}
                      value={shiftData?.end2 || ''}
                      onChange={(val) => handleFieldChange('end2', val)}
                      onComplete={() => advanceFromField('end2')}
                      onEnterPress={() => advanceFromField('end2')}
                      onFocus={() => setActiveField('end2')}
                      placeholder="00:00"
                      className={`w-16 ${activeField === 'end2' ? 'ring-2 ring-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/40' : ''}`}
                    />
                  </div>

                </div>
              ) : (
                <div className={`flex items-center gap-1.5 bg-white dark:bg-slate-950/80 px-2.5 py-1 rounded-xl border transition-all shadow-sm ${
                  activeField === 'continuousStart' || activeField === 'continuousEnd' ? 'border-cyan-500/80 ring-2 ring-cyan-500/10' : 'border-slate-200 dark:border-slate-800'
                }`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t.interval}</span>
                  <SmartTimeInput
                    ref={continuousStartRef}
                    value={shiftData?.continuousStart || ''}
                    onChange={(val) => handleFieldChange('continuousStart', val)}
                    onComplete={() => advanceFromField('continuousStart')}
                    onEnterPress={() => advanceFromField('continuousStart')}
                    onFocus={() => setActiveField('continuousStart')}
                    placeholder="00:00"
                    className="w-20"
                  />
                  <span className="text-slate-400 text-xs font-bold">→</span>
                  <SmartTimeInput
                    ref={continuousEndRef}
                    value={shiftData?.continuousEnd || ''}
                    onChange={(val) => handleFieldChange('continuousEnd', val)}
                    onComplete={() => advanceFromField('continuousEnd')}
                    onEnterPress={() => advanceFromField('continuousEnd')}
                    onFocus={() => setActiveField('continuousEnd')}
                    placeholder="00:00"
                    className="w-20"
                  />
                </div>
              )}

            </div>
          ) : (
            // DISABLED REST DAY BANNER
            <div className="flex-1 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-800/80 shadow-sm">
                <Moon className="w-3.5 h-3.5 text-slate-400" />
                {t.offDayLabel}
              </span>
              <button
                onClick={handleActivateDay}
                className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.activateDay}</span>
              </button>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {isPrevAvailable && (
              <button
                onClick={() => onCopyFromPrevious(day.dateStr)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
                title={t.copyPrevious}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {isNextAvailable && !isOff && workedHours > 0 && (
              <button
                onClick={() => onDuplicateToNext(day.dateStr)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
                title={t.duplicateToNext}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleToggleOff}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl border shadow-sm transition-all touch-target flex items-center gap-1 ${
                isOff
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                  : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-rose-300 border-slate-200 dark:border-slate-800'
              }`}
              title={isOff ? 'Turn day ON' : 'Set as OFF day'}
            >
              {isOff ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.activateDay}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.setOff}</span>
                </>
              )}
            </button>

            <div className={`min-w-[72px] text-center px-2.5 py-1 rounded-xl font-mono font-bold text-xs border shadow-sm ${
              workedHours >= 8 
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40' 
                : workedHours > 0 
                  ? 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30' 
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
            }`}>
              {workedHours > 0 && !isOff ? `${workedHours.toFixed(1)}h` : '0.0h'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
