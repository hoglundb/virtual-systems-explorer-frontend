import { useNavigate } from "react-router-dom";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";

const MENU_ITEMS = [
  { label: "Parts Catalog", route: "/parts", active: true },
  { label: "3D Vehicle Viewer", route: "/viewer", active: false },
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
    <div style={{
      width: "100%",
      height: "100%",
      background: "rgb(8, 15, 25)",
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
  );
}

export default Home;
