import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NAV_HEIGHT = 48;

const CYAN = "#00d2b4";
const TEXT_1 = "#e8edf5";
const TEXT_2 = "#7a8fa8";
const TEXT_3 = "#3a4f66";
const BORDER = "rgba(255,255,255,0.07)";
const MONO = "'Space Mono', monospace";

function ViewerNav({ title }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      height: NAV_HEIGHT,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2.5rem",
      background: "rgba(8,13,22,0.88)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${BORDER}`,
      boxSizing: "border-box",
    }}>
      <span
        onClick={() => navigate("/")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: MONO,
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          color: hovered ? CYAN : TEXT_1,
          cursor: "pointer",
          transition: "color 0.2s",
          userSelect: "none",
        }}
      >
        VIX<span style={{ color: CYAN }}>T</span>RION
      </span>

      <span style={{
        fontFamily: MONO,
        fontSize: "0.6rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: TEXT_2,
      }}>
        {title}
      </span>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: MONO,
        fontSize: "0.6rem",
        letterSpacing: "0.15em",
        color: TEXT_3,
      }}>
        <span style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: CYAN,
          display: "inline-block",
        }} />
        Prototype Build
      </div>
    </div>
  );
}

export default ViewerNav;
