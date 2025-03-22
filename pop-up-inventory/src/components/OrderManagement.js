import React, { useState, useEffect } from 'react';
import axios from '../axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ customerName: '', productId: '', quantity: '' });

  useEffect(() => {
    // Fetch all orders from the backend
    axios.get('/orders')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/orders', newOrder);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Order Management</h2>
      <h3>Place New Order</h3>
      <form onSubmit={handlePlaceOrder}>
        <input
          type="text"
          name="customerName"
          value={newOrder.customerName}
          onChange={handleOrderChange}
          placeholder="Customer Name"
        />
        <input
          type="text"
          name="productId"
          value={newOrder.productId}
          onChange={handleOrderChange}
          placeholder="Product ID"
        />
        <input
          type="number"
          name="quantity"
          value={newOrder.quantity}
          onChange={handleOrderChange}
          placeholder="Quantity"
        />
        <button type="submit">Place Order</button>
      </form>

      <h3>Existing Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>Customer: {order.customerName}</p>
            <p>Product: {order.product.name}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Status: {order.orderStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;
