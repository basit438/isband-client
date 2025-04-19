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
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axiosInstance.get(`/product/${id}`);
        const data = res.data;
        if (data.success) {
          setProduct(data.product);
          // Set initial color and images
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
            setSelectedImages(data.product.colors[0].images);
          }
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

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedImages(color.images);
  };

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
      
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <img
            src={selectedImages?.[0] || "heroimg.jpeg"}
            alt={product.name}
            className="w-full h-96 object-contain rounded-lg shadow-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {selectedImages?.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} view ${index + 2}`}
              className="w-full h-44 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="text-gray-700 mb-2"><strong>Price:</strong> ₹{product.price}</p>
          <p className="text-gray-700 mb-2"><strong>Description:</strong> {product.description}</p>
          <p className="text-gray-700 mb-2"><strong>Gender:</strong> {product.gender}</p>
        </div>

        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Available Colors</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className={`px-4 py-2 rounded-full border transition-all ${selectedColor?.colorName === color.colorName
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-red-300'}`}
                >
                  {color.colorName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart 🛒
      </button>
    </div>
  );
};

export default ProductDetails;
