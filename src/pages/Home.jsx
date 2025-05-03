import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

export default function EcommerceLandingPage() {
  const [cartItems] = useState(3);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/product?page=1');
        if (response.data.success) {
          setFeaturedProducts(response.data.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative bg-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center p-8 md:p-16">
              <div className="text-sm text-gray-600 mb-4">
                SPRING / SUMMER COLLECTION 2027
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Get up to 30% Off<br />New Arrivals
              </h1>
              <Link to="/productList">
              <button className="bg-red-500 text-white px-6 py-2 w-32 hover:bg-red-600 transition-colors">
                SHOP NOW
              </button>
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="/menmodel.jpg" 
                alt="Fashion model wearing spring collection" 
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: '/womenmodel.jpeg', label: "WOMEN'S" },
              { src: '/herosectionmimage.jpg', label: 'ACCESSORIES' },
              { src: '/heroimg.jpeg', label: "MEN'S" },
            ].map(({ src, label }) => (
              <div
                key={label}
                className="relative group cursor-pointer h-64 overflow-hidden flex items-center justify-center"
              >
                <img
                  src={src}
                  alt={label}
                  className="h-full w-auto object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white px-4 py-2 text-gray-800 font-medium">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <div 
                    key={product._id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <Link to={`/productdetail/${product._id}`}>
                      <div className="relative overflow-hidden h-64">
                        <img 
                          src={product.colors && product.colors[0] && product.colors[0].images && product.colors[0].images[0] 
                            ? product.colors[0].images[0] 
                            : '/menmodel.jpg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{product.brand}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            {product.discount > 0 ? (
                              <div className="flex items-center">
                                <span className="text-red-500 font-bold mr-2">${product.finalPrice}</span>
                                <span className="text-gray-400 text-sm line-through">${product.price}</span>
                              </div>
                            ) : (
                              <span className="text-red-500 font-bold">${product.finalPrice || product.price}</span>
                            )}
                          </div>
                          <button className="text-gray-500 hover:text-red-500 transition-colors">
                            <ShoppingBag size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-8">
                  <p>No products found. Check back soon!</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/Productlist" className="inline-block bg-red-500 text-white px-6 py-2 hover:bg-red-600 transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">COLOSHOP</h3>
              <p className="text-gray-400 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tempus magna.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">USEFUL LINKS</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Track Order</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Shipping & Delivery</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">CUSTOMER SERVICE</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Help & FAQ</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">NEWSLETTER</h3>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with our latest offers and promotions.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-gray-700 text-white px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-red-500"
                />
                <button className="bg-red-500 px-4 text-white hover:bg-red-600">
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            © 2025 COLOSHOP. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
