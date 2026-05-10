import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const BG = "rgb(8, 15, 25)";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(8, 20, 35, 0.9)",
    border: `1px solid ${CYAN_DIM}`,
    color: TITLE_COLOR,
    fontSize: "0.85rem",
    fontFamily: "monospace",
    letterSpacing: "1px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      display: "flex", width: "100%", height: "100%",
      background: BG, alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: "380px",
        border: `1px solid ${CYAN_DIM}`,
        background: "rgba(8, 20, 35, 0.9)",
        padding: "40px 35px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "5px", color: MUTED, textTransform: "uppercase", marginBottom: "10px" }}>
            Virtual Systems Explorer
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "4px", color: TITLE_COLOR }}>
            AUTHENTICATION
          </div>
          <div style={{ width: "100%", height: "1px", background: CYAN_DIM, marginTop: "20px" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "6px" }}>
              Username
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "6px" }}>
              Password
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "42px" }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: showPassword ? CYAN : MUTED, padding: "2px", lineHeight: 1,
                  display: "flex", alignItems: "center",
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: "12px", color: "rgba(255, 100, 100, 0.9)", letterSpacing: "1px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "14px",
              background: loading ? "rgba(80, 200, 220, 0.1)" : CYAN_BG,
              border: `1px solid ${CYAN_DIM}`,
              color: loading ? MUTED : TITLE_COLOR,
              fontSize: "0.8rem",
              fontWeight: "bold",
              letterSpacing: "4px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "monospace",
            }}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
