import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts();
      fetchOrders(); 
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        editingProduct
      );
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status,
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Manage Products
          </h2>
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={
                editingProduct
                  ? editingProduct.description
                  : newProduct.description
              }
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  : setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
              }
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Stock"
              value={editingProduct ? editingProduct.stock : newProduct.stock}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      stock: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, stock: e.target.value })
              }
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={
                editingProduct ? editingProduct.category : newProduct.category
              }
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, category: e.target.value })
              }
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct ? editingProduct.image : newProduct.image}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, image: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-green-600 font-bold mb-1">
                  Price: ${product.price}
                </p>
                <p className="text-gray-500 mb-1">Stock: {product.stock}</p>
                <p className="text-gray-500 mb-4">
                  Category: {product.category}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Manage Orders
          </h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Order #{order._id}
                </h3>
                <p className="text-gray-600 mb-1">
                  Customer: {order.user.username}
                </p>
                <p className="text-green-600 font-bold mb-2">
                  Total: ${order.total}
                </p>
                <p className="text-gray-500 mb-4">Status: {order.status}</p>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
