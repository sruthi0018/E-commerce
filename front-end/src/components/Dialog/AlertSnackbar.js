import { useEffect } from "react";

export default function AlertSnackbar({ open, message, severity = "info", onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const severityColors = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px", // ⬅️ Changed from bottom to top
        right: "20px",
        backgroundColor: severityColors[severity] || "#333",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
        animation: "slideIn 0.3s ease-out",
        maxWidth: "300px",
      }}
    >
      {message}
      <style>
        {`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}
