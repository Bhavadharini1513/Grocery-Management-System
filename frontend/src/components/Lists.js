import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Lists = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/lists");
      setLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteList = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/lists/${id}`);
      fetchLists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="lists">
      <h1>Grocery Lists</h1>
      <Link to="/add-list" className="btn">
        Create New List
      </Link>
      <ul className="list-list">
        {lists.map((list) => (
          <li key={list._id}>
            <div className="list-info">
              <h3>{list.name}</h3>
              <p>{list.description}</p>
              <span>{list.items.length} items</span>
            </div>
            <div className="list-actions">
              <Link to={`/list/${list._id}`} className="btn-small">
                View
              </Link>
              <button
                onClick={() => deleteList(list._id)}
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

export default Lists;
