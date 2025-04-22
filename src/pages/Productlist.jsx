import React, { useEffect, useState } from "react";
import { ShoppingBag, Search, Filter, X, ChevronRight } from "react-feather";
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
    <section className="bg-white min-h-screen">
      {/* Top Banner */}
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-sm text-gray-700">Free standard shipping on orders over $50</p>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-normal">Products</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 font-light text-sm text-gray-800 border border-gray-300 px-3 py-2"
            >
              <Filter size={16} />
              <span>{showFilters ? 'HIDE FILTERS' : 'FILTER & SORT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "280px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:mr-8 overflow-hidden"
              >
                <div className="border-r border-gray-200 h-full pr-6 py-2">
                  <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-lg font-normal uppercase tracking-wide">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-black">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Categories Filter */}
                  <div className="mb-8 border-b border-gray-200 pb-6">
                    <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Category</h4>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                            className="rounded-sm border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-black transition-colors duration-200">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Types Filter */}
                  <div className="mb-8 border-b border-gray-200 pb-6">
                    <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Product Type</h4>
                    <div className="space-y-3">
                      {types.map((t) => (
                        <label key={t} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedType === t}
                            onChange={() => setSelectedType(selectedType === t ? "" : t)}
                            className="rounded-sm border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-black transition-colors duration-200">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-8">
                    <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Price</h4>
                    <div className="space-y-6">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange.min}</span>
                        <span>${priceRange.max === 100000 ? "100,000+" : priceRange.max}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Apply Filters Button (Mobile Only) */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-black text-white py-3 uppercase text-sm font-medium tracking-wide"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className={`flex-1 transition-all duration-300 ${showFilters ? 'md:pl-4' : ''}`}>
            {/* Search Field */}
            <div className="mb-8">
              <div className="relative w-full max-w-md mx-auto md:mx-0">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-500 bg-transparent text-sm"
                />
                <Search className="absolute left-0 top-2 text-gray-500" size={18} />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                <p className="mb-2 text-lg">No products found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page + debouncedSearch + selectedCategory + selectedType + debouncedPriceRange.min + debouncedPriceRange.max}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group cursor-pointer"
                      >
                        <Link to={`/productdetail/${product._id}`} className="block">
                          <div className="relative overflow-hidden mb-2">
                            <img
                              src={product?.colors?.[0]?.images?.[0] || "heroimg.jpeg"}
                              alt={product.name}
                              className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Favorite button could be added here */}
                          </div>
                          <div className="px-1">
                            <h3 className="text-sm font-light text-gray-800 mb-1">{product.name || "No Title"}</h3>
                            <p className="text-xs text-gray-500 mb-1">{product.brand || "Unknown Brand"}</p>
                            <p className="text-sm font-medium">${product.price}</p>
                            {/* Color options could be added here */}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-1 my-12">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 hover:border-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === page;
                    const isWithinRange = Math.abs(pageNumber - page) <= 1 || pageNumber === 1 || pageNumber === totalPages;
                    
                    if (!isWithinRange) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) return <span key={pageNumber} className="text-gray-500 px-1">...</span>;
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-8 h-8 flex items-center justify-center text-sm transition-colors duration-200 ${
                          isCurrentPage
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 hover:border-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
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