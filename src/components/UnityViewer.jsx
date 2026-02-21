import { useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const MIN_WIDTH = 1280;
const MIN_HEIGHT = 720;
const SPLASH_DURATION = 3500;

const BOOT_LINES = [
  "Initializing secure environment...",
  "Loading asset registry...",
  "Mounting 3D subsystems...",
  "Calibrating interaction layer...",
  "Establishing operator session...",
  "VSE ready.",
];

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
          style={{ transform: `rotate(90deg)`, transformOrigin: `${size/2}px ${size/2}px` }}
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

export function SplashScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const lineInterval = SPLASH_DURATION / BOOT_LINES.length;

    const lineTimer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= BOOT_LINES.length) { clearInterval(lineTimer); return prev; }
        return prev + 1;
      });
    }, lineInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, SPLASH_DURATION / 100);

    const doneTimer = setTimeout(() => {
      setFading(true);
      setTimeout(onDone, 600);
    }, SPLASH_DURATION);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgb(8, 15, 25)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 100,
      opacity: fading ? 0 : 1,
      transition: "opacity 0.6s ease-out",
    }}>
      {[
        { top: "20px", left: "20px", borderTop: `1px solid ${CYAN}`, borderLeft: `1px solid ${CYAN}` },
        { top: "20px", right: "20px", borderTop: `1px solid ${CYAN}`, borderRight: `1px solid ${CYAN}` },
        { bottom: "20px", left: "20px", borderBottom: `1px solid ${CYAN}`, borderLeft: `1px solid ${CYAN}` },
        { bottom: "20px", right: "20px", borderBottom: `1px solid ${CYAN}`, borderRight: `1px solid ${CYAN}` },
      ].map((style, i) => (
        <div key={i} style={{ position: "absolute", width: "40px", height: "40px", ...style }} />
      ))}

      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "8px", color: MUTED, textTransform: "uppercase", marginBottom: "16px" }}>
          Virtual Systems Explorer
        </div>
        <div style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "6px", color: TITLE_COLOR }}>
          VSE
        </div>
        <div style={{ width: "60px", height: "1px", background: CYAN_DIM, margin: "16px auto 0" }} />
      </div>

      <div style={{ width: "380px", marginBottom: "48px", minHeight: "140px" }}>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{
            fontSize: "11px",
            fontFamily: "monospace",
            color: i === visibleLines - 1 ? CYAN : MUTED,
            marginBottom: "8px",
            letterSpacing: "1px",
          }}>
            <span style={{ color: CYAN_DIM, marginRight: "10px" }}>{'>'}</span>
            {line}
          </div>
        ))}
      </div>

      <div style={{ width: "380px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "2px", color: MUTED, textTransform: "uppercase" }}>Loading</span>
          <span style={{ fontSize: "10px", fontFamily: "monospace", color: CYAN }}>{progress}%</span>
        </div>
        <div style={{ height: "2px", background: "rgba(80, 200, 220, 0.1)", borderRadius: "1px" }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: CYAN,
            borderRadius: "1px",
            transition: "width 0.1s linear",
            boxShadow: `0 0 8px ${CYAN}`,
          }} />
        </div>
      </div>
    </div>
  );
}

function UnityViewer() {
  const buildName = "Builds";
  const buildPath = `/unity/${buildName}`;

  const [partsInspected, setPartsInspected] = useState(2);
  const [procedureSteps, setProcedureSteps] = useState(3);
  const [splashDone, setSplashDone] = useState(false);

  const { unityProvider, isLoaded, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: `${buildPath}.loader.js`,
    dataUrl: `${buildPath}.data`,
    frameworkUrl: `${buildPath}.framework.js`,
    codeUrl: `${buildPath}.wasm`,
  });

  const ready = isLoaded && splashDone;

  const handlePartClick = useCallback(() => {
    setPartsInspected((prev) => prev + 1);
  }, []);

  const handleProcedureStep = useCallback((step) => {
    setProcedureSteps(Number(step));
  }, []);

  useEffect(() => {
    addEventListener("OnPartClicked", handlePartClick);
    addEventListener("OnProcedureStep", handleProcedureStep);
    return () => {
      removeEventListener("OnPartClicked", handlePartClick);
      removeEventListener("OnProcedureStep", handleProcedureStep);
    };
  }, [addEventListener, removeEventListener, handlePartClick, handleProcedureStep]);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <div style={{ width: "100%", height: "100%", background: "rgb(8, 15, 25)", visibility: splashDone ? "visible" : "hidden" }}>
        <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
}

export default UnityViewer;
