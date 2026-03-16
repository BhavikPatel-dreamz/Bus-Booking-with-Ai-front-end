import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

const AppDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  hasError = false,
  clearable = false,
  searchable,
  className = '',
  size = 'default', // 'default' | 'sm'
}) => {
  const isSearchable = searchable ?? options.length > 4;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selected = options.find((opt) => String(opt.value) === String(value)) || null;

  const filtered = isSearchable && search
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && isSearchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
  };

  const handleTriggerKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
      setHighlightedIndex(-1);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelect(filtered[highlightedIndex]);
      }
    }
  };

  const sizeClasses = size === 'sm'
    ? 'px-3 py-2 text-sm'
    : 'px-4 py-2.5 text-sm';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        className={`w-full ${sizeClasses} border rounded-lg text-left flex items-center justify-between transition-all outline-none ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
            : hasError
              ? 'border-rose-300 bg-rose-50'
              : isOpen
                ? 'border-sky-500 ring-2 ring-sky-500 bg-white'
                : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <span className={selected ? 'text-slate-800' : 'text-slate-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {/* Search input (only when searchable) */}
          {isSearchable && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search..."
                className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {clearable && value && (
              <div
                onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}
                className="px-4 py-2.5 cursor-pointer text-sm text-slate-400 hover:bg-slate-50 border-b border-slate-100"
              >
                {placeholder}
              </div>
            )}
            {filtered.length > 0 ? (
              filtered.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                    String(option.value) === String(value)
                      ? 'bg-sky-50 text-sky-700'
                      : index === highlightedIndex
                        ? 'bg-slate-100 text-slate-800'
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {String(option.value) === String(value) && (
                    <Check className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                {isSearchable && search ? 'No results found' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDropdown;
