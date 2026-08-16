import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MONTH_NAMES_RO } from './romanianCalendar';
import { formatCurrency, calculateShiftDayHours } from './salaryEngine';

/**
 * Generates and downloads a Romanian Duty Sheet & Payslip PDF (Foaie Colectivă de Prezență & Fluturaș Salariu)
 * @param {object} params
 */
export function exportDutySheetPDF({
  year,
  month,
  days,
  shifts,
  calcResult,
  employeeName = 'Angajat',
  companyName = 'ZidBhai Enterprise SRL',
  position = 'Specialist Operațiuni'
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const monthName = MONTH_NAMES_RO[month - 1];
  const primaryColor = [6, 182, 212];    // Neon Cyan #06b6d4
  const darkColor = [15, 23, 42];        // Deep Slate #0f172a
  const emeraldColor = [16, 185, 129];   // Emerald #10b981
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
  doc.text('FOAIE DE PONTAJ & FLUTURAȘ DE SALARIU // ROMANIA FISCAL CODE', 14, 21);

  // Period Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`LUNA: ${monthName.toUpperCase()} ${year}`, 196, 16, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Normă Lunar: ${calcResult.normHours} ore (${calcResult.normHours / 8} zile lucrătoare)`, 196, 22, { align: 'right' });

  // Metadata Card
  let currentY = 40;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  doc.text('ANGAJAT:', 18, currentY + 7);
  doc.text('COMPANIE:', 80, currentY + 7);
  doc.text('SALARIU BAZĂ BRUT:', 140, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(employeeName, 18, currentY + 13);
  doc.text(companyName, 80, currentY + 13);
  doc.text(`${calcResult.baseGross.toLocaleString('ro-RO')} LEI`, 140, currentY + 13);

  currentY += 24;

  // Key Financial Highlights summary bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 20, 2, 2, 'F');

  // Mini summary blocks
  const metrics = [
    { label: 'ORE LUCRATE', val: `${calcResult.totalWorkedHours}h / ${calcResult.normHours}h` },
    { label: 'ORE WEEKEND', val: `${calcResult.weekendHours}h` },
    { label: 'ORE SĂRBĂTOARE', val: `${calcResult.holidayHours}h` },
    { label: 'ORE SUPLIMENTARE', val: `${calcResult.overtimeHours}h` },
    { label: 'SALARIU NET', val: `${calcResult.netSalary.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} LEI`, highlight: true }
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

    let shiftType = 'LIBER (OFF)';
    let intervals = '-';
    let tags = [];

    if (d.isHoliday) tags.push(d.holidayInfo ? d.holidayInfo.shortName : 'Sărbătoare');
    if (d.isWeekend) tags.push('Weekend');

    if (!shift.isOff && workedHours > 0) {
      if (shift.mode === 'continuous') {
        shiftType = 'Continuu';
        intervals = `${shift.continuousStart || '--'} - ${shift.continuousEnd || '--'}`;
      } else {
        shiftType = 'Split (Pauză)';
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
      tags.join(' | ') || (d.isStandardWorkday ? 'Normă' : '-')
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Zi', 'Zi Săpt.', 'Tip Tură', 'Intervale Orare', 'Pauză', 'Ore', 'Observații / Statut']],
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
      1: { halign: 'left', cellWidth: 22 },
      2: { halign: 'center', cellWidth: 24 },
      3: { halign: 'center', cellWidth: 48 },
      4: { halign: 'center', cellWidth: 16 },
      5: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      6: { halign: 'left', cellWidth: 46 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      // Highlight weekends & holidays
      const rowIdx = data.row.index;
      if (rowIdx >= 0 && rowIdx < days.length) {
        const day = days[rowIdx];
        if (day && day.isHoliday) {
          data.cell.styles.fillColor = [254, 243, 199]; // Amber tint for holidays
        } else if (day && day.isWeekend) {
          data.cell.styles.fillColor = [241, 245, 249]; // Slate tint for weekends
        }
      }
    }
  });

  let finalY = doc.lastAutoTable.finalY + 8;

  // Check if we need a new page for the fiscal waterfall and signatures
  if (finalY > 235) {
    doc.addPage();
    finalY = 20;
  }

  // Fiscal Breakdown Table
  const taxRows = [
    ['1. Salariu Bază Brut (Regular)', `${calcResult.regularGross.toFixed(2)} LEI`],
    ['2. Spor Weekend (+30%)', `${calcResult.weekendBonus.toFixed(2)} LEI`],
    ['3. Spor Sărbători Legale (+100%)', `${calcResult.holidayBonus.toFixed(2)} LEI`],
    ['4. Plata Ore Suplimentare (+75%)', `${calcResult.overtimePay.toFixed(2)} LEI`],
    ['VENIT BRUT TOTAL REALIZAT', `${calcResult.totalGross.toFixed(2)} LEI`],
    ['  - CAS Pensie (25%)', `-${calcResult.cas.toFixed(2)} LEI`],
    ['  - CASS Sănătate (10%)', `-${calcResult.cass.toFixed(2)} LEI`],
    ['  = Bază Impozabilă', `${calcResult.taxableBase.toFixed(2)} LEI`],
    ['  - Impozit pe Venit (10%)', `-${calcResult.impozit.toFixed(2)} LEI`],
    ['SALARIU NET DE PLATĂ', `${calcResult.netSalary.toFixed(2)} LEI`],
  ];

  autoTable(doc, {
    startY: finalY,
    head: [['Element de Calcul Fiscal (Codul Fiscal)', 'Sumă (LEI)']],
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

  // Signatures box next to tax table
  const sigX = 142;
  const sigY = finalY;

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(sigX, sigY, 54, 48, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('CONFIRMARE & SEMNĂTURI', sigX + 4, sigY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text('Întocmit Angajator:', sigX + 4, sigY + 15);
  doc.line(sigX + 4, sigY + 24, sigX + 50, sigY + 24);

  doc.text('Luat la cunoștință Angajat:', sigX + 4, sigY + 32);
  doc.line(sigX + 4, sigY + 42, sigX + 50, sigY + 42);

  // Footer note
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generat automat prin ZidBhai ShiftPay // Calculator Salarii România conform Codului Muncii și Codului Fiscal.', 14, 290);

  // Save the PDF
  const filename = `Pontaj_Salariu_${employeeName.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`;
  doc.save(filename);
}
