import { useNavigate } from "react-router-dom";
import UnityViewer from "../components/UnityViewer";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const BG = "rgb(8, 15, 25)";

const CONTROLS = [
  { input: "Right Click + Drag", action: "Rotate" },
  { input: "Middle Click + Drag", action: "Pan" },
  { input: "Left Click + Drag", action: "Select / Move Part" },
  { input: "Scroll Wheel", action: "Zoom" },
  { input: "R", action: "Reset View" },
];

function ControlRow({ input, action }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: `1px solid rgba(80, 200, 220, 0.1)`,
    }}>
      <span style={{
        fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase",
        color: MUTED,
      }}>
        {action}
      </span>
      <span style={{
        fontSize: "0.65rem", letterSpacing: "1px",
        color: TITLE_COLOR, fontFamily: "monospace",
      }}>
        {input}
      </span>
    </div>
  );
}

function Viewer() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>

      {/* Left panel — back button + controls */}
      <div style={{
        width: "280px", flexShrink: 0,
        borderRight: `1px solid ${CYAN_DIM}`,
        background: BG,
        display: "flex", flexDirection: "column",
        height: "100%", boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{ padding: "16px", borderBottom: `1px solid ${CYAN_DIM}` }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent", border: "none",
              color: MUTED, fontSize: "0.75rem",
              letterSpacing: "2px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              padding: "0 0 10px 0",
              display: "flex", alignItems: "center", gap: "6px",
            }}
            onMouseEnter={e => e.currentTarget.style.color = CYAN}
            onMouseLeave={e => e.currentTarget.style.color = MUTED}
          >
            ← Home
          </button>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", color: MUTED, textTransform: "uppercase" }}>
            3D Vehicle Viewer
          </div>
        </div>

        {/* Controls reference */}
        <div style={{ padding: "16px", flex: 1 }}>
          <div style={{
            fontSize: "0.55rem", letterSpacing: "3px", color: MUTED,
            textTransform: "uppercase", marginBottom: "12px",
          }}>
            Viewport Controls
          </div>
          {CONTROLS.map((c) => (
            <ControlRow key={c.input} input={c.input} action={c.action} />
          ))}
        </div>

        {/* Footer status */}
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${CYAN_DIM}` }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "2px", color: MUTED, textTransform: "uppercase" }}>
            Unity WebGL
          </span>
        </div>
      </div>

      {/* Unity canvas area */}
      <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
        <UnityViewer />
      </div>

    </div>
  );
}

export default Viewer;
