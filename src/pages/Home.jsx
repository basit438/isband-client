import { useState } from 'react';
import { Search, User, ShoppingBag } from 'lucide-react';

export default function EcommerceLandingPage() {
  const [cartItems] = useState(3);

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
              <button className="bg-red-500 text-white px-6 py-2 w-32 hover:bg-red-600 transition-colors">
                SHOP NOW
              </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(item => (
              <div 
                key={item}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={`menmodel.jpg`} 
                    alt={`Product ${item}`} 
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 text-xs">
                    NEW
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Stylish Product {item}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-red-500 font-bold">$29.99</span>
                    <button className="text-gray-500 hover:text-red-500">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
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
