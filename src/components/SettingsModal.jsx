import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Building2, 
  Coins, 
  RotateCcw, 
  Check 
} from 'lucide-react';
import { DEFAULT_GROSS_BASE, RON_EUR_DEFAULT_RATE } from '../utils/salaryEngine';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave
}) {
  const [formData, setFormData] = useState({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      baseGross: parseFloat(formData.baseGross) || DEFAULT_GROSS_BASE,
      eurRate: parseFloat(formData.eurRate) || RON_EUR_DEFAULT_RATE
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setFormData({
      baseGross: DEFAULT_GROSS_BASE,
      employeeName: 'ZidBhai Operator',
      companyName: 'ZidBhai Enterprise SRL',
      position: 'Specialist Operațiuni',
      eurRate: RON_EUR_DEFAULT_RATE
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Configurare Profil & Salariu
            </h2>
            <p className="text-xs text-slate-400">
              Personalizează salariul de bază și datele de pe fișa de pontaj
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Base Gross Salary Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Salariu Contract Brut (LEI / Lună)
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                value={formData.baseGross}
                onChange={(e) => setFormData({ ...formData, baseGross: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl font-mono text-sm font-bold text-emerald-400 outline-none"
                placeholder="5500"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-500">
                LEI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Valoare implicită: <strong>5.500 LEI</strong> (rezultă exact 3.217,50 LEI net fără sporuri).
            </p>
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Nume Angajat
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full glass-input px-4 py-2 rounded-xl text-sm text-slate-200 outline-none"
                placeholder="Popescu Ion"
              />
            </div>
          </div>

          {/* Company Name & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Companie / Angajator
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-slate-200 outline-none"
                placeholder="Companie SRL"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Funcție / Poziție
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-slate-200 outline-none"
                placeholder="Specialist"
              />
            </div>
          </div>

          {/* EUR Exchange Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Curs de Schimb RON / EUR
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.0001"
                value={formData.eurRate}
                onChange={(e) => setFormData({ ...formData, eurRate: e.target.value })}
                className="w-full glass-input px-4 py-2 rounded-xl font-mono text-xs text-slate-200 outline-none"
                placeholder="4.9765"
              />
              <span className="absolute right-4 top-2 text-xs text-slate-500 font-mono">
                1 EUR = {formData.eurRate} RON
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetare Implicite</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-glow-emerald transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Salvează Setările</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
