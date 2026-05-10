import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const MUTED = "rgba(100, 210, 230, 0.5)";

function Layout() {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", color: "white" }}>
      <div style={{
        display: "flex", justifyContent: "flex-end", alignItems: "center",
        padding: "6px 16px",
        borderBottom: `1px solid ${CYAN_DIM}`,
        background: "rgb(8, 15, 25)",
        flexShrink: 0,
      }}>
        <button
          onClick={logout}
          style={{
            background: "transparent",
            border: `1px solid ${CYAN_DIM}`,
            color: MUTED,
            fontSize: "0.65rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            padding: "5px 12px",
            cursor: "pointer",
            fontFamily: "monospace",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(100, 210, 230, 0.9)"}
          onMouseLeave={e => e.currentTarget.style.color = MUTED}
        >
          Logout
        </button>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
