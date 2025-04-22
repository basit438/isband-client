import axiosInstance from '../utils/axios';
import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Minus, ArrowRight, Heart } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [promoCode, setPromoCode] = useState('');
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

  const handlePromoCode = (e) => {
    e.preventDefault();
    alert(`Promo code "${promoCode}" applied!`);
    setPromoCode('');
  };

  const moveToWishlist = (productId) => {
    alert(`Moving item to wishlist functionality will be implemented soon!`);
  };

  if (loading) {
    return (
      <div ref={loaderRef} className="text-center p-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading your shopping bag...</p>
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
          className="mt-4 text-sm text-gray-700 underline hover:text-black"
        >
          Try again
        </button>
      </div>
    );
  }
  
  if (!cartData || cartData.products.length === 0) {
    return (
      <div ref={pageRef} className="text-center p-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-normal mb-6">Shopping bag (0)</h2>
        <div className="border-t border-b py-16 mb-8">
          <p className="text-gray-600 mb-8">Your shopping bag is empty</p>
          <button 
            className="bg-black text-white px-12 py-3 hover:opacity-80 transition-opacity font-normal"
            onClick={() => navigate('/products')}
          >
            CONTINUE SHOPPING
          </button>
        </div>
        <div className="max-w-lg mx-auto">
          <h3 className="text-lg font-medium mb-4">Need help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Contact us</p>
              <p>Customer service: +1-888-770-7140</p>
              <p className="mb-2">Available 7 days a week, 7 AM - 1 AM ET</p>
              <p className="underline cursor-pointer">Chat with us</p>
            </div>
            <div>
              <p className="font-medium mb-2">Shipping & Returns</p>
              <p className="underline cursor-pointer mb-2">Delivery information</p>
              <p className="underline cursor-pointer">Return & refund policy</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-gray-800">Shopping bag ({cartData.products.length})</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Product List - Takes up 2/3 on desktop */}
        <div className="lg:col-span-2">
          <div className="border-t border-gray-200">
            {cartData.products.map((item, index) => (
              <div 
                key={item.productId} 
                className="border-b border-gray-200 py-6"
                ref={el => {
                  if (el) {
                    el.dataset.productId = item.productId;
                    cartItemsRef.current[index] = el;
                  }
                }}
              >
                <div className="flex flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-28">
                    <img
                      src={item.product?.colors?.[0]?.images?.[0] || '/heroimg.jpeg'}
                      alt={item.product?.name}
                      className="w-28 h-36 object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-base font-medium">{item.product?.name}</h3>
                        <p className="text-sm font-normal mt-1">₹{item.product.price.toFixed(2)}</p>
                      </div>
                      <p className="text-base font-normal price-display">₹{item.subtotal.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs text-gray-600">Color: {item.product?.colors?.[0]?.name || 'Default'}</p>
                      <p className="text-xs text-gray-600">Size: {item.product?.size || 'OS'}</p>
                      <p className="text-xs text-gray-600">Art. No.: {item.product?.id?.substring(0, 8) || 'N/A'}</p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center bg-gray-100 border border-gray-300">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-200 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 text-sm font-medium bg-white border-l border-r border-gray-300 quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => moveToWishlist(item.productId)}
                          className="flex items-center text-xs text-gray-700 hover:text-black transition-colors"
                        >
                          <Heart size={14} className="mr-1" /> Move to favorites
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-xs text-gray-700 hover:text-black transition-colors"
                        >
                          <Trash2 size={14} className="inline mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <button 
              className="inline-block border border-gray-300 text-gray-800 px-6 py-2 hover:bg-gray-50 transition-colors text-sm"
              onClick={() => navigate('/products')}
            >
              CONTINUE SHOPPING
            </button>
            
            <button 
              className="inline-block text-gray-600 text-sm hover:text-black transition-colors"
              onClick={handleClearCart}
            >
              Clear shopping bag
            </button>
          </div>
        </div>
        
        {/* Order Summary - Takes up 1/3 on desktop */}
        <div className="lg:col-span-1">
          <div ref={summaryRef} className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold mb-4">Order summary</h2>
            
            {/* Discount code section */}
            <div className="mb-8">
              <form onSubmit={handlePromoCode}>
                <p className="text-sm mb-2">Discount code</p>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm" 
                    placeholder="Enter code"
                  />
                  <button 
                    type="submit"
                    className="bg-black text-white px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                  >
                    APPLY
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t border-gray-300 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span ref={subtotalPriceRef}>₹{cartData.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3"></div>
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span className="text-right">
                  <div className="text-xs text-gray-500">Tax included</div>
                  <div ref={totalPriceRef}>₹{cartData.totalPrice.toFixed(2)}</div>
                </span>
              </div>
            </div>
            
            <button
              className="w-full mt-6 bg-black text-white py-3 px-4 hover:opacity-80 transition-opacity flex items-center justify-center gap-2 font-medium"
              onClick={() => navigate('/checkout')}
            >
              CONTINUE TO CHECKOUT <ArrowRight size={16} />
            </button>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-600 mb-2">We accept:</p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-300 pt-6 text-xs text-gray-600 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Delivery options:</h3>
                <p>Standard Delivery (4-7 business days): ₹0.00</p>
                <p>Express Delivery (2-3 business days): ₹199.00</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Need help?</h3>
                <p className="mb-1">Customer service: +1-888-770-7140</p>
                <p>Available 7 days a week, 7 AM - 1 AM ET</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;