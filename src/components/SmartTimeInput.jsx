import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';

/**
 * Ultra-Modern Smart Time Input Component
 * - 4-digit auto-formatting (e.g. "1100" -> "11:00")
 * - Auto-advances focus to next time field immediately upon completion
 * - Enter key moves to next field or next day
 * - Quick touch suggestion popover on mobile/PC
 * - Up/Down arrow keys for rapid 1-hour adjustments
 */
const SmartTimeInput = forwardRef(function SmartTimeInput({
  value = '',
  onChange,
  onComplete,
  onEnterPress,
  placeholder = '00:00',
  className = '',
  id,
  name,
  suggestions = ['09:00', '11:00', '17:00', '18:30', '23:00']
}, ref) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current);

  const [rawText, setRawText] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setRawText(value || '');
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (timeStr) => {
    setRawText(timeStr);
    onChange(timeStr);
    setShowSuggestions(false);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 40);
    }
  };

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
      setShowSuggestions(false);

      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 40);
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
        setShowSuggestions(false);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 40);
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
      setShowSuggestions(false);
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
    <div ref={containerRef} className="relative inline-block">
      <input
        ref={innerRef}
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        value={rawText}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={5}
        className={`liquid-input text-xs font-mono font-bold px-2 py-1 text-center rounded-lg outline-none tracking-widest ${className}`}
      />

      {/* Modern Touch Suggestion Popover */}
      {showSuggestions && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 animate-fade-in">
          {suggestions.map((time) => (
            <button
              key={time}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(time);
              }}
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 hover:bg-cyan-500 hover:text-white rounded-md transition-colors"
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default SmartTimeInput;
