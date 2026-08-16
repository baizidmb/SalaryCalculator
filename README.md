# Salary Calculator // Romanian Duty Sheet & Smart Salary Calculator

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, transparent liquid-glass web application tailored for Romanian labor regulations (**Codul Muncii - Legea 53/2003** & **Codul Fiscal - Legea 227/2015**).

---

## ✨ Features

- 🇷🇴 **Romanian Calendar & Legal Holidays Engine**:
  - Full astronomical Orthodox Easter computus (Meeus Julian algorithm with Gregorian offset).
  - Automatically derives **Good Friday (Vinerea Mare)**, **Paștele Ortodox (Zilele 1 & 2)**, and **Rusalii (Zilele 1 & 2)**.
  - Detects all statutory Romanian public holidays (Art. 139 Codul Muncii): *1 & 2 Jan, 6 & 7 Jan, 24 Jan, 1 May, 1 Jun, 15 Aug, 30 Nov, 1 Dec, 25 & 26 Dec*.
  - Dynamic monthly norm calculation based on working days ($N = \text{Working Days} \times 8\text{h}$).

- 💰 **Romanian Fiscal Deduction Waterfall**:
  - **Gross Contract Base**: Default `5,500 LEI` (customizable in Settings).
  - **CAS (Social Security / Pensie)**: `25%`
  - **CASS (Health Insurance / Sănătate)**: `10%`
  - **Taxable Base**: $\text{Gross} - (\text{CAS} + \text{CASS})$
  - **Income Tax (Impozit pe Venit)**: `10%`
  - **Net Standard Pay**: $5{,}500 - 1{,}375 - 550 - 357.50 = \mathbf{3{,}217.50\text{ LEI}}$.

- ⚡ **Allowance Toggles (Independent ON/OFF)**:
  - **Weekend Allowance (+30%)**: $+30\%$ bonus on hourly base rate for hours worked on Saturday & Sunday (*Art. 137 Codul Muncii*).
  - **Legal Holiday Allowance (+100%)**: $+100\%$ bonus on hourly base rate for hours worked on statutory holidays (*Art. 142 Codul Muncii*).
  - **Overtime Allowance (+75%)**: $+75\%$ bonus on hourly base rate for hours worked exceeding the monthly norm (*Art. 120 Codul Muncii*).

- 📱 **100% Mobile Optimized Experience**:
  - Dedicated touch-friendly mobile shift cards on screens `< 768px`.
  - 1-Tap Presets: `[8h Standard]`, `[10.5h Split]`, `[Rest (OFF)]`.
  - Sticky mobile bottom bar with live Net Pay, Hours, PDF Export, and Jump to Top.
  - 1-Tap fast "Today" jump button.

- 📄 **Modern Executive PDF Export**:
  - Generates a branded, print-ready Romanian Duty Timesheet (**Foaie Colectivă de Prezență**) and Official Payslip (**Fluturaș de Salariu**) with executive KPI cards and signature boxes.

- 🌐 **Bilingual (English & Romanian)**:
  - Default: English (`EN 🇬🇧`).
  - 1-Tap language switcher to Romanian (`RO 🇷🇴`).

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/baizidmb/SalaryCalculator.git
cd SalaryCalculator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🧪 Verification & Unit Tests

Run the mathematical verification test suite:
```bash
node test_calculations.js
```

---

## ⚖️ License
MIT License.
