import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  // Add smooth scroll function
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-white">FuelFlow</h1>
          <div className="space-x-6">
            <Link to="/login" className="text-white hover:text-blue-400">Login</Link>
            <button 
              onClick={scrollToContact} 
              className="text-white hover:text-blue-400"
            >
              Contact
            </button>
          </div>
        </nav>
        
        {/* ... rest of your hero section ... */}
      </div>

      {/* Features Section */}
      {/* ... your features section ... */}

      {/* Contact Section - Add id for scrolling */}
      <div id="contact" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Contact Us</h2>
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                className="w-full p-3 rounded bg-gray-700 text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded bg-gray-700 text-white"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Message</label>
              <textarea
                className="w-full p-3 rounded bg-gray-700 text-white h-32"
                placeholder="Your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 