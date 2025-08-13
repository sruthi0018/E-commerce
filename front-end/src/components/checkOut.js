import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createOrder } from "../redux/slices/order";
import { clearCart } from "../redux/slices/cart";

export default function CheckoutModal({ items, onClose }) {
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");

  const normalizedItems = Array.isArray(items) ? items : [items];
  const preparedItems = normalizedItems.map((i) => ({
    productId: i.productId || i._id,
    title: i.title,
    price: i.price,
    quantity: i.quantity || 1,
  }));

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert("Please enter your shipping address");
      return;
    }

    const orderData = {
      items: preparedItems.map((i) => ({
        product: i.productId,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      totalPrice: preparedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      shippingAddress:address,
    };

    dispatch(createOrder(orderData)).then(() => {
      alert("Order placed successfully!");
      dispatch(clearCart());
      onClose();
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Checkout</h2>

        <div style={styles.itemList}>
          {preparedItems.map((item) => (
            <div key={item.productId} style={styles.itemCard}>
              <span style={styles.itemTitle}>
                {item.title} <span style={styles.qty}>(x{item.quantity})</span>
              </span>
              <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div style={styles.totalBox}>
          <strong>Total:</strong>{" "}
          <span style={styles.totalPrice}>
            ₹{preparedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
          </span>
        </div>

        <textarea
          placeholder="Enter your shipping address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.placeBtn} onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
    padding: "10px",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    animation: "fadeIn 0.3s ease",
  },
  title: {
    marginBottom: "15px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
  },
  itemList: {
    marginBottom: "15px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  },
  itemCard: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  itemTitle: {
    fontWeight: "500",
  },
  qty: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  itemPrice: {
    fontWeight: "600",
    color: "#1f2937",
  },
  totalBox: {
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.1rem",
  },
  totalPrice: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  textarea: {
    width: "95%",
    height: "90px",
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.95rem",
    resize: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  placeBtn: {
    background: "#1e3a8a",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    flex: 1,
    transition: "background 0.2s",
  },
  cancelBtn: {
    background: "#9ca3af",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    flex: 1,
    transition: "background 0.2s",
  },
};
