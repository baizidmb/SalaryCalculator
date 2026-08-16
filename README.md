# ZidBhai ShiftPay // Romanian Duty Sheet & Smart Salary Calculator

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A luxury dark-mode web application (Deep Slate `#090D16` with Neon Cyan `#06b6d4` & Emerald `#10b981` accents) tailored for Romanian labor regulations (**Codul Muncii - Legea 53/2003** & **Codul Fiscal - Legea 227/2015**).

---

## ✨ Features

- 🇷🇴 **Romanian Calendar & Legal Holidays Engine**:
  - Full astronomical Orthodox Easter computus (Meeus Julian algorithm with Gregorian offset).
  - Automatically derives **Good Friday (Vinerea Mare)**, **Paștele Ortodox (Zilele 1 & 2)**, and **Rusalii (Zilele 1 & 2)**.
  - Detects all statutory Romanian public holidays (Art. 139 Codul Muncii): *1 & 2 Ianuarie, 6 & 7 Ianuarie, 24 Ianuarie, 1 Mai, 1 Iunie, 15 August, 30 Noiembrie, 1 Decembrie, 25 & 26 Decembrie*.
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

- 🕒 **Duty Sheet & Shift Log Grid**:
  - **Split Shift Mode**: `Start 1` $\rightarrow$ `End 1 / Break Start` $\rightarrow$ `Start 2 / Break End` $\rightarrow$ `End 2` (e.g., `11:00-17:00` & `18:30-23:00` = `10.5h` net working time).
  - **Continuous Shift Mode**: Single start and end interval with overnight shift support.
  - **1-Tap Quick OFF Day Toggle**: Zeroes out hours for rest days.
  - **Bulk Actions**: 1-click Fill standard 8h weekdays, Split template, Weekend OFF, and Reset.
  - **Local Persistence**: Auto-saves all inputs to browser `localStorage`.

- 📄 **High-Resolution PDF Export**:
  - Generates a branded, print-ready Romanian Duty Sheet (**Foaie Colectivă de Prezență**) and Payslip (**Fluturaș de Salariu**) with signature boxes for employer and employee.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 5
- **Styling**: Tailwind CSS v3 (Glassmorphism, custom glow shadows, dark-mode `#090D16`)
- **Icons**: `lucide-react`
- **PDF Generation**: `jspdf` + `jspdf-autotable`
- **Animations / Effects**: `canvas-confetti`

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
