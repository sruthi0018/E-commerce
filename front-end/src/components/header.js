import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";


export default function Header({ isHome,onSearch, searchValue }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
console.log(isHome,"isHome")
  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <h1>E-Commerce</h1>
      <div style={styles.right}>
         {isHome ? (
          <button
            onClick={() => navigate("/home")}
            style={styles.authButton}
          >
            Home
          </button>
        ) : (
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            style={styles.input}
          />
        )}
        {token ? (
          <>
            <span>{user?.name}</span>
            <button onClick={handleLogoutClick} style={styles.authButton}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} style={styles.authButton}>
            Sign In
          </button>
        )}
        <FaShoppingCart style={styles.icon} onClick={() => navigate("/checkout")}/>
      </div>
 
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#1e3a8a",
    color: "#fff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "250px",
  },
  homeButton: {
    background: "#34d399",
    color: "#000",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  authButton: {
    background: "#facc15",
    color: "#000",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  icon: {
    cursor: "pointer",
  },
};
