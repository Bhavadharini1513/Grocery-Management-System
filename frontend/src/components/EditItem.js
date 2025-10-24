import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    category: "",
    purchased: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/items/${id}`);
      setFormData({
        name: res.data.name,
        quantity: res.data.quantity,
        category: res.data.category,
        purchased: res.data.purchased,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const { name, quantity, category, purchased } = formData;

  const onChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/items/${id}`, formData);
      navigate("/items");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update item");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Edit Grocery Item
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Item Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={onChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Bakery">Bakery</option>
            <option value="Pantry">Pantry</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="purchased"
            name="purchased"
            checked={purchased}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="purchased"
            className="ml-2 block text-sm text-gray-900"
          >
            Purchased
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditItem;
