import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const drawerWidth = 240;

export default function SideNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/home", show: true },
    { label: "Categories", path: "/home/categories", show: true },
    { label: "Products", path: "/home/products", show: true },
    { label: "Orders", path: "/home/orders", show: true },

  ];

  return (
    <aside
      style={{
        width: drawerWidth,
        height: "100%",
        backgroundColor: "#1e3a8a",
        color: "#facc15",
        paddingTop: "20px",
        boxSizing: "border-box",
        borderRight: "1px solid #E0E0E0",
        flexShrink: 0,
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <li key={item.path} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 20px",
                    backgroundColor: isSelected ? "#1d4ed8" : "transparent",
                    color: "#facc15",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: isSelected ? "bold" : "normal",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e40af")}
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = isSelected ? "#1d4ed8" : "transparent")
                  }
                >
                  {item.label}
                </button>
              </li>
            );
          })}
      </ul>
    </aside>
  );
}
