import React from "react";

const Categories = ({ categories, onSelectCategory }) => {
  return (
    <div className="category-row">
      {categories.map((cat) => (
        <button
          key={cat}
          className="category-pill"
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Categories;
