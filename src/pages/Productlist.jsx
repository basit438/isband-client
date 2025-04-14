import React, { useEffect, useState } from "react";
import { ShoppingBag, Search } from "react-feather";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 on search
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/api/v1/product?page=${page}&search=${debouncedSearch}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Shop Our Products
        </h2>

        {/* Search Field */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                       src={
                          product?.colors?.[0]?.images?.[0] || "heroimg.jpeg"
                      }
                      
                        alt={product.name || "Product"}
                        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 text-xs">
                        NEW
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{product.name || "No Title"}</h3>
                      <p className="text-sm text-gray-500 truncate">{product.brand || "Unknown Brand"}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-red-500 font-bold">${product.price}</span>
                        <Link to={`/productdetail/${product._id}`}>veiw detail</Link>
                        {/* <button className="text-gray-500 hover:text-red-500">
                          <ShoppingBag size={18} />
                        </button> */}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProductList;
