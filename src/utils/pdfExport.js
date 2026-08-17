import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MONTH_NAMES_RO, MONTH_NAMES_EN } from './romanianCalendar';
import { calculateShiftDayHours } from './salaryEngine';

/**
 * Generates and downloads a Modern Luxury Duty Sheet & Salary Payslip PDF
 * @param {object} params
 */
export function exportDutySheetPDF({
  year,
  month,
  days,
  shifts,
  calcResult,
  employeeName = 'Employee',
  companyName = 'Enterprise SRL',
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
  
  // Luxury Palette
  const darkNavy = [15, 23, 42];        // #0f172a
  const cyanAccent = [2, 132, 199];      // #0284c7
  const emeraldAccent = [5, 150, 105];   // #059669
  const textMuted = [100, 116, 139];     // #64748b
  const cardBg = [248, 250, 252];        // #f8fafc
  const borderColor = [226, 232, 240];   // #e2e8f0

  // 1. TOP ACCENT STRIP (Cyan & Emerald Gradient Bar)
  doc.setFillColor(...cyanAccent);
  doc.rect(0, 0, 105, 3, 'F');
  doc.setFillColor(...emeraldAccent);
  doc.rect(105, 0, 105, 3, 'F');

  // 2. HEADER BANNER
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 3, 210, 28, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...darkNavy);
  doc.text(isRo ? 'CALCULATOR SALARII' : 'SALARY CALCULATOR', 14, 15);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cyanAccent);
  doc.text(
    isRo 
      ? 'FOAIE COLECTIVĂ DE PREZENȚĂ & FLUTURAȘ DE SALARIU' 
      : 'EXECUTIVE DUTY TIMESHEET & OFFICIAL SALARY PAYSLIP', 
    14, 
    21
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(
    isRo 
      ? 'Conform Codul Muncii (Legea 53/2003) & Codul Fiscal (Legea 227/2015)' 
      : 'Compliant with Romanian Labor Code & Fiscal Code (Law 227/2015)', 
    14, 
    26
  );

  // Period Box on Top Right
  doc.setFillColor(...cardBg);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(140, 7, 56, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkNavy);
  doc.text(`${monthName.toUpperCase()} ${year}`, 168, 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(
    isRo 
      ? `Normă: ${calcResult.normHours} ore (${calcResult.normHours / 8} zile)` 
      : `Norm: ${calcResult.normHours} hrs (${calcResult.normHours / 8} days)`, 
    168, 
    21, 
    { align: 'center' }
  );

  // 3. EMPLOYEE & COMPANY METADATA CARD
  let currentY = 34;
  doc.setFillColor(...cardBg);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(14, currentY, 182, 17, 2, 2, 'FD');

  const metaCols = [
    { label: isRo ? 'ANGAJAT (NUME):' : 'EMPLOYEE NAME:', val: employeeName, x: 18 },
    { label: isRo ? 'COMPANIE / ANGAJATOR:' : 'COMPANY / EMPLOYER:', val: companyName, x: 74 },
    { label: isRo ? 'FUNCȚIE / POZIȚIE:' : 'JOB POSITION:', val: position, x: 130 },
  ];

  metaCols.forEach(col => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.text(col.label, col.x, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkNavy);
    doc.text(col.val, col.x, currentY + 12);
  });

  currentY += 21;

  // 4. EXECUTIVE FINANCIAL KPI CARDS
  doc.setFillColor(...darkNavy);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, 'F');

  const kpis = [
    { 
      label: isRo ? 'TOTAL ORE LUCRATE' : 'TOTAL WORKED', 
      val: `${calcResult.totalWorkedHours}h / ${calcResult.normHours}h`,
      highlight: false 
    },
    { 
      label: isRo ? 'WEEKEND & SĂRBĂTORI' : 'WEEKEND & HOLIDAYS', 
      val: `${calcResult.weekendHours + calcResult.holidayHours} ore`,
      highlight: false 
    },
    { 
      label: isRo ? 'ORE SUPLIMENTARE' : 'OVERTIME HOURS', 
      val: `${calcResult.overtimeHours} ore`,
      highlight: false 
    },
    { 
      label: isRo ? 'VENIT NET DE PLATĂ' : 'FINAL NET TAKE-HOME', 
      val: `${calcResult.netSalary.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} RON`,
      highlight: true 
    }
  ];

  kpis.forEach((kpi, idx) => {
    const colWidth = 182 / kpis.length;
    const x = 14 + idx * colWidth;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(kpi.label, x + 4, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    if (kpi.highlight) {
      doc.setTextColor(52, 211, 153); // Bright Emerald
    } else {
      doc.setTextColor(255, 255, 255);
    }
    doc.text(kpi.val, x + 4, currentY + 13);
  });

  currentY += 22;

  // 5. DAILY DUTY TIMESHEET TABLE
  const tableRows = days.map(d => {
    const shift = shifts[d.dateStr] || { isOff: d.isWeekend };
    const { workedHours, breakHours } = calculateShiftDayHours(shift);

    let shiftType = isRo ? 'LIBER (OFF)' : 'OFF (REST)';
    let intervals = '-';
    let tags = [];

    if (d.isHoliday) tags.push(d.holidayInfo ? d.holidayInfo.shortName : (isRo ? 'Sărbătoare' : 'Holiday'));
    if (d.isWeekend) tags.push('Weekend');

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
      tags.join(' | ') || (d.isStandardWorkday ? (isRo ? 'Normă standard' : 'Standard Norm') : '-')
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [[
      isRo ? 'Zi' : 'Day',
      isRo ? 'Zi Săptămână' : 'Weekday',
      isRo ? 'Tip Program' : 'Shift Mode',
      isRo ? 'Intervale Orare (Lucru)' : 'Logged Intervals',
      isRo ? 'Pauză' : 'Break',
      isRo ? 'Ore' : 'Hours',
      isRo ? 'Observații / Statut' : 'Status / Notes'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.3,
      textColor: darkNavy,
      lineColor: borderColor,
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: darkNavy,
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
      5: { halign: 'center', cellWidth: 15, fontStyle: 'bold' },
      6: { halign: 'left', cellWidth: 48 },
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
          data.cell.styles.fillColor = [254, 243, 199]; // Amber tint
        } else if (day && day.isWeekend) {
          data.cell.styles.fillColor = [241, 245, 249]; // Soft Slate tint
        }
      }
    }
  });

  let finalY = doc.lastAutoTable.finalY + 8;

  // New page if needed for fiscal summary
  if (finalY > 235) {
    doc.addPage();
    finalY = 20;
  }

  // 6. FISCAL CASCADE TABLE
  const taxRows = [
    [isRo ? '1. Salariu Bază Brut (Regular)' : '1. Regular Base Gross Salary', `${calcResult.regularGross.toFixed(2)} RON`],
    [isRo ? '2. Spor Weekend (+30% Art. 137)' : '2. Weekend Allowance (+30% Art. 137)', `${calcResult.weekendBonus.toFixed(2)} RON`],
    [isRo ? '3. Spor Sărbători Legale (+100% Art. 142)' : '3. Statutory Holiday Allowance (+100% Art. 142)', `${calcResult.holidayBonus.toFixed(2)} RON`],
    [isRo ? '4. Plata Ore Suplimentare (+75% Art. 120)' : '4. Overtime Compensation (+75% Art. 120)', `${calcResult.overtimePay.toFixed(2)} RON`],
    [isRo ? 'TOTAL VENIT BRUT REALIZAT' : 'TOTAL REALIZED GROSS EARNINGS', `${calcResult.totalGross.toFixed(2)} RON`],
    [isRo ? '  - CAS Pensie (25%)' : '  - CAS Pension Security (25%)', `-${calcResult.cas.toFixed(2)} RON`],
    [isRo ? '  - CASS Sănătate (10%)' : '  - CASS Health Insurance (10%)', `-${calcResult.cass.toFixed(2)} RON`],
    [isRo ? '  = Bază Impozabilă' : '  = Taxable Income Base', `${calcResult.taxableBase.toFixed(2)} RON`],
    [isRo ? '  - Impozit pe Venit (10%)' : '  - Personal Income Tax (10%)', `-${calcResult.impozit.toFixed(2)} RON`],
    [isRo ? 'TOTAL SALARIU NET DE PLATĂ' : 'TOTAL FINAL NET TAKE-HOME PAY', `${calcResult.netSalary.toFixed(2)} RON`],
  ];

  autoTable(doc, {
    startY: finalY,
    head: [[isRo ? 'Cascadă Calcul Fiscal (Codul Fiscal Legea 227/2015)' : 'Fiscal Calculation Waterfall (Romanian Fiscal Code)', isRo ? 'Sumă (RON)' : 'Amount (RON)']],
    body: taxRows,
    theme: 'plain',
    tableWidth: 120,
    margin: { left: 14 },
    styles: {
      fontSize: 7.5,
      cellPadding: 1.3,
      textColor: darkNavy,
    },
    headStyles: {
      fillColor: darkNavy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 82 },
      1: { halign: 'right', cellWidth: 38, fontStyle: 'bold' }
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

  // 7. SIGNATURES CARD
  const sigX = 142;
  const sigY = finalY;

  doc.setDrawColor(...borderColor);
  doc.setFillColor(...cardBg);
  doc.roundedRect(sigX, sigY, 54, 48, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  doc.text(isRo ? 'CONFIRMARE & SEMNĂTURĂ' : 'APPROVAL & SIGNATURE', sigX + 4, sigY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text(isRo ? 'Semnătură Angajator:' : 'Employer Signature:', sigX + 4, sigY + 15);
  doc.line(sigX + 4, sigY + 24, sigX + 50, sigY + 24);

  doc.text(isRo ? 'Semnătură Angajat:' : 'Employee Signature:', sigX + 4, sigY + 32);
  doc.line(sigX + 4, sigY + 42, sigX + 50, sigY + 42);

  // 8. FOOTER NOTE
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    isRo 
      ? 'Generat automat prin Salary Calculator // Foaie de Pontaj & Fluturaș Salariu conform Codului Muncii și Codului Fiscal.' 
      : 'Generated automatically via Salary Calculator // Duty Timesheet & Payslip under Romanian Labor & Fiscal Regulations.', 
    14, 
    290
  );

  const filename = `SalaryCalculator_${employeeName.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`;
  doc.save(filename);
}
