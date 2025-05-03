import React, { useState } from "react";
import { Heart, User, ShoppingBag, Menu, X } from "react-feather";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axios";
function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, cartCount, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout", {});
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      navigate("/login");
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  // const user = useSelector((state) => state.user);

  return (
    <>
      <header className="bg-white py-4 px-6 shadow-sm relative z-20">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-xl">
            <Link to="/" className="text-black">
              <span className="text-black">Is</span>
              <span className="text-red-500">band</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            {[
              { name: "HOME", path: "/" },
              { name: "SHOP", path: "/Productlist" },
              { name: "BLOG", path: "/blog" },
              { name: "CONTACT", path: "/contact" },
              { name: "ABOUT", path: "/about" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-red-500"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-red-500">
              <Link to="/wishlist">
                <Heart size={20} />
              </Link>
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <button className="text-gray-700 hover:text-red-500">
                    <User size={20} />
                  </button>
                </Link>
                <Link to="/cart">
                  <button className="text-gray-700 hover:text-red-500 relative">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-red-500 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="hidden md:block text-red-500 hover:underline">Login</button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-10 py-4 px-6 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 text-sm font-medium">
              {[
                { name: "HOME", path: "/" },
                { name: "SHOP", path: "/Productlist" },
                { name: "BLOG", path: "/blog" },
                { name: "CONTACT", path: "/contact" },
                { name: "ABOUT", path: "/about" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 hover:text-red-500">
                  <ShoppingBag size={18} />
                  <span>CART {cartCount > 0 && `(${cartCount})`}</span>
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-500 hover:underline text-left"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="text-red-500 hover:underline">Login</button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
