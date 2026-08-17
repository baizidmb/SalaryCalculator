import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import AllowanceToggles from './components/AllowanceToggles';
import SummaryCards from './components/SummaryCards';
import DutyGrid from './components/DutyGrid';
import StickySidebarSummary from './components/StickySidebarSummary';
import TaxBreakdownModal from './components/TaxBreakdownModal';
import SettingsModal from './components/SettingsModal';
import MobileSummaryBar from './components/MobileSummaryBar';

import { getDaysInMonth, getMonthlyNormInfo } from './utils/romanianCalendar';
import { calculateSalary, DEFAULT_GROSS_BASE, RON_EUR_DEFAULT_RATE } from './utils/salaryEngine';
import { exportDutySheetPDF } from './utils/pdfExport';
import { TRANSLATIONS } from './utils/i18n';

export default function App() {
  // 1. Language State: Default English 'en', 1-tap toggle to 'ro'
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('shiftpay_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  // 2. Theme State: Default 'light' (Pure White Glossy Glass), toggle to 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('shiftpay_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  // 3. Overtime Mode: Default 'daily' (>8h/day), can be 'weekly' or 'monthly'
  const [overtimeMode, setOvertimeMode] = useState(() => {
    try {
      return localStorage.getItem('shiftpay_overtime_mode') || 'daily';
    } catch {
      return 'daily';
    }
  });

  // Update root html class for dark mode theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('shiftpay_theme', theme);
  }, [theme]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('shiftpay_lang', lang);
  }, [lang]);

  // Persist overtime mode
  useEffect(() => {
    localStorage.setItem('shiftpay_overtime_mode', overtimeMode);
  }, [overtimeMode]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLangToggle = () => {
    setLang(prev => prev === 'en' ? 'ro' : 'en');
  };

  const handleOvertimeModeChange = (mode) => {
    setOvertimeMode(mode);
    // Also save in settings
    setSettings(prev => {
      const updated = { ...prev, overtimeMode: mode };
      localStorage.setItem('shiftpay_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const t = TRANSLATIONS[lang];

  // Calendar Year and Month
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear() || 2026);
  const [selectedMonth, setSelectedMonth] = useState((now.getMonth() + 1) || 8); // 1-12

  // Currency view toggle (RON / EUR)
  const [currency, setCurrency] = useState('RON');

  // Allowance Toggles (Independent ON/OFF)
  const [toggles, setToggles] = useState(() => {
    try {
      const saved = localStorage.getItem('shiftpay_toggles');
      return saved ? JSON.parse(saved) : { weekend: true, holiday: true, overtime: true };
    } catch {
      return { weekend: true, holiday: true, overtime: true };
    }
  });

  // App & Employee Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('shiftpay_settings');
      return saved ? JSON.parse(saved) : {
        baseGross: DEFAULT_GROSS_BASE,
        employeeName: 'ZidBhai Operator',
        companyName: 'Enterprise SRL',
        position: 'Operations Specialist',
        eurRate: RON_EUR_DEFAULT_RATE,
        joinDate: '',
        overtimeMode: 'daily'
      };
    } catch {
      return {
        baseGross: DEFAULT_GROSS_BASE,
        employeeName: 'ZidBhai Operator',
        companyName: 'Enterprise SRL',
        position: 'Operations Specialist',
        eurRate: RON_EUR_DEFAULT_RATE,
        joinDate: '',
        overtimeMode: 'daily'
      };
    }
  });

  // Shifts state per month
  const [shifts, setShifts] = useState({});
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Generate calendar days for selected year/month with active locale
  const days = useMemo(() => {
    return getDaysInMonth(selectedYear, selectedMonth, lang);
  }, [selectedYear, selectedMonth, lang]);

  // Monthly norm metadata
  const normInfo = useMemo(() => {
    return getMonthlyNormInfo(selectedYear, selectedMonth, lang);
  }, [selectedYear, selectedMonth, lang]);

  // Load shifts for current year/month from localStorage with full workday ON defaults
  useEffect(() => {
    const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const loaded = JSON.parse(saved);
        const merged = {};
        days.forEach(d => {
          if (loaded[d.dateStr]) {
            merged[d.dateStr] = loaded[d.dateStr];
          } else {
            // Default: Active by default (isOff: false for weekdays), zero times
            merged[d.dateStr] = {
              mode: 'split',
              isOff: d.isWeekend,
              start1: '',
              end1: '',
              start2: '',
              end2: '',
              continuousStart: '',
              continuousEnd: ''
            };
          }
        });
        setShifts(merged);
      } else {
        const initialShifts = {};
        days.forEach(d => {
          initialShifts[d.dateStr] = {
            mode: 'split',
            isOff: d.isWeekend,
            start1: '',
            end1: '',
            start2: '',
            end2: '',
            continuousStart: '',
            continuousEnd: ''
          };
        });
        setShifts(initialShifts);
      }
    } catch (e) {
      console.error('Error loading shifts from localStorage', e);
    }
  }, [selectedYear, selectedMonth, days]);

  // Handle single shift change and auto-save
  const handleShiftChange = (dateStr, updatedShift) => {
    setShifts(prev => {
      const updated = {
        ...prev,
        [dateStr]: updatedShift
      };
      const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error('Error auto-saving shift entry', err);
      }
      return updated;
    });
  };

  // Allowance toggles handler
  const handleToggleChange = (toggleKey) => {
    setToggles(prev => {
      const updated = {
        ...prev,
        [toggleKey]: !prev[toggleKey]
      };
      localStorage.setItem('shiftpay_toggles', JSON.stringify(updated));
      return updated;
    });
  };

  // Settings save handler
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    if (newSettings.overtimeMode) {
      setOvertimeMode(newSettings.overtimeMode);
    }
    localStorage.setItem('shiftpay_settings', JSON.stringify(newSettings));
  };

  const handleClearMonth = () => {
    if (window.confirm(t.confirmResetMonth)) {
      const updated = {};
      days.forEach(d => {
        updated[d.dateStr] = {
          mode: 'split',
          isOff: d.isWeekend,
          start1: '',
          end1: '',
          start2: '',
          end2: '',
          continuousStart: '',
          continuousEnd: ''
        };
      });
      setShifts(updated);
      const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const handleDuplicateRow = (sourceDateStr) => {
    const sourceShift = shifts[sourceDateStr];
    if (!sourceShift) return;

    const currentIdx = days.findIndex(d => d.dateStr === sourceDateStr);
    if (currentIdx >= 0 && currentIdx < days.length - 1) {
      const nextDay = days[currentIdx + 1];
      setShifts(prev => {
        const updated = {
          ...prev,
          [nextDay.dateStr]: {
            ...sourceShift,
            isOff: false
          }
        };
        const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleCopyFromPrevious = (targetDateStr) => {
    const currentIdx = days.findIndex(d => d.dateStr === targetDateStr);
    if (currentIdx > 0) {
      const prevDay = days[currentIdx - 1];
      const prevShift = shifts[prevDay.dateStr];
      if (prevShift) {
        setShifts(prev => {
          const updated = {
            ...prev,
            [targetDateStr]: {
              ...prevShift,
              isOff: false
            }
          };
          const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
          localStorage.setItem(storageKey, JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  // Perform calculations
  const calcResult = useMemo(() => {
    return calculateSalary({
      baseGross: settings.baseGross,
      normHours: normInfo.normHours,
      days,
      shifts,
      toggles,
      overtimeMode,
      joinDate: settings.joinDate
    });
  }, [settings.baseGross, settings.joinDate, normInfo.normHours, days, shifts, toggles, overtimeMode]);

  // Export PDF
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        exportDutySheetPDF({
          year: selectedYear,
          month: selectedMonth,
          days,
          shifts,
          calcResult,
          employeeName: settings.employeeName,
          companyName: settings.companyName,
          position: settings.position,
          lang
        });
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert(lang === 'ro' ? 'Eroare la generarea fișierului PDF.' : 'Error generating PDF file.');
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#f4f6f9] dark:bg-[#060a12] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Seamless Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation & App Bar */}
      <Header
        lang={lang}
        onLangToggle={handleLangToggle}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onOpenInfo={() => setIsTaxModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExportPDF={handleExportPDF}
        baseGross={settings.baseGross}
        employeeName={settings.employeeName}
        isExporting={isExporting}
      />

      {/* Main Responsive Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-24 md:pb-8">
        
        {/* 🌟 SIDE-BY-SIDE INTERACTIVE DESKTOP LAYOUT (lg+) & CLEAN VERTICAL FLOW ON MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ⬅️ LEFT MAIN WORKSPACE (lg: 7 cols / xl: 8 cols): MONTH SELECTOR + DUTY TIMESHEET */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            
            {/* 1. Month Navigation & Norm Info */}
            <section>
              <MonthSelector
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
                lang={lang}
              />
            </section>

            {/* 2. Duty Sheet & Shift Logging Grid (Up Front & Center) */}
            <section>
              <DutyGrid
                days={days}
                shifts={shifts}
                onShiftChange={handleShiftChange}
                onClearMonth={handleClearMonth}
                onDuplicateRow={handleDuplicateRow}
                onCopyFromPrevious={handleCopyFromPrevious}
                lang={lang}
              />
            </section>

          </div>

          {/* ➡️ RIGHT STICKY FINANCIAL DASHBOARD (lg: 5 cols / xl: 4 cols): STICKS AS YOU LOG ON PC */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 self-start">
            <StickySidebarSummary
              calcResult={calcResult}
              currency={currency}
              onCurrencyToggle={() => setCurrency(c => c === 'RON' ? 'EUR' : 'RON')}
              toggles={toggles}
              onToggleChange={handleToggleChange}
              overtimeMode={overtimeMode}
              onOvertimeModeChange={handleOvertimeModeChange}
              onOpenTaxDetails={() => setIsTaxModalOpen(true)}
              onExportPDF={handleExportPDF}
              isExporting={isExporting}
              lang={lang}
            />
          </div>

        </div>

        {/* 📱 MOBILE SUMMARY & ALLOWANCES (Rendered below Duty Grid on Mobile, hidden on lg+) */}
        <div className="lg:hidden space-y-5">
          <section>
            <SummaryCards
              calcResult={calcResult}
              currency={currency}
              onCurrencyToggle={() => setCurrency(c => c === 'RON' ? 'EUR' : 'RON')}
              onOpenTaxDetails={() => setIsTaxModalOpen(true)}
              lang={lang}
            />
          </section>

          <section>
            <AllowanceToggles
              toggles={toggles}
              onToggleChange={handleToggleChange}
              calcResult={calcResult}
              overtimeMode={overtimeMode}
              onOvertimeModeChange={handleOvertimeModeChange}
              currency={currency}
              lang={lang}
            />
          </section>
        </div>

      </main>

      {/* Sticky Mobile Summary Bar (< md screens) */}
      <MobileSummaryBar
        calcResult={calcResult}
        currency={currency}
        lang={lang}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {selectedYear} <strong>{t.appTitle}</strong> // {t.appSubtitle}.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-600">
            {lang === 'ro' 
              ? 'Conform Codul Muncii (Legea 53/2003) & Codul Fiscal (Legea 227/2015).' 
              : 'Compliant with Romanian Labor Code (Law 53/2003) & Fiscal Code (Law 227/2015).'}
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TaxBreakdownModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        calcResult={calcResult}
        currency={currency}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={{ ...settings, overtimeMode }}
        onSave={handleSaveSettings}
        lang={lang}
      />

    </div>
  );
}
