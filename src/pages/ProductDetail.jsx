import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingBag, ChevronDown, ChevronUp } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axios';
import AddToCart from '../components/AddToCart';

const ProductDetails = () => {
  const { id } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedColorImages, setSelectedColorImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  // Removed quantity state as it's now managed in the AddToCart component
  const [showDescription, setShowDescription] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showCare, setShowCare] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axiosInstance.get(`/product/${id}`);
        const data = res.data;
        if (data.success) {
          setProduct(data.product);
          // Set the first color as default selected color
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
            setSelectedColorImages(data.product.colors[0].images || []);
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
    checkIfInWishlist();
  }, [id]);
  
  // Check if product is in wishlist
  const checkIfInWishlist = async () => {
    try {
      const res = await axiosInstance.get("/wishlist/");
      if (res.data.wishlist) {
        const isProductInWishlist = res.data.wishlist.some(item => item._id === id);
        setIsInWishlist(isProductInWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };
  
  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedColorImages(color.images || []);
    setCurrentImageIndex(0); // Reset to first image when color changes
  };
  
  // Navigate through images
  const nextImage = () => {
    if (selectedColorImages.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedColorImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (selectedColorImages.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedColorImages.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div></div>;
  if (!product) return <div className="text-center p-8 text-red-500 font-medium">Product not found.</div>;

  // Display a notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-black text-white py-2 px-4 rounded shadow-lg z-50 animate-fade-in-out';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleWishlistToggle = async () => {
    try {
      const response = await axiosInstance.post('/wishlist/add', {
        productId: product._id,
      });

      if (response.data.success) {
        // Toggle the wishlist state
        const newWishlistState = !isInWishlist;
        setIsInWishlist(newWishlistState);
        
        if (newWishlistState) {
          showNotification('Added to your favorites');
        } else {
          showNotification('Removed from your favorites');
        }
      } else {
        showNotification(response.data.message || 'Error updating favorites');
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      showNotification('Failed to update favorites');
    }
  };
  
  // handleAddToCart is now handled by the AddToCart component
  
  // Handle image zoom functionality
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  // handleQuantityChange is now handled by the AddToCart component


  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to="/productlist" className="hover:underline">{product.category}</Link> / 
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Product Images */}
        <div className="md:w-2/3">
          <div className="sticky top-24">
            {/* Main Image with Zoom */}
            <div 
              className="relative overflow-hidden mb-2 h-[500px] md:h-[600px] bg-gray-50"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              ref={imageRef}
            >
              <img
                src={selectedColorImages[currentImageIndex] || "heroimg.jpeg"}
                alt={`${product.name} - ${selectedColor?.colorName || 'Default'}`}
                className="w-full h-full object-contain transition-opacity"
              />
              
              {/* Zoomed image overlay */}
              {isZoomed && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${selectedColorImages[currentImageIndex] || "heroimg.jpeg"})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: '200%',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.9,
                  }}
                />
              )}
              
              {/* Image Navigation Arrows */}
              {selectedColorImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button 
                    onClick={prevImage}
                    className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 hover:text-gray-900 transition-all"
                  >
                    ❮
                  </button>
                  <button 
                    onClick={nextImage}
                    className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 hover:text-gray-900 transition-all"
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {selectedColorImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {selectedColorImages.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 flex-shrink-0 cursor-pointer ${currentImageIndex === index ? 'border-2 border-black' : 'border border-gray-200'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Product Info */}
        <div className="md:w-1/3">
          <div className="sticky top-24">
            <h1 className="text-2xl font-normal mb-2">{product.name}</h1>
            <p className="text-xl font-semibold mb-4">₹{product.price}</p>
            <p className="text-sm text-gray-500 mb-6">{product.category} / {product.gender}</p>
            
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color: <span className="font-normal">{selectedColor?.colorName}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleColorSelect(color)}
                    className={`
                      cursor-pointer transition-all duration-200 
                      w-12 h-12 border-2 
                      ${selectedColor?.colorName === color.colorName 
                        ? 'border-black' 
                        : 'border-transparent hover:border-gray-300'}
                    `}
                  >
                    <div 
                      className="w-full h-full" 
                      style={{ backgroundColor: color.colorHex || '#ccc' }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Size Selection if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size: <span className="font-normal">{selectedSize?.size || 'Select a size'}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`border px-3 py-2 min-w-[40px] text-center cursor-pointer transition-colors
                        ${selectedSize?.size === size.size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-black'}
                      `}
                    >
                      {size.size}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add to Cart and Wishlist Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              {/* Using the new AddToCart component with color and size */}
              <AddToCart 
                productId={product._id}
                buttonClassName="w-full bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium"
                onAddToCart={(quantity) => showNotification(`Added ${quantity} item(s) to your shopping bag`)}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
              />
              <button 
                onClick={handleWishlistToggle}
                className={`w-full border py-3 px-6 flex items-center justify-center gap-2 transition-colors
                  ${isInWishlist 
                    ? 'border-red-500 text-red-500 hover:bg-red-50' 
                    : 'border-black hover:bg-gray-50'}`}
              >
                <Heart 
                  size={18} 
                  className={isInWishlist ? "text-red-500 fill-current" : ""} 
                />
                <span>{isInWishlist ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
            
            {/* Accordion Sections */}
            <div className="border-t border-gray-200">
              {/* Description Section */}
              <div className="py-4 border-b border-gray-200">
                <button 
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium">Description</span>
                  {showDescription ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showDescription && (
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </div>
                )}
              </div>
              
              {/* Details Section */}
              <div className="py-4 border-b border-gray-200">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium">Details</span>
                  {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showDetails && (
                  <div className="mt-2 text-sm text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Brand: {product.brand || 'Not specified'}</li>
                      <li>Material: {product.material || 'Not specified'}</li>
                      <li>Type: {product.type || 'Not specified'}</li>
                      {product.careInstructions && <li>Care: {product.careInstructions}</li>}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Care Instructions Section */}
              <div className="py-4 border-b border-gray-200">
                <button 
                  onClick={() => setShowCare(!showCare)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium">Care Instructions</span>
                  {showCare ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showCare && (
                  <div className="mt-2 text-sm text-gray-600">
                    {product.careInstructions || 'Wash according to label instructions. Check product label for detailed care information.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* You May Also Like Section */}
      <div className="mt-16">
        <h2 className="text-xl font-medium mb-6 text-center">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* This would be populated with recommended products */}
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">Related Product</div>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">Related Product</div>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">Related Product</div>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">Related Product</div>
        </div>
      </div>
      
      {/* Add custom animation for notifications */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;