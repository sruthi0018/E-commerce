import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSingleProduct, GetProductById } from "../redux/slices/product";
import { addToCart, removeFromCart, updateCartQty } from "../redux/slices/cart";
import CheckoutModal from "../components/checkOut";
import Header from "../components/header";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading } = useSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);


  useEffect(() => {
    if (id) dispatch(GetProductById(id));
    return () => dispatch(clearSingleProduct());
  }, [id, dispatch]);


  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (loading || !product || Object.keys(product).length === 0) {
    return <div style={styles.loading}>Loading product...</div>;
  }

  const mainImage = selectedImage
    ? process.env.REACT_APP_UPLOAD_URL + selectedImage
    : "";


  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    navigate("/checkout");
  };


  const handleBuyNow = () => {
    setShowCheckout(true);
  };

  return (
    <>
    <Header isHome="true"/>
    <div style={styles.page}>
      <div style={styles.container}>
       
        <div style={styles.imageBox}>
          <img src={mainImage} alt={product.title} style={styles.mainImage} />
          <div style={styles.thumbnailRow}>
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={process.env.REACT_APP_UPLOAD_URL + img}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(img)}
                style={{
                  ...styles.thumbnail,
                  border:
                    selectedImage === img
                      ? "2px solid #1e3a8a"
                      : "1px solid #ccc",
                }}
              />
            ))}
          </div>
        </div>

        
        <div style={styles.details}>
          <h1 style={styles.title}>{product.title}</h1>
          <p style={styles.category}>Category: {product.category?.name}</p>
          <p style={styles.price}>₹{product.price}</p>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.stock}>
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>

          <div style={styles.actions}>
            <button
              style={styles.cartBtn}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>

            <button
              style={styles.buyBtn}
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          items={product}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
    </>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "#f9fafb",
  },
  container: {
    display: "flex",
    gap: "40px",
    maxWidth: "1200px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  imageBox: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    maxWidth: "400px",
    height: "400px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
  },
  thumbnailRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  thumbnail: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "6px",
    cursor: "pointer",
  },
  details: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "10px",
  },
  category: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "5px",
  },
  price: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "10px",
  },
  stock: {
    fontSize: "14px",
    color: "#10b981",
    marginBottom: "15px",
  },
  actions: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },
  cartBtn: {
    padding: "10px 20px",
    backgroundColor: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  buyBtn: {
    padding: "10px 20px",
    backgroundColor: "#facc15",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
};