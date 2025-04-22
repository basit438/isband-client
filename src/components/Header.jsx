import React from "react";
import { Search, User, ShoppingBag } from "react-feather";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, cartCount, logout } = useAuth();

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
    // const user = useSelector((state) => state.user);  

  return (
    <>
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-xl">
            <Link to="/" className="text-black">
              <span className="text-black">Is</span>
              <span className="text-red-500">band</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            {[
              { name: "HOME", path: "/" },
              { name: "SHOP", path: "/Productlist" },
              // { name: "PROMOTION", path: "/promotion" },
              { name: "PAGES", path: "/pages" },
              { name: "BLOG", path: "/blog" },
              { name: "CONTACT", path: "/contact" },
              // { name: "ABOUT", path: "/about" },
              { name: "WISHLIST", path: "/wishlist" },
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
              <Search size={20} />
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
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="text-red-500 hover:underline">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
