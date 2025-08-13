import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateProduct, DeleteProduct, GetAllProducts, UpdateProduct } from "../../redux/slices/product";
import { useNavigate } from "react-router-dom";
import ProductModal from "../../components/Dashboard/AddProduct";
import ConfirmDialog from "../../components/Dialog/ConfirmationDialog";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
     const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { products } = useSelector((state) => state.products);
    const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  
  const handleConfirmDelete = () => {
    // call your delete API
    dispatch(DeleteProduct(deleteId)); // or DeleteProduct(deleteId)
    setConfirmOpen(false);
    setDeleteId(null);
  };

  useEffect(() => {
    dispatch(GetAllProducts({ page: 1, limit: 100 }));
  }, [dispatch]);





  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

const handleSubmit = async (data) => {  
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category", data.category);

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        if (file) formData.append("images", file);
      });
    }

    if (editProduct) {
      console.log("Update Product:", data);
      await dispatch(UpdateProduct(editProduct._id, formData));  
              await GetAllProducts()
      
    } else {
      console.log("Add Product:", data);
      await dispatch(CreateProduct(formData)); 
    }
    setModalOpen(false); 
  } catch (error) {
    console.error("Error submitting product:", error);
  }
};



  return (
    <div>
        <h2>Products</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button
          onClick={handleAdd}
          style={authButton}
        >
          Add Product
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1e3a8a", color: "#fff" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No products found
              </td>
            </tr>
          )}
          {products.map((prod, index) => (
            <tr key={prod._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{prod.title}</td>
              <td style={tdStyle}>{prod?.category?.name}</td>
              <td style={tdStyle}>{prod.price}</td>
              <td style={tdStyle}>{prod.stock}</td>
              <td style={tdStyle}>
                <button
                  onClick={() =>handleEdit(prod)}
                  style={actionButtonStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(prod._id)}
                  style={{ ...actionButtonStyle, backgroundColor: "#ef4444" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={editProduct || null}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
};
const authButton= {
    background: "#facc15",
    color: "#000",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }
const actionButtonStyle = {
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "4px",
  cursor: "pointer",
};
