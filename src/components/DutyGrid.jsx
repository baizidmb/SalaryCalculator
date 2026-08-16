import React, { useState } from 'react';
import { 
  Calendar, 
  Wand2, 
  Trash2, 
  Sun, 
  Split, 
  Clock, 
  Filter, 
  CheckCheck,
  RefreshCw
} from 'lucide-react';
import ShiftRow from './ShiftRow';
import { calculateShiftDayHours } from '../utils/salaryEngine';

export default function DutyGrid({
  days,
  shifts,
  onShiftChange,
  onBulkFillWeekdaysStandard,
  onBulkFillSplitTemplate,
  onSetWeekendsOff,
  onClearMonth,
  onDuplicateRow
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'worked' | 'holidays_weekends'

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
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800/80 shadow-card-glass space-y-5">
      
      {/* Top Toolbar: Title & Filter Tabs & Bulk Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Foaie de Pontaj & Evidență Zilnică a Orelor
            </h3>
            <p className="text-xs text-slate-400">
              Înregistrează intervalele de lucru, ture frânte (split) și zile libere
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shrink-0 self-start xl:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Toate ({days.length})
          </button>

          <button
            onClick={() => setFilterMode('worked')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterMode === 'worked'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Doar Lucrate
          </button>

          <button
            onClick={() => setFilterMode('holidays_weekends')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterMode === 'holidays_weekends'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekend / Sărbători
          </button>
        </div>

      </div>

      {/* Bulk Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5 pr-2">
          <Wand2 className="w-3.5 h-3.5 text-cyan-400" /> Acțiuni Rapide:
        </span>

        <button
          onClick={onBulkFillWeekdaysStandard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Completează automat toate zilele lucrătoare cu tura 09:00 - 17:00 (8h)"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Normă Standard (8h Luni-Vineri)</span>
        </button>

        <button
          onClick={onBulkFillSplitTemplate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Completează tura frântă 11:00-17:00 & 18:30-23:00 (10.5h)"
        >
          <Split className="w-3.5 h-3.5 text-cyan-400" />
          <span>Template Split (10.5h)</span>
        </button>

        <button
          onClick={onSetWeekendsOff}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Setează toate sâmbetele și duminicile ca zile OFF"
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Weekenduri OFF</span>
        </button>

        <div className="ml-auto">
          <button
            onClick={onClearMonth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 border border-rose-800/40 transition-colors"
            title="Șterge toate înregistrările din această lună"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Resetează Pontaj</span>
          </button>
        </div>
      </div>

      {/* Grid of Days */}
      <div className="space-y-2.5">
        {filteredDays.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Nicio zi nu corespunde filtrului selectat.
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
              />
            );
          })
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Afișate <strong className="text-slate-200">{filteredDays.length}</strong> din <strong className="text-slate-200">{days.length}</strong> zile ale lunii.
        </div>
        <div className="flex items-center gap-2">
          <span>Datele se salvează automat în browser (`localStorage`).</span>
        </div>
      </div>

    </div>
  );
}
