import React from 'react';
import axios from 'axios';

const Checkout = ({ cartItems }) => {
  const [address, setAddress] = React.useState('');

  const PlaceOrder = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to place order');
      return;
    }
    const order = {
      userId: user.UserId,
      shippingAddress: address,
    };
    axios
      .post('http://localhost:5000/api/orders', order)
      .then((response) => {
        if (response.status === 200) {
          alert('Order placed successfully');
          window.location.href = '/cart';
        } else {
          alert('Failed to place order');
        }
      })
      .catch((error) => {
        console.error('Error placing order: ', error);
        alert('Failed to place order');
      });
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      <table className="cart-summary">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td>{item.Name}</td>
              <td>{item.Quantity}</td>
              <td>${(item.Price * item.Quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grand-total">
        <h3>
          Grand Total: $
          {cartItems
            .reduce((acc, item) => acc + item.Price * item.Quantity, 0)
            .toFixed(2)}
        </h3>
      </div>
      <form className="checkout-form" onSubmit={PlaceOrder}>
        <label htmlFor="address">Shipping Address:</label>
        <input
          type="text"
          id="address"
          required
          onChange={(e) => setAddress(e.target.value)}
          className="address-input"
        />
        <button className="checkout-btn" type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
