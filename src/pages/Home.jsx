import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import heroImg from '/menmodel.jpg';

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
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col space-y-4">
              <span className="text-sm uppercase tracking-widest text-gray-500">
                Spring/Summer Collection 2027
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Get up to <span className="text-red-600">30% Off</span>
                <br /> New Arrivals
              </h1>
              <Link to="/productList">
                <button className="mt-4 bg-black text-white uppercase px-6 py-3 tracking-wide hover:bg-gray-800 transition">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="w-full">
              <img
                src={heroImg}
                alt="Model wearing spring collection"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
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
                  <div key={product._id} className="bg-white shadow-sm hover:shadow-md transition group rounded-lg overflow-hidden">
                    <Link to={`/productdetail/${product._id}`}>  
                      <div className="relative overflow-hidden h-64">
                        <img
                          src={
                            product.colors?.[0]?.images?.[0] || heroImg
                          }
                          alt={product.name}
                          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs">
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
                                <span className="text-red-600 font-bold mr-2">${product.finalPrice}</span>
                                <span className="text-gray-400 text-sm line-through">${product.price}</span>
                              </div>
                            ) : (
                              <span className="text-red-600 font-bold">${product.finalPrice || product.price}</span>
                            )}
                          </div>
                          <button className="text-gray-500 hover:text-red-600 transition">
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
            <Link to="/productList" className="inline-block bg-red-600 text-white uppercase px-6 py-3 hover:bg-red-700 transition">
              View All Products
            </Link>
          </div>
        </div>
      </section>

          {/* Shop by Category */}
          <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { src: '/womenmodel.jpeg', label: "Women" },
              { src: '/heroimg.jpeg', label: "Men" },
              { src: '/herosectionmimage.jpg', label: "Accessories" },
            ].map(({ src, label }) => (
              <Link
                key={label}
                to={`/category/${label.toLowerCase()}`}
                className="relative group overflow-hidden rounded-lg"
              >
                <img
                  src={src}
                  alt={label}
                  className="w-full h-48 sm:h-64 object-contain transform group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-lg font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                  className="bg-gray-700 text-white px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-red-600"
                />
                <button className="bg-red-600 px-4 text-white hover:bg-red-700 transition">
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
