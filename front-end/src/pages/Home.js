import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { GetAllProducts } from "../redux/slices/product";
import { GetAllCategories } from "../redux/slices/category";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import ProductList from "../components/ProductList";
import SideNav from "../components/Dashboard/sidenav";
import AdminDashboard from "../components/Dashboard/adminDashboard";
import { useAuth } from "../context/authContext";
import ProductsPage from "./Dashboard/ProductListPage";
import CategoriesPage from "./Dashboard/CategoryListPage";
import OrdersTable from "./Dashboard/OrdersListPAge";
import socket from "../utils/socket";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { products, total } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [selectedSubIds, setSelectedSubIds] = useState([]);
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  console.log("TO", selectedSubIds);

  useEffect(() => {
    const delay = setTimeout(() => {
      const catId =
        selectedSubIds.length > 0 ? selectedSubIds.join(",") : undefined;
      dispatch(GetAllProducts({ search, page, limit, catId }));
    }, 300);

    return () => clearTimeout(delay);
  }, [dispatch, search, page, selectedSubIds]);

  useEffect(() => {
    if (user?.role === "admin") {
      socket.on("stock:change", ({ productId, stock, title }) => {
        setSnackbar({
          open: true,
          message: `Stock updated: ${
            title || productId
          } now has ${stock} items`,
          severity: stock < 5 ? "warning" : "info",
        });
      });

      socket.on("order:new", ({ orderId }) => {
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
    }
  }, [user?.role]);

  useEffect(() => {
    dispatch(GetAllCategories());
 
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleFilterChange = (subIds) => {
    setPage(1);
    setSelectedSubIds(subIds);
  };

  if (user?.role === "admin") {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header isHome={true} />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <SideNav activePage={activePage} setActivePage={setActivePage} />

          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="orders" element={<OrdersTable />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header onSearch={handleSearchChange} searchValue={search} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar categories={categories} onFilterChange={handleFilterChange} />

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <ProductList products={products} />

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ccc",
                  backgroundColor: i + 1 === page ? "#1e3a8a" : "#fff",
                  color: i + 1 === page ? "#fff" : "#000",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
