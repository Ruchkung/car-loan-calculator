import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

// ============================================
// BASE UI STYLED FORM COMPONENTS
// ============================================

const Field = ({ children, className = '' }) => (
  <div className={`field-root ${className}`}>{children}</div>
);

Field.Label = ({ children, className = '' }) => (
  <label className={`field-label ${className}`}>{children}</label>
);

Field.Control = ({ children }) => (
  <div className="field-control">{children}</div>
);

Field.Description = ({ children }) => (
  <p className="field-description">{children}</p>
);

// Number Input Component
const NumberInput = ({ value, onChange, min, max, step = 1, prefix, suffix, className = '' }) => {
  const handleDecrement = () => {
    const newValue = Math.max(min ?? -Infinity, (value || 0) - step);
    onChange(newValue);
  };
  
  const handleIncrement = () => {
    const newValue = Math.min(max ?? Infinity, (value || 0) + step);
    onChange(newValue);
  };

  return (
    <div className={`number-input-group ${className}`}>
      <button type="button" className="number-btn decrement" onClick={handleDecrement}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
        </svg>
      </button>
      <div className="number-input-wrapper">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="number-input"
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      <button type="button" className="number-btn increment" onClick={handleIncrement}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
};

// Select Component
const Select = ({ value, onChange, options, className = '' }) => (
  <div className={`select-root ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select-trigger"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="select-icon">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
);

// Toggle/Switch Component
const Toggle = ({ checked, onChange, options }) => (
  <div className="toggle-group">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        className={`toggle-btn ${checked === opt.value ? 'active' : ''}`}
        onClick={() => onChange(opt.value)}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// Slider Component
const Slider = ({ value, onChange, min, max, step = 1, className = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className={`slider-root ${className}`}>
      <div className="slider-track">
        <div className="slider-indicator" style={{ width: `${percentage}%` }} />
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="slider-input"
      />
    </div>
  );
};

// Toast Component
const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {message}
    </div>
  );
};

// ============================================
// URL STATE MANAGEMENT
// ============================================

const defaultState = {
  carPrice: 1000000,
  downPaymentType: 'percent',
  downPaymentValue: 20,
  loanTermMonths: 60,
  interestRate: 3.5,
  insurancePerYear: 25000,
  actInsurance: 650,
  roadTax: 1600,
  maintenancePerYear: 6000,
  fuelPerMonth: 3000,
};

const parseUrlParams = () => {
  if (typeof window === 'undefined') return defaultState;
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    carPrice: params.has('price') ? Number(params.get('price')) : defaultState.carPrice,
    downPaymentType: params.get('dpType') || defaultState.downPaymentType,
    downPaymentValue: params.has('dpValue') ? Number(params.get('dpValue')) : defaultState.downPaymentValue,
    loanTermMonths: params.has('term') ? Number(params.get('term')) : defaultState.loanTermMonths,
    interestRate: params.has('rate') ? Number(params.get('rate')) : defaultState.interestRate,
    insurancePerYear: params.has('insurance') ? Number(params.get('insurance')) : defaultState.insurancePerYear,
    actInsurance: params.has('act') ? Number(params.get('act')) : defaultState.actInsurance,
    roadTax: params.has('tax') ? Number(params.get('tax')) : defaultState.roadTax,
    maintenancePerYear: params.has('maintenance') ? Number(params.get('maintenance')) : defaultState.maintenancePerYear,
    fuelPerMonth: params.has('fuel') ? Number(params.get('fuel')) : defaultState.fuelPerMonth,
  };
};

const generateShareUrl = (state) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  // Only add params that differ from defaults to keep URL shorter
  if (state.carPrice !== defaultState.carPrice) params.set('price', state.carPrice);
  if (state.downPaymentType !== defaultState.downPaymentType) params.set('dpType', state.downPaymentType);
  if (state.downPaymentValue !== defaultState.downPaymentValue) params.set('dpValue', state.downPaymentValue);
  if (state.loanTermMonths !== defaultState.loanTermMonths) params.set('term', state.loanTermMonths);
  if (state.interestRate !== defaultState.interestRate) params.set('rate', state.interestRate);
  if (state.insurancePerYear !== defaultState.insurancePerYear) params.set('insurance', state.insurancePerYear);
  if (state.actInsurance !== defaultState.actInsurance) params.set('act', state.actInsurance);
  if (state.roadTax !== defaultState.roadTax) params.set('tax', state.roadTax);
  if (state.maintenancePerYear !== defaultState.maintenancePerYear) params.set('maintenance', state.maintenancePerYear);
  if (state.fuelPerMonth !== defaultState.fuelPerMonth) params.set('fuel', state.fuelPerMonth);
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// ============================================
// MAIN APPLICATION
// ============================================

export default function CarLoanCalculator() {
  const printRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Initialize state from URL or defaults
  const [carPrice, setCarPrice] = useState(defaultState.carPrice);
  const [downPaymentType, setDownPaymentType] = useState(defaultState.downPaymentType);
  const [downPaymentValue, setDownPaymentValue] = useState(defaultState.downPaymentValue);
  const [loanTermMonths, setLoanTermMonths] = useState(defaultState.loanTermMonths);
  const [interestRate, setInterestRate] = useState(defaultState.interestRate);
  const [insurancePerYear, setInsurancePerYear] = useState(defaultState.insurancePerYear);
  const [actInsurance, setActInsurance] = useState(defaultState.actInsurance);
  const [roadTax, setRoadTax] = useState(defaultState.roadTax);
  const [maintenancePerYear, setMaintenancePerYear] = useState(defaultState.maintenancePerYear);
  const [fuelPerMonth, setFuelPerMonth] = useState(defaultState.fuelPerMonth);
  const [showFullTable, setShowFullTable] = useState(false);

  // Load state from URL on mount
  useEffect(() => {
    const urlState = parseUrlParams();
    setCarPrice(urlState.carPrice);
    setDownPaymentType(urlState.downPaymentType);
    setDownPaymentValue(urlState.downPaymentValue);
    setLoanTermMonths(urlState.loanTermMonths);
    setInterestRate(urlState.interestRate);
    setInsurancePerYear(urlState.insurancePerYear);
    setActInsurance(urlState.actInsurance);
    setRoadTax(urlState.roadTax);
    setMaintenancePerYear(urlState.maintenancePerYear);
    setFuelPerMonth(urlState.fuelPerMonth);
    setIsInitialized(true);
  }, []);

  // Current state object for sharing
  const currentState = useMemo(() => ({
    carPrice,
    downPaymentType,
    downPaymentValue,
    loanTermMonths,
    interestRate,
    insurancePerYear,
    actInsurance,
    roadTax,
    maintenancePerYear,
    fuelPerMonth,
  }), [carPrice, downPaymentType, downPaymentValue, loanTermMonths, interestRate, insurancePerYear, actInsurance, roadTax, maintenancePerYear, fuelPerMonth]);

  // Update URL when state changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const url = generateShareUrl(currentState);
    window.history.replaceState({}, '', url);
  }, [currentState, isInitialized]);

  const handleShare = useCallback(async () => {
    const shareUrl = generateShareUrl(currentState);
    
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'เครื่องคำนวณค่าใช้จ่ายรถยนต์',
          text: `ราคารถ ${formatInt(carPrice)} บาท | ค่างวด ${formatInt(calculations.monthlyPayment)} บาท/เดือน`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMessage('คัดลอกลิงก์แล้ว!');
      setShowToast(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToastMessage('คัดลอกลิงก์แล้ว!');
      setShowToast(true);
    }
  }, [currentState, carPrice]);

  const handleReset = useCallback(() => {
    setCarPrice(defaultState.carPrice);
    setDownPaymentType(defaultState.downPaymentType);
    setDownPaymentValue(defaultState.downPaymentValue);
    setLoanTermMonths(defaultState.loanTermMonths);
    setInterestRate(defaultState.interestRate);
    setInsurancePerYear(defaultState.insurancePerYear);
    setActInsurance(defaultState.actInsurance);
    setRoadTax(defaultState.roadTax);
    setMaintenancePerYear(defaultState.maintenancePerYear);
    setFuelPerMonth(defaultState.fuelPerMonth);
    setToastMessage('รีเซ็ตค่าเริ่มต้นแล้ว');
    setShowToast(true);
  }, []);

  const calculations = useMemo(() => {
    const downPayment = downPaymentType === 'percent' 
      ? (carPrice * downPaymentValue / 100) 
      : downPaymentValue;
    
    const loanAmount = carPrice - downPayment;
    const years = loanTermMonths / 12;
    
    const totalInterest = loanAmount * (interestRate / 100) * years;
    const totalLoanWithInterest = loanAmount + totalInterest;
    const monthlyPayment = totalLoanWithInterest / loanTermMonths;
    
    const yearlyInsurance = insurancePerYear;
    const yearlyAct = actInsurance;
    const yearlyTax = roadTax;
    const yearlyMaintenance = maintenancePerYear;
    
    const monthlyInsurance = yearlyInsurance / 12;
    const monthlyAct = yearlyAct / 12;
    const monthlyTax = yearlyTax / 12;
    const monthlyMaintenance = yearlyMaintenance / 12;
    
    const totalMonthlyExpense = monthlyPayment + monthlyInsurance + monthlyAct + monthlyTax + monthlyMaintenance + fuelPerMonth;
    
    const schedule = [];
    let remainingPrincipal = loanAmount;
    const principalPerMonth = loanAmount / loanTermMonths;
    const interestPerMonth = totalInterest / loanTermMonths;
    
    for (let month = 1; month <= loanTermMonths; month++) {
      const year = Math.ceil(month / 12);
      const isFirstMonthOfYear = month === 1 || (month - 1) % 12 === 0;
      const yearDiscount = Math.pow(0.9, year - 1);
      const currentYearInsurance = yearlyInsurance * yearDiscount;
      const currentMonthInsurance = currentYearInsurance / 12;
      
      remainingPrincipal -= principalPerMonth;
      
      schedule.push({
        month,
        year,
        principal: principalPerMonth,
        interest: interestPerMonth,
        payment: monthlyPayment,
        insurance: currentMonthInsurance,
        act: monthlyAct,
        tax: monthlyTax,
        maintenance: monthlyMaintenance,
        fuel: fuelPerMonth,
        totalMonthly: monthlyPayment + currentMonthInsurance + monthlyAct + monthlyTax + monthlyMaintenance + fuelPerMonth,
        remainingPrincipal: Math.max(0, remainingPrincipal),
        isFirstMonthOfYear
      });
    }
    
    const totalPaid = totalLoanWithInterest + downPayment;
    const totalAllExpenses = schedule.reduce((sum, s) => sum + s.totalMonthly, 0) + downPayment;
    
    return {
      downPayment,
      loanAmount,
      totalInterest,
      totalLoanWithInterest,
      monthlyPayment,
      monthlyInsurance,
      monthlyAct,
      monthlyTax,
      monthlyMaintenance,
      totalMonthlyExpense,
      totalPaid,
      totalAllExpenses,
      schedule,
      yearlyInsurance,
      yearlyAct,
      yearlyTax,
      yearlyMaintenance,
      yearlyFuel: fuelPerMonth * 12
    };
  }, [carPrice, downPaymentType, downPaymentValue, loanTermMonths, interestRate, insurancePerYear, actInsurance, roadTax, maintenancePerYear, fuelPerMonth]);

  const formatNumber = (num) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  const formatInt = (num) => new Intl.NumberFormat('th-TH').format(Math.round(num));

  const handleExportPDF = () => {
    window.print();
  };

  const loanTermOptions = [
    { value: '12', label: '12 งวด (1 ปี)' },
    { value: '24', label: '24 งวด (2 ปี)' },
    { value: '36', label: '36 งวด (3 ปี)' },
    { value: '48', label: '48 งวด (4 ปี)' },
    { value: '60', label: '60 งวด (5 ปี)' },
    { value: '72', label: '72 งวด (6 ปี)' },
    { value: '84', label: '84 งวด (7 ปี)' },
  ];

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .app-container {
          font-family: 'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: #e2e8f0;
          padding: 2rem;
        }
        
        /* ========== TOAST ========== */
        
        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
          z-index: 1000;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        /* ========== BASE UI FORM STYLES ========== */
        
        .field-root {
          margin-bottom: 1.25rem;
        }
        
        .field-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #94a3b8;
          margin-bottom: 0.5rem;
          letter-spacing: 0.025em;
        }
        
        .field-description {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.375rem;
        }
        
        /* Number Input */
        .number-input-group {
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .number-input-group:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        
        .number-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.75rem;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .number-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        
        .number-btn:active {
          background: rgba(59, 130, 246, 0.2);
        }
        
        .number-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 0.5rem;
        }
        
        .input-prefix, .input-suffix {
          font-size: 0.8125rem;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .number-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f1f5f9;
          font-size: 1rem;
          font-family: 'JetBrains Mono', monospace;
          text-align: center;
          padding: 0.5rem;
          outline: none;
          -moz-appearance: textfield;
        }
        
        .number-input::-webkit-outer-spin-button,
        .number-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        /* Select */
        .select-root {
          position: relative;
        }
        
        .select-trigger {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0.75rem;
          color: #f1f5f9;
          font-size: 0.9375rem;
          font-family: inherit;
          cursor: pointer;
          appearance: none;
          transition: all 0.2s ease;
        }
        
        .select-trigger:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        
        .select-trigger option {
          background: #1e293b;
          color: #f1f5f9;
        }
        
        .select-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #64748b;
        }
        
        /* Toggle */
        .toggle-group {
          display: flex;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0.75rem;
          padding: 0.25rem;
          gap: 0.25rem;
        }
        
        .toggle-btn {
          flex: 1;
          padding: 0.625rem 1rem;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          color: #94a3b8;
          font-size: 0.8125rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .toggle-btn:hover {
          color: #e2e8f0;
        }
        
        .toggle-btn.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        
        /* Slider */
        .slider-root {
          position: relative;
          height: 2.5rem;
          display: flex;
          align-items: center;
        }
        
        .slider-track {
          position: absolute;
          width: 100%;
          height: 0.375rem;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .slider-indicator {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
          border-radius: 1rem;
          transition: width 0.1s ease;
        }
        
        .slider-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        /* ========== LAYOUT STYLES ========== */
        
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          border-radius: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25);
        }
        
        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        
        .header p {
          color: #64748b;
          font-size: 1rem;
        }
        
        .header-actions {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .grid-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
        }
        
        /* Cards */
        .card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .card-header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.5rem;
        }
        
        .card-header h2 {
          font-size: 1rem;
          font-weight: 600;
        }
        
        .icon-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .icon-cyan { background: rgba(6, 182, 212, 0.15); color: #06b6d4; }
        .icon-amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .icon-rose { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }
        
        .text-blue { color: #3b82f6; }
        .text-cyan { color: #06b6d4; }
        .text-amber { color: #f59e0b; }
        .text-emerald { color: #10b981; }
        .text-rose { color: #f43f5e; }
        
        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .stat-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 0.875rem;
          padding: 1.25rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        
        .stat-card.highlight {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%);
          border-color: rgba(59, 130, 246, 0.3);
        }
        
        .stat-label {
          font-size: 0.8125rem;
          color: #94a3b8;
          margin-bottom: 0.375rem;
        }
        
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.2;
        }
        
        .stat-unit {
          font-size: 0.8125rem;
          color: #64748b;
          margin-top: 0.25rem;
        }
        
        /* Breakdown Grid */
        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 640px) {
          .breakdown-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .breakdown-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 0.875rem;
          padding: 1.25rem;
        }
        
        .breakdown-card h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }
        
        .breakdown-row .label {
          color: #94a3b8;
        }
        
        .breakdown-row .value {
          font-family: 'JetBrains Mono', monospace;
          color: #f1f5f9;
        }
        
        .breakdown-row.total {
          border-top: 1px solid rgba(148, 163, 184, 0.15);
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          font-weight: 600;
        }
        
        /* Summary Banner */
        .summary-banner {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 0.875rem;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .summary-item h4 {
          font-size: 0.8125rem;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }
        
        .summary-item .value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }
        
        /* Table */
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .table-header h3 {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .table-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }
        
        .btn-secondary:hover {
          background: rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
        }
        
        .btn-primary:hover {
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
          transform: translateY(-1px);
        }
        
        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }
        
        .btn-success:hover {
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }
        
        .btn-ghost {
          background: transparent;
          color: #64748b;
        }
        
        .btn-ghost:hover {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }
        
        .data-table th {
          text-align: left;
          padding: 0.875rem 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
          position: sticky;
          top: 0;
        }
        
        .data-table th:last-child,
        .data-table td:last-child {
          text-align: right;
        }
        
        .data-table td {
          padding: 0.75rem;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap;
        }
        
        .data-table tr:hover td {
          background: rgba(59, 130, 246, 0.05);
        }
        
        .year-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.625rem;
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border-radius: 1rem;
          font-size: 0.6875rem;
          font-weight: 600;
          font-family: 'IBM Plex Sans Thai', sans-serif;
        }
        
        .table-footer {
          text-align: center;
          padding: 1rem;
          color: #64748b;
          font-size: 0.8125rem;
        }
        
        /* Yearly Summary */
        .yearly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        
        .yearly-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 0.75rem;
          padding: 1rem;
        }
        
        .yearly-card .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .yearly-card .year {
          font-weight: 600;
          color: #3b82f6;
        }
        
        .yearly-card .months {
          font-size: 0.6875rem;
          color: #64748b;
        }
        
        .yearly-card .total {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          color: #f1f5f9;
          margin-bottom: 0.375rem;
        }
        
        .yearly-card .detail {
          font-size: 0.6875rem;
          color: #64748b;
        }
        
        /* Footer */
        .footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          color: #64748b;
          font-size: 0.8125rem;
        }
        
        .footer p {
          margin-bottom: 0.25rem;
        }
        
        /* ========== PRINT STYLES ========== */
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .app-container {
            background: white !important;
            color: #1e293b !important;
            padding: 1rem !important;
          }
          
          .grid-layout {
            display: block !important;
          }
          
          .card, .stat-card, .breakdown-card, .yearly-card {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin-bottom: 1rem;
          }
          
          .field-label, .stat-label, .breakdown-row .label, .header p, .footer {
            color: #64748b !important;
          }
          
          .number-input, .select-trigger {
            background: white !important;
            border: 1px solid #cbd5e1 !important;
            color: #1e293b !important;
          }
          
          .toggle-btn.active {
            background: #3b82f6 !important;
            color: white !important;
          }
          
          .stat-value, .yearly-card .total, .summary-item .value {
            color: #1e293b !important;
          }
          
          .text-blue { color: #2563eb !important; }
          .text-cyan { color: #0891b2 !important; }
          .text-amber { color: #d97706 !important; }
          .text-emerald { color: #059669 !important; }
          .text-rose { color: #e11d48 !important; }
          
          .data-table {
            font-size: 0.6875rem !important;
          }
          
          .data-table th {
            background: #f1f5f9 !important;
            color: #475569 !important;
          }
          
          .data-table td {
            border-color: #e2e8f0 !important;
            color: #1e293b !important;
          }
          
          .btn, .no-print, .header-actions, .toast {
            display: none !important;
          }
          
          .header h1 {
            background: none !important;
            -webkit-text-fill-color: #1e293b !important;
            color: #1e293b !important;
          }
          
          .summary-banner {
            background: #f0fdf4 !important;
            border-color: #86efac !important;
          }
          
          .header-icon {
            background: #3b82f6 !important;
          }
          
          .year-badge {
            background: #dbeafe !important;
            color: #2563eb !important;
          }
          
          .table-container {
            max-height: none !important;
            overflow: visible !important;
          }
          
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
      
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="main-content" ref={printRef}>
        {/* Header */}
        <header className="header">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1>เครื่องคำนวณค่าใช้จ่ายรถยนต์</h1>
          <p>วางแผนการเงินก่อนซื้อรถ คำนวณทุกค่าใช้จ่ายแบบครบวงจร</p>
          
          <div className="header-actions no-print">
            <button className="btn btn-success" onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              แชร์ลิงก์
            </button>
            <button className="btn btn-ghost" onClick={handleReset}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              รีเซ็ต
            </button>
          </div>
        </header>

        <div className="grid-layout">
          {/* Input Section */}
          <aside>
            {/* Car Info */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon icon-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h2 className="text-blue">ข้อมูลรถยนต์</h2>
              </div>
              
              <Field>
                <Field.Label>ราคารถ</Field.Label>
                <NumberInput
                  value={carPrice}
                  onChange={setCarPrice}
                  min={0}
                  step={10000}
                  suffix="บาท"
                />
              </Field>
              
              <Field>
                <Field.Label>ประเภทเงินดาวน์</Field.Label>
                <Toggle
                  checked={downPaymentType}
                  onChange={setDownPaymentType}
                  options={[
                    { value: 'percent', label: 'เปอร์เซ็นต์ (%)' },
                    { value: 'baht', label: 'จำนวนบาท' }
                  ]}
                />
              </Field>
              
              <Field>
                <Field.Label>เงินดาวน์</Field.Label>
                <NumberInput
                  value={downPaymentValue}
                  onChange={setDownPaymentValue}
                  min={0}
                  step={downPaymentType === 'percent' ? 1 : 10000}
                  suffix={downPaymentType === 'percent' ? '%' : 'บาท'}
                />
                {downPaymentType === 'percent' && (
                  <Field.Description>= {formatInt(carPrice * downPaymentValue / 100)} บาท</Field.Description>
                )}
              </Field>
            </div>

            {/* Loan Details */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon icon-cyan">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </div>
                <h2 className="text-cyan">รายละเอียดสินเชื่อ</h2>
              </div>
              
              <Field>
                <Field.Label>จำนวนงวด</Field.Label>
                <Select
                  value={String(loanTermMonths)}
                  onChange={(v) => setLoanTermMonths(Number(v))}
                  options={loanTermOptions}
                />
              </Field>
              
              <Field>
                <Field.Label>อัตราดอกเบี้ย (% ต่อปี)</Field.Label>
                <NumberInput
                  value={interestRate}
                  onChange={setInterestRate}
                  min={0}
                  max={15}
                  step={0.1}
                  suffix="%"
                />
                <Slider
                  value={interestRate}
                  onChange={setInterestRate}
                  min={0}
                  max={15}
                  step={0.1}
                />
              </Field>
            </div>

            {/* Other Expenses */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon icon-amber">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <h2 className="text-amber">ค่าใช้จ่ายอื่นๆ</h2>
              </div>
              
              <Field>
                <Field.Label>ประกันภัยชั้น 1 (ต่อปี)</Field.Label>
                <NumberInput
                  value={insurancePerYear}
                  onChange={setInsurancePerYear}
                  min={0}
                  step={1000}
                  suffix="บาท"
                />
              </Field>
              
              <Field>
                <Field.Label>พ.ร.บ. (ต่อปี)</Field.Label>
                <NumberInput
                  value={actInsurance}
                  onChange={setActInsurance}
                  min={0}
                  step={50}
                  suffix="บาท"
                />
              </Field>
              
              <Field>
                <Field.Label>ภาษีรถประจำปี</Field.Label>
                <NumberInput
                  value={roadTax}
                  onChange={setRoadTax}
                  min={0}
                  step={100}
                  suffix="บาท"
                />
              </Field>
              
              <Field>
                <Field.Label>ค่าบำรุงรักษา (ต่อปี)</Field.Label>
                <NumberInput
                  value={maintenancePerYear}
                  onChange={setMaintenancePerYear}
                  min={0}
                  step={500}
                  suffix="บาท"
                />
              </Field>
              
              <Field>
                <Field.Label>ค่าน้ำมัน (ต่อเดือน)</Field.Label>
                <NumberInput
                  value={fuelPerMonth}
                  onChange={setFuelPerMonth}
                  min={0}
                  step={500}
                  suffix="บาท"
                />
              </Field>
            </div>
          </aside>

          {/* Results Section */}
          <main>
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card highlight">
                <div className="stat-label">ค่างวดต่อเดือน</div>
                <div className="stat-value text-blue">{formatInt(calculations.monthlyPayment)}</div>
                <div className="stat-unit">บาท</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">ค่าใช้จ่ายรวม/เดือน</div>
                <div className="stat-value text-cyan">{formatInt(calculations.totalMonthlyExpense)}</div>
                <div className="stat-unit">บาท (รวมทุกรายการ)</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">ดอกเบี้ยรวมทั้งหมด</div>
                <div className="stat-value text-rose">{formatInt(calculations.totalInterest)}</div>
                <div className="stat-unit">บาท</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon icon-emerald">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                </div>
                <h2 className="text-emerald">สรุปค่าใช้จ่ายทั้งหมด</h2>
              </div>
              
              <div className="breakdown-grid">
                <div className="breakdown-card">
                  <h3><span>💰</span> ค่าใช้จ่ายตอนซื้อ</h3>
                  <div className="breakdown-row">
                    <span className="label">ราคารถ</span>
                    <span className="value">{formatInt(carPrice)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">เงินดาวน์</span>
                    <span className="value">{formatInt(calculations.downPayment)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">ยอดจัดไฟแนนซ์</span>
                    <span className="value">{formatInt(calculations.loanAmount)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">ดอกเบี้ยรวม ({loanTermMonths/12} ปี)</span>
                    <span className="value text-rose">{formatInt(calculations.totalInterest)} บาท</span>
                  </div>
                  <div className="breakdown-row total">
                    <span className="label">ยอดผ่อนรวม</span>
                    <span className="value text-emerald">{formatInt(calculations.totalLoanWithInterest)} บาท</span>
                  </div>
                </div>
                
                <div className="breakdown-card">
                  <h3><span>📅</span> ค่าใช้จ่ายต่อเดือน</h3>
                  <div className="breakdown-row">
                    <span className="label">ค่างวดรถ</span>
                    <span className="value">{formatInt(calculations.monthlyPayment)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">ประกันภัย</span>
                    <span className="value">{formatInt(calculations.monthlyInsurance)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">พ.ร.บ.</span>
                    <span className="value">{formatInt(calculations.monthlyAct)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">ภาษีรถ</span>
                    <span className="value">{formatInt(calculations.monthlyTax)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">บำรุงรักษา</span>
                    <span className="value">{formatInt(calculations.monthlyMaintenance)} บาท</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="label">ค่าน้ำมัน</span>
                    <span className="value">{formatInt(fuelPerMonth)} บาท</span>
                  </div>
                  <div className="breakdown-row total">
                    <span className="label">รวมทั้งหมด/เดือน</span>
                    <span className="value text-cyan">{formatInt(calculations.totalMonthlyExpense)} บาท</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-banner">
                <div className="summary-item">
                  <h4>💵 ค่าใช้จ่ายทั้งหมดตลอดสัญญา ({loanTermMonths/12} ปี)</h4>
                  <div className="value text-emerald">{formatInt(calculations.totalAllExpenses)} บาท</div>
                </div>
                <div className="summary-item" style={{ textAlign: 'right' }}>
                  <h4>📈 มากกว่าราคารถ</h4>
                  <div className="value text-amber">+{formatInt(calculations.totalAllExpenses - carPrice)} บาท</div>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="card">
              <div className="table-header">
                <h3>📋 ตารางผ่อนชำระรายเดือน</h3>
                <div className="table-actions">
                  <button className="btn btn-secondary no-print" onClick={() => setShowFullTable(!showFullTable)}>
                    {showFullTable ? 'ย่อตาราง' : 'แสดงทั้งหมด'}
                  </button>
                  <button className="btn btn-success no-print" onClick={handleShare}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    แชร์
                  </button>
                  <button className="btn btn-primary no-print" onClick={handleExportPDF}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="table-container" style={{ maxHeight: showFullTable ? 'none' : '480px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>งวด</th>
                      <th>ค่างวด</th>
                      <th>เงินต้น</th>
                      <th>ดอกเบี้ย</th>
                      <th>ประกัน</th>
                      <th>อื่นๆ</th>
                      <th style={{ color: '#3b82f6' }}>รวม/เดือน</th>
                      <th>คงเหลือ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showFullTable ? calculations.schedule : calculations.schedule.slice(0, 12)).map((row) => (
                      <React.Fragment key={row.month}>
                        {row.isFirstMonthOfYear && (
                          <tr>
                            <td colSpan={8} style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '0.5rem 0.75rem' }}>
                              <span className="year-badge">ปีที่ {row.year}</span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ fontWeight: 500 }}>{row.month}</td>
                          <td>{formatInt(row.payment)}</td>
                          <td style={{ color: '#94a3b8' }}>{formatInt(row.principal)}</td>
                          <td className="text-rose">{formatInt(row.interest)}</td>
                          <td style={{ color: '#94a3b8' }}>{formatInt(row.insurance)}</td>
                          <td style={{ color: '#64748b' }}>{formatInt(row.act + row.tax + row.maintenance + row.fuel)}</td>
                          <td className="text-blue" style={{ fontWeight: 600 }}>{formatInt(row.totalMonthly)}</td>
                          <td className="text-cyan">{formatInt(row.remainingPrincipal)}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {!showFullTable && calculations.schedule.length > 12 && (
                <div className="table-footer no-print">
                  แสดง 12 งวดแรก จากทั้งหมด {loanTermMonths} งวด
                </div>
              )}
            </div>

            {/* Yearly Summary */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon icon-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <h2 className="text-blue">สรุปค่าใช้จ่ายรายปี</h2>
              </div>
              
              <div className="yearly-grid">
                {Array.from({ length: Math.ceil(loanTermMonths / 12) }, (_, yearIdx) => {
                  const yearSchedule = calculations.schedule.filter(s => s.year === yearIdx + 1);
                  const yearTotal = yearSchedule.reduce((sum, s) => sum + s.totalMonthly, 0);
                  const yearPayment = yearSchedule.reduce((sum, s) => sum + s.payment, 0);
                  const yearInterest = yearSchedule.reduce((sum, s) => sum + s.interest, 0);
                  
                  return (
                    <div key={yearIdx} className="yearly-card">
                      <div className="header">
                        <span className="year">ปีที่ {yearIdx + 1}</span>
                        <span className="months">{yearSchedule.length} งวด</span>
                      </div>
                      <div className="total">{formatInt(yearTotal)}</div>
                      <div className="detail">
                        ค่างวด {formatInt(yearPayment)} • ดอกเบี้ย {formatInt(yearInterest)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>

        <footer className="footer">
          <p>* การคำนวณใช้อัตราดอกเบี้ยแบบ Flat Rate ตามที่นิยมใช้ในประเทศไทย</p>
          <p>* ค่าประกันภัยจะลดลงประมาณ 10% ต่อปีตามมูลค่ารถที่ลดลง</p>
        </footer>
      </div>
    </div>
  );
}
