import { Outlet } from "react-router-dom";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";

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
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(80, 200, 220, 0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={CYAN} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
          fill={TITLE_COLOR} fontSize="13" fontFamily="monospace" fontWeight="bold"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <span style={{ fontSize: "10px", letterSpacing: "2px", color: MUTED, textTransform: "uppercase", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

function Layout() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", color: "white" }}>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <Outlet />
      </div>

      {/* RIGHT PANEL — persistent across all pages */}
      <div style={{
        width: "300px",
        padding: "20px",
        overflowY: "auto",
        background: "rgb(8, 15, 25)",
        borderLeft: `1px solid ${CYAN_DIM}`,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        {/* Operator */}
        <div style={{ borderBottom: `1px solid ${CYAN_DIM}`, paddingBottom: "16px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: MUTED, textTransform: "uppercase" }}>Operator</div>
          <div style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "1px", color: TITLE_COLOR, marginTop: "4px" }}>John Doe</div>
        </div>

        {/* Description */}
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(200, 220, 240, 0.75)", margin: 0 }}>
            The Virtual Systems Explorer is an interactive training platform for maintenance technicians.
            Use the 3D viewer to inspect equipment components, follow guided maintenance procedures,
            and track certification progress.
          </p>
        </div>

        {/* Operator Stats */}
        <div style={{ marginTop: "auto" }}>
          <h2 style={{
            color: TITLE_COLOR,
            fontSize: "0.7rem",
            fontWeight: "bold",
            letterSpacing: "4px",
            textTransform: "uppercase",
            borderBottom: `1px solid ${CYAN_DIM}`,
            paddingBottom: "8px",
            marginTop: 0,
            marginBottom: "12px",
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

export default Layout;
