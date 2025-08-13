import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";

const drawerWidth = 240;
export default function SideNav({ activePage, setActivePage }) {
  const { user } = useAuth();

  const navItems = [
    { label: "Dashboard", key: "dashboard", show: true },
    { label: "Products", key: "products", show: true },
    { label: "Categories", key: "categories", show: true },
    { label: "Orders", key: "orders", show: true },
    { label: "Inventory", key: "inventory", show: true },
    { label: "Staff", key: "staff", show: user?.role === "superadmin" },
  ];

  return (
    <aside
      style={{
        width: 240,
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
            const isSelected = activePage === item.key;
            return (
              <li key={item.key} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => setActivePage(item.key)}
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
