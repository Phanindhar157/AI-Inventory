import React, { useState } from 'react';
import axios from '../axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    vendorId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/products', product);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Product Description"
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Product Price"
        />
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
        />
        <input
          type="text"
          name="vendorId"
          value={product.vendorId}
          onChange={handleChange}
          placeholder="Vendor ID"
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
