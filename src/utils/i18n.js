/**
 * Complete Internationalization (i18n) Dictionary
 * Supports English (Default) & Romanian with 1-Tap Switching
 */

export const TRANSLATIONS = {
  en: {
    // Header & Meta
    appTitle: 'ZidBhai ShiftPay',
    appSubtitle: 'Romanian Duty Sheet & Smart Salary Calculator',
    roFiscalBadge: 'RO Labor Code',
    bucharestTime: 'Bucharest Time',
    contractGross: 'Contract Gross',
    fiscalGuide: 'Fiscal Guide',
    settings: 'Settings',
    exportPdf: 'Export PDF',
    generatingPdf: 'Generating...',
    
    // Month Selector & Norm
    monthlyNorm: 'Monthly Norm',
    workingDays: 'workdays',
    legalHoliday: 'Legal Holiday',
    legalHolidays: 'Legal Holidays',
    publicHolidaysIn: 'Public Holidays in',
    allDays: 'All',
    workedDays: 'Worked Only',
    weekendHolidays: 'Weekends & Holidays',
    jumpToToday: 'Today',
    
    // Summary Cards
    netTakeHome: 'Net Take-Home Pay',
    cleanNetIncome: 'Net In-Hand Salary',
    standardFixedNorm: 'Standard norm salary (3,217.50 LEI net)',
    bonusesAndOvertime: 'bonuses & overtime',
    belowNormBy: 'Below norm by',
    totalGrossLabel: 'Total Gross:',
    celebrate: 'Celebrate',
    
    timesheetAndHours: 'Duty Sheet & Logged Hours',
    monthlyDistribution: 'Monthly Norm Distribution',
    normProgress: 'Norm',
    loggedHoursVsNorm: 'hours',
    daysWorked: 'days worked',
    weekendHours: 'Weekend Hours (Sat/Sun)',
    holidayHours: 'Legal Holiday Hours',
    overtimeHours: 'Overtime Hours',
    breakHoursTracked: 'Break Time Excluded',
    
    taxesAndDeductions: 'Statutory Taxes & Deductions',
    fiscalWaterfall: 'Fiscal Cascade (Romanian Fiscal Code)',
    viewFormula: 'View Formula',
    totalGrossRealized: '1. Total Gross Earnings',
    casPension: 'CAS Pension (25%)',
    cassHealth: 'CASS Health (10%)',
    taxableIncomeBase: 'Taxable Income Base',
    incomeTax: 'Income Tax (10%)',
    netPayable: 'Net Salary Payable',
    employerCostCAM: 'Employer Cost (CAM 2.25%):',
    
    // Allowance Toggles
    activeAllowancesTitle: 'Active Salary Allowances & Bonuses',
    activeAllowancesSubtitle: 'Independent computation toggles compliant with Romanian Labor Law',
    hourlyBaseRate: 'Base Hourly Rate:',
    perHour: 'LEI/hr',
    weekendToggleTitle: 'Weekend Bonus (Sat / Sun)',
    weekendLegalRef: 'Art. 137 Labor Code',
    weekendToggleDesc: '+30% bonus on base hourly rate for hours worked on Saturdays and Sundays.',
    holidayToggleTitle: 'Legal Holiday Bonus',
    holidayLegalRef: 'Art. 142 Labor Code',
    holidayToggleDesc: '+100% bonus (double rate) on base hourly rate for statutory Romanian holidays.',
    overtimeToggleTitle: 'Overtime Work Bonus',
    overtimeLegalRef: 'Art. 120 Labor Code',
    overtimeToggleDesc: 'Hours exceeding monthly standard norm are compensated with a +75% bonus rate (175% total).',
    hoursLogged: 'Hours logged:',
    disabled: 'Disabled',
    
    // Duty Sheet & Grid
    dutySheetTitle: 'Duty Sheet & Daily Working Hours',
    dutySheetSubtitle: 'Log shift intervals, split shifts with breaks, and rest days',
    quickActions: 'Quick Actions:',
    fillStandardWeekdays: 'Standard 8h (Mon-Fri)',
    fillSplitTemplate: 'Split Template (10.5h)',
    setWeekendsOff: 'Weekends OFF',
    resetMonth: 'Reset Month',
    showingDays: 'Showing',
    ofDays: 'of',
    daysInMonth: 'days in month.',
    autoSaveNotice: 'All entries auto-save in your browser (localStorage).',
    noDaysMatchingFilter: 'No days match the selected filter.',
    
    // Shift Row Controls & Presets
    standardWorkday: 'Standard Workday',
    nonWorkday: 'Non-working day',
    weekendBadge: 'Weekend',
    splitMode: 'Split Shift',
    continuousMode: 'Continuous',
    slot1: 'Slot 1',
    slot2: 'Slot 2',
    breakPill: 'Break:',
    interval: 'Interval',
    offDayLabel: 'Rest Day (OFF - 0 hrs)',
    setOff: 'Set OFF',
    activateDay: 'Active Day',
    duplicateToNext: 'Copy to next day',
    presetsLabel: 'Presets:',
    preset8h: '8h Standard',
    presetSplit: '10.5h Split',
    presetOff: 'Rest (OFF)',
    
    // Modals
    fiscalGuideTitle: 'Romanian Fiscal Code & Labor Law Guide',
    fiscalGuideSubtitle: 'Law 227/2015 (Fiscal Code) & Law 53/2003 (Labor Code)',
    calculationCascadeTitle: 'Monthly Calculation Cascade Breakdown',
    gotIt: 'Got It, Thanks',
    
    settingsTitle: 'Profile & Salary Settings',
    settingsSubtitle: 'Customize contract gross salary, employee details, and currency rates',
    contractGrossInput: 'Contract Gross Salary (LEI / Month)',
    defaultGrossHint: 'Default: 5,500 LEI (yields exactly 3,217.50 LEI net without bonuses).',
    employeeNameLabel: 'Employee Name',
    companyNameLabel: 'Company / Employer Name',
    jobTitleLabel: 'Position / Job Title',
    exchangeRateLabel: 'RON / EUR Exchange Rate',
    resetDefaults: 'Reset Defaults',
    saveSettings: 'Save Settings',
    
    // Confirmations & Prompts
    confirmResetMonth: 'Are you sure you want to reset all shift logs for this month?',
    
    // Mobile bar
    mobileNet: 'Net',
    mobileHours: 'Hours',
    
    // Months & Days
    months: [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  
  ro: {
    // Header & Meta
    appTitle: 'ZidBhai ShiftPay',
    appSubtitle: 'Pontaj Românesc & Calculator Inteligent Salarii',
    roFiscalBadge: 'Codul Muncii RO',
    bucharestTime: 'Ora României',
    contractGross: 'Brut Contract',
    fiscalGuide: 'Ghid Fiscal',
    settings: 'Setări',
    exportPdf: 'Export PDF',
    generatingPdf: 'Generare...',
    
    // Month Selector & Norm
    monthlyNorm: 'Normă Lunară',
    workingDays: 'zile lucrătoare',
    legalHoliday: 'Sărbătoare Legală',
    legalHolidays: 'Sărbători Legale',
    publicHolidaysIn: 'Zile Libere Legale în',
    allDays: 'Toate',
    workedDays: 'Doar Lucrate',
    weekendHolidays: 'Weekend / Sărbători',
    jumpToToday: 'Astăzi',
    
    // Summary Cards
    netTakeHome: 'Salariu Net de Plată',
    cleanNetIncome: 'Venit Curat În Mână',
    standardFixedNorm: 'Normă standard fixă (3.217,50 LEI net)',
    bonusesAndOvertime: 'sporuri & ore suplimentare',
    belowNormBy: 'Sub normă cu',
    totalGrossLabel: 'Venit Brut Total:',
    celebrate: 'Celebrare',
    
    timesheetAndHours: 'Pontaj & Ore Înregistrate',
    monthlyDistribution: 'Distribuție Normă Lunară',
    normProgress: 'Normă',
    loggedHoursVsNorm: 'ore',
    daysWorked: 'zile lucrate',
    weekendHours: 'Ore Weekend (Sâmbătă/Duminică)',
    holidayHours: 'Ore Sărbători Legale',
    overtimeHours: 'Ore Suplimentare',
    breakHoursTracked: 'Pauze Scăzute',
    
    taxesAndDeductions: 'Taxe & Rețineri Stat',
    fiscalWaterfall: 'Cascadă Fiscală (Codul Fiscal)',
    viewFormula: 'Vezi Formula',
    totalGrossRealized: '1. Venit Brut Total Realizat',
    casPension: 'CAS Pensie (25%)',
    cassHealth: 'CASS Sănătate (10%)',
    taxableIncomeBase: 'Bază Impozabilă',
    incomeTax: 'Impozit pe Venit (10%)',
    netPayable: 'Salariu Net de Plată',
    employerCostCAM: 'Cost Total Angajator (CAM 2.25%):',
    
    // Allowance Toggles
    activeAllowancesTitle: 'Sporuri Salariale Active',
    activeAllowancesSubtitle: 'Comutatoare independente de calcul conform legislației muncii',
    hourlyBaseRate: 'Tarif Orar Bază:',
    perHour: 'LEI/oră',
    weekendToggleTitle: 'Spor Weekend (S / D)',
    weekendLegalRef: 'Art. 137 Codul Muncii',
    weekendToggleDesc: 'Majorare de 30% la tariful orar de bază pentru orele lucrate sâmbăta și duminica.',
    holidayToggleTitle: 'Spor Sărbători Legale',
    holidayLegalRef: 'Art. 142 Codul Muncii',
    holidayToggleDesc: 'Spor de 100% (dublu) din tariful orar de bază pentru orele lucrate de sărbători legale.',
    overtimeToggleTitle: 'Spor Ore Suplimentare',
    overtimeLegalRef: 'Art. 120 Codul Muncii',
    overtimeToggleDesc: 'Orele ce depășesc norma standard a lunii sunt plătite cu spor legal de 75% (175% tarif orar).',
    hoursLogged: 'Ore înregistrate:',
    disabled: 'Dezactivat',
    
    // Duty Sheet & Grid
    dutySheetTitle: 'Foaie de Pontaj & Evidență Zilnică',
    dutySheetSubtitle: 'Înregistrează intervalele de lucru, ture frânte (split) și zile libere',
    quickActions: 'Acțiuni Rapide:',
    fillStandardWeekdays: 'Normă Standard (8h L-V)',
    fillSplitTemplate: 'Template Split (10.5h)',
    setWeekendsOff: 'Weekenduri OFF',
    resetMonth: 'Resetează Pontaj',
    showingDays: 'Afișate',
    ofDays: 'din',
    daysInMonth: 'zile ale lunii.',
    autoSaveNotice: 'Datele se salvează automat în browser (localStorage).',
    noDaysMatchingFilter: 'Nicio zi nu corespunde filtrului selectat.',
    
    // Shift Row Controls & Presets
    standardWorkday: 'Zi lucrătoare normă',
    nonWorkday: 'Zi nelucrătoare',
    weekendBadge: 'Weekend',
    splitMode: 'Tură Split',
    continuousMode: 'Continuu',
    slot1: 'Tura 1',
    slot2: 'Tura 2',
    breakPill: 'Pauză:',
    interval: 'Interval',
    offDayLabel: 'Zi Liberă (OFF - 0 ore)',
    setOff: 'Setează OFF',
    activateDay: 'Activează Zi',
    duplicateToNext: 'Copiază în ziua următoare',
    presetsLabel: 'Preset:',
    preset8h: '8h Standard',
    presetSplit: '10.5h Split',
    presetOff: 'Liber (OFF)',
    
    // Modals
    fiscalGuideTitle: 'Ghid de Calcul Fiscal & Legislația Muncii',
    fiscalGuideSubtitle: 'Codul Fiscal (Legea 227/2015) & Codul Muncii (Legea 53/2003)',
    calculationCascadeTitle: 'Cascada de Calcul pentru Luna Selectată',
    gotIt: 'Am Înțeles',
    
    settingsTitle: 'Configurare Profil & Salariu',
    settingsSubtitle: 'Personalizează salariul de bază și datele de pe fișa de pontaj',
    contractGrossInput: 'Salariu Contract Brut (LEI / Lună)',
    defaultGrossHint: 'Valoare implicită: 5.500 LEI (rezultă exact 3.217,50 LEI net fără sporuri).',
    employeeNameLabel: 'Nume Angajat',
    companyNameLabel: 'Companie / Angajator',
    jobTitleLabel: 'Funcție / Poziție',
    exchangeRateLabel: 'Curs de Schimb RON / EUR',
    resetDefaults: 'Resetare Implicite',
    saveSettings: 'Salvează Setările',
    
    // Confirmations & Prompts
    confirmResetMonth: 'Sigur doriți să resetați toate turele pentru această lună?',
    
    // Mobile bar
    mobileNet: 'Net',
    mobileHours: 'Ore',
    
    // Months & Days
    months: [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie',
      'Mai', 'Iunie', 'Iulie', 'August',
      'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ],
    daysShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    daysFull: ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
  }
};
