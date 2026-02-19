import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  resetProductStatus,
} from "../../slice/admin/allProductsSlice";
import "../../style/admin/AllProducts.css";

const AllProducts = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImageName, setEditImageName] = useState("");

  const {
    products,
    loading,
    error,
    updateSuccess,
    deleteSuccess,
  } = useSelector((state) => state.allProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess || deleteSuccess) {
      setEditingProduct(null);
      setEditFormData({ title: "", author: "", price: "", description: "" });
      setEditImageFile(null);
      setEditImageName("");
      
      // Force refresh to ensure latest data (especially image URLs)
      dispatch(fetchAllProducts());
      
      const timer = setTimeout(() => {
        dispatch(resetProductStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, deleteSuccess, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      author: product.author,
      price: product.price,
      description: product.description,
    });
    setEditImageFile(null);
    setEditImageName("");
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({ title: "", author: "", price: "", description: "" });
    setEditImageFile(null);
    setEditImageName("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImageName(file.name);
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    console.log("Submitting update for product:", editingProduct.id);
    const formData = new FormData();
    formData.append("title", editFormData.title);
    formData.append("author", editFormData.author);
    formData.append("price", editFormData.price.toString()); // Ensure string for FormData
    formData.append("description", editFormData.description);
    if (editImageFile) {
      formData.append("image", editImageFile);
      console.log("Including new image file:", editImageFile.name);
    }

    // Log entries for debugging
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    dispatch(updateProduct({ productId: editingProduct.id, formData }));
  };

  if (loading && products.length === 0) return <div className="loading">Loading products...</div>;
  if (error && products.length === 0) return <div className="error">Error: {error}</div>;

  return (
    <div className="all-products-container">
      {/* Edit Modal / Form Overlay */}
      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3 className="edit-modal-title">Edit Product</h3>
            <form onSubmit={handleUpdateSubmit} className="edit-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input
                        type="text"
                        name="author"
                        value={editFormData.author}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        value={editFormData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Change Image</label>
                    <div 
                        className="file-upload-wrapper"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {editImageName || "Click to upload new image"}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="edit-actions">
                    <button type="button" onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                    <button type="submit" className="btn-save" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <h2 className="section-title">All Products</h2>
      {products.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="product-image"
                  onError={(e) => { e.target.src = "https://placehold.co/150?text=No+Image"; }} 
                />
              </div>
              <div className="product-info">
                <h4 className="product-title">{product.title}</h4>
                <p className="product-author">by {product.author}</p>
                <p className="product-price">${product.price}</p>
                <div className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
