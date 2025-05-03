import React from 'react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src="/heroimg.jpeg" 
          alt="About Us" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-light tracking-wider">ABOUT US</h1>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-light mb-6 tracking-wide">OUR STORY</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2023, Isband is a fashion brand that believes in sustainable, timeless fashion. 
            We create collections that combine quality and sustainability at the best price in a more sustainable way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <img 
              src="/menmodel.jpg" 
              alt="Our Values" 
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-light mb-4 tracking-wide">OUR VALUES</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We are committed to making a positive impact in the world of fashion. Our business concept is to offer fashion and quality at the best price in a sustainable way.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that great design should be available to everyone, and that when we work together, we can lead the change towards circular and climate-positive fashion while being a fair and equal company.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="flex flex-col justify-center md:order-1 order-2">
            <h3 className="text-2xl font-light mb-4 tracking-wide">SUSTAINABILITY</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We're committed to a more sustainable fashion future. Our goal is to use 100% recycled or sustainably sourced materials by 2030 and achieve climate-positive status by 2040.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in transparency and ethical practices throughout our supply chain, ensuring fair wages and safe working conditions for all who contribute to our collections.
            </p>
          </div>
          <div className="md:order-2 order-1">
            <img 
              src="/womenmodel.jpeg" 
              alt="Sustainability" 
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-light mb-12 tracking-wide">OUR TEAM</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Creative Director', image: '/heroimg.jpeg' },
              { name: 'David Chen', role: 'Head of Design', image: '/menmodel.jpg' },
              { name: 'Emma Rodriguez', role: 'Sustainability Lead', image: '/womenmodel.jpeg' },
            ].map((member, index) => (
              <div key={index} className="mb-8">
                <div className="mb-4 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;