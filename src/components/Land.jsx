import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [showLogo, setShowLogo] = useState(false)
  const [showHeading, setShowHeading] = useState(false)

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 500)
    const headingTimer = setTimeout(() => setShowHeading(true), 2000)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(headingTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 rounded-lg max-w-5xl mx-auto mt-0 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <img src="src/assets/fuel_logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xl font-semibold">Sentinelfuel</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-400">Home</a>
            <a href="#" className="hover:text-blue-400">About</a>
            <a href="#" className="hover:text-blue-400">Services</a>
            <a href="#" className="hover:text-blue-400">Contact</a>
          </nav>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gold-light">
              Book a call
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
              SignUp
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-8">
              <img src="src/assets/user1.jpeg" alt="User 1" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="w-8 h-8">
              <img src="src/assets/user1.jpeg" alt="User 2" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="w-8 h-8">
              <img src="src/assets/user1.jpeg" alt="User 3" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-sm text-gray-400">Trusted by the Dealers</span>
          </div>
          
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
          <button className="px-8 py-3 text-lg font-semibold text-black bg-white rounded-md hover:bg-gray-200">
            Get started for free
          </button>
        </div>

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

        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-10">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-gray-400">
                We ensure top-notch quality in all our products and services.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Solutions</h3>
              <p className="text-gray-400">
                Tailored solutions to meet your business requirements.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                We are here to assist you anytime, any day.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 mt-20 py-8 text-center text-gray-400">
        <p>&copy; 2024 Sentinelfuel. All rights reserved.</p>
        <a href="#top" className="text-blue-400 hover:underline mt-2 inline-block">
          Back to top
        </a>
      </footer>
    </div>
  )
}

export default App