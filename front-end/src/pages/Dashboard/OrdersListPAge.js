import moment from "moment";
import React, { useEffect, useState } from "react";
import { GetOrders } from "../../redux/slices/order";
import { useDispatch, useSelector } from "react-redux";
// import OrderModal from "./OrderModal"; // optional modal for viewing/editing order

export default function OrdersTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders } = useSelector((state) => state.order);
const fDate = (dateStr) => moment(dateStr).format("DD MMM YYYY");
const dispatch= useDispatch()


  const handleClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };
  useEffect(() => {
    dispatch(GetOrders({ page: 1, limit: 100 }));
  }, [dispatch]);




  const thStyle = { padding: "10px", textAlign: "left", borderBottom: "1px solid #ccc" };
  const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };


  return (
    <div>
      <h2>Orders</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1e3a8a", color: "#fff" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}>Total Price</th>
            <th style={thStyle}>Shipping Address</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created At</th>
            {/* <th style={thStyle}>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {orders?.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                No orders found
              </td>
            </tr>
          )}
          {orders?.map((order, index) => (
            <tr key={order._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{order._id}</td>
              <td style={tdStyle}>{order.user.name}</td>
              <td style={tdStyle}>
                {order.items.map((item, i) => (
                  <div key={i}>
                    {item.title} x {item.quantity} (${item.price})
                  </div>
                ))}
              </td>
              <td style={tdStyle}>{order.totalPrice}</td>
              <td style={tdStyle}>{order.shippingAddress}</td>
              <td style={tdStyle}>{order.status}</td>
              <td style={tdStyle}>{fDate(order.createdAt)}</td>
             
            </tr>
          ))}
        </tbody>
      </table>

    
    </div>
  );
}
