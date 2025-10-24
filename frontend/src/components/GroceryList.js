import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, filterCategory]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    setFilteredItems(filtered);
  };

  const togglePurchased = async (id, purchased) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${id}`, {
        purchased: !purchased,
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <div className="grocery-list">
      <h1>Grocery Items</h1>
      <Link to="/add-item" className="btn">
        Add New Item
      </Link>
      <div className="filters">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <ul className="item-list">
        {filteredItems.map((item) => (
          <li key={item._id} className={item.purchased ? "purchased" : ""}>
            <div className="item-info">
              <span>
                {item.name} ({item.quantity}) - {item.category}
              </span>
            </div>
            <div className="item-actions">
              <button onClick={() => togglePurchased(item._id, item.purchased)}>
                {item.purchased ? "Unmark" : "Mark Purchased"}
              </button>
              <Link to={`/edit-item/${item._id}`} className="btn-small">
                Edit
              </Link>
              <button
                onClick={() => deleteItem(item._id)}
                className="btn-small delete"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
