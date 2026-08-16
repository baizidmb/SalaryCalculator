import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import AllowanceToggles from './components/AllowanceToggles';
import SummaryCards from './components/SummaryCards';
import DutyGrid from './components/DutyGrid';
import TaxBreakdownModal from './components/TaxBreakdownModal';
import SettingsModal from './components/SettingsModal';

import { getDaysInMonth, getMonthlyNormInfo } from './utils/romanianCalendar';
import { calculateSalary, DEFAULT_GROSS_BASE, RON_EUR_DEFAULT_RATE } from './utils/salaryEngine';
import { exportDutySheetPDF } from './utils/pdfExport';

export default function App() {
  // Current local date defaults
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
        companyName: 'ZidBhai Enterprise SRL',
        position: 'Specialist Operațiuni',
        eurRate: RON_EUR_DEFAULT_RATE
      };
    } catch {
      return {
        baseGross: DEFAULT_GROSS_BASE,
        employeeName: 'ZidBhai Operator',
        companyName: 'ZidBhai Enterprise SRL',
        position: 'Specialist Operațiuni',
        eurRate: RON_EUR_DEFAULT_RATE
      };
    }
  });

  // Shifts state per month
  const [shifts, setShifts] = useState({});
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Generate calendar days for selected year/month
  const days = useMemo(() => {
    return getDaysInMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Monthly norm metadata
  const normInfo = useMemo(() => {
    return getMonthlyNormInfo(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Load shifts for current year/month from localStorage
  useEffect(() => {
    const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setShifts(JSON.parse(saved));
      } else {
        // Initialize default: weekdays 09:00 - 17:00 (8h), weekends OFF
        const initialShifts = {};
        days.forEach(d => {
          if (d.isWeekend) {
            initialShifts[d.dateStr] = {
              mode: 'split',
              isOff: true,
              start1: '',
              end1: '',
              start2: '',
              end2: '',
              continuousStart: '',
              continuousEnd: ''
            };
          } else {
            // Default 8h continuous or split
            initialShifts[d.dateStr] = {
              mode: 'continuous',
              isOff: false,
              start1: '11:00',
              end1: '17:00',
              start2: '18:30',
              end2: '20:30',
              continuousStart: '09:00',
              continuousEnd: '17:00'
            };
          }
        });
        setShifts(initialShifts);
      }
    } catch {
      setShifts({});
    }
  }, [selectedYear, selectedMonth, days]);

  // Save shifts to localStorage whenever modified
  const handleShiftChange = (dateStr, shiftData) => {
    const updated = {
      ...shifts,
      [dateStr]: shiftData
    };
    setShifts(updated);
    const storageKey = `shiftpay_shifts_${selectedYear}_${selectedMonth}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  };

  // Toggle update & save
  const handleToggleChange = (toggleId, value) => {
    const updated = { ...toggles, [toggleId]: value };
    setToggles(updated);
    try {
      localStorage.setItem('shiftpay_toggles', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  };

  // Settings update & save
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('shiftpay_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  };

  // Bulk Actions
  const handleBulkFillWeekdaysStandard = () => {
    const updated = { ...shifts };
    days.forEach(d => {
      if (d.isStandardWorkday) {
        updated[d.dateStr] = {
          mode: 'continuous',
          isOff: false,
          continuousStart: '09:00',
          continuousEnd: '17:00',
          start1: '',
          end1: '',
          start2: '',
          end2: ''
        };
      } else {
        updated[d.dateStr] = {
          ...updated[d.dateStr],
          isOff: true
        };
      }
    });
    setShifts(updated);
    localStorage.setItem(`shiftpay_shifts_${selectedYear}_${selectedMonth}`, JSON.stringify(updated));
  };

  const handleBulkFillSplitTemplate = () => {
    const updated = { ...shifts };
    days.forEach(d => {
      if (d.isStandardWorkday) {
        updated[d.dateStr] = {
          mode: 'split',
          isOff: false,
          start1: '11:00',
          end1: '17:00',
          start2: '18:30',
          end2: '23:00',
          continuousStart: '',
          continuousEnd: ''
        };
      }
    });
    setShifts(updated);
    localStorage.setItem(`shiftpay_shifts_${selectedYear}_${selectedMonth}`, JSON.stringify(updated));
  };

  const handleSetWeekendsOff = () => {
    const updated = { ...shifts };
    days.forEach(d => {
      if (d.isWeekend) {
        updated[d.dateStr] = {
          ...updated[d.dateStr],
          isOff: true
        };
      }
    });
    setShifts(updated);
    localStorage.setItem(`shiftpay_shifts_${selectedYear}_${selectedMonth}`, JSON.stringify(updated));
  };

  const handleClearMonth = () => {
    if (window.confirm(`Sigur doriți să resetați toate turele pentru ${selectedMonth}/${selectedYear}?`)) {
      const updated = {};
      days.forEach(d => {
        updated[d.dateStr] = {
          mode: 'split',
          isOff: true,
          start1: '',
          end1: '',
          start2: '',
          end2: '',
          continuousStart: '',
          continuousEnd: ''
        };
      });
      setShifts(updated);
      localStorage.setItem(`shiftpay_shifts_${selectedYear}_${selectedMonth}`, JSON.stringify(updated));
    }
  };

  const handleDuplicateRow = (sourceDateStr) => {
    const sourceShift = shifts[sourceDateStr];
    if (!sourceShift) return;

    // Find next day in calendar
    const currentIdx = days.findIndex(d => d.dateStr === sourceDateStr);
    if (currentIdx >= 0 && currentIdx < days.length - 1) {
      const nextDay = days[currentIdx + 1];
      const updated = {
        ...shifts,
        [nextDay.dateStr]: {
          ...sourceShift,
          isOff: false
        }
      };
      setShifts(updated);
      localStorage.setItem(`shiftpay_shifts_${selectedYear}_${selectedMonth}`, JSON.stringify(updated));
    }
  };

  // Perform full calculations
  const calcResult = useMemo(() => {
    return calculateSalary({
      baseGross: settings.baseGross,
      normHours: normInfo.normHours,
      days,
      shifts,
      toggles
    });
  }, [settings.baseGross, normInfo.normHours, days, shifts, toggles]);

  // Export PDF Trigger
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
          position: settings.position
        });
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert('A apărut o eroare la generarea fișierului PDF.');
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col antialiased">
      
      {/* Top Header */}
      <Header
        onOpenInfo={() => setIsTaxModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExportPDF={handleExportPDF}
        baseGross={settings.baseGross}
        employeeName={settings.employeeName}
        isExporting={isExporting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* 1. Month Selector & Norm Info */}
        <section>
          <MonthSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
          />
        </section>

        {/* 2. Financial Summary & Hours Cards */}
        <section>
          <SummaryCards
            calcResult={calcResult}
            currency={currency}
            onCurrencyToggle={() => setCurrency(c => c === 'RON' ? 'EUR' : 'RON')}
            onOpenTaxDetails={() => setIsTaxModalOpen(true)}
          />
        </section>

        {/* 3. Allowance Toggle Switches */}
        <section>
          <AllowanceToggles
            toggles={toggles}
            onToggleChange={handleToggleChange}
            calcResult={calcResult}
            currency={currency}
          />
        </section>

        {/* 4. Duty Sheet & Shift Grid */}
        <section>
          <DutyGrid
            days={days}
            shifts={shifts}
            onShiftChange={handleShiftChange}
            onBulkFillWeekdaysStandard={handleBulkFillWeekdaysStandard}
            onBulkFillSplitTemplate={handleBulkFillSplitTemplate}
            onSetWeekendsOff={handleSetWeekendsOff}
            onClearMonth={handleClearMonth}
            onDuplicateRow={handleDuplicateRow}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {selectedYear} <strong>ZidBhai ShiftPay</strong> // Romanian Duty Sheet & Smart Salary Calculator.
          </p>
          <p className="text-[11px] text-slate-600">
            Conform Codul Muncii (Legea 53/2003) & Codul Fiscal (Legea 227/2015).
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TaxBreakdownModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        calcResult={calcResult}
        currency={currency}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

    </div>
  );
}
