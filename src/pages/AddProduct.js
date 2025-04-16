import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    Name: '',
    Description: '',
    Price: '',
    ImageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value || '', // Ensuring empty strings rather than undefined or null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!product.Name || !product.Description || !product.Price) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/products', product);

      setProduct({
        Name: '',
        Description: '',
        Price: '',
        ImageUrl: '',
      });
      setLoading(false);

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError('Failed to add product. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('Failed to add product. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="add-product-section">
      <h2>Add New Product</h2>

      {success && <p className="success-message">Product added successfully!</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="Name" // name should match state keys (case-sensitive)
            value={product.Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="Description" // name should match state keys (case-sensitive)
            value={product.Description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="Price" // name should match state keys (case-sensitive)
            value={product.Price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="ImageUrl" // name should match state keys (case-sensitive)
            value={product.ImageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
