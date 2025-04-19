import React, { useEffect, useState } from "react";
import { ShoppingBag, Search, Filter } from "react-feather";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState({ min: 0, max: 100000 });
  const categories = ["Men", "Women", "Kids", "Unisex"];
  const types = ["T-Shirt", "Jeans", "Shirt", "Pants", "Dress", "Jacket"];

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
        `http://localhost:5002/api/v1/product?page=${page}&search=${debouncedSearch}&category=${selectedCategory}&type=${selectedType}&minPrice=${debouncedPriceRange.min}&maxPrice=${debouncedPriceRange.max}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  // Debounce price range changes
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
      setPage(1); // reset to page 1 on price range change
    }, 500);
    return () => clearTimeout(delay);
  }, [priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch, selectedCategory, selectedType, debouncedPriceRange]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 flex">
        {/* Filter Sidebar */}
        <div className={`fixed md:relative inset-y-0 left-0 transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white md:bg-transparent p-6 space-y-6 shadow-lg md:shadow-none`}>
          <div className="flex justify-between items-center md:hidden">
            <h3 className="font-bold text-lg">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500">
              ×
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Types */}
          <div>
            <h4 className="font-semibold mb-3">Types</h4>
            <div className="space-y-2">
              {types.map((t) => (
                <label key={t} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedType === t}
                    onChange={() => setSelectedType(selectedType === t ? "" : t)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-semibold mb-3">Price Range</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Shop Our Products</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 text-gray-600"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

        {/* Search Field */}
        <div className="mb-8">
          <div className="relative w-full">
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
          <div className="text-center text-gray-600 py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No products found.</div>
        ) : (
          <div>
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
                      alt={product.name}
                        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 text-xs">
                        {product.category || "Category"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{product.name || "No Title"}</h3>
                      <p className="text-sm text-gray-500 truncate">{product.brand || "Unknown Brand"}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-red-500 font-bold">${product.price}</span>
                        <Link to={`/productdetail/${product._id}`}>veiw detail</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ←
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === page;
                const isWithinRange = Math.abs(pageNumber - page) <= 2 || pageNumber === 1 || pageNumber === totalPages;
                
                if (!isWithinRange) {
                  if (pageNumber === 2 || pageNumber === totalPages - 1) return <span key={pageNumber}>...</span>;
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isCurrentPage
                        ? 'bg-red-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                →
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Overlay for mobile filter sidebar */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </section>
  );
}

export default ProductList;
