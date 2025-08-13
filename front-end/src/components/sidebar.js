import React, { useState } from "react";

export default function Sidebar({ categories, onFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (e, categoryId) => {
    let updatedCategories;
    if (e.target.checked) {
      updatedCategories = [...selectedCategories, categoryId];
    } else {
      updatedCategories = selectedCategories.filter((id) => id !== categoryId);
    }
    setSelectedCategories(updatedCategories);
    onFilterChange(updatedCategories); 
  };

  return (
    <aside style={{ width: "250px", padding: "20px", borderRight: "1px solid #ddd" }}>
      <h3>All Categories</h3>
      {categories.map((cat) => (
        <div key={cat._id} style={{ marginBottom: "10px" }}>
          <input
            type="checkbox"
            id={cat._id}
            checked={selectedCategories.includes(cat._id)}
            onChange={(e) => handleCheckboxChange(e, cat._id)}
          />
          <label htmlFor={cat._id} style={{ marginLeft: "8px" }}>
            {cat.name}
          </label>
        </div>
      ))}
    </aside>
  );
}
