import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'react-feather';
import axiosInstance from '../utils/axios';

const AddToCart = ({ 
  productId, 
  initialQuantity = 1, 
  onAddToCart, 
  buttonText = 'Add to Shopping Bag', 
  buttonClassName, 
  showQuantity = true, 
  showButton = true,
  size = 'normal',
  quantityClassName,
  onQuantityChange,
  selectedColor = null,
  selectedSize = null,
  disabled = false
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Update quantity if initialQuantity prop changes
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);
  
  // Check if product is already in cart
  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const res = await axiosInstance.get('/cart');
        if (res.data.success && res.data.cart && res.data.cart.products) {
          // Check if this product with the same color and size is already in cart
          const isProductInCart = res.data.cart.products.some(item => {
            // Basic product ID check
            const idMatch = item.productId === productId;
            
            // If color and size are specified, check those too
            if (selectedColor && selectedSize) {
              return idMatch && 
                item.selectedColor && item.selectedColor.colorName === selectedColor.colorName && 
                item.selectedSize === selectedSize.size;
            } else if (selectedColor) {
              return idMatch && item.selectedColor && item.selectedColor.colorName === selectedColor.colorName;
            } else if (selectedSize) {
              return idMatch && item.selectedSize === selectedSize.size;
            }
            
            // If no color or size specified, just check the ID
            return idMatch;
          });
          
          setIsInCart(isProductInCart);
        }
      } catch (error) {
        console.error('Error checking cart status:', error);
      }
    };
    
    if (productId) {
      checkIfInCart();
    }
  }, [productId, selectedColor, selectedSize]);

  // Display a notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-black text-white py-2 px-4 rounded shadow-lg z-50 animate-fade-in-out';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleQuantityChange = (type) => {
    let newQuantity = quantity;
    
    if (type === 'increase') {
      newQuantity = quantity + 1;
      setQuantity(newQuantity);
    } else if (type === 'decrease' && quantity > 1) {
      newQuantity = quantity - 1;
      setQuantity(newQuantity);
    } else {
      return; // No change
    }
    
    // Call the onQuantityChange callback if provided
    if (onQuantityChange && typeof onQuantityChange === 'function') {
      onQuantityChange(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isInCart) return; // Prevent adding if already in cart
    
    try {
      setIsAddingToCart(true); // Set loading state
      
      // Create product object with all available information
      const productData = {
        productId: productId,
        quantity: quantity,
      };
      
      // Add color information if available
      if (selectedColor) {
        // Ensure we're only sending the necessary color data
        productData.selectedColor = {
          colorName: selectedColor.colorName,
          colorHex: selectedColor.colorHex
        };
      }
      
      // Add size information if available
      if (selectedSize) {
        // Send the size as a string value
        productData.selectedSize = selectedSize.size;
      }
      
      const response = await axiosInstance.post('/cart/add', {
        products: [productData],
      });

      if (response.data.success) {
        // Show success notification
        showNotification('Added to your shopping bag');
        
        // Update cart status
        setIsInCart(true);
        
        // Call the callback if provided
        if (onAddToCart && typeof onAddToCart === 'function') {
          onAddToCart(quantity);
        }
      } else {
        showNotification(response.data.message || 'Error adding to bag');
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      showNotification('Failed to add product to bag');
    } finally {
      setIsAddingToCart(false); // Reset loading state
    }
  };


  // Determine button size classes
  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return 'py-1 px-3 text-xs';
      case 'large':
        return 'py-4 px-8 text-lg';
      case 'normal':
      default:
        return 'py-3 px-6';
    }
  };

  // Default button class if none provided
  const defaultButtonClass = `bg-black text-white ${getSizeClasses()} hover:bg-gray-800 transition-colors font-medium`;
  
  // Default quantity control class
  const defaultQuantityClass = quantityClassName || 'flex items-center border border-gray-300 w-32';

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity Selector */}
      {showQuantity && (
        <div className={size === 'small' ? '' : 'mb-2'}>
          {size !== 'small' && <h3 className="text-sm font-medium mb-2">Quantity</h3>}
          <div className={defaultQuantityClass}>
            <button 
              onClick={() => handleQuantityChange('decrease')}
              className="px-3 py-2 text-gray-500 hover:text-black"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="flex-1 text-center quantity-display">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange('increase')}
              className="px-3 py-2 text-gray-500 hover:text-black"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Add to Cart Button */}
      {showButton && (
        <button 
          onClick={handleAddToCart} 
          disabled={isInCart || isAddingToCart || disabled}
          className={`${buttonClassName || defaultButtonClass} ${isInCart ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed' : ''} ${isAddingToCart ? 'opacity-75 cursor-wait' : ''} ${disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
        >
          {isInCart ? 'Added to Bag' : isAddingToCart ? 'Adding...' : buttonText}
        </button>
      )}

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
      `}</style>
    </div>
  );
};

export default AddToCart;