import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import About from './About';
import Features from './Features';
import Contact from './Contact';

function Landing() {
  const [showLogo, setShowLogo] = useState(false);
  const [showHeading, setShowHeading] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 500);
    const headingTimer = setTimeout(() => setShowHeading(true), 2000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(headingTimer);
    };
  }, []);

  return (
    <div ref={forwardRef} className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 rounded-lg max-w-5xl mx-auto mt-0 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <img src="src/assets/fuel_logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xl font-semibold">Sentinelfuel</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-blue-400">About</button>
            <button onClick={() => scrollToSection(servicesRef)} className="hover:text-blue-400">Services</button>
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-blue-400">Contact</button>
          </nav>
          <div className="flex space-x-4">
            {/* <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gold-light">
              Book a call
            </button> */}
            <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleClick}>
              SignUp
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          {/* Your landing page content */}
          <div className="relative h-96 mb-8">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotateY: 0 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, rotateY: { duration: 1 } }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ perspective: 1000 }}
                >
                  <img
                    src="src/assets/fuel_logo.png"
                    alt="Fuel Logo"
                    className="w-64 h-64 object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showHeading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white bg-black bg-opacity-50 p-4 rounded">
                    Managing your<br />fuel with IOT
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Make big changes with small differences. An innovative fuel management system
            that uses IOT to optimize consumption and reduce environmental impact.
          </p>
          <button className="px-8 py-3 text-lg font-semibold text-black bg-white rounded-md hover:bg-gray-200"
          onClick={handleClick}>
            Get started for free
          </button>
        </div>

        {/* Total Fuel Saved Section */}
        <div className="bg-gray-900 rounded-lg p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button className="text-white hover:text-blue-400">Fuel Optimization</button>
              <button className="text-white hover:text-blue-400">Consumption Analysis</button>
              <button className="text-white hover:text-blue-400">Environmental Impact</button>
            </div>
            <select className="bg-transparent border border-gray-700 rounded px-2 py-1 text-sm">
              <option>This Month</option>
            </select>
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold mb-2">Total Fuel Saved</h3>
            <p className="text-4xl font-bold">240.8K gallons</p>
          </div>
        </div>

        {/* Reuse your components */}
        <About ref={aboutRef} />
        <Features ref={servicesRef} />
        <Contact ref={contactRef} />
      </main>

      <footer className="border-t border-gray-800 mt-20 py-8 text-center text-gray-400">
        <p>&copy; 2024 Sentinelfuel. All rights reserved.</p>
        <a href="#top" className="text-blue-400 hover:underline mt-2 inline-block">
          Back to top
        </a>
      </footer>
    </div>
  );
}

export default Landing;
