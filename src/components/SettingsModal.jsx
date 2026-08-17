import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Check,
  Calendar,
  Clock
} from 'lucide-react';
import { DEFAULT_GROSS_BASE, RON_EUR_DEFAULT_RATE } from '../utils/salaryEngine';
import { TRANSLATIONS } from '../utils/i18n';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  lang = 'en'
}) {
  const [formData, setFormData] = useState({ ...settings });
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      baseGross: parseFloat(formData.baseGross) || DEFAULT_GROSS_BASE,
      eurRate: parseFloat(formData.eurRate) || RON_EUR_DEFAULT_RATE,
      joinDate: formData.joinDate || null,
      overtimeMode: formData.overtimeMode || 'daily'
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setFormData({
      baseGross: DEFAULT_GROSS_BASE,
      employeeName: 'ZidBhai Operator',
      companyName: 'Enterprise SRL',
      position: 'Operations Specialist',
      eurRate: RON_EUR_DEFAULT_RATE,
      joinDate: '',
      overtimeMode: 'daily'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto liquid-glass-elevated rounded-2xl p-5 sm:p-7 border border-emerald-500/30 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors shadow-sm touch-target flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t.settingsTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {t.settingsSubtitle}
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Base Gross Salary Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {t.contractGrossInput}
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={formData.baseGross}
                onChange={(e) => setFormData({ ...formData, baseGross: e.target.value })}
                className="w-full liquid-input px-3.5 py-2.5 rounded-xl font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 outline-none"
                placeholder="5500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                RON
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.defaultGrossHint}
            </p>
          </div>

          {/* Joining Date (Mid-month hire) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t.joinDateLabel}</span>
            </label>
            <input
              type="date"
              value={formData.joinDate || ''}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              className="w-full liquid-input px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {t.joinDateHint}
            </p>
          </div>

          {/* Default Overtime Calculation Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.overtimeModeSettingLabel}</span>
            </label>
            <select
              value={formData.overtimeMode || 'daily'}
              onChange={(e) => setFormData({ ...formData, overtimeMode: e.target.value })}
              className="w-full liquid-input px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="daily">{t.overtimeDaily} - {t.overtimeDailyDesc}</option>
              <option value="weekly">{t.overtimeWeekly} - {t.overtimeWeeklyDesc}</option>
              <option value="monthly">{t.overtimeMonthly} - {t.overtimeMonthlyDesc}</option>
            </select>
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {t.employeeNameLabel}
            </label>
            <input
              type="text"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full liquid-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Company Name & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {t.companyNameLabel}
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full liquid-input px-3.5 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none"
                placeholder="Company SRL"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {t.jobTitleLabel}
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full liquid-input px-3.5 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none"
                placeholder="Specialist"
              />
            </div>
          </div>

          {/* EUR Exchange Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {t.exchangeRateLabel}
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.eurRate}
              onChange={(e) => setFormData({ ...formData, eurRate: e.target.value })}
              className="w-full liquid-input px-3.5 py-2 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 outline-none"
              placeholder="4.9765"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetDefaults}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all touch-target"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveSettings}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
