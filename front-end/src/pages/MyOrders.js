// pages/MyOrdersPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMyOrders } from "../redux/slices/order";
import Header from "../components/header";


export default function MyOrders ()  {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(GetMyOrders());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <Header isHome="true"/>
    <div style={styles.container}>
      <h2>My Orders</h2>
      {
        (!orders || orders.length === 0) &&(
           <p style={{ textAlign: "center" }}>No orders found.</p>
        )
      }
      {orders.map((order) => (
        <div key={order._id} style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <span><strong>Order ID:</strong> {order._id}</span>
            <span><strong>Status:</strong> {order.status}</span>
            <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div>
            {order.items.map((item, idx) => (
              <div key={idx} style={styles.item}>
                <img
                  src={`${process.env.REACT_APP_UPLOAD_URL}${item.product.images[0]}`}
                  alt={item.product.title}
                  style={styles.image}
                />
                <div>
                  <h4>{item.product.title}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
                <div style={styles.itemTotal}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.orderFooter}>
            <strong>Total: ₹{order.totalPrice}</strong>
            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

const styles = {
  container: { padding: "20px" },
  orderCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    paddingBottom: "8px",
    marginBottom: "10px",
    fontSize: "14px",
    color: "#555",
  },
  item: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    marginRight: "10px",
    borderRadius: "4px",
  },
  itemTotal: { marginLeft: "auto", fontWeight: "bold" },
  orderFooter: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
  },
};
