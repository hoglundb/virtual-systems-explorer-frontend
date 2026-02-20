const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";

function Parts() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "rgb(8, 15, 25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "16px",
    }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "4px", color: MUTED, textTransform: "uppercase" }}>
        Interactive 3D Viewer
      </div>
      <div style={{ width: "40px", height: "1px", background: CYAN_DIM }} />
      <div style={{ fontSize: "14px", color: TITLE_COLOR, letterSpacing: "1px" }}>
        Coming soon
      </div>
    </div>
  );
}

export default Parts;
