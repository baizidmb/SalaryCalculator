import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MONTH_NAMES_RO, MONTH_NAMES_EN, DAY_NAMES_FULL_RO, DAY_NAMES_FULL_EN } from './romanianCalendar';
import { calculateShiftDayHours } from './salaryEngine';

/**
 * Generates and downloads a Romanian Duty Sheet & Payslip PDF (Bilingual EN/RO)
 * @param {object} params
 */
export function exportDutySheetPDF({
  year,
  month,
  days,
  shifts,
  calcResult,
  employeeName = 'Employee',
  companyName = 'ZidBhai Enterprise SRL',
  position = 'Operations Specialist',
  lang = 'en'
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const isRo = lang === 'ro';
  const monthName = isRo ? MONTH_NAMES_RO[month - 1] : MONTH_NAMES_EN[month - 1];
  const primaryColor = [6, 182, 212];    // Neon Cyan #06b6d4
  const darkColor = [15, 23, 42];        // Deep Slate #0f172a
  const grayColor = [100, 116, 139];

  // Header Background bar
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 32, 'F');

  // Accent glowing line
  doc.setFillColor(...primaryColor);
  doc.rect(0, 32, 210, 1.5, 'F');

  // Brand Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('ZidBhai ShiftPay', 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(6, 182, 212);
  doc.text(
    isRo 
      ? 'FOAIE DE PONTAJ & FLUTURAȘ DE SALARIU // CODUL FISCAL RO' 
      : 'DUTY TIMESHEET & SALARY PAYSLIP // ROMANIAN FISCAL CODE', 
    14, 
    21
  );

  // Period Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${isRo ? 'LUNA' : 'PERIOD'}: ${monthName.toUpperCase()} ${year}`, 196, 16, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(
    isRo 
      ? `Normă Lunară: ${calcResult.normHours} ore (${calcResult.normHours / 8} zile lucrătoare)` 
      : `Monthly Norm: ${calcResult.normHours} hrs (${calcResult.normHours / 8} standard workdays)`, 
    196, 
    22, 
    { align: 'right' }
  );

  // Metadata Card
  let currentY = 40;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text(isRo ? 'ANGAJAT:' : 'EMPLOYEE:', 18, currentY + 7);
  doc.text(isRo ? 'COMPANIE:' : 'COMPANY:', 80, currentY + 7);
  doc.text(isRo ? 'SALARIU BAZĂ BRUT:' : 'BASE GROSS CONTRACT:', 140, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(employeeName, 18, currentY + 13);
  doc.text(companyName, 80, currentY + 13);
  doc.text(`${calcResult.baseGross.toLocaleString('ro-RO')} LEI`, 140, currentY + 13);

  currentY += 24;

  // Key Financial Highlights summary bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 20, 2, 2, 'F');

  const metrics = [
    { label: isRo ? 'ORE LUCRATE' : 'TOTAL WORKED', val: `${calcResult.totalWorkedHours}h / ${calcResult.normHours}h` },
    { label: isRo ? 'ORE WEEKEND' : 'WEEKEND HOURS', val: `${calcResult.weekendHours}h` },
    { label: isRo ? 'ORE SĂRBĂTOARE' : 'HOLIDAY HOURS', val: `${calcResult.holidayHours}h` },
    { label: isRo ? 'ORE SUPLIMENTARE' : 'OVERTIME HOURS', val: `${calcResult.overtimeHours}h` },
    { label: isRo ? 'SALARIU NET' : 'NET TAKE-HOME', val: `${calcResult.netSalary.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} LEI`, highlight: true }
  ];

  metrics.forEach((m, idx) => {
    const colWidth = 182 / metrics.length;
    const x = 14 + idx * colWidth;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.text(m.label, x + 3, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    if (m.highlight) {
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setTextColor(...darkColor);
    }
    doc.text(m.val, x + 3, currentY + 14);
  });

  currentY += 26;

  // Daily Shifts Table
  const tableRows = days.map(d => {
    const shift = shifts[d.dateStr] || { isOff: d.isWeekend };
    const { workedHours, breakHours } = calculateShiftDayHours(shift);

    let shiftType = isRo ? 'LIBER (OFF)' : 'REST DAY (OFF)';
    let intervals = '-';
    let tags = [];

    if (d.isHoliday) tags.push(d.holidayInfo ? d.holidayInfo.shortName : (isRo ? 'Sărbătoare' : 'Holiday'));
    if (d.isWeekend) tags.push(isRo ? 'Weekend' : 'Weekend');

    if (!shift.isOff && workedHours > 0) {
      if (shift.mode === 'continuous') {
        shiftType = isRo ? 'Continuu' : 'Continuous';
        intervals = `${shift.continuousStart || '--'} - ${shift.continuousEnd || '--'}`;
      } else {
        shiftType = isRo ? 'Split (Pauză)' : 'Split Shift';
        const p1 = `${shift.start1 || '--'} - ${shift.end1 || '--'}`;
        const p2 = `${shift.start2 || '--'} - ${shift.end2 || '--'}`;
        intervals = `${p1} & ${p2}`;
      }
    }

    return [
      String(d.dayNumber).padStart(2, '0'),
      d.dayNameFull,
      shiftType,
      intervals,
      breakHours > 0 ? `${breakHours}h` : '-',
      workedHours > 0 ? `${workedHours.toFixed(1)}h` : '0.0h',
      tags.join(' | ') || (d.isStandardWorkday ? (isRo ? 'Normă' : 'Standard') : '-')
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [[
      isRo ? 'Zi' : 'Day',
      isRo ? 'Zi Săpt.' : 'Weekday',
      isRo ? 'Tip Tură' : 'Shift Mode',
      isRo ? 'Intervale Orare' : 'Time Intervals',
      isRo ? 'Pauză' : 'Break',
      isRo ? 'Ore' : 'Hours',
      isRo ? 'Observații / Statut' : 'Status / Notes'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: darkColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
      1: { halign: 'left', cellWidth: 24 },
      2: { halign: 'center', cellWidth: 24 },
      3: { halign: 'center', cellWidth: 46 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      6: { halign: 'left', cellWidth: 47 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      const rowIdx = data.row.index;
      if (rowIdx >= 0 && rowIdx < days.length) {
        const day = days[rowIdx];
        if (day && day.isHoliday) {
          data.cell.styles.fillColor = [254, 243, 199];
        } else if (day && day.isWeekend) {
          data.cell.styles.fillColor = [241, 245, 249];
        }
      }
    }
  });

  let finalY = doc.lastAutoTable.finalY + 8;

  if (finalY > 235) {
    doc.addPage();
    finalY = 20;
  }

  // Fiscal Breakdown Table
  const taxRows = [
    [isRo ? '1. Salariu Bază Brut (Regular)' : '1. Regular Base Gross Pay', `${calcResult.regularGross.toFixed(2)} LEI`],
    [isRo ? '2. Spor Weekend (+30%)' : '2. Weekend Bonus (+30%)', `${calcResult.weekendBonus.toFixed(2)} LEI`],
    [isRo ? '3. Spor Sărbători Legale (+100%)' : '3. Statutory Holiday Bonus (+100%)', `${calcResult.holidayBonus.toFixed(2)} LEI`],
    [isRo ? '4. Plata Ore Suplimentare (+75%)' : '4. Overtime Compensation (+75%)', `${calcResult.overtimePay.toFixed(2)} LEI`],
    [isRo ? 'VENIT BRUT TOTAL REALIZAT' : 'TOTAL REALIZED GROSS EARNINGS', `${calcResult.totalGross.toFixed(2)} LEI`],
    [isRo ? '  - CAS Pensie (25%)' : '  - CAS Pension Security (25%)', `-${calcResult.cas.toFixed(2)} LEI`],
    [isRo ? '  - CASS Sănătate (10%)' : '  - CASS Health Insurance (10%)', `-${calcResult.cass.toFixed(2)} LEI`],
    [isRo ? '  = Bază Impozabilă' : '  = Taxable Income Base', `${calcResult.taxableBase.toFixed(2)} LEI`],
    [isRo ? '  - Impozit pe Venit (10%)' : '  - Personal Income Tax (10%)', `-${calcResult.impozit.toFixed(2)} LEI`],
    [isRo ? 'SALARIU NET DE PLATĂ' : 'FINAL NET TAKE-HOME PAY', `${calcResult.netSalary.toFixed(2)} LEI`],
  ];

  autoTable(doc, {
    startY: finalY,
    head: [[isRo ? 'Element de Calcul Fiscal (Codul Fiscal)' : 'Fiscal Calculation Cascade (Romanian Fiscal Code)', isRo ? 'Sumă (LEI)' : 'Amount (LEI)']],
    body: taxRows,
    theme: 'plain',
    tableWidth: 120,
    margin: { left: 14 },
    styles: {
      fontSize: 7.5,
      cellPadding: 1.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: darkColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'right', cellWidth: 40, fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.row.index === 4) {
        data.cell.styles.fillColor = [224, 242, 254];
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.row.index === 9) {
        data.cell.styles.fillColor = [209, 250, 229];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [5, 150, 105];
      }
    }
  });

  // Signatures box
  const sigX = 142;
  const sigY = finalY;

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(sigX, sigY, 54, 48, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(isRo ? 'CONFIRMARE & SEMNĂTURI' : 'APPROVAL & SIGNATURES', sigX + 4, sigY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text(isRo ? 'Întocmit Angajator:' : 'Employer Signature:', sigX + 4, sigY + 15);
  doc.line(sigX + 4, sigY + 24, sigX + 50, sigY + 24);

  doc.text(isRo ? 'Luat la cunoștință Angajat:' : 'Employee Signature:', sigX + 4, sigY + 32);
  doc.line(sigX + 4, sigY + 42, sigX + 50, sigY + 42);

  // Footer note
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    isRo 
      ? 'Generat automat prin ZidBhai ShiftPay // Calculator Salarii România conform Codului Muncii și Codului Fiscal.' 
      : 'Generated via ZidBhai ShiftPay // Romanian Duty Sheet & Smart Salary Calculator under Romanian Labor & Fiscal Code.', 
    14, 
    290
  );

  const filename = `ShiftPay_Timesheet_${employeeName.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`;
  doc.save(filename);
}
