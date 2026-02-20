import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const BG = "rgb(8, 15, 25)";

function PartsList({ selectedPart, onSelectPart }) {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/parts")
      .then((res) => res.json())
      .then((data) => {
        setParts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load parts");
        setLoading(false);
      });
  }, []);

  const filtered = parts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      width: "280px",
      flexShrink: 0,
      borderRight: `1px solid ${CYAN_DIM}`,
      background: BG,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: `1px solid ${CYAN_DIM}` }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: MUTED,
            fontSize: "0.75rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "0 0 10px 0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={e => e.currentTarget.style.color = CYAN}
          onMouseLeave={e => e.currentTarget.style.color = MUTED}
        >
          ← Home
        </button>
        <div style={{ fontSize: "0.65rem", letterSpacing: "4px", color: MUTED, textTransform: "uppercase", marginBottom: "12px" }}>
          Parts Catalog
        </div>
        <input
          type="text"
          placeholder="Search parts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "rgba(80, 200, 220, 0.05)",
            border: `1px solid ${CYAN_DIM}`,
            color: TITLE_COLOR,
            fontSize: "0.75rem",
            letterSpacing: "1px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <div style={{ padding: "20px", fontSize: "0.7rem", color: MUTED, letterSpacing: "2px", textTransform: "uppercase" }}>
            Loading...
          </div>
        )}
        {error && (
          <div style={{ padding: "20px", fontSize: "0.7rem", color: "rgba(230, 100, 100, 0.8)", letterSpacing: "1px" }}>
            {error}
          </div>
        )}
        {!loading && !error && filtered.map((part) => {
          const isSelected = selectedPart?.id === part.id;
          return (
            <div
              key={part.id}
              onClick={() => onSelectPart(part)}
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${CYAN_DIM}`,
                background: isSelected ? CYAN_BG : "transparent",
                borderLeft: `3px solid ${isSelected ? CYAN : "transparent"}`,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(80, 200, 220, 0.04)"; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                fontSize: "0.75rem", letterSpacing: "1px", color: isSelected ? CYAN : TITLE_COLOR,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px",
              }}
                title={part.name}
              >
                {part.name}
              </div>
            </div>
          );
        })}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "20px", fontSize: "0.7rem", color: MUTED, letterSpacing: "1px" }}>
            No parts found
          </div>
        )}
      </div>

      {/* Footer count */}
      <div style={{ padding: "10px 16px", borderTop: `1px solid ${CYAN_DIM}` }}>
        <span style={{ fontSize: "0.65rem", letterSpacing: "2px", color: MUTED, textTransform: "uppercase" }}>
          {filtered.length} part{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default PartsList;
