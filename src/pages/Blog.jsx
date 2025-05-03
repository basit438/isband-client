import React from 'react';

const Blog = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="/heroimg.jpeg" 
          alt="Blog" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-light tracking-wider">BLOG</h1>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
        <div className="mb-12">
          <h2 className="text-3xl font-light mb-6 tracking-wide">COMING SOON</h2>
          <div className="w-16 h-1 bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
            We're working on creating inspiring content about fashion, sustainability, and style tips.
            Our blog will be launching soon with exciting stories and updates from the world of fashion.
          </p>
          
          <div className="inline-block border-b border-black pb-1">
            <span className="text-sm tracking-wider">STAY TUNED</span>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-gray-50 p-8 max-w-xl mx-auto">
          <h3 className="text-xl font-light mb-4">GET NOTIFIED WHEN WE LAUNCH</h3>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter to be the first to know when our blog launches
            and receive exclusive content straight to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your Email Address" 
              className="flex-grow p-3 border border-gray-300 focus:outline-none focus:border-black"
            />
            <button className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;