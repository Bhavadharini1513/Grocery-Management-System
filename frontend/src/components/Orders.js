import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateBill = (order) => {
    const billContent = `
GROCERY MANAGEMENT SYSTEM - BILL
================================

Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Customer: ${user.role === "admin" ? order.user.username : user.username}

Items:
${order.items
  .map(
    (item) =>
      `${item.product.name} - Quantity: ${item.quantity} - Price: $${
        item.price
      } - Subtotal: $${(item.price * item.quantity).toFixed(2)}`
  )
  .join("\n")}

Total: $${order.total.toFixed(2)}
Status: ${order.status}

Thank you for shopping with us!
    `;

    const blob = new Blob([billContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill_${order._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {user?.role === "admin" ? "All Orders" : "My Orders"}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Order #{order._id.slice(-8)}
            </h3>
            <p className="text-gray-600 mb-2">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            {user?.role === "admin" && (
              <p className="text-gray-600 mb-2">
                Customer: {order.user.username}
              </p>
            )}
            <p className="text-gray-600 mb-2">
              Status:{" "}
              <span
                className={`font-medium ${
                  order.status === "completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Total: ${order.total.toFixed(2)}
            </p>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
              {order.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between py-1 border-b border-gray-200"
                >
                  <span className="text-gray-700">{item.product.name}</span>
                  <span className="text-gray-600">Qty: {item.quantity}</span>
                  <span className="font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => generateBill(order)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download Bill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
