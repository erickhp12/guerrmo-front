import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import config from '../../config.js';

const RECENT_KEY = 'guerrmo_recent_searches';
const MAX_RECENT = 6;
const DEBOUNCE_MS = 350;

const getRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveRecent = (term) => {
  const trimmed = term.trim();
  if (!trimmed) return;
  const prev = getRecent().filter(r => r.toLowerCase() !== trimmed.toLowerCase());
  const next = [trimmed, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

const removeRecent = (term) => {
  const next = getRecent().filter(r => r !== term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

/**
 * SearchBar — reusable component with debounce, live suggestions and recent history.
 * Props:
 *   placeholder  string    — input placeholder
 *   autoFocus    bool      — focus on mount
 *   className    string    — extra classes on the wrapper div
 *   onSearch     fn(term)  — called on submit (optional; defaults to navigate to /buscar)
 */
const SearchBar = ({ placeholder = 'Buscar refacción...', autoFocus = false, className = '', onSearch }) => {
  const history = useHistory();
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSugg, setLoadingSugg] = useState(false);
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecent);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value]);

  // Fetch suggestions when debounced value changes
  useEffect(() => {
    if (debouncedValue.trim().length < 2) {
      setSuggestions([]);
      setLoadingSugg(false);
      return;
    }
    setLoadingSugg(true);
    const controller = new AbortController();
    fetch(`${config.API_URL}/articles/0/clave/${encodeURIComponent(debouncedValue.trim())}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 8));
        } else {
          setSuggestions([]);
        }
        setLoadingSugg(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setSuggestions([]);
          setLoadingSugg(false);
        }
      });
    return () => controller.abort();
  }, [debouncedValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigate = useCallback((term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    saveRecent(trimmed);
    setRecentSearches(getRecent());
    setValue('');
    setOpen(false);
    setActiveIndex(-1);
    if (onSearch) {
      onSearch(trimmed);
    } else {
      history.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    }
  }, [history, onSearch]);

  const handleKeyDown = (e) => {
    const listItems = suggestions.length > 0 ? suggestions : recentSearches;
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, listItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigate(suggestions[activeIndex].descripcion || suggestions[activeIndex].clave);
      } else if (activeIndex >= 0 && recentSearches[activeIndex]) {
        navigate(recentSearches[activeIndex]);
      } else {
        navigate(value);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const showRecent = open && value.trim().length < 2 && recentSearches.length > 0;
  const showSuggestions = open && value.trim().length >= 2;
  const showNoResults = showSuggestions && !loadingSugg && suggestions.length === 0;
  const dropdownVisible = showRecent || showSuggestions || showNoResults;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {loadingSugg
              ? <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/></svg>
            }
          </span>
          <input
            ref={inputRef}
            autoFocus={autoFocus}
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setOpen(true); setActiveIndex(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
        <button
          onClick={() => navigate(value)}
          className="bg-red-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm shrink-0"
        >
          Buscar
        </button>
      </div>

      {/* Dropdown */}
      {dropdownVisible && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">

          {/* Recent searches */}
          {showRecent && (
            <>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase">Búsquedas recientes</span>
                <button
                  onClick={() => { localStorage.removeItem(RECENT_KEY); setRecentSearches([]); setOpen(false); }}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Limpiar
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <div
                  key={term}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer group ${activeIndex === i ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onMouseDown={() => navigate(term)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{term}</span>
                  </div>
                  <button
                    onMouseDown={(e) => { e.stopPropagation(); removeRecent(term); setRecentSearches(getRecent()); }}
                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 shrink-0 ml-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Live suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase">Sugerencias</span>
              </div>
              {suggestions.map((product, i) => (
                <div
                  key={product.clave + i}
                  onMouseDown={() => navigate(product.descripcion || product.clave)}
                  className={`px-4 py-2.5 cursor-pointer ${activeIndex === i ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate">{product.descripcion}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {product.clave}
                        {product.claveAlterna && product.claveAlterna !== product.clave && (
                          <span className="ml-2 text-gray-300">/ {product.claveAlterna}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 whitespace-nowrap shrink-0">
                      ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
              {suggestions.length === 8 && (
                <div
                  onMouseDown={() => navigate(value)}
                  className="px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer font-medium border-t border-gray-100"
                >
                  Ver todos los resultados para "{value}" →
                </div>
              )}
            </>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500 text-sm">Sin resultados para <strong>"{value}"</strong></p>
              <p className="text-gray-400 text-xs mt-1">Intenta con otra clave o descripción</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
