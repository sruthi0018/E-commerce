import React from "react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3>{title || "Confirm Action"}</h3>
        <p>{message || "Are you sure you want to continue?"}</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: 20 }}>
          <button onClick={onCancel} style={styles.cancel}>Cancel</button>
          <button onClick={onConfirm} style={styles.confirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 400,
    display: "flex",
    flexDirection: "column",
  },
  cancel: {
    padding: "8px 16px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  confirm: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
