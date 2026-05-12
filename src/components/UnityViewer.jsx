import { useState, useEffect, useRef } from "react";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const SPLASH_DURATION = 3500;

const BOOT_LINES = [
  "Initializing secure environment...",
  "Loading asset registry...",
  "Mounting 3D subsystems...",
  "Calibrating interaction layer...",
  "Establishing operator session...",
  "Awaiting engine...",
];

export function SplashScreen({ onDone, isLoaded = false }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(Math.round((elapsed / SPLASH_DURATION) * 100), 99);
      setProgress(pct);
      if (pct < 99) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const lineInterval = SPLASH_DURATION / BOOT_LINES.length;
    const lineTimer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= BOOT_LINES.length) { clearInterval(lineTimer); return prev; }
        return prev + 1;
      });
    }, lineInterval);
    return () => clearInterval(lineTimer);
  }, []);

  const timerDone = useRef(false);
  useEffect(() => {
    const doneTimer = setTimeout(() => { timerDone.current = true; }, SPLASH_DURATION);
    return () => clearTimeout(doneTimer);
  }, []);

  useEffect(() => {
    if (isLoaded && timerDone.current && !fading) {
      setFading(true);
      setTimeout(onDone, 600);
    }
  }, [isLoaded, fading, onDone]);

  useEffect(() => {
    const poll = setInterval(() => {
      if (isLoaded && timerDone.current && !fading) {
        setFading(true);
        setTimeout(onDone, 600);
        clearInterval(poll);
      }
    }, 100);
    return () => clearInterval(poll);
  }, [isLoaded, fading, onDone]);

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
