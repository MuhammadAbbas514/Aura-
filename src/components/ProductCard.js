import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductCard = ({ product}) => {


  const onAddtoFav = (product) => {
    const user=JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to add products to favourites');
      return;
    }
    const response = axios.post('http://localhost:5000/api/favourites/add', {
      userId: user.UserId,
      productId: product.ProductId,
    });
    response.then((res) => {
       if (res.status === 200) {
        alert(res.data.message);
      }
      else {
        alert('Failed to add product to favourites');
      }

  }
    ).catch((err) => {
      alert('Failed to add product to favourites');
    });
  };
  
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
  return(

  
  <div className="product-card">
    <Link to={`/products/${product.ProductId}`} className="product-link">
    <img src={product.ImageUrl} alt={product.Name} className="product-image" />
    <p className="product-name">{product.Name}</p>
    <p className="product-price">${product.Price}</p>
    </Link>
    <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
      Add to Cart
    </button>
    <button className="add-to-fav-btn" onClick={() => onAddtoFav(product)}>
      Add to Favourites
    </button>
  </div>
)};

export default ProductCard;
