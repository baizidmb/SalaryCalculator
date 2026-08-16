import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';

/**
 * Smart Time Input Component
 * - Supports direct 4-digit numeric typing (e.g. typing "1100" -> "11:00")
 * - Auto-advances focus to next input field via onComplete callback
 * - Mobile numeric keypad friendly with inputMode="numeric"
 * - Clean zero-default hh:mm placeholder
 */
const SmartTimeInput = forwardRef(function SmartTimeInput({
  value = '',
  onChange,
  onComplete,
  placeholder = '00:00',
  className = '',
  id,
  name
}, ref) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current);

  const [rawText, setRawText] = useState(value || '');

  useEffect(() => {
    setRawText(value || '');
  }, [value]);

  const handleChange = (e) => {
    let inputVal = e.target.value;
    
    // Strip everything except numbers and colon
    inputVal = inputVal.replace(/[^0-9:]/g, '');

    // If user typed only digits (e.g. "1100", "0930", "1830")
    const digitsOnly = inputVal.replace(/:/g, '');

    if (digitsOnly.length === 4) {
      const hh = parseInt(digitsOnly.substring(0, 2), 10);
      const mm = parseInt(digitsOnly.substring(2, 4), 10);
      
      const safeHh = Math.min(23, Math.max(0, hh));
      const safeMm = Math.min(59, Math.max(0, mm));
      
      const formatted = `${String(safeHh).padStart(2, '0')}:${String(safeMm).padStart(2, '0')}`;
      setRawText(formatted);
      onChange(formatted);

      // Auto-advance to next input field!
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 30);
      }
      return;
    }

    // If user enters standard "HH:MM"
    if (inputVal.length === 5 && inputVal.includes(':')) {
      const [hPart, mPart] = inputVal.split(':');
      const hh = parseInt(hPart, 10);
      const mm = parseInt(mPart, 10);
      if (!isNaN(hh) && !isNaN(mm)) {
        const safeHh = Math.min(23, Math.max(0, hh));
        const safeMm = Math.min(59, Math.max(0, mm));
        const formatted = `${String(safeHh).padStart(2, '0')}:${String(safeMm).padStart(2, '0')}`;
        setRawText(formatted);
        onChange(formatted);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 30);
        }
        return;
      }
    }

    setRawText(inputVal);
    
    if (inputVal === '') {
      onChange('');
    }
  };

  const handleBlur = () => {
    // When leaving field, auto-format partial inputs like "9" -> "09:00", "11" -> "11:00", "11:3" -> "11:30"
    if (!rawText) return;
    const digitsOnly = rawText.replace(/:/g, '');
    
    if (digitsOnly.length === 1 || digitsOnly.length === 2) {
      const hh = Math.min(23, Math.max(0, parseInt(digitsOnly, 10) || 0));
      const formatted = `${String(hh).padStart(2, '0')}:00`;
      setRawText(formatted);
      onChange(formatted);
    } else if (digitsOnly.length === 3) {
      const hh = Math.min(23, Math.max(0, parseInt(digitsOnly.substring(0, 2), 10) || 0));
      const mm = Math.min(59, Math.max(0, parseInt(digitsOnly.substring(2) + '0', 10) || 0));
      const formatted = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
      setRawText(formatted);
      onChange(formatted);
    }
  };

  const handleKeyDown = (e) => {
    // Enter key triggers auto-advance
    if (e.key === 'Enter' && onComplete) {
      e.preventDefault();
      onComplete();
    }
  };

  return (
    <input
      ref={innerRef}
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      value={rawText}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={5}
      className={`liquid-input text-xs font-mono font-bold px-2 py-1 text-center rounded-lg outline-none tracking-widest ${className}`}
    />
  );
});

export default SmartTimeInput;
