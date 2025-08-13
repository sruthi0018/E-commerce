import React, { useEffect, useState } from "react";
// import AddCategoryModal from "./addCategory";
import { CreateCategory, GetAllCategories } from "../redux/slices/category";
import { useDispatch, useSelector } from "react-redux";
// import { AddSubCategoryModal } from "./addSubCategory";

// import { GetAllSubCategories } from "../redux/slices/subCategory";

// import AddProductModal from "./addProduct";
import ProductCard from "./ProductCard";
// import { useAuth } from "../../context/auth";
// import { GetWishlist } from "../../redux/slices/wishList";

export default function ProductList({ products }) {
  const dispatch = useDispatch();
//   const { user } = useAuth();
//   console.log(user, "usr");
//   const userId = user?.id;

// useEffect(() => {
//   if (userId) {
//     dispatch(GetWishlist(userId));
//   }
// }, [userId, dispatch]);
  
  useEffect(() => {
    
    dispatch(GetAllCategories());
    // dispatch(GetAllSubCategories());
  }, [dispatch]);
  const { categories } = useSelector((state) => state.categories);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const handleAddCategory = () => setShowCategoryModal(true);
  const handleAddSubCategory = () => setShowSubCategoryModal(true);
  const handleAddProduct = () => setShowProductModal(true);
  const handleCloseModal = () => setShowCategoryModal(false);
  const handleCloseSubCatModal = () => setShowSubCategoryModal(false);
  const handleCloseProductModal = () => setShowProductModal(false);

  const handleCategorySubmit = async (categoryName) => {
    try {
      console.log("Create category:", categoryName);
      await dispatch(CreateCategory({ name: categoryName }));
      await dispatch(GetAllCategories());
    } catch (error) {
      console.error("Category creation failed:", error.message);
    }
  };

  return (
    <main style={{ flex: 1, padding: "20px" }}>
      {/* <div style={{   marginBottom: "20px", 
  display: "flex", 
  gap: "15px", 
  justifyContent: "flex-end" }}>
        <button style={styles.button} onClick={handleAddCategory}>
          Add Category
        </button>
        <button style={styles.button} onClick={handleAddSubCategory}>
          Add Subcategory
        </button>
        <button style={styles.button} onClick={handleAddProduct}>
          Add Product
        </button>
      </div> */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p style={{ textAlign: "center" }}>No Product Found</p>
      )}
      {/* <AddCategoryModal
        open={showCategoryModal}
        onClose={handleCloseModal}
        onSubmit={handleCategorySubmit}
      />
      <AddSubCategoryModal
        open={showSubCategoryModal}
        onClose={handleCloseSubCatModal}
        categories={categories}
      />
      <AddProductModal
        open={showProductModal}
        onClose={handleCloseProductModal}
      /> */}
    </main>
  );
}

const styles = {
  button: {
    backgroundColor: "#facc15",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
