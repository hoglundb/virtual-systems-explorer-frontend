import React, { useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  // This stores the list of clicks we see on the right side of the screen
  const [logs, setLogs] = useState(["System Initialized...", "Awaiting Unity connection..."]);

  // 1. TELL REACT WHERE THE UNITY FILES ARE
  // Note: These files MUST be inside your 'public/unity/' folder
  const { unityProvider, isLoaded, loadingProgression, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "/unity/Build.loader.js",
    dataUrl: "/unity/Build.data",
    frameworkUrl: "/unity/Build.framework.js",
    codeUrl: "/unity/Build.wasm",
  });

  // 2. THE "RECEIVER" FUNCTION
  // This runs whenever Unity sends a message called "OnPartClicked"
  const handlePartClick = useCallback((partName) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] User clicked: ${partName}`, ...prev.slice(0, 15)]);

    // Optional: Send this same data to your Node.js backend
    /*
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ part: partName, time: time })
    });
    */
  }, []);

  // 3. THE "LISTENER"
  // This tells the browser to keep an ear out for Unity's voice
  useEffect(() => {
    addEventListener("OnPartClicked", handlePartClick);
    return () => removeEventListener("OnPartClicked", handlePartClick);
  }, [addEventListener, removeEventListener, handlePartClick]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1a1a1a", color: "white", fontFamily: "sans-serif" }}>

      {/* LEFT SIDE: THE 3D MOTORCYCLE VIEW */}
      <div style={{ flex: 3, position: "relative", borderRight: "2px solid #333", background: "#000" }}>
        {!isLoaded && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <p>Loading VSE Prototype...</p>
            <div style={{ width: "200px", height: "10px", background: "#333", borderRadius: "5px" }}>
              <div style={{ width: `${loadingProgression * 100}%`, height: "100%", background: "#4caf50", borderRadius: "5px", transition: "width 0.3s" }} />
            </div>
          </div>
        )}
        <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* RIGHT SIDE: THE DATA FEED */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#111" }}>
        <h2 style={{ color: "#4caf50", borderBottom: "1px solid #333", paddingBottom: "10px", marginTop: 0 }}>
          Telemetry Feed
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              padding: "8px",
              background: i === 0 ? "#222" : "transparent",
              borderLeft: i === 0 ? "4px solid #4caf50" : "none",
              color: i === 0 ? "#fff" : "#888",
              fontSize: "14px",
              fontFamily: "monospace"
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