// ============================================
//  EventSearch.jsx — React Component (10%)
//  Smart search with live suggestions
// ============================================

import { useState, useEffect, useRef } from "react";

export default function EventSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // Get events from localStorage (shared with vanilla JS)
  const getStoredEvents = () => {
    try {
      return JSON.parse(localStorage.getItem("sc_events")) || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (query.length > 1) {
      const events = getStoredEvents();
      const filtered = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.category.toLowerCase().includes(query.toLowerCase()) ||
          e.location.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [query]);

  const handleSelect = (event) => {
    setQuery(event.title);
    setOpen(false);
    if (onSearch) onSearch(event.title);
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "500px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Search Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#1E1E35",
          border: open
            ? "1.5px solid #6C63FF"
            : "1.5px solid rgba(108,99,255,0.3)",
          borderRadius: "12px",
          padding: "0.55rem 1rem",
          gap: "0.6rem",
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: open ? "0 0 0 3px rgba(108,99,255,0.15)" : "none",
        }}
      >
        <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔮</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Smart search — type to get suggestions..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#E8E8F0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              background: "none",
              border: "none",
              color: "#9999BB",
              cursor: "pointer",
              fontSize: "1rem",
              padding: 0,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        )}
        <span
          style={{
            fontSize: "0.65rem",
            background: "rgba(108,99,255,0.2)",
            color: "#6C63FF",
            padding: "2px 8px",
            borderRadius: "50px",
            fontWeight: 700,
            flexShrink: 0,
            letterSpacing: "0.3px",
          }}
        >
          ⚛ React
        </span>
      </div>

      {/* Suggestions Dropdown */}
      {open && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#1A1A2E",
            border: "1px solid rgba(108,99,255,0.25)",
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 1000,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.7rem",
              color: "#6666AA",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            🔍 Suggestions
          </div>
          {suggestions.map((ev) => (
            <SuggestionItem key={ev.id} event={ev} onSelect={handleSelect} />
          ))}
        </div>
      )}

      {open && suggestions.length === 0 && query.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#1A1A2E",
            border: "1px solid rgba(108,99,255,0.25)",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
            color: "#9999BB",
            fontSize: "0.85rem",
            zIndex: 1000,
          }}
        >
          😕 No events matching "{query}"
        </div>
      )}
    </div>
  );
}

function SuggestionItem({ event, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(event)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.75rem 1rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        background: hovered ? "rgba(108,99,255,0.12)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${event.color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          flexShrink: 0,
        }}
      >
        {event.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#E8E8F0",
            fontWeight: 600,
            fontSize: "0.88rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.title}
        </div>
        <div style={{ color: "#9999BB", fontSize: "0.72rem", marginTop: 2 }}>
          {event.category} · {event.date} · {event.location}
        </div>
      </div>
      <span
        style={{
          fontSize: "0.7rem",
          background: `${event.color}22`,
          color: event.color,
          padding: "2px 8px",
          borderRadius: "50px",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {event.seats} seats
      </span>
    </div>
  );
}
