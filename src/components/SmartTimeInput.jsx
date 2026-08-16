import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';

/**
 * Ultra-Modern Smart Time Input Component
 * - 4-digit auto-formatting (e.g. "1100" -> "11:00")
 * - Reliable mobile and PC auto-advance across fields
 * - Transparent Super Glossy Liquid Glass suggestion popover
 * - Touch-friendly and viewport-clamped
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
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const triggerAutoAdvance = () => {
    if (onComplete) {
      // Use double requestAnimationFrame + small timeout to ensure mobile virtual keyboards shift seamlessly
      requestAnimationFrame(() => {
        setTimeout(() => {
          onComplete();
        }, 30);
      });
    }
  };

  const handleSelectSuggestion = (timeStr) => {
    setRawText(timeStr);
    onChange(timeStr);
    setShowSuggestions(false);
    triggerAutoAdvance();
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
      triggerAutoAdvance();
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
        triggerAutoAdvance();
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
        className={`liquid-input text-xs font-mono font-bold px-2 py-1 text-center rounded-xl outline-none tracking-widest transition-all duration-200 ${className}`}
      />

      {/* 🌟 Super Glossy Transparent Liquid Glass Floating Suggestion Dock */}
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 animate-in fade-in zoom-in-95 duration-200 ease-out pointer-events-auto">
          
          {/* Glass Card Container */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl backdrop-blur-2xl bg-white/80 dark:bg-slate-900/85 border border-white/80 dark:border-white/15 shadow-[0_12px_36px_rgba(6,182,212,0.22)] shadow-cyan-500/10 max-w-[calc(100vw-36px)] overflow-x-auto whitespace-nowrap scrollbar-none">
            
            {suggestions.map((time) => (
              <button
                key={time}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectSuggestion(time);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectSuggestion(time);
                }}
                className="px-2.5 py-1 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-800/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-500 hover:text-white dark:hover:text-white rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm active:scale-95 transition-all duration-150 shrink-0 touch-manipulation"
              >
                {time}
              </button>
            ))}

          </div>

          {/* Micro arrow indicator pointing down to the input */}
          <div className="w-2.5 h-2.5 rotate-45 mx-auto -mt-1.5 bg-white/80 dark:bg-slate-900/85 border-r border-b border-white/80 dark:border-white/15 shadow-sm" />

        </div>
      )}
    </div>
  );
});

export default SmartTimeInput;
