import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetProductState,
} from "../../slice/admin/addProductSlice";
import "../../style/admin/AddProduct.css";

const AddProduct = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // --- Local State ---
  const [selectedImageName, setSelectedImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [productData, setProductData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // --- Redux State ---
  const {
    loading: addLoading,
    success: addSuccess,
    error: addError,
  } = useSelector((state) => state.addProduct);

  // --- Effects ---
  useEffect(() => {
    if (addSuccess) {
      // Reset local form state
      setProductData({ title: "", author: "", price: "", description: "" });
      setImageFile(null);
      setSelectedImageName("");
      setFieldErrors({});
      // Reset redux state after 3 seconds
      const timer = setTimeout(() => {
        dispatch(resetProductState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addSuccess, dispatch]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSelectedImageName(file.name);
      if (fieldErrors.image) {
        setFieldErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!productData.title.trim()) errors.title = "Title is required";
    if (!productData.author.trim()) errors.author = "Author is required";
    if (!productData.price) errors.price = "Price is required";
    if (!productData.description.trim())
      errors.description = "Description is required";
    if (!imageFile) errors.image = "Product image is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Create FormData because the backend uses Form(...) and File(...)
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("author", productData.author);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    dispatch(createProduct(formData));
  };

  return (
    <div className="add-product-container">
      <section className="add-product-card">
        <h3 className="add-product-title">Add New Product</h3>

        {addSuccess && (
          <p className="success-messagea">Product added successfully!</p>
        )}

        {addError && <p className="error-message">{addError}</p>}

        <form onSubmit={handleAddProductSubmit} noValidate>
          <div className="add-product-form-grid">
            {/* Left Column */}
            <div className="form-column">
              {["title", "author", "price"].map((field) => (
                <div key={field} className="form-group">
                  <label className="form-label">
                    {field === "title" ? "Book Title" : field}
                  </label>
                  <input
                    type={field === "price" ? "number" : "text"}
                    name={field}
                    step={field === "price" ? "0.01" : undefined}
                    value={productData[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field}`}
                    className="form-input"
                  />
                  {fieldErrors[field] && (
                    <span className="field-error">{fieldErrors[field]}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Book Image</label>
                <div
                  className="image-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="image-upload-text">
                    {selectedImageName || "Click to upload image"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                {fieldErrors.image && (
                  <span className="field-error">{fieldErrors.image}</span>
                )}
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="form-textarea"
                ></textarea>
                {fieldErrors.description && (
                  <span className="field-error">{fieldErrors.description}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={addLoading}
              className="btn-add-product"
            >
              {addLoading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProduct;
