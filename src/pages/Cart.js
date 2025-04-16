import React, { useState, useEffect } from "react";
import axios from "axios";
import Checkout from "../components/Checkout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login to view cart");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          params: {
            userId: user.UserId,
          },
        });
        setCartItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };
    fetchCartItems();
  }, []);

  const ClearCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to view cart");
      return;
    }

    try {
      const response = await axios.delete("http://localhost:5000/api/cart", {
        params: {
          userId: user.UserId,
        },
      });
      if (response.status === 200) {
        setCartItems([]);
        alert("Cart cleared successfully");
      } else {
        alert("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart: ", error);
      alert("Failed to clear cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to view cart");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/cart/update", {
        userId: user.UserId,
        productId: productId,
        quantity: quantity,
      });
      if (response.status === 200) {
        const updatedCartItems = cartItems.map((item) => {
          if (item.ProductId === productId) {
            item.Quantity = quantity;
          }
          return item;
        });
        setCartItems(updatedCartItems);
       
      } else {
        alert("Failed to update quantity");
      }
    }
    catch (error) {
      console.error("Error updating quantity: ", error);
      alert("Failed to update quantity");
    }
  };








  const RemoveFromCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to view cart");
      return;
    }

    try {
      const response = await axios.delete("http://localhost:5000/api/cart/remove", {
        data: {
          userId: user.UserId,
          productId: productId,
        },
      });
      if (response.status === 200) {
        const updatedCartItems = cartItems.filter((item) => item.ProductId !== productId);
        setCartItems(updatedCartItems);
        alert("Item removed from cart successfully");
      } else {
        alert("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart: ", error);
      alert("Failed to remove item from cart");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((cartItem, index) => (
            <div key={index} className="cart-item">
              <h3>{cartItem.Name}</h3>
              <p>Quantity: {cartItem.Quantity}</p>
              <input type="number" value={cartItem.Quantity} 
                onChange={(e) => {
                  updateQuantity(cartItem.ProductId, e.target.value);
                }}
                min={1}
              />
              <p>Total Price: ${cartItem.Price * cartItem.Quantity}</p>
              <button className="remove-from-cart-btn" onClick={() => RemoveFromCart(cartItem.ProductId)}>
                Remove
              </button>
              
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-cart">Your cart is empty</p>
      )}
      <div className="cart-actions">
        <button className="clear-cart-btn" onClick={ClearCart}>
          Clear Cart
        </button>
      </div>
      <Checkout cartItems={cartItems} />
    </div>
  );
};

export default Cart;
