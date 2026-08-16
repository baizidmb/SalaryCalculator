import React from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Coffee, 
  Copy, 
  Check, 
  XCircle, 
  Clock, 
  Split, 
  AlignJustify 
} from 'lucide-react';
import { calculateShiftDayHours, decimalToTimeString } from '../utils/salaryEngine';

export default function ShiftRow({
  day,
  shiftData,
  onChange,
  onDuplicateToNext,
  isNextAvailable
}) {
  const isOff = !!shiftData?.isOff;
  const mode = shiftData?.mode || 'split';

  const { workedHours, breakHours } = calculateShiftDayHours(shiftData);

  const handleFieldChange = (field, value) => {
    onChange(day.dateStr, {
      ...shiftData,
      isOff: false, // Entering time automatically turns OFF state off
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

  // Determine row style based on weekend, holiday, or off
  let rowBg = 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/60';
  if (day.isHoliday) {
    rowBg = 'bg-amber-950/20 hover:bg-amber-950/30 border-amber-500/30';
  } else if (day.isWeekend) {
    rowBg = 'bg-slate-950/60 hover:bg-slate-900/50 border-slate-800/80';
  }

  if (isOff) {
    rowBg += ' opacity-50';
  }

  return (
    <div className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-150 shift-row-hover ${rowBg}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Day & Date & Badges Column */}
        <div className="flex items-center gap-3 min-w-[200px]">
          
          {/* Day Number Box */}
          <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl font-mono font-bold text-base border shadow-sm ${
            day.isHoliday 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : day.isWeekend 
                ? 'bg-slate-800 text-cyan-400 border-slate-700' 
                : 'bg-slate-950 text-white border-slate-800'
          }`}>
            <span>{String(day.dayNumber).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase font-sans font-semibold tracking-wider text-slate-400">
              {day.dayNameShort}
            </span>
          </div>

          {/* Day Details & Holiday Badge */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                {day.dayNameFull}
              </span>
              
              {day.isWeekend && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Weekend
                </span>
              )}
            </div>

            {day.isHoliday ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {day.holidayInfo?.shortName || 'Sărbătoare Legală'}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                {day.isStandardWorkday ? 'Zi lucrătoare normă' : 'Zi nelucrătoare'}
              </span>
            )}
          </div>

        </div>

        {/* Shift Mode & Inputs Controls */}
        {!isOff ? (
          <div className="flex-1 flex flex-wrap items-center gap-3">
            
            {/* Mode Switcher Buttons */}
            <div className="flex items-center bg-slate-950/90 rounded-lg p-0.5 border border-slate-800 shrink-0">
              <button
                onClick={() => handleModeChange('split')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  mode === 'split' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tură Frântă / Split cu Pauză inclusă"
              >
                <Split className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              <button
                onClick={() => handleModeChange('continuous')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  mode === 'continuous' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tură Continuă"
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span>Continuu</span>
              </button>
            </div>

            {/* Time Input Fields based on mode */}
            {mode === 'split' ? (
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Slot 1: Start 1 -> End 1 / Break Start */}
                <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Tura 1</span>
                  <input
                    type="time"
                    value={shiftData?.start1 || ''}
                    onChange={(e) => handleFieldChange('start1', e.target.value)}
                    className="glass-input text-xs font-mono font-bold px-1.5 py-0.5 rounded outline-none"
                    placeholder="11:00"
                  />
                  <span className="text-slate-500 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.end1 || ''}
                    onChange={(e) => handleFieldChange('end1', e.target.value)}
                    className="glass-input text-xs font-mono font-bold px-1.5 py-0.5 rounded outline-none"
                    placeholder="17:00"
                  />
                </div>

                {/* Break Indicator Pill */}
                {breakHours > 0 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] border border-slate-700 font-mono" title="Pauză între ture">
                    <Coffee className="w-3 h-3 text-amber-400" />
                    <span>Pauză: {decimalToTimeString(breakHours, true)}</span>
                  </div>
                )}

                {/* Slot 2: Break End -> End 2 */}
                <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Tura 2</span>
                  <input
                    type="time"
                    value={shiftData?.start2 || ''}
                    onChange={(e) => handleFieldChange('start2', e.target.value)}
                    className="glass-input text-xs font-mono font-bold px-1.5 py-0.5 rounded outline-none"
                    placeholder="18:30"
                  />
                  <span className="text-slate-500 text-xs">→</span>
                  <input
                    type="time"
                    value={shiftData?.end2 || ''}
                    onChange={(e) => handleFieldChange('end2', e.target.value)}
                    className="glass-input text-xs font-mono font-bold px-1.5 py-0.5 rounded outline-none"
                    placeholder="23:00"
                  />
                </div>

              </div>
            ) : (
              // Continuous mode
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Interval</span>
                <input
                  type="time"
                  value={shiftData?.continuousStart || ''}
                  onChange={(e) => handleFieldChange('continuousStart', e.target.value)}
                  className="glass-input text-xs font-mono font-bold px-2 py-0.5 rounded outline-none"
                  placeholder="12:00"
                />
                <span className="text-slate-500 text-xs">→</span>
                <input
                  type="time"
                  value={shiftData?.continuousEnd || ''}
                  onChange={(e) => handleFieldChange('continuousEnd', e.target.value)}
                  className="glass-input text-xs font-mono font-bold px-2 py-0.5 rounded outline-none"
                  placeholder="23:30"
                />
              </div>
            )}

          </div>
        ) : (
          /* Day marked as OFF display */
          <div className="flex-1 flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/60 text-slate-400 text-xs font-semibold border border-slate-800/80">
              <Moon className="w-3.5 h-3.5 text-slate-500" />
              Zi Liberă (OFF - 0 ore)
            </span>
          </div>
        )}

        {/* Action Controls & Total Hours Pill */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
          
          {/* Quick OFF Toggle Button */}
          <button
            onClick={handleToggleOff}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              isOff
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
            title="Marchează ca Zi Liberă"
          >
            {isOff ? 'Activează Zi' : 'Setează OFF'}
          </button>

          {/* Duplicate to Next Day Button */}
          {isNextAvailable && !isOff && workedHours > 0 && (
            <button
              onClick={() => onDuplicateToNext(day.dateStr)}
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
              title="Copiază acest orar în ziua următoare"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Daily Total Hours Tag */}
          <div className={`min-w-[70px] text-center px-2.5 py-1 rounded-lg font-mono font-bold text-xs border ${
            workedHours >= 8 
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
              : workedHours > 0 
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}>
            {workedHours > 0 ? `${workedHours.toFixed(1)}h` : '0.0h'}
          </div>

        </div>

      </div>
    </div>
  );
}
