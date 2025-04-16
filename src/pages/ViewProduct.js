import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewProduct = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error-message">{error}</p>;


  const onAddToCart = (product) => {
    
    const user=JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to add products to cart');
      return;
    }


    const response = axios.post('http://localhost:5000/api/cart/add', {
      productId: product.ProductId,
      userId: user.UserId,
      quantity: 1,
    });
    response.then((res) => {
      if (res.status === 200) {
        alert('Product added to cart');
      } else {
        alert('Failed to add product to cart');
      }
    }).catch((err) => {
      alert('Failed to add product to cart');
    });
  };

  return (
    <div className="view-product-page">
      {product ? (
        <div className="product-details">
          
          {product.ImageUrl && (
            <img src={product.ImageUrl} alt={product.Name} className="product-image" />
          )}
          <div className="product-info">
          <h1>{product.Name}</h1>
          <p><strong>Description:</strong> {product.Description || 'No description available'}</p>
          <p><strong>Price:</strong> ${product.Price.toFixed(2)}</p>
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
            Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ViewProduct;
