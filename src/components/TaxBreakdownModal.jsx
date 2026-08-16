import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  Calculator 
} from 'lucide-react';
import { formatCurrency } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function TaxBreakdownModal({ 
  isOpen, 
  onClose, 
  calcResult, 
  currency = 'RON',
  lang = 'en'
}) {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] liquid-glass-elevated rounded-2xl p-5 sm:p-7 overflow-y-auto border border-cyan-500/30 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors shadow-sm touch-target flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t.fiscalGuideTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {t.fiscalGuideSubtitle}
            </p>
          </div>
        </div>

        {/* Live Calculation Walkthrough Box */}
        <div className="bg-white/80 dark:bg-slate-950/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-sm">
          <h3 className="text-xs sm:text-sm font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            {t.calculationCascadeTitle}
          </h3>

          <div className="space-y-2.5 text-xs">
            
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{t.totalGrossRealized}:</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {lang === 'ro' ? 'Bază' : 'Base'} ({calcResult.regularGross.toFixed(2)} LEI) + {lang === 'ro' ? 'Spor WE' : 'Weekend'} ({calcResult.weekendBonus.toFixed(2)} LEI) + {lang === 'ro' ? 'Spor Sărbători' : 'Holiday'} ({calcResult.holidayBonus.toFixed(2)} LEI) + {lang === 'ro' ? 'Suplimentare' : 'Overtime'} ({calcResult.overtimePay.toFixed(2)} LEI)
                </p>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm shrink-0">
                {formatCurrency(calcResult.totalGross, currency)}
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-300">2. {t.casPension}:</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {lang === 'ro' ? 'Contribuția de Asigurări Sociale' : 'Social Security Contribution'} = {calcResult.totalGross.toFixed(2)} × 25%
                </p>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm shrink-0">
                -{formatCurrency(calcResult.cas, currency)}
              </span>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-300">3. {t.cassHealth}:</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {lang === 'ro' ? 'Contribuția de Asigurări Sociale de Sănătate' : 'Health Insurance Contribution'} = {calcResult.totalGross.toFixed(2)} × 10%
                </p>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm shrink-0">
                -{formatCurrency(calcResult.cass, currency)}
              </span>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-purple-700 dark:text-purple-300">4. {t.taxableIncomeBase}:</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {calcResult.totalGross.toFixed(2)} - {calcResult.cas.toFixed(2)} - {calcResult.cass.toFixed(2)}
                </p>
              </div>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300 text-sm shrink-0">
                {formatCurrency(calcResult.taxableBase, currency)}
              </span>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-300">5. {t.incomeTax}:</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {calcResult.taxableBase.toFixed(2)} × 10%
                </p>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm shrink-0">
                -{formatCurrency(calcResult.impozit, currency)}
              </span>
            </div>

            {/* Step 6: Final Net */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <div>
                <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">6. {t.netPayable}:</span>
                <p className="text-emerald-700/80 dark:text-emerald-200/70 text-[11px]">
                  {calcResult.totalGross.toFixed(2)} - CAS - CASS - {lang === 'ro' ? 'Impozit' : 'Tax'}
                </p>
              </div>
              <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-base sm:text-lg shrink-0">
                {formatCurrency(calcResult.netSalary, currency)}
              </span>
            </div>

          </div>
        </div>

        {/* Labor Law References */}
        <div className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {lang === 'ro' ? 'Prevederi din Codul Muncii (Sporuri Legale)' : 'Romanian Labor Code Provisions'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="font-bold text-cyan-700 dark:text-cyan-300">{t.weekendToggleTitle}</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                <strong>Art. 137:</strong> {t.weekendToggleDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="font-bold text-amber-700 dark:text-amber-300">{t.holidayToggleTitle}</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                <strong>Art. 142:</strong> {t.holidayToggleDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="font-bold text-emerald-700 dark:text-emerald-300">{t.overtimeToggleTitle}</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                <strong>Art. 120:</strong> {t.overtimeToggleDesc}
              </p>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-sm touch-target"
          >
            {t.gotIt}
          </button>
        </div>

      </div>
    </div>
  );
}
