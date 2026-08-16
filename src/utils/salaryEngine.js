/**
 * Romanian Salary & Tax Calculation Engine
 * Complies with Romanian Fiscal Code (Codul Fiscal - Legea 227/2015) & Labor Code (Legea 53/2003)
 * Standard Rates: CAS 25%, CASS 10%, Impozit pe Venit 10%
 * Allowance Rules: Weekend +30%, Legal Holiday +100%, Overtime +75%
 * Supports: Daily Overtime (>8h/day), Weekly Overtime (>40h/week), Monthly Overtime, and Prorated Join Dates.
 */

export const DEFAULT_GROSS_BASE = 5500; // Standard Romanian gross contract base in LEI
export const CAS_RATE = 0.25;           // 25% Social Security (Pensie)
export const CASS_RATE = 0.10;          // 10% Health Insurance (Sănătate)
export const IMPOZIT_RATE = 0.10;       // 10% Income Tax (Impozit pe Venit)
export const CAM_RATE = 0.0225;         // 2.25% Employer Work Insurance (CAM)
export const RON_EUR_DEFAULT_RATE = 4.9765; // BNR Reference exchange rate

export const BONUS_RATES = {
  weekend: 0.30,   // +30% for hours worked on Saturday / Sunday (Art. 137)
  holiday: 1.00,   // +100% for hours worked on legal statutory holidays (Art. 142)
  overtime: 0.75,  // +75% bonus rate for overtime hours (Art. 120)
};

/**
 * Converts a time string "HH:mm" to decimal hours (e.g. "18:30" -> 18.5)
 * @param {string} timeStr 
 * @returns {number}
 */
export function timeToDecimal(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours + minutes / 60;
}

/**
 * Converts decimal hours to "HH:mm" or readable string "Xh Ym" / "10.5h"
 * @param {number} decimalHours 
 * @param {boolean} formattedText 
 * @returns {string}
 */
export function decimalToTimeString(decimalHours, formattedText = false) {
  if (isNaN(decimalHours) || decimalHours <= 0) return formattedText ? '0h 00m' : '00:00';
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (formattedText) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Adds or subtracts deltaMinutes from a time string "HH:mm"
 * @param {string} timeStr "17:00"
 * @param {number} deltaMinutes e.g. +30, -30, +60
 * @returns {string} "17:30"
 */
export function adjustTime(timeStr, deltaMinutes) {
  if (!timeStr || typeof timeStr !== 'string') return '09:00';
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;
  let totalMin = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0) + deltaMinutes;
  
  // Normalize within 0 - 1439 (24h)
  totalMin = (totalMin % 1440 + 1440) % 1440;
  const newH = Math.floor(totalMin / 60);
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * Calculates duration in decimal hours between start and end time
 * Supports crossing midnight (e.g. 22:00 to 02:00 = 4.0h)
 * @param {string} start "HH:mm"
 * @param {string} end "HH:mm"
 * @returns {number} duration in decimal hours (rounded to 2 decimals)
 */
export function calculateIntervalDuration(start, end) {
  if (!start || !end) return 0;
  const tStart = timeToDecimal(start);
  const tEnd = timeToDecimal(end);
  
  let duration = tEnd - tStart;
  if (duration < 0) {
    // Crosses midnight
    duration += 24;
  }
  return Math.round(duration * 100) / 100;
}

/**
 * Computes shift daily totals and break time for a shift log row
 * @param {object} shiftLog 
 * @returns {{ workedHours: number, breakHours: number, isValid: boolean }}
 */
export function calculateShiftDayHours(shiftLog) {
  if (!shiftLog || shiftLog.isOff) {
    return { workedHours: 0, breakHours: 0, isValid: true };
  }

  const mode = shiftLog.mode || 'split';

  if (mode === 'continuous') {
    const workedHours = calculateIntervalDuration(shiftLog.continuousStart, shiftLog.continuousEnd);
    return {
      workedHours,
      breakHours: 0,
      isValid: workedHours > 0 || (!shiftLog.continuousStart && !shiftLog.continuousEnd)
    };
  }

  if (mode === 'split') {
    const part1 = calculateIntervalDuration(shiftLog.start1, shiftLog.end1);
    const part2 = calculateIntervalDuration(shiftLog.start2, shiftLog.end2);
    
    // Break duration between slot 1 end and slot 2 start
    let breakHours = 0;
    if (shiftLog.end1 && shiftLog.start2) {
      breakHours = calculateIntervalDuration(shiftLog.end1, shiftLog.start2);
    }

    const totalWorked = Math.round((part1 + part2) * 100) / 100;
    return {
      workedHours: totalWorked,
      breakHours,
      isValid: totalWorked > 0 || (!shiftLog.start1 && !shiftLog.end1 && !shiftLog.start2 && !shiftLog.end2)
    };
  }

  return { workedHours: 0, breakHours: 0, isValid: true };
}

/**
 * Returns ISO week number or week key for weekly grouping
 * @param {Date} d 
 * @returns {string} e.g. "2024-W28"
 */
function getWeekKey(d) {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7; // Monday = 0
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Main Romanian Salary Calculator Engine
 * 
 * @param {object} params
 * @param {number} params.baseGross Contract base gross salary in LEI (default 5,500)
 * @param {number} params.normHours Standard norm hours for the month (e.g. 168h)
 * @param {Array<object>} params.days Calendar days metadata
 * @param {object} params.shifts Shift logs keyed by dateStr
 * @param {object} params.toggles Allowance toggles { weekend: boolean, holiday: boolean, overtime: boolean }
 * @param {string} params.overtimeMode 'daily' | 'weekly' | 'monthly' (default 'daily' or 'monthly')
 * @param {string} params.joinDate Optional join date string "YYYY-MM-DD"
 * @returns {object} Full financial calculation result
 */
export function calculateSalary({
  baseGross = DEFAULT_GROSS_BASE,
  normHours = 168,
  days = [],
  shifts = {},
  toggles = { weekend: true, holiday: true, overtime: true },
  overtimeMode = 'daily', // 'daily' (>8h/day) | 'weekly' (>40h/week) | 'monthly' (>norm)
  joinDate = null
}) {
  const safeBaseGross = Math.max(0, Number(baseGross) || 0);
  
  // Calculate effective norm (if join date is present in the current month, prorate)
  let effectiveNormHours = Math.max(1, Number(normHours) || 168);
  let proratedWorkingDays = 0;

  if (joinDate && days.length > 0) {
    const joinTime = new Date(joinDate).setHours(0, 0, 0, 0);
    const validDays = days.filter(d => {
      const dTime = new Date(d.dateStr).setHours(0, 0, 0, 0);
      return dTime >= joinTime && d.isStandardWorkday;
    });
    if (validDays.length > 0 && validDays.length < days.filter(d => d.isStandardWorkday).length) {
      proratedWorkingDays = validDays.length;
      effectiveNormHours = proratedWorkingDays * 8;
    }
  }

  // Base hourly rate based on full standard norm (R = Gross / Norm)
  const hourlyBaseRate = safeBaseGross / (Number(normHours) || 168);

  let totalWorkedHours = 0;
  let weekdayHours = 0;
  let weekendHours = 0;
  let holidayHours = 0;
  let totalBreakHours = 0;
  let totalDaysWorked = 0;
  let totalOffDays = 0;
  let totalPendingDays = 0;

  // Daily and weekly tracking
  let dailyOvertimeHoursTotal = 0;
  let dailyRegularHoursTotal = 0;

  const weeklyBuckets = {};

  // Process all days in the month
  days.forEach(day => {
    const shift = shifts[day.dateStr] || { isOff: day.isWeekend };
    const { workedHours, breakHours } = calculateShiftDayHours(shift);

    if (shift.isOff) {
      totalOffDays++;
    } else if (workedHours === 0) {
      totalPendingDays++;
    }

    if (workedHours > 0) {
      totalDaysWorked++;
      totalWorkedHours += workedHours;
      totalBreakHours += breakHours;

      // Daily regular vs overtime split (> 8h standard threshold)
      const dayRegular = Math.min(workedHours, 8);
      const dayOvertime = Math.max(0, workedHours - 8);
      dailyRegularHoursTotal += dayRegular;
      dailyOvertimeHoursTotal += dayOvertime;

      // Weekly bucket grouping
      const dObj = new Date(day.dateStr);
      const wKey = getWeekKey(dObj);
      if (!weeklyBuckets[wKey]) weeklyBuckets[wKey] = 0;
      weeklyBuckets[wKey] += workedHours;

      if (day.isHoliday) {
        holidayHours += workedHours;
      } else if (day.isWeekend) {
        weekendHours += workedHours;
      } else {
        weekdayHours += workedHours;
      }
    }
  });

  totalWorkedHours = Math.round(totalWorkedHours * 100) / 100;
  weekendHours = Math.round(weekendHours * 100) / 100;
  holidayHours = Math.round(holidayHours * 100) / 100;
  weekdayHours = Math.round(weekdayHours * 100) / 100;
  totalBreakHours = Math.round(totalBreakHours * 100) / 100;
  dailyOvertimeHoursTotal = Math.round(dailyOvertimeHoursTotal * 100) / 100;
  dailyRegularHoursTotal = Math.round(dailyRegularHoursTotal * 100) / 100;

  // Calculate Overtime Hours based on selected mode
  let overtimeHours = 0;
  let regularEarnedHours = 0;

  if (overtimeMode === 'daily') {
    // 1. Daily Overtime: Sum of all hours exceeding 8h on each day
    overtimeHours = dailyOvertimeHoursTotal;
    regularEarnedHours = dailyRegularHoursTotal;
  } else if (overtimeMode === 'weekly') {
    // 2. Weekly Overtime: Sum of hours exceeding 40h in each calendar week
    let weeklyOvertimeTotal = 0;
    Object.values(weeklyBuckets).forEach(hrs => {
      if (hrs > 40) {
        weeklyOvertimeTotal += (hrs - 40);
      }
    });
    overtimeHours = Math.round(weeklyOvertimeTotal * 100) / 100;
    regularEarnedHours = Math.max(0, totalWorkedHours - overtimeHours);
  } else {
    // 3. Monthly Overtime: Hours exceeding the effective norm
    overtimeHours = Math.max(0, Math.round((totalWorkedHours - effectiveNormHours) * 100) / 100);
    regularEarnedHours = Math.min(totalWorkedHours, effectiveNormHours);
  }

  // BASE REGULAR GROSS
  let regularGross = 0;
  if (regularEarnedHours >= effectiveNormHours) {
    regularGross = safeBaseGross;
  } else {
    regularGross = regularEarnedHours * hourlyBaseRate;
  }

  // ALLOWANCE CALCULATIONS (Active based on toggles)
  // 1. Weekend Allowance (+30% bonus rate on hourly rate for weekend hours)
  const weekendBonus = toggles.weekend 
    ? weekendHours * hourlyBaseRate * BONUS_RATES.weekend 
    : 0;

  // 2. Legal Holiday Allowance (+100% bonus rate on hourly rate for legal holiday hours)
  const holidayBonus = toggles.holiday 
    ? holidayHours * hourlyBaseRate * BONUS_RATES.holiday 
    : 0;

  // 3. Overtime Pay: Overtime hours are compensated at base rate + 75% bonus rate (175% total)
  const overtimePay = toggles.overtime 
    ? overtimeHours * hourlyBaseRate * (1 + BONUS_RATES.overtime)
    : (overtimeHours > 0 ? overtimeHours * hourlyBaseRate : 0);

  // TOTAL GROSS EARNINGS
  const totalGross = Math.round((regularGross + weekendBonus + holidayBonus + (toggles.overtime ? overtimePay : (overtimeHours * hourlyBaseRate))) * 100) / 100;

  // STATUTORY ROMANIAN TAX DEDUCTIONS (Codul Fiscal Legea 227/2015)
  // 1. CAS (Pensie): 25% of Total Gross
  const cas = Math.round(totalGross * CAS_RATE * 100) / 100;

  // 2. CASS (Sănătate): 10% of Total Gross
  const cass = Math.round(totalGross * CASS_RATE * 100) / 100;

  // 3. Taxable Base (Venit Impozabil) = Total Gross - (CAS + CASS)
  const taxableBase = Math.max(0, Math.round((totalGross - cas - cass) * 100) / 100);

  // 4. Income Tax (Impozit pe Venit): 10% of Taxable Base
  const impozit = Math.round(taxableBase * IMPOZIT_RATE * 100) / 100;

  // 5. Total Net Salary = Total Gross - (CAS + CASS + Impozit)
  const netSalary = Math.round((totalGross - cas - cass - impozit) * 100) / 100;

  // 6. Employer CAM (Contribuția Asiguratorie pentru Muncă 2.25%)
  const cam = Math.round(totalGross * CAM_RATE * 100) / 100;
  const totalEmployerCost = Math.round((totalGross + cam) * 100) / 100;

  // Standard net baseline
  const standardNetBase = 3217.50;

  return {
    // Rates & Baseline
    baseGross: safeBaseGross,
    normHours: effectiveNormHours,
    fullMonthNormHours: Number(normHours) || 168,
    hourlyBaseRate: Math.round(hourlyBaseRate * 100) / 100,
    overtimeMode,
    joinDate,
    proratedWorkingDays,
    
    // Hours metrics
    totalWorkedHours,
    regularEarnedHours: Math.round(regularEarnedHours * 100) / 100,
    weekdayHours,
    weekendHours,
    holidayHours,
    overtimeHours,
    totalBreakHours,
    totalDaysWorked,
    totalOffDays,
    totalPendingDays,

    // Gross Components
    regularGross: Math.round(regularGross * 100) / 100,
    weekendBonus: Math.round(weekendBonus * 100) / 100,
    holidayBonus: Math.round(holidayBonus * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    totalGross,

    // Deductions & Taxes
    cas,
    cass,
    taxableBase,
    impozit,
    netSalary,
    standardNetBase,

    // Employer Cost
    cam,
    totalEmployerCost,

    // Active Toggle states
    toggles,
  };
}

/**
 * Formats a numeric currency value into Romanian LEI format (e.g. 3.217,50 LEI)
 * @param {number} amount 
 * @param {string} currency 'RON' | 'EUR'
 * @param {number} eurRate RON to EUR rate
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'RON', eurRate = RON_EUR_DEFAULT_RATE) {
  if (isNaN(amount)) return currency === 'RON' ? '0,00 LEI' : '€0.00';
  
  if (currency === 'EUR') {
    const eurVal = amount / (eurRate || RON_EUR_DEFAULT_RATE);
    return `€${eurVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Romanian formatting (comma as decimal separator, period for thousands)
  return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LEI`;
}
