import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';

const EmployeeSearchDropdown = ({
  label,
  employees,
  value,
  onChange,
  placeholder = 'Search and select...',
  emptyMessage = 'No employees available',
  hasError,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selected = employees.find(e => e.id === value) || null;

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    String(e.phone).includes(search) ||
    e.city.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  const handleSelect = (employee) => {
    onChange(employee.id);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => prev < filtered.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : filtered.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative overflow-visible">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full px-4 py-2.5 border rounded-lg text-left flex items-center justify-between transition-all ${
          hasError
            ? 'border-rose-300 bg-rose-50'
            : isOpen
              ? 'border-sky-500 ring-2 ring-sky-500'
              : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        {selected ? (
          <span className="text-slate-800 text-sm">{selected.name} — {selected.city}</span>
        ) : (
          <span className="text-slate-400 text-sm">{placeholder}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {hasError && errorMessage && (
        <p className="mt-1 text-sm text-rose-600">{errorMessage}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name, phone, or city..."
              className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((emp, index) => (
                <div
                  key={emp.id}
                  onClick={() => handleSelect(emp)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors text-sm ${
                    emp.id === value
                      ? 'bg-sky-50 text-sky-700'
                      : index === highlightedIndex
                        ? 'bg-slate-100 text-slate-800'
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400">{emp.city} • {emp.phone}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                {employees.length === 0 ? emptyMessage : 'No matches found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearchDropdown;
