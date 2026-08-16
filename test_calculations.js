import { calculateShiftDayHours, calculateSalary, DEFAULT_GROSS_BASE } from './src/utils/salaryEngine.js';
import { getOrthodoxEasterDate, getRomanianHolidays, getMonthlyNormInfo, getDaysInMonth } from './src/utils/romanianCalendar.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

console.log('--- STARTING VERIFICATION TESTS ---');

// Test 1: Split shift calculation (11:00 - 17:00 & 18:30 - 23:00)
const splitShift = {
  mode: 'split',
  isOff: false,
  start1: '11:00',
  end1: '17:00',
  start2: '18:30',
  end2: '23:00'
};
const splitRes = calculateShiftDayHours(splitShift);
assert(splitRes.workedHours === 10.5, `Split shift 11:00-17:00 & 18:30-23:00 should equal 10.5h, got ${splitRes.workedHours}h`);
assert(splitRes.breakHours === 1.5, `Break 17:00 to 18:30 should equal 1.5h, got ${splitRes.breakHours}h`);

// Test 2: Standard 168 hours with all allowances toggled OFF
// Construct mock days (21 working days of 8h each = 168h)
const mockDays = [];
const mockShifts = {};

for (let i = 1; i <= 21; i++) {
  const dateStr = `2026-08-${String(i).padStart(2, '0')}`;
  mockDays.push({
    dayNumber: i,
    dateStr,
    dayOfWeek: 1, // Monday
    isWeekend: false,
    isHoliday: false,
    isStandardWorkday: true
  });
  mockShifts[dateStr] = {
    mode: 'continuous',
    isOff: false,
    continuousStart: '09:00',
    continuousEnd: '17:00' // 8h
  };
}

const salaryRes = calculateSalary({
  baseGross: 5500,
  normHours: 168,
  days: mockDays,
  shifts: mockShifts,
  toggles: { weekend: false, holiday: false, overtime: false }
});

assert(salaryRes.totalWorkedHours === 168, `Total worked hours should be 168, got ${salaryRes.totalWorkedHours}`);
assert(salaryRes.totalGross === 5500, `Total Gross should be 5500 LEI, got ${salaryRes.totalGross}`);
assert(salaryRes.cas === 1375, `CAS (25%) should be 1375 LEI, got ${salaryRes.cas}`);
assert(salaryRes.cass === 550, `CASS (10%) should be 550 LEI, got ${salaryRes.cass}`);
assert(salaryRes.taxableBase === 3575, `Taxable Base should be 3575 LEI, got ${salaryRes.taxableBase}`);
assert(salaryRes.impozit === 357.50, `Impozit (10%) should be 357.50 LEI, got ${salaryRes.impozit}`);
assert(salaryRes.netSalary === 3217.50, `Net Salary should be exactly 3217.50 LEI, got ${salaryRes.netSalary}`);

// Test 3: Orthodox Easter Dates verification
const easter2024 = getOrthodoxEasterDate(2024);
assert(easter2024.getUTCMonth() === 4 && easter2024.getUTCDate() === 5, `Orthodox Easter 2024 should be May 5, got Month:${easter2024.getUTCMonth()+1} Day:${easter2024.getUTCDate()}`);

const easter2025 = getOrthodoxEasterDate(2025);
assert(easter2025.getUTCMonth() === 3 && easter2025.getUTCDate() === 20, `Orthodox Easter 2025 should be April 20, got Month:${easter2025.getUTCMonth()+1} Day:${easter2025.getUTCDate()}`);

const easter2026 = getOrthodoxEasterDate(2026);
assert(easter2026.getUTCMonth() === 3 && easter2026.getUTCDate() === 12, `Orthodox Easter 2026 should be April 12, got Month:${easter2026.getUTCMonth()+1} Day:${easter2026.getUTCDate()}`);

// Test 4: Romanian Statutory Holidays Count
const holidays2026 = getRomanianHolidays(2026);
assert(holidays2026.length >= 17, `Should have at least 17 statutory holiday entries in 2026, got ${holidays2026.length}`);

// Test 5: Weekend and Holiday Allowances calculation
const weekendDay = { dayNumber: 1, dateStr: '2026-08-01', dayOfWeek: 6, isWeekend: true, isHoliday: false, isStandardWorkday: false };
const holidayDay = { dayNumber: 15, dateStr: '2026-08-15', dayOfWeek: 6, isWeekend: true, isHoliday: true, isStandardWorkday: false };

const testBonusSalary = calculateSalary({
  baseGross: 5500,
  normHours: 168,
  days: [
    ...mockDays,
    weekendDay,
    holidayDay
  ],
  shifts: {
    ...mockShifts,
    '2026-08-01': { mode: 'continuous', continuousStart: '10:00', continuousEnd: '18:00' }, // 8h weekend
    '2026-08-15': { mode: 'continuous', continuousStart: '10:00', continuousEnd: '18:00' }  // 8h holiday
  },
  toggles: { weekend: true, holiday: true, overtime: true }
});

assert(testBonusSalary.weekendHours === 8, `Weekend hours should be 8, got ${testBonusSalary.weekendHours}`);
assert(testBonusSalary.holidayHours === 8, `Holiday hours should be 8, got ${testBonusSalary.holidayHours}`);
assert(testBonusSalary.overtimeHours === 16, `Overtime hours should be 16, got ${testBonusSalary.overtimeHours}`);
assert(testBonusSalary.weekendBonus > 0, `Weekend bonus should be > 0, got ${testBonusSalary.weekendBonus}`);
assert(testBonusSalary.holidayBonus > 0, `Holiday bonus should be > 0, got ${testBonusSalary.holidayBonus}`);
assert(testBonusSalary.overtimePay > 0, `Overtime pay should be > 0, got ${testBonusSalary.overtimePay}`);
assert(testBonusSalary.netSalary > 3217.50, `Net salary with bonuses should exceed base net (3217.50), got ${testBonusSalary.netSalary}`);

console.log(`\n--- ALL TESTS COMPLETED: ${passed}/${total} PASSED ---`);
if (passed === total) {
  console.log('🎯 100% SPECIFICATION COMPLIANCE VERIFIED');
}
