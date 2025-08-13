import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  updateCartQty,
  getCart,
} from "../redux/slices/cart";
import CheckoutModal from "../components/checkOut";
import Header from "../components/header";

export default function CartPage() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [showCheckout, setShowCheckout] = useState(false);
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
    <Header isHome="true"/>
    <div style={styles.page}>
      <h1 style={styles.heading}>Your Cart</h1>

      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        <>
          <div style={styles.cartList}>
            {items.map((item) => (
              <div key={item.productId} style={styles.card}>
                <img
                  src={process.env.REACT_APP_UPLOAD_URL + item.image}
                  alt={item.title}
                  style={styles.image}
                />
                <div style={styles.details}>
                  <h3>{item.title}</h3>
                  <p>₹{item.price}</p>

                  <div style={styles.qtyBox}>
                    <button
                      onClick={() =>
                        dispatch(
                          updateCartQty(
                            item.productId,
                            Math.max(item.quantity - 1, 1)
                          )
                        )
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateCartQty(item.productId, item.quantity + 1)
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    style={styles.removeBtn}
                    onClick={() => {
                      dispatch(removeFromCart(item.productId));
                      dispatch(getCart());
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h3>Total: ₹{totalPrice}</h3>
            <button
              style={styles.checkoutBtn}
              onClick={() => setShowCheckout(true)}
            >
              Checkout
            </button>
            <button
              style={styles.clearBtn}
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}

      {showCheckout && <CheckoutModal items={items} onClose={() => setShowCheckout(false)} />}
    </div>
    </>
  );
}

const styles = {
  page: { padding: "20px" },
  heading: { textAlign: "center", marginBottom: "20px" },
  cartList: { display: "flex", flexWrap: "wrap", gap: "20px" },
  card: {
    width: "250px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  image: { width: "100%", height: "180px", objectFit: "cover" },
  details: { padding: "10px" },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  qtyBtn: {
    padding: "4px 8px",
    background: "#f3f4f6",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "4px",
  },
  removeBtn: {
    marginTop: "10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  summary: {
    marginTop: "30px",
    textAlign: "center",
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "8px",
  },
  checkoutBtn: {
    background: "#1e3a8a",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer",
  },
  clearBtn: {
    background: "#9ca3af",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
