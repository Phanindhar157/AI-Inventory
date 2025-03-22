import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from '../axios';

const socket = io('http://localhost:5002'); // Connect to backend WebSocket server

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products from the backend
  useEffect(() => {
    axios.get('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));

    // Listen for stock updates in real-time
    socket.on('stockUpdated', (productId) => {
      console.log('Stock updated for product:', productId);
      fetchProductData(productId); // Fetch the updated product data
    });

    // Cleanup the WebSocket connection
    return () => {
      socket.off('stockUpdated');
    };
  }, []);

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.get(`/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, ...response.data } : product
        )
      );
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
