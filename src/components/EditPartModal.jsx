import { useState, useEffect } from "react";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";

function Field({ label, value, onChange, readOnly = false, multiline = false }) {
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: readOnly ? "rgba(80, 200, 220, 0.03)" : CYAN_BG,
    border: `1px solid ${readOnly ? "rgba(80, 200, 220, 0.1)" : CYAN_DIM}`,
    color: readOnly ? MUTED : TITLE_COLOR,
    fontSize: "0.8rem",
    letterSpacing: "1px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: multiline ? "vertical" : "none",
    cursor: readOnly ? "default" : "text",
  };

  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ fontSize: "0.6rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "6px" }}>
        {label}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          rows={4}
          style={inputStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function EditPartModal({ part, onClose, onSaved }) {
  const [name, setName] = useState(part.name ?? "");
  const [description, setDescription] = useState(part.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/parts/${encodeURIComponent(part.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      onSaved(updated);
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    // Backdrop
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* Modal */}
      <div
        style={{
          width: "480px",
          background: "rgb(10, 18, 30)",
          border: `1px solid ${CYAN_DIM}`,
          padding: "32px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "4px", color: MUTED, textTransform: "uppercase", marginBottom: "8px" }}>
            Edit Part
          </div>
          <div style={{ fontSize: "1rem", fontWeight: "bold", letterSpacing: "2px", color: TITLE_COLOR,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {part.name}
          </div>
          <div style={{ width: "100%", height: "1px", background: CYAN_DIM, marginTop: "16px" }} />
        </div>

        {/* Fields */}
        <Field label="Part ID" value={part.id} onChange={() => {}} readOnly />
        <Field label="Display Name" value={name} onChange={setName} />
        <Field label="Description" value={description} onChange={setDescription} multiline />

        {error && (
          <div style={{ fontSize: "0.75rem", color: "rgba(230, 100, 100, 0.9)", marginBottom: "16px", letterSpacing: "1px" }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: `1px solid ${CYAN_DIM}`,
              color: MUTED,
              fontSize: "0.7rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              background: saving ? "rgba(80, 200, 220, 0.1)" : CYAN_BG,
              border: `1px solid ${CYAN}`,
              color: saving ? MUTED : CYAN,
              fontSize: "0.7rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontWeight: "bold",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPartModal;
