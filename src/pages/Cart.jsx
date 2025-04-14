import axiosInstance from '../utils/axios';
import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const { updateCartCount } = useAuth();
  
  // Refs for animations
  const cartItemsRef = useRef([]);
  const loaderRef = useRef(null);
  const summaryRef = useRef(null);
  const pageRef = useRef(null);
  // Refs for price elements in the summary
  const subtotalPriceRef = useRef(null);
  const totalPriceRef = useRef(null);

  // Check for auth token first
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch cart data once on component mount
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation for page entry - only run once when data is first loaded
  useEffect(() => {
    if (pageRef.current && !loading && initialLoad) {
      gsap.fromTo(
        pageRef.current, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      setInitialLoad(false);
    }
  }, [loading, initialLoad]);

  // Animation for order summary - only run once when data is first loaded
  useEffect(() => {
    if (summaryRef.current && !loading && cartData?.products?.length > 0 && initialLoad) {
      gsap.fromTo(
        summaryRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.3, ease: "power2.out" }
      );
    }
  }, [loading, cartData?.products?.length, initialLoad]);

  const animateItemsEntry = () => {
    if (cartItemsRef.current.length > 0) {
      gsap.fromTo(
        cartItemsRef.current,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.3, 
          stagger: 0.1, 
          ease: "power2.out" 
        }
      );
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cart');
      if (response.data.success) {
        setCartData(response.data.cart);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
      // Reset refs for new data
      cartItemsRef.current = [];
      // Schedule animation after render, but only on initial load
      if (initialLoad) {
        setTimeout(() => animateItemsEntry(), 100);
      }
    }
  };

  // Animate only price changes in summary section
  const animateSummaryPrices = (oldTotal, newTotal) => {
    // Animate subtotal price element
    if (subtotalPriceRef.current) {
      // Subtle highlight effect
      gsap.fromTo(
        subtotalPriceRef.current,
        { backgroundColor: "rgba(255, 99, 71, 0.2)" },
        { backgroundColor: "rgba(255, 99, 71, 0)", duration: 0.8, ease: "power2.out" }
      );

      // Animate the actual price change
      gsap.to({value: oldTotal}, {
        value: newTotal,
        duration: 0.5,
        onUpdate: function() {
          subtotalPriceRef.current.textContent = `₹${this.targets()[0].value.toFixed(2)}`;
        }
      });
    }
    
    // Animate total price element
    if (totalPriceRef.current) {
      // Subtle highlight effect
      gsap.fromTo(
        totalPriceRef.current,
        { backgroundColor: "rgba(255, 99, 71, 0.2)" },
        { backgroundColor: "rgba(255, 99, 71, 0)", duration: 0.8, ease: "power2.out" }
      );

      // Animate the actual price change
      gsap.to({value: oldTotal}, {
        value: newTotal,
        duration: 0.5,
        onUpdate: function() {
          totalPriceRef.current.textContent = `₹${this.targets()[0].value.toFixed(2)}`;
        }
      });
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      // Find the DOM element for the updating item
      const itemElement = cartItemsRef.current.find(
        ref => ref && ref.dataset.productId === productId
      );
      
      if (itemElement) {
        // Simple pulse animation for quantity change
        gsap.fromTo(
          itemElement.querySelector('.quantity-display'),
          { scale: 1 },
          { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
        );
        
        // Update price with count-up animation
        const priceElement = itemElement.querySelector('.price-display');
        const oldPrice = parseFloat(priceElement.textContent.replace('₹', ''));
        const item = cartData.products.find(item => item.productId === productId);
        const newPrice = Number((item.product.price * newQuantity).toFixed(2));
        
        // Animate the price change
        gsap.to({value: oldPrice}, {
          value: newPrice,
          duration: 0.5,
          onUpdate: function() {
            priceElement.textContent = `₹${this.targets()[0].value.toFixed(2)}`;
          }
        });
      }

      // Optimistically update the UI
      const updatedProducts = cartData.products.map(item => {
        if (item.productId === productId) {
          const newSubtotal = Number((item.product.price * newQuantity).toFixed(2));
          return { ...item, quantity: newQuantity, subtotal: newSubtotal };
        }
        return item;
      });
      const newTotalPrice = Number(updatedProducts.reduce((total, item) => total + item.subtotal, 0).toFixed(2));
      
      // Animate only summary prices
      const oldTotal = cartData.totalPrice;
      animateSummaryPrices(oldTotal, newTotalPrice);
      
      setCartData(prev => ({ ...prev, products: updatedProducts, totalPrice: newTotalPrice }));

      // Make API call
      const response = await axiosInstance.put('/cart/update-quantity', {
        productId,
        quantity: newQuantity
      });
      
      if (!response.data.success) {
        await fetchCart();
      }
      updateCartCount();
    } catch (error) {
      setError('Error updating quantity');
      console.error('Error updating quantity:', error);
      await fetchCart();
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      // Find the DOM element for the item to remove
      const itemElement = cartItemsRef.current.find(
        ref => ref && ref.dataset.productId === productId
      );
      
      if (itemElement) {
        // Animate item removal
        await gsap.to(itemElement, {
          opacity: 0,
          height: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }

      // Update the UI after animation
      const updatedProducts = cartData.products.filter(item => item.productId !== productId);
      const newTotalPrice = Number(updatedProducts.reduce((total, item) => total + item.subtotal, 0).toFixed(2));
      
      // Animate only summary prices
      const oldTotal = cartData.totalPrice;
      animateSummaryPrices(oldTotal, newTotalPrice);
      
      // Remove item from refs array
      cartItemsRef.current = cartItemsRef.current.filter(
        ref => ref && ref.dataset.productId !== productId
      );
      
      setCartData(prev => ({ ...prev, products: updatedProducts, totalPrice: newTotalPrice }));

      // Make API call
      const response = await axiosInstance.delete('/cart/remove-item', {
        data: { productId }
      });
      
      if (!response.data.success) {
        await fetchCart();
      }
      updateCartCount();
    } catch (error) {
      setError('Error removing item');
      console.error('Error removing item:', error);
      await fetchCart();
    }
  };

  const handleClearCart = async () => {
    try {
      // Animate all items removal
      await gsap.to(cartItemsRef.current, {
        opacity: 0,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.inOut"
      });

      // Animate only summary prices to zero
      const oldTotal = cartData.totalPrice;
      animateSummaryPrices(oldTotal, 0);

      setCartData(prev => ({ ...prev, products: [], totalPrice: 0 }));

      // Make API call
      const response = await axiosInstance.delete('/cart/clear');
      
      if (!response.data.success) {
        await fetchCart();
      }
      updateCartCount();
    } catch (error) {
      setError('Error clearing cart');
      console.error('Error clearing cart:', error);
      await fetchCart();
    }
  };

  if (loading) {
    return (
      <div ref={loaderRef} className="text-center p-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading your bag...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-12 animate-fade-in">
        <div className="text-red-500 text-xl mb-4">😕</div>
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={fetchCart}
          className="mt-4 text-sm text-gray-700 underline hover:text-red-500"
        >
          Try again
        </button>
      </div>
    );
  }
  
  if (!cartData || cartData.products.length === 0) {
    return (
      <div ref={pageRef} className="text-center p-12">
        <h2 className="text-3xl font-bold mb-6">Your bag is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your bag to see them here!</p>
        <button 
          className="bg-red-500 text-white px-6 py-3 hover:bg-red-600 transition-colors font-medium"
          onClick={() => navigate('/products')}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">/Bag</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List - Takes up 2/3 on desktop */}
        <div className="lg:col-span-2">
          <div className="space-y-5">
            {cartData.products.map((item, index) => (
              <div 
                key={item.productId} 
                className="border-b border-gray-200 pb-5"
                ref={el => {
                  if (el) {
                    el.dataset.productId = item.productId;
                    cartItemsRef.current[index] = el;
                  }
                }}
              >
                <div className="flex flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-24">
                    <img
                      src={item.product?.colors?.[0]?.images?.[0] || '/heroimg.jpeg'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium">{item.product?.name}</h3>
                      <p className="text-base font-bold price-display">₹{item.subtotal.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-1">
                      <p className="text-xs text-gray-600">Color: {item.product?.colors?.[0]?.name || 'Default'}</p>
                      <p className="text-xs text-gray-600">Size: {item.product?.size || 'OS'}</p>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button 
              className="inline-block border border-gray-300 text-gray-800 px-6 py-2 hover:bg-gray-50 font-medium transition-colors text-sm"
              onClick={() => navigate('/products')}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
        
        {/* Order Summary - Takes up 1/3 on desktop */}
        <div className="lg:col-span-1">
          <div ref={summaryRef} className="border border-gray-200 p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Order summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span ref={subtotalPriceRef}>₹{cartData.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3"></div>
              <div className="flex justify-between font-bold text-base">
                <span>Estimated Total</span>
                <span ref={totalPriceRef}>₹{cartData.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className="w-full bg-red-500 text-white py-3 px-4 hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mb-6 font-medium"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              SECURE CHECKOUT <ArrowRight size={16} />
            </button>
            
            <div className="text-xs text-gray-700 mt-6">
              <h3 className="font-bold mb-2">Need assistance?</h3>
              <p className="mb-2">Please contact our Customer Care team either:</p>
              <p className="mb-2">By telephone: +1-888-770-7140</p>
              <p className="mb-2">Or via our <span className="text-red-500 hover:text-red-700 cursor-pointer transition-colors">Contact form</span></p>
              <p>Our Customer Care team is available to help you 7 days a week from 7 AM to 1 AM ET</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;