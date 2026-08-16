import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Percent, 
  Scale, 
  Calculator 
} from 'lucide-react';
import { formatCurrency } from '../utils/salaryEngine';

export default function TaxBreakdownModal({ 
  isOpen, 
  onClose, 
  calcResult, 
  currency = 'RON' 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel-elevated rounded-2xl p-6 sm:p-8 overflow-y-auto border border-cyan-500/30 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Ghid de Calcul Fiscal & Legislația Muncii
            </h2>
            <p className="text-xs text-slate-400">
              Codul Fiscal (Legea 227/2015) & Codul Muncii (Legea 53/2003 republicată)
            </p>
          </div>
        </div>

        {/* Live Calculation Walkthrough Box */}
        <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Cascada de Calcul pentru Luna Selectată
          </h3>

          <div className="space-y-3 text-xs">
            
            {/* Step 1 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-200">1. Venit Brut Total Realizat:</span>
                <p className="text-slate-400 text-[11px]">
                  Bază ({calcResult.regularGross.toFixed(2)} LEI) + Spor WE ({calcResult.weekendBonus.toFixed(2)} LEI) + Spor Sărbători ({calcResult.holidayBonus.toFixed(2)} LEI) + Suplimentare ({calcResult.overtimePay.toFixed(2)} LEI)
                </p>
              </div>
              <span className="font-mono font-bold text-white text-sm shrink-0">
                {formatCurrency(calcResult.totalGross, currency)}
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-300">2. CAS (Pensii) - 25%:</span>
                <p className="text-slate-400 text-[11px]">
                  Contribuția de Asigurări Sociale = Brut Total × 25% ({calcResult.totalGross.toFixed(2)} × 0.25)
                </p>
              </div>
              <span className="font-mono font-bold text-rose-400 text-sm shrink-0">
                -{formatCurrency(calcResult.cas, currency)}
              </span>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-300">3. CASS (Sănătate) - 10%:</span>
                <p className="text-slate-400 text-[11px]">
                  Contribuția de Asigurări Sociale de Sănătate = Brut Total × 10% ({calcResult.totalGross.toFixed(2)} × 0.10)
                </p>
              </div>
              <span className="font-mono font-bold text-rose-400 text-sm shrink-0">
                -{formatCurrency(calcResult.cass, currency)}
              </span>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-purple-300">4. Bază Impozabilă (Venit Net Impozabil):</span>
                <p className="text-slate-400 text-[11px]">
                  Brut Total - (CAS + CASS) = {calcResult.totalGross.toFixed(2)} - {calcResult.cas.toFixed(2)} - {calcResult.cass.toFixed(2)}
                </p>
              </div>
              <span className="font-mono font-bold text-purple-300 text-sm shrink-0">
                {formatCurrency(calcResult.taxableBase, currency)}
              </span>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-300">5. Impozit pe Venit - 10%:</span>
                <p className="text-slate-400 text-[11px]">
                  Bază Impozabilă × 10% = {calcResult.taxableBase.toFixed(2)} × 0.10
                </p>
              </div>
              <span className="font-mono font-bold text-rose-400 text-sm shrink-0">
                -{formatCurrency(calcResult.impozit, currency)}
              </span>
            </div>

            {/* Step 6: Final Net */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-emerald-300 text-sm">6. SALARIU NET FINAL (În Mână):</span>
                <p className="text-emerald-200/70 text-[11px]">
                  Brut Total - CAS - CASS - Impozit = {calcResult.totalGross.toFixed(2)} - {calcResult.cas.toFixed(2)} - {calcResult.cass.toFixed(2)} - {calcResult.impozit.toFixed(2)}
                </p>
              </div>
              <span className="font-mono font-extrabold text-emerald-400 text-lg shrink-0">
                {formatCurrency(calcResult.netSalary, currency)}
              </span>
            </div>

          </div>
        </div>

        {/* Legal Articles Reference Accordion/Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Prevederi din Codul Muncii (Sporuri Legale)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-300">Spor Weekend (+30%)</span>
              <p className="text-slate-400 text-[11px]">
                <strong>Art. 137 Codul Muncii:</strong> Repausul săptămânal se acordă de regulă sâmbăta și duminica. În cazul în care repausul ar fi acordat în alte zile, salariații beneficiază de un spor stabilit prin CCM sau contract individual (standard +30%).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-300">Sărbători Legale (+100%)</span>
              <p className="text-slate-400 text-[11px]">
                <strong>Art. 142 Codul Muncii:</strong> Salariaților care lucrează în unități sanitare, alimentație publică etc. în zile de sărbătoare li se asigură timp liber corespunzător sau un spor de minimum 100% din salariul de bază corespunzător muncii prestate.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-300">Ore Suplimentare (+75%)</span>
              <p className="text-slate-400 text-[11px]">
                <strong>Art. 120 Codul Muncii:</strong> Munca suplimentară se compensează prin ore libere plătite în următoarele 90 de zile. În cazul în care compensarea nu este posibilă, se acordă un spor de cel puțin 75% din salariul de bază.
              </p>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-glow-cyan"
          >
            Am Înțeles
          </button>
        </div>

      </div>
    </div>
  );
}
