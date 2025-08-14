import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

import socket from "../../utils/socket";
import { getDashboardStats } from "../../redux/slices/dashboard";
import AlertSnackbar from "../Dialog/AlertSnackbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { stats, isLoading, error } = useSelector((state) => state.dashboard);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    dispatch(getDashboardStats());

   // Listen for stock change
  socket.on("stock:change", ({ productId, stock, title }) => {
    setSnackbar({
      open: true,
      message: `Stock updated: ${title || productId} now has ${stock} items`,
      severity: stock < 5 ? "warning" : "info",
    });
  });

  // Listen for new order
  socket.on("order:new", ({ orderId, userId }) => {
    setSnackbar({
      open: true,
      message: `New order placed! #${orderId}`,
      severity: "success",
    });
  });

  return () => {
    socket.off("stock:change");
    socket.off("order:new");
  };
  
}, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const stockData = {
    labels: stats.products.map((p) => p.title),
    datasets: [
      {
        label: "Stock",
        data: stats.products.map((p) => p.stock),
        backgroundColor: stats.products.map((p) =>
          p.stock < 5 ? "#f87171" : "#1e40af"
        ), 
      },
    ],
  };

  const stockOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
      title: { display: true, text: "Product Stock Levels" },
    },
    scales: {
      x: {
        title: { display: true, text: "Products" },
        ticks: { maxRotation: 90, minRotation: 45 },
      },
      y: {
        title: { display: true, text: "Stock Quantity" },
        beginAtZero: true,
      },
    },
  };

  const ordersData = {
    labels: stats.ordersLastWeek.map((o) => o._id),
    datasets: [
      {
        label: "Orders",
        data: stats.ordersLastWeek.map((o) => o.count),
        borderColor: "#16a34a",
        backgroundColor: "#bbf7d0",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };

  const ordersOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
      title: { display: true, text: "Orders Last 7 Days" },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Order Count" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle} onClick={() => navigate("/home/products")}>
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div style={cardStyle} onClick={() => navigate("/home/products")}>
          <h3>Low Stock Products</h3>
          <p>{stats.lowStockProducts}</p>
        </div>
        <div style={cardStyle} onClick={() => navigate("/home/orders")}>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={chartContainerStyle}>
          <Bar key={stats.products.length} data={stockData} options={stockOptions} />
        </div>
        <div style={chartContainerStyle}>
          <Line key={stats.ordersLastWeek.length} data={ordersData} options={ordersOptions} />
        </div>
      </div>
       <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}

const cardStyle = {
  flex: 1,
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "all 0.2s",
};

const chartContainerStyle = {
  flex: 1,
  minWidth: "300px",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};
