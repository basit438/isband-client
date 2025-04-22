import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, X, ShoppingBag } from "react-feather";
import axiosInstance from "../utils/axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get("/wishlist/");
      setWishlist(res.data.wishlist);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axiosInstance.post("/wishlist/add", { productId });
      // Refresh wishlist after removing item
      fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-normal mb-8 uppercase tracking-widest text-center">Favorites</h1>
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        
        {error && (
          <div className="border border-gray-200 text-gray-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">Error: {error}</span>
          </div>
        )}
        
        {wishlist.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Heart size={32} className="mx-auto" />
            </div>
            <p className="text-lg text-gray-800 mb-6">Your favorites list is empty</p>
            <Link to="/products" className="inline-block bg-black hover:bg-gray-800 text-white font-normal py-3 px-6 transition duration-300">
              Continue Shopping
            </Link>
          </div>
        )}
        
        {wishlist.length > 0 && (
          <div>
            <div className="mb-6 text-right">
              <span className="text-sm text-gray-500">{wishlist.length} items</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product._id} className="group">
                  <div className="relative overflow-hidden">
                    <Link to={`/productdetail/${product._id}`}>
                      <img
                        src={product?.colors?.[0]?.images?.[0] || "heroimg.jpeg"}
                        alt={product.name}
                        className="w-full h-96 object-cover"
                      />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-300"
                      aria-label="Remove from favorites"
                    >
                      <X size={16} className="text-black" />
                    </button>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button className="w-full bg-black text-white py-2 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                        <ShoppingBag size={16} />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-3 pb-6">
                    <Link to={`/productdetail/${product._id}`} className="block">
                      <p className="text-xs text-gray-500 mb-1">{product.brand || "Brand"}</p>
                      <h3 className="font-normal text-sm text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm font-medium">${product.finalPrice || product.price}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/ProductList" className="inline-block border border-black text-black hover:bg-black hover:text-white font-normal py-3 px-10 uppercase tracking-wider text-sm transition duration-300">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;