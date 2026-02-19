import { useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";

function SectionHeader({ children }) {
  return (
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
      {children}
    </h2>
  );
}

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
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(80, 200, 220, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={CYAN}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${size/2}px ${size/2}px` }}
          fill={TITLE_COLOR}
          fontSize="13"
          fontFamily="monospace"
          fontWeight="bold"
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

function App() {
  // --- CONFIGURATION ---
  const buildName = "Builds";
  const buildPath = `/unity/${buildName}`;

  // --- STATE ---
  const [partsInspected, setPartsInspected] = useState(2);
  const [procedureSteps, setProcedureSteps] = useState(3);

  // --- UNITY CONTEXT ---
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener
  } = useUnityContext({
    loaderUrl: `${buildPath}.loader.js`,
    dataUrl: `${buildPath}.data`,
    frameworkUrl: `${buildPath}.framework.js`,
    codeUrl: `${buildPath}.wasm`,
  });

  // --- HANDLERS ---
  const handlePartClick = useCallback(() => {
    setPartsInspected((prev) => prev + 1);
  }, []);

  const handleProcedureStep = useCallback((step) => {
    setProcedureSteps(Number(step));
  }, []);

  // --- LISTENERS ---
  useEffect(() => {
    addEventListener("OnPartClicked", handlePartClick);
    addEventListener("OnProcedureStep", handleProcedureStep);
    return () => {
      removeEventListener("OnPartClicked", handlePartClick);
      removeEventListener("OnProcedureStep", handleProcedureStep);
    };
  }, [addEventListener, removeEventListener, handlePartClick, handleProcedureStep]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", color: "white" }}>

      {/* LEFT SIDE: Unity */}
      <div style={{
        flex: 1,
        display: "flex",
        position: "relative",
        borderRight: `1px solid ${CYAN_DIM}`,
        background: "rgb(8, 15, 25)",
        minWidth: "0"
      }}>
        {!isLoaded && (
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 10,
            background: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "8px"
          }}>
            <p style={{ marginBottom: "10px", letterSpacing: "2px", fontSize: "12px" }}>
              LOADING VSE... {Math.round(loadingProgression * 100)}%
            </p>
            <div style={{ width: "240px", height: "4px", background: "rgba(80,200,220,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                width: `${loadingProgression * 100}%`,
                height: "100%",
                background: CYAN,
                transition: "width 0.3s ease-out"
              }} />
            </div>
          </div>
        )}
        <Unity
          unityProvider={unityProvider}
          style={{ width: "100%", height: "100%", visibility: isLoaded ? "visible" : "hidden" }}
        />
      </div>

      {/* RIGHT SIDE: Sidebar */}
      <div style={{
        width: "300px",
        padding: "20px",
        overflowY: "auto",
        background: "rgb(8, 15, 25)",
        borderTop: `1px solid ${CYAN_DIM}`,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box"
      }}>

        {/* OPERATOR IDENTITY */}
        <div style={{ borderBottom: `1px solid ${CYAN_DIM}`, paddingBottom: "16px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: MUTED, textTransform: "uppercase" }}>
            Operator
          </div>
          <div style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "1px", color: TITLE_COLOR, marginTop: "4px" }}>
            John Doe
          </div>
        </div>

        {/* SYSTEM DESCRIPTION */}
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(200, 220, 240, 0.75)", margin: 0 }}>
            The Virtual Systems Explorer is an interactive training platform for maintenance technicians.
            Use the 3D viewer to inspect equipment components, follow guided maintenance procedures,
            and track certification progress.
          </p>
        </div>

        {/* OPERATOR STATS */}
        <div style={{ marginTop: "auto" }}>
          <SectionHeader>Operator Stats</SectionHeader>
          <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "8px" }}>
            <RadialStat label="Parts Inspected" value={partsInspected} max={12} />
            <RadialStat label="Procedure" value={procedureSteps} max={8} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
