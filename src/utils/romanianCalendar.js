/**
 * Romanian Calendar & Legal Holidays Engine
 * Implements Romanian Labor Code (Codul Muncii - Art. 139) & Astronomical Orthodox Computus
 */

export const MONTH_NAMES_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie',
  'Mai', 'Iunie', 'Iulie', 'August',
  'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
];

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export const DAY_NAMES_SHORT_RO = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
export const DAY_NAMES_FULL_RO = [
  'Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'
];

/**
 * Calculates Orthodox Easter for a given year using Meeus Julian algorithm + Gregorian conversion (+13 days)
 * @param {number} year 
 * @returns {Date} Orthodox Easter Sunday Date object in UTC
 */
export function getOrthodoxEasterDate(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31); // 3=March, 4=April (Julian)
  const day = ((d + e + 114) % 31) + 1;

  // Convert Julian date to Gregorian (13 days offset for 1900-2099)
  const julianDate = new Date(Date.UTC(year, month - 1, day));
  const gregorianEaster = new Date(julianDate.getTime() + 13 * 24 * 60 * 60 * 1000);
  return gregorianEaster;
}

/**
 * Retrieves all Romanian official statutory holidays for a specific year
 * @param {number} year 
 * @returns {Array<{dateStr: string, name: string, shortName: string}>}
 */
export function getRomanianHolidays(year) {
  const holidays = [];

  const addHoliday = (month, day, name, shortName) => {
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    holidays.push({
      dateStr: `${year}-${mStr}-${dStr}`,
      name,
      shortName: shortName || name
    });
  };

  // Fixed Romanian Legal Holidays (Art. 139 Codul Muncii)
  addHoliday(1, 1, 'Anul Nou - Ziua 1', 'Anul Nou');
  addHoliday(1, 2, 'Anul Nou - Ziua 2', 'Anul Nou');
  addHoliday(1, 6, 'Boboteaza (Botezul Domnului)', 'Boboteaza');
  addHoliday(1, 7, 'Sfântul Ioan Botezătorul', 'Sf. Ioan');
  addHoliday(1, 24, 'Ziua Unirii Principatelor Române', 'Mica Unire');
  addHoliday(5, 1, 'Ziua Muncii', '1 Mai');
  addHoliday(6, 1, 'Ziua Copilului', '1 Iunie');
  addHoliday(8, 15, 'Adormirea Maicii Domnului (Sf. Maria)', 'Sf. Maria');
  addHoliday(11, 30, 'Sfântul Andrei', 'Sf. Andrei');
  addHoliday(12, 1, 'Ziua Națională a României', '1 Decembrie');
  addHoliday(12, 25, 'Crăciunul - Ziua 1', 'Crăciun 1');
  addHoliday(12, 26, 'Crăciunul - Ziua 2', 'Crăciun 2');

  // Dynamic Orthodox Holidays calculated from Easter
  const easterSun = getOrthodoxEasterDate(year);

  // Good Friday (Vinerea Mare) - 2 days before Easter
  const goodFriday = new Date(easterSun.getTime() - 2 * 24 * 60 * 60 * 1000);
  addHoliday(
    goodFriday.getUTCMonth() + 1,
    goodFriday.getUTCDate(),
    'Vinerea Mare (Vinerea Patimilor)',
    'Vinerea Mare'
  );

  // Orthodox Easter Day 1 (Duminica Paștelui)
  addHoliday(
    easterSun.getUTCMonth() + 1,
    easterSun.getUTCDate(),
    'Paștele Ortodox - Ziua 1',
    'Paște 1'
  );

  // Orthodox Easter Day 2 (A doua zi de Paște)
  const easterMon = new Date(easterSun.getTime() + 1 * 24 * 60 * 60 * 1000);
  addHoliday(
    easterMon.getUTCMonth() + 1,
    easterMon.getUTCDate(),
    'Paștele Ortodox - Ziua 2',
    'Paște 2'
  );

  // Pentecost Day 1 (Rusalii - Duminică, 49 days after Easter)
  const rusaliiSun = new Date(easterSun.getTime() + 49 * 24 * 60 * 60 * 1000);
  addHoliday(
    rusaliiSun.getUTCMonth() + 1,
    rusaliiSun.getUTCDate(),
    'Rusalii - Ziua 1 (Pogorârea Sf. Duh)',
    'Rusalii 1'
  );

  // Pentecost Day 2 (Rusalii - Luni, 50 days after Easter)
  const rusaliiMon = new Date(easterSun.getTime() + 50 * 24 * 60 * 60 * 1000);
  addHoliday(
    rusaliiMon.getUTCMonth() + 1,
    rusaliiMon.getUTCDate(),
    'Rusalii - Ziua 2 (Sfânta Treime)',
    'Rusalii 2'
  );

  return holidays;
}

/**
 * Checks if a specific date string (YYYY-MM-DD) is a Romanian statutory holiday
 * @param {string} dateStr YYYY-MM-DD
 * @returns {object|null} Holiday object if holiday, else null
 */
export function getHolidayForDate(dateStr) {
  if (!dateStr) return null;
  const [yearStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const holidays = getRomanianHolidays(year);
  return holidays.find(h => h.dateStr === dateStr) || null;
}

/**
 * Generates full day structure for a month
 * @param {number} year 
 * @param {number} month 1-12
 * @returns {Array<object>} List of day metadata objects
 */
export function getDaysInMonth(year, month) {
  const days = [];
  const totalDays = new Date(year, month, 0).getDate();
  const holidays = getRomanianHolidays(year);
  const holidayMap = new Map(holidays.map(h => [h.dateStr, h]));

  for (let day = 1; day <= totalDays; day++) {
    const dStr = String(day).padStart(2, '0');
    const mStr = String(month).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    
    // JS Date: 0 = Sun, 1 = Mon, ..., 6 = Sat
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;
    const holiday = holidayMap.get(dateStr) || null;
    const isHoliday = !!holiday;
    
    // Working day in standard Romanian calendar: Mon-Fri and NOT a legal holiday
    const isStandardWorkday = !isWeekend && !isHoliday;

    days.push({
      dayNumber: day,
      dateStr,
      dayOfWeek,
      dayNameShort: DAY_NAMES_SHORT_RO[dayOfWeek],
      dayNameFull: DAY_NAMES_FULL_RO[dayOfWeek],
      isWeekend,
      isSaturday,
      isSunday,
      isHoliday,
      holidayInfo: holiday,
      isStandardWorkday,
    });
  }

  return days;
}

/**
 * Calculates the monthly standard norm (working days * 8h)
 * @param {number} year 
 * @param {number} month 1-12
 * @returns {{ workingDays: number, normHours: number, totalDays: number, weekendDays: number, holidayDays: number }}
 */
export function getMonthlyNormInfo(year, month) {
  const days = getDaysInMonth(year, month);
  let workingDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;

  days.forEach(d => {
    if (d.isStandardWorkday) {
      workingDays++;
    }
    if (d.isWeekend) {
      weekendDays++;
    }
    if (d.isHoliday && !d.isWeekend) {
      holidayDays++;
    }
  });

  return {
    workingDays,
    normHours: workingDays * 8,
    totalDays: days.length,
    weekendDays,
    holidayDays,
  };
}
