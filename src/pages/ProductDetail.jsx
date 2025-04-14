import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingBag, Search } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axios';

const ProductDetails = () => {
  const { id } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axiosInstance.get(`/product/${id}`);
        const data = res.data;
        if (data.success) {
          setProduct(data.product);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!product) return <div className="text-center p-4 text-red-500">Product not found.</div>;

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post('/cart/add', {
          products: [
            {
              productId: product._id,
              quantity: 1, // default quantity
            },
          ],
        }
      );

      if (response.data.success) {
        alert("Product added to cart successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={
          product?.colors?.[0]?.images?.[0] || "heroimg.jpeg"
        }
        alt={product.name}
        className="w-full h-64 object-contain mb-4 rounded-lg shadow-md"
      />
      <p className="text-gray-700 mb-2"><strong>Category:</strong> {product.category}</p>
      <p className="text-gray-700 mb-2"><strong>Price:</strong> ₹{product.price}</p>
      <p className="text-gray-700 mb-2"><strong>Description:</strong> {product.description}</p>
      <p className="text-gray-700 mb-2"><strong>Gender:</strong> {product.gender}</p>
      <div className="mt-4">
        <strong>Available Colors:</strong>
        <ul className="flex gap-2 mt-2">
          {product.colors.map((color, index) => (
            <li key={index} className="px-3 py-1 border rounded-full bg-gray-100">
              {color.colorName}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart 🛒
      </button>
    </div>
  );
};

export default ProductDetails;
