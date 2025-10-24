import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-light-green-600 text-light-green-800 px-7 py-5 mb-8">
      <div className="text-xl font-bold">
        <Link
          to="/"
          className="text-white font-bold hover:text-light-green-600"
        >
          Greeny Market 🧺
        </Link>
      </div>
      <ul className="flex items-center space-x-4">
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <li>
                  <Link
                    to="/"
                    className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
                  >
                    Manage Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
                  >
                    All Orders
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
              </>
            )}
            <li>
              <span className="text-white font-semibold">
                {user.username} ({user.role})
              </span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-light-green-500 text-white font-bold hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="bg-light-green-200 text-light-green-800 hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
              >
                Login 🔐
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="bg-light-green-200 text-light-green-800 hover:bg-light-green-300 hover:text-light-green-800 px-3 py-2 rounded transition-colors"
              >
                Register 🔑
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
