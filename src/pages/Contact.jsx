import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({
      submitted: true,
      error: false,
      message: 'Thank you for your message. We will get back to you shortly.'
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="/heroimg.jpeg" 
          alt="Contact Us" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-light tracking-wider">CONTACT US</h1>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-light mb-6 tracking-wide">GET IN TOUCH</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're here to help and answer any question you might have. We look forward to hearing from you.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  123 Fashion Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Contact</h3>
                <p className="text-gray-600 mb-1">Email: contact@isband.com</p>
                <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Opening Hours</h3>
                <p className="text-gray-600 mb-1">Monday - Friday: 9am - 10pm</p>
                <p className="text-gray-600 mb-1">Saturday: 10am - 8pm</p>
                <p className="text-gray-600">Sunday: 11am - 6pm</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-light mb-6 tracking-wide">SEND A MESSAGE</h2>
            
            {formStatus.submitted ? (
              <div className="bg-gray-50 p-6 text-center">
                <p className={`text-lg ${formStatus.error ? 'text-red-500' : 'text-green-600'}`}>
                  {formStatus.message}
                </p>
                <button 
                  onClick={() => setFormStatus({ submitted: false, error: false, message: '' })}
                  className="mt-4 bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows="5"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                  ></textarea>
                </div>
                
                <div>
                  <button 
                    type="submit"
                    className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors w-full md:w-auto"
                  >
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="h-96 bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Map Placeholder</p>
          <p className="text-gray-400">A Google Map would be integrated here</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;