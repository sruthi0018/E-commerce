import React from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";


export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const productImage = Array.isArray(product.images)
    ? product.images[0]
    : product.images;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
      }}
    >

      {productImage && (
        <img
          src={`${process.env.REACT_APP_UPLOAD_URL}${productImage}`}
          alt={product.title}
          style={{
            width: "100%",
            borderRadius: "8px",
            height: "150px",
            objectFit: "cover",
          }}
        />
      )}
      <h4 style={{ margin: "10px 0",color:"#1e3a8a"}}>{product.title}</h4>
      <p style={{ fontWeight: "bold" }}>₹{product.price}</p>
    </div>
  );
}
