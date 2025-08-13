// components/cart/CartSidebar.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/auth";
import { GetCart, RemoveFromCart, UpdateCartQty } from "../../redux/slices/cart";

export default function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?.id && isOpen) {
      dispatch(GetCart(user.id));
    }
  }, [dispatch, user?.id, isOpen]);

  const handleQtyChange = (productId, qty) => {
    if (qty <= 0) {
      dispatch(RemoveFromCart(productId));
    } else {
      dispatch(UpdateCartQty(productId, qty));
    }
  };

  return (
    <div style={{ ...styles.sidebar, right: isOpen ? 0 : "-100%" }}>
      <div style={styles.header}>
        <h3 style={styles.title}>🛒 Cart</h3>
        <button onClick={onClose} style={styles.closeBtn}>✖</button>
      </div>

      {items.length === 0 ? (
        <p style={styles.emptyText}>Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item._id} style={styles.productItem}>
              <img
                src={process.env.REACT_APP_UPLOAD_URL + item.image}
                alt={item.title}
                style={styles.image}
              />
              <div style={styles.details}>
                <h4 style={styles.productTitle}>{item.title}</h4>
                <p style={styles.productPrice}>₹{item.price}</p>
                <div style={styles.qtyBox}>
                  <button onClick={() => handleQtyChange(item.productId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQtyChange(item.productId, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button
                onClick={() => dispatch(RemoveFromCart(item.productId))}
                style={styles.removeBtn}
              >
                ✖
              </button>
            </div>
          ))}
          <button style={styles.checkoutBtn} onClick={() => alert("Go to Checkout")}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    width: "350px",
    backgroundColor: "#ffffff",
    boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
    transition: "right 0.3s ease-in-out",
    zIndex: 1000,
    padding: "20px",
    overflowY: "auto",
    borderLeft: "1px solid #e5e7eb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "15px",
    paddingBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e3a8a",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#1e3a8a",
  },
  emptyText: {
    color: "#64748b",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "40px",
  },
  productItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
    position: "relative",
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  details: { flex: 1 },
  productTitle: {
    margin: "0 0 4px 0",
    fontSize: "15px",
    fontWeight: "500",
    color: "#111827",
  },
  productPrice: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#dc2626",
    fontSize: "16px",
    cursor: "pointer",
  },
  checkoutBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    backgroundColor: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
