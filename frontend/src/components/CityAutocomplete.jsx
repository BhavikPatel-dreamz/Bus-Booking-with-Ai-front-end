import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const CityAutocomplete = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  cities,
  hasError
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredCities, setFilteredCities] = useState([]);
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let list = cities;

    if (value.trim().length > 0) {
      list = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );

      // while typing → only top 5
      list = list.slice(0, 5);
    }

    setFilteredCities(list);
    setHighlightedIndex(-1);
  }, [value, cities, isOpen]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onChange({ target: { name, value: city } });
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;

    const item = listRef.current.children[highlightedIndex];
    if (item) {
      item.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);


  const handleKeyDown = (e) => {
    if (!isOpen || filteredCities.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCities.length) {
          handleSelect(filteredCities[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    onChange(e);
  };

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setFilteredCities(cities);   // show ALL cities first
          setIsOpen(true);

          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.select();
            }
          }, 0);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hasError ? "border-red-500" : "border-gray-200"
          } bg-gray-50 text-gray-800 placeholder:text-gray-400 
focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} />


      {isOpen && filteredCities.length > 0 && (

        <div ref={listRef} className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-y-auto max-h-[240px]">


          {filteredCities.map((city, index) => (
            <div
              key={city}
              onClick={() => handleSelect(city)}
              className={`px-4 py-3 cursor-pointer flex items-center gap-2 transition-colors ${index === highlightedIndex
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-secondary text-foreground'
                }`}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
