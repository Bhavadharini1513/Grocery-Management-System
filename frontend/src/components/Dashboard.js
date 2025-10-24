import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ProductList from "./ProductList";

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <ProductList />;
};

export default Dashboard;
