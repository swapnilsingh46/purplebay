import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createListing as apiCreateListing } from "../services/listingService";
import api from "../services/api"; // axios instance for uploads
import { createListingValidator } from "../utils/validators";
import { AuthContext } from "../context/AuthContext";

export default function CreateListing() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // form state for listing fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); // selected category id
  const [categories, setCategories] = useState([]); // categories from backend
  const [images, setImages] = useState([]); // File objects for upload
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // GET /api/categories
        const res = await api.get("/categories");
        setCategories(res.data);
        // set first category as default if available
        if (res.data.length > 0) setCategoryId(res.data[0]._id);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // protect route: require login to create listing
  if (!user) return <div>Please login to create a listing.</div>;

  // handle file input and limit to 5 images
  const handleFiles = (e) => {
    setImages(Array.from(e.target.files).slice(0, 5));
  };

  // submit the form to create a listing
  const submit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // validate input using yup validator
      await createListingValidator.validate(
        {
          title,
          description,
          startingPrice: Number(price),
          category: categoryId,
        },
        { abortEarly: false }
      );

      setLoading(true);

      // upload images first and collect returned paths
      let uploadedPaths = [];
      if (images.length) {
        const fd = new FormData();
        images.forEach((f) => fd.append("images", f));
        const res = await api.post("/uploads", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedPaths = res.data.files || [];
      }

      // prepare listing payload
      const listingData = {
        title,
        description,
        price: Number(price),
        category: categoryId, // send ObjectId for category
        images: uploadedPaths,
      };

      // create listing via API service
      const created = await apiCreateListing(listingData);
      alert("Listing created successfully!");
      navigate(`/listings/${created._id}`);
    } catch (err) {
      // handle validation errors from yup
      if (err.inner) {
        const errs = {};
        err.inner.forEach((e) => (errs[e.path] = e.message));
        setErrors(errs);
      } else {
        console.error("create listing error", err);
        alert(err.response?.data?.msg || "Create listing failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-75 mx-auto">
      <h3>Create Listing</h3>
      <form onSubmit={submit}>
        {/* Title input */}
        <input
          className="form-control my-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <small className="text-danger">{errors.title}</small>}

        {/* Description of the product */}
        <textarea
          className="form-control my-2"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <small className="text-danger">{errors.description}</small>}

        {/* Price input */}
        <input
          className="form-control my-2"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.startingPrice && <small className="text-danger">{errors.startingPrice}</small>}

        {/* Category dropdown - categories are provided by backend */}
        <select
          className="form-control my-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <small className="text-danger">{errors.category}</small>}

        {/* Image upload (limit 5) */}
        <div className="mb-2">
          <label className="form-label">Images (up to 5)</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
          />
        </div>

        {/* Submit button */}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

