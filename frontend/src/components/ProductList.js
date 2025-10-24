import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } 
  };

  const addToCart = async (productId, quantity = 1) => { 
    try {
      await axios.post("http://localhost:5000/api/cart", {
        productId,
        quantity,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Available Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-green-600 mb-2">
                ${product.price}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Stock: {product.stock}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Category: {product.category}
              </p>
              <button
                onClick={() => addToCart(product._id)}
                disabled={product.stock === 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  product.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
