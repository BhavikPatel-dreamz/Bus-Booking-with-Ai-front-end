import { useState, useRef, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const CustomInput = forwardRef(({ value, onClick, placeholder, hasError }, ref) => (
  <div className="relative">
    <input
      type="text"
      ref={ref}
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      readOnly
      className={`w-full pl-4 pr-10 py-3 rounded-xl border ${
        hasError ? 'border-destructive' : 'border-input'
      } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer`}
    />
    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
  </div>
));

CustomInput.displayName = 'CustomInput';

const StyledDatePicker = ({ 
  id,
  name,
  value, 
  onChange, 
  placeholder = 'Select date',
  hasError = false,
  minDate = new Date()
}) => {
  // Parse the value - handle both Date objects and string formats
  const parseValue = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    // Handle YYYY-MM-DD format
    const parsed = new Date(val + 'T00:00:00');
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const selectedDate = parseValue(value);

  const handleChange = (date) => {
    if (!date) return;
    // Format as YYYY-MM-DD for form compatibility
    const formattedDate = format(date, 'yyyy-MM-dd');
    // Create a synthetic event to match existing form handlers
    const syntheticEvent = {
      target: {
        name: name,
        value: formattedDate
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <div className="relative w-full datepicker-container">
      <DatePicker
        id={id}
        selected={selectedDate}
        onChange={handleChange}
        minDate={minDate}
        dateFormat="dd MMM yyyy"
        placeholderText={placeholder}
        customInput={<CustomInput placeholder={placeholder} hasError={hasError} />}
        popperClassName="styled-datepicker-popper"
        calendarClassName="styled-datepicker-calendar"
        wrapperClassName="w-full"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              boundary: 'clippingParents',
              padding: 8,
            },
          },
        ]}
      />
    </div>
  );
};

export default StyledDatePicker;