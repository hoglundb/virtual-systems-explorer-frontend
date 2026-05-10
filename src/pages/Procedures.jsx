import { useNavigate } from "react-router-dom";
import UnityViewer from "../components/UnityViewer";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const BG = "rgb(8, 15, 25)";

function Procedures() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>

      {/* Left panel */}
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
            Maintenance Procedures
          </div>
        </div>

        {/* Placeholder for procedure step list */}
        <div style={{ padding: "16px", flex: 1 }}>
          <div style={{
            fontSize: "0.55rem", letterSpacing: "3px", color: MUTED,
            textTransform: "uppercase", marginBottom: "12px",
          }}>
            Procedure Steps
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(200, 220, 240, 0.4)", lineHeight: "1.6" }}>
            Steps will appear here as the procedure progresses.
          </div>
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
        <UnityViewer sceneName="HSTT_Procedure_Scene" />
      </div>

    </div>
  );
}

export default Procedures;
