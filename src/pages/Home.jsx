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
              <span className="text-sm uppercase tracking-widest text-gray-600">
                Spring/Summer 2027
              </span>
              <h1 className="text-4xl md:text-5xl font-light leading-tight">
                Up to 30% Off<br />New Arrivals
              </h1>
              <Link to="/productList">
                <button className="mt-4 border border-black text-black uppercase px-6 py-3 tracking-widest hover:bg-black hover:text-white transition">
                  Shop Now
                </button>
              </Link>
            </div>
            <div>
              <img
                src={heroImg}
                alt="Model wearing spring collection"
                className="w-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

   

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-6 tracking-widest uppercase">
            Featured Products
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin border-2 border-solid border-black border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <Link key={product._id} to={`/productdetail/${product._id}`} className="flex flex-col items-center text-center">
                  <div className="w-full mb-4">
                    <img src={product.colors?.[0]?.images?.[0] || heroImg} alt={product.name} className="w-full h-64 object-contain" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-sm font-light uppercase text-gray-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 truncate">{product.brand}</p>
                    <div className="text-sm font-medium uppercase text-gray-900">${product.finalPrice || product.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/productList" className="text-sm uppercase tracking-widest hover:underline">View All Products</Link>
          </div>
        </div>
      </section>

   


      {/* Newsletter CTA */}
      <section className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4 tracking-widest uppercase">Stay in the Loop</h2>
          <p className="mb-6">Subscribe to our newsletter for exclusive deals and updates.</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-sm text-gray-900 focus:outline-none"
            />
            <button className="bg-red-600 px-6 rounded-r-sm uppercase tracking-widest hover:bg-red-700 transition">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-light mb-4">COLOSHOP</h3>
            <p className="text-sm mb-2">Experience fashion, delivered.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-light mb-4">USEFUL LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">Help & FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-light mb-4">CONTACT US</h3>
            <p className="text-sm">123 Fashion Ave,<br />New York, NY</p>
            <p className="text-sm mt-2">Email: support@coloshop.com</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-light mb-4">FOLLOW US</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          © 2025 COLOSHOP. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
