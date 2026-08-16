import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';

/**
 * Smart Time Input Component
 * - Manages direct typing (e.g. "1100" -> "11:00")
 * - Handles auto-advancing focus synchronously
 * - Keyboard navigation (Up/Down arrow keys, Enter key)
 */
const SmartTimeInput = forwardRef(function SmartTimeInput({
  value = '',
  onChange,
  onComplete,
  onEnterPress,
  onFocus,
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
    inputVal = inputVal.replace(/[^0-9:]/g, '');
    const digitsOnly = inputVal.replace(/:/g, '');

    // If 4 digits entered (e.g. "1100", "1700", "1830", "2300")
    if (digitsOnly.length === 4) {
      const hh = parseInt(digitsOnly.substring(0, 2), 10);
      const mm = parseInt(digitsOnly.substring(2, 4), 10);
      
      const safeHh = Math.min(23, Math.max(0, hh));
      const safeMm = Math.min(59, Math.max(0, mm));
      
      const formatted = `${String(safeHh).padStart(2, '0')}:${String(safeMm).padStart(2, '0')}`;
      setRawText(formatted);
      onChange(formatted);

      if (onComplete) {
        onComplete();
        // Fallback for mobile virtual keyboard
        setTimeout(() => {
          onComplete();
        }, 30);
      }
      return;
    }

    // Standard 5 char "HH:MM"
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
          onComplete();
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
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnterPress) {
        onEnterPress();
      } else if (onComplete) {
        onComplete();
      }
      return;
    }

    // Up / Down arrow keys increment/decrement hour
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const delta = e.key === 'ArrowUp' ? 1 : -1;
      let currentHour = 9;
      let currentMin = 0;
      if (rawText && rawText.includes(':')) {
        const parts = rawText.split(':');
        currentHour = parseInt(parts[0], 10) || 0;
        currentMin = parseInt(parts[1], 10) || 0;
      }
      let newHour = (currentHour + delta + 24) % 24;
      const formatted = `${String(newHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      setRawText(formatted);
      onChange(formatted);
    }
  };

  return (
    <input
      ref={innerRef}
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      value={rawText}
      onChange={handleChange}
      onFocus={(e) => {
        if (onFocus) onFocus(e);
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={5}
      className={`liquid-input text-xs font-mono font-bold px-2 py-1 text-center rounded-xl outline-none tracking-widest transition-all duration-200 ${className}`}
    />
  );
});

export default SmartTimeInput;
