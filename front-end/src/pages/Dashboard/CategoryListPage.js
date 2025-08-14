import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateCategory,
  DeleteCategory,
  GetAllCategories,
  UpdateCategory,
} from "../../redux/slices/category";
import CategoryModal from "../../components/Dashboard/AddCategory";
import ConfirmDialog from "../../components/Dialog/ConfirmationDialog";
import AlertSnackbar from "../../components/Dialog/AlertSnackbar";
// import { GetAllCategories, CreateCategory, UpdateCategory, DeleteCategory } from "../redux/categorySlice";
// import CategoryModal from "./CategoryModal"; // similar to ProductModal

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const { categories } = useSelector((state) => state.categories);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(DeleteCategory(deleteId));
    setSnackbar({
      open: true,
      message: "Category deleted successfully",
      severity: "success",
    });
    setConfirmOpen(false);
    setDeleteId(null);
  };

  useEffect(() => {
    dispatch(GetAllCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleAdd = () => {
    setEditCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editCategory) {
        await dispatch(UpdateCategory(editCategory._id, data));
        setSnackbar({
          open: true,
          message: "Category updated successfully",
          severity: "success",
        });
      } else {
        await dispatch(CreateCategory(data));
        await dispatch(GetAllCategories());
        setSnackbar({
          open: true,
          message: "Category created successfully",
          severity: "success",
        });
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit category",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button onClick={handleAdd} style={authButton}>
          Add Category
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1e3a8a", color: "#fff" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>

            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No categories found
              </td>
            </tr>
          )}
          {categories?.map((cat, index) => (
            <tr key={cat._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{cat?.name}</td>

              <td style={tdStyle}>
                <button
                  onClick={() => handleEdit(cat)}
                  style={actionButtonStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(cat._id)}
                  style={{ ...actionButtonStyle, backgroundColor: "#ef4444" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={editCategory || null}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
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

const authButton = {
  background: "#facc15",
  color: "#000",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const actionButtonStyle = {
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "4px",
  cursor: "pointer",
};
