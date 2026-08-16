import React from 'react';
import { Wallet, Clock, ArrowUp, Download } from 'lucide-react';
import { formatCurrency } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function MobileSummaryBar({
  calcResult,
  currency = 'RON',
  lang = 'en',
  onExportPDF,
  isExporting
}) {
  const t = TRANSLATIONS[lang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden animate-slide-up">
      <div className="liquid-glass-elevated rounded-2xl p-3 border border-slate-200/90 dark:border-slate-800 shadow-xl flex items-center justify-between gap-2">
        
        {/* Net Salary Mini Block */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
              {t.mobileNet}
            </span>
            <span className="font-mono font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 truncate block">
              {formatCurrency(calcResult.netSalary, currency)}
            </span>
          </div>
        </div>

        {/* Total Hours vs Norm */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shrink-0 text-xs">
          <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {calcResult.totalWorkedHours}h <span className="text-[10px] font-normal text-slate-500">/ {calcResult.normHours}h</span>
          </span>
        </div>

        {/* Action Controls: Export & Scroll to Top */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-sm active:scale-95 transition-all disabled:opacity-50"
            title={t.exportPdf}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
