import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          params: { userId: user.UserId },
        });
        setOrders(response.data);
        console.log('Orders:', response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders: ', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="my-orders-section">
      <h2 className="section-title">My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.OrderId} className="order-card">
            <h3 className="order-id">Order ID: {order.OrderId}</h3>
            <p className="order-date">Order Date: {new Date(order.OrderDate).toLocaleDateString()}</p>
            <p className="shipping-address">Shipping Address: {order.ShippingAddress}</p>

            <h4 className="order-items-header">Items:</h4>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.ProductId}>
                    <td>{item.Name}</td>
                    <td>{item.Quantity}</td>
                    <td>${item.Price}</td>
                    <td>${(item.Quantity * item.Price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="order-total">
              Total: ${order.items.reduce((acc, item) => acc + item.Quantity * item.Price, 0).toFixed(2)}
            </h4>
          </div>
        ))
      ) : (
        <p className="no-orders">You have no orders yet.</p>
      )}
    </div>
  );
};

export default MyOrders;
