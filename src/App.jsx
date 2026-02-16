import React, { useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  // --- CONFIGURATION ---
  const buildName = "Builds";
  const buildPath = `/unity/${buildName}`;

  // --- STATE ---
  const [logs, setLogs] = useState(["System Initialized...", "Awaiting Unity connection..."]);

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
  const handlePartClick = useCallback((partName) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] User clicked: ${partName}`, ...prev.slice(0, 15)]);
  }, []);

  // --- LISTENERS ---
  useEffect(() => {
    addEventListener("OnPartClicked", handlePartClick);
    return () => removeEventListener("OnPartClicked", handlePartClick);
  }, [addEventListener, removeEventListener, handlePartClick]);

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      background: "#1a1a1a",
      color: "white",
      fontFamily: "sans-serif",
      margin: 0,
      padding: 0,
      overflow: "hidden"
    }}>

      {/* LEFT SIDE: 3D VIEW (Flexible Area) */}
      <div style={{
        flex: 1,              // Take up all remaining space
        display: "flex",      // Crucial: Makes children (Unity) fill the space
        position: "relative",
        borderRight: "2px solid #333",
        background: "#000",
        minWidth: "0"         // Fixes a known flexbox bug with large children
      }}>

        {/* Loading Overlay */}
        {!isLoaded && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 10,
            background: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "10px"
          }}>
            <p style={{ marginBottom: "10px" }}>Loading VSE Prototype... {Math.round(loadingProgression * 100)}%</p>
            <div style={{ width: "240px", height: "8px", background: "#333", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${loadingProgression * 100}%`,
                height: "100%",
                background: "#4caf50",
                transition: "width 0.3s ease-out"
              }} />
            </div>
          </div>
        )}

        {/* UNITY COMPONENT */}
        <Unity
          unityProvider={unityProvider}
          style={{
            width: "100%",
            height: "100%",
            visibility: isLoaded ? "visible" : "hidden"
          }}
        />
      </div>

      {/* RIGHT SIDE: DATA FEED (Fixed Width) */}
      <div style={{
        width: "350px",       // Fixed width so Unity can't push it
        padding: "20px",
        overflowY: "auto",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box"
      }}>
        <h2 style={{
          color: "#4caf50",
          fontSize: "1.2rem",
          borderBottom: "1px solid #333",
          paddingBottom: "10px",
          marginTop: 0
        }}>
          Telemetry Feed
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              padding: "10px",
              background: i === 0 ? "rgba(76, 175, 80, 0.1)" : "transparent",
              borderLeft: i === 0 ? "4px solid #4caf50" : "4px solid transparent",
              color: i === 0 ? "#fff" : "#777",
              fontSize: "12px",
              fontFamily: "monospace",
              borderRadius: "4px",
              wordBreak: "break-all"
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;