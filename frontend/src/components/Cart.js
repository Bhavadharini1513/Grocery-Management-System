import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      } else {
        await axios.put(`http://localhost:5000/api/cart/${productId}`, {
          quantity,
        });
      }
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const checkout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/orders");
      alert("Order placed successfully!");
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Shopping Cart
      </h1>
      {cart.items.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {item.product.description}
                  </p>
                  <p className="text-lg font-medium text-gray-700">
                    Price: ${item.product.price}
                  </p>
                  <p className="text-lg font-medium text-gray-700">
                    Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Total: ${total.toFixed(2)}
            </h2>
            <button
              onClick={checkout}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
