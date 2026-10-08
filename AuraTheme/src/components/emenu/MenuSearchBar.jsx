import React, { useRef } from 'react';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';

/**
 * HighlightMatch
 * Highlights the matched search query substring within product name
 */
export function HighlightMatch({ text = '', query = '' }) {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }

  const q = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(q);

  if (index === -1) {
    return <span>{text}</span>;
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + q.length);
  const after = text.substring(index + q.length);

  return (
    <span>
      {before}
      <span className="bg-amber-200/90 text-slate-900 rounded-xs px-0.5 font-black underline decoration-amber-400">
        {match}
      </span>
      {after}
    </span>
  );
}

/**
 * MenuSearchBar
 * Fast, real-time search component at the top of the menu page
 * that filters products by name with instant feedback and matching highlights.
 */
export default function MenuSearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search products by name (e.g. Croissant, Latte, Sourdough)...',
  totalMatches,
  totalItems,
  accentColor = '#2F6FED',
  className = '',
  quickTags = ['Latte', 'Croissant', 'Sourdough', 'Matcha', 'Espresso'],
  showQuickTags = false,
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleSelectTag = (tag) => {
    onChange?.(tag);
    inputRef.current?.focus();
  };

  const isSearching = Boolean(value && value.trim().length > 0);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center w-full group">
        {/* Search Icon */}
        <div className="absolute left-3.5 sm:left-4 pointer-events-none flex items-center justify-center text-slate-400 group-focus-within:text-[var(--accent-color,#2F6FED)] transition-colors">
          <SearchOutlined className="text-base sm:text-lg" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search menu products by name"
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-10 sm:pl-11 pr-24 sm:pr-28 py-2.5 sm:py-3 text-xs sm:text-sm bg-white hover:bg-slate-50/50 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium rounded-2xl border border-slate-200/90 shadow-2xs focus:border-[var(--accent-color,#2F6FED)] focus:ring-3 focus:ring-[var(--accent-ring,rgba(47,111,237,0.12))] outline-none transition-all duration-200"
          style={{
            '--accent-color': accentColor,
            '--accent-ring': `${accentColor}1f`,
          }}
        />

        {/* Right Actions: Result Pill & Clear Button */}
        <div className="absolute right-2.5 sm:right-3 flex items-center gap-1.5">
          {isSearching && (
            <>
              {/* Match count badge */}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-100 text-slate-600">
                {totalMatches !== undefined ? `${totalMatches} found` : 'Searching'}
              </span>

              {/* Clear (X) button */}
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search input"
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 active:scale-90 transition-transform cursor-pointer"
                title="Clear search (Esc)"
              >
                <CloseCircleFilled className="text-sm sm:text-base text-slate-400 hover:text-slate-600" />
              </button>
            </>
          )}

          {!isSearching && totalItems !== undefined && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-400 bg-slate-100/60">
              {totalItems} items
            </span>
          )}
        </div>
      </div>

      {/* Quick Search Tag Suggestions (Optional) */}
      {showQuickTags && quickTags && quickTags.length > 0 && !isSearching && (
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none pb-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 mr-0.5">
            Quick:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSelectTag(tag)}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors font-medium whitespace-nowrap cursor-pointer shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
