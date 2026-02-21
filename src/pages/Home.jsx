import { useNavigate } from "react-router-dom";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const BG = "rgb(8, 15, 25)";

function RadialStat({ label, value, max }) {
  const pct = max === 0 ? 0 : value / max;
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(80, 200, 220, 0.1)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={CYAN} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${size/2}px ${size/2}px` }}
          fill={TITLE_COLOR} fontSize="13" fontFamily="monospace" fontWeight="bold">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <span style={{ fontSize: "10px", letterSpacing: "2px", color: MUTED, textTransform: "uppercase", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

const MENU_ITEMS = [
  { label: "Parts Catalog", route: "/parts", active: true },
  { label: "3D Vehicle Viewer", route: "/viewer", active: true },
  { label: "Maintenance Procedures", route: "/procedures", active: false },
  { label: "Data & Analytics", route: "/analytics", active: false },
  { label: "Settings & Profile", route: "/settings", active: false },
];

function MenuButton({ label, route, active, onClick }) {
  return (
    <button
      onClick={() => active && onClick(route)}
      style={{
        width: "100%",
        padding: "21px 24px",
        background: active ? CYAN_BG : "transparent",
        border: `1px solid ${active ? CYAN_DIM : "rgba(80, 200, 220, 0.1)"}`,
        color: active ? TITLE_COLOR : "rgba(200, 220, 240, 0.3)",
        fontSize: "0.85rem",
        fontWeight: "bold",
        letterSpacing: "3px",
        textTransform: "uppercase",
        textAlign: "left",
        cursor: active ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "background 0.2s, border-color 0.2s",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => { if (active) e.currentTarget.style.background = "rgba(80, 200, 220, 0.14)"; }}
      onMouseLeave={e => { if (active) e.currentTarget.style.background = CYAN_BG; }}
    >
      {active && (
        <span style={{
          width: "8px", height: "8px",
          background: CYAN,
          borderRadius: "50%",
          boxShadow: `0 0 6px ${CYAN}`,
          flexShrink: 0,
        }} />
      )}
      {!active && (
        <span style={{
          width: "8px", height: "8px",
          border: `1px solid rgba(80, 200, 220, 0.2)`,
          borderRadius: "2px",
          transform: "rotate(45deg)",
          flexShrink: 0,
        }} />
      )}
      {label}
    </button>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: BG }}>

      {/* Centered terminal card */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>

      {/* Terminal card */}
      <div style={{
        width: "446px",
        border: `1px solid ${CYAN_DIM}`,
        background: "rgba(8, 20, 35, 0.9)",
        padding: "40px 35px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "5px", color: MUTED, textTransform: "uppercase", marginBottom: "10px" }}>
            Virtual Systems Explorer
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: "bold", letterSpacing: "4px", color: TITLE_COLOR }}>
            MAINTENANCE TERMINAL
          </div>
          <div style={{ width: "100%", height: "1px", background: CYAN_DIM, marginTop: "20px" }} />
        </div>

        {/* Menu items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {MENU_ITEMS.map((item) => (
            <MenuButton
              key={item.route}
              label={item.label}
              route={item.route}
              active={item.active}
              onClick={navigate}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div style={{ width: "100%", height: "1px", background: CYAN_DIM, marginBottom: "14px" }} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase" }}>
            Prototype Release
          </span>
        </div>
      </div>
      </div>

      {/* Right panel — operator info, home page only */}
      <div style={{
        width: "300px", flexShrink: 0,
        padding: "20px",
        background: BG,
        borderLeft: `1px solid ${CYAN_DIM}`,
        display: "flex", flexDirection: "column",
        boxSizing: "border-box",
        overflowY: "auto",
      }}>
        <div style={{ borderBottom: `1px solid ${CYAN_DIM}`, paddingBottom: "16px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: MUTED, textTransform: "uppercase" }}>Operator</div>
          <div style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "1px", color: TITLE_COLOR, marginTop: "4px" }}>John Doe</div>
        </div>
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(200, 220, 240, 0.75)", margin: 0 }}>
            The Virtual Systems Explorer is an interactive training platform for maintenance technicians.
            Use the 3D viewer to inspect equipment components, follow guided maintenance procedures,
            and track certification progress.
          </p>
        </div>
        <div style={{ marginTop: "auto" }}>
          <h2 style={{
            color: TITLE_COLOR, fontSize: "0.7rem", fontWeight: "bold",
            letterSpacing: "4px", textTransform: "uppercase",
            borderBottom: `1px solid ${CYAN_DIM}`, paddingBottom: "8px",
            marginTop: 0, marginBottom: "12px",
          }}>
            Operator Stats
          </h2>
          <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "8px" }}>
            <RadialStat label="Parts Inspected" value={2} max={12} />
            <RadialStat label="Procedure" value={3} max={8} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
