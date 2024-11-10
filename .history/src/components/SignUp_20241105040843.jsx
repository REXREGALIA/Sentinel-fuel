import React, { useContext, useState, useEffect } from "react";
import signupimg from "../assets/signup_img.png";
import { useNavigate } from "react-router-dom";
import logo from "../assets/fuel_logo.png";
import ggl from "../assets/google_img.png";
import { Toaster, toast } from "sonner";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthContext } from "../AuthContext";

const Signup = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the profile with the display name
      await updateProfile(user, { displayName: name });

      // Store the user's UID in local storage
      localStorage.setItem('userId', user.uid);

      console.log("Display Name:", user.displayName); // Check if displayName is set

      toast.success("Account created successfully!");
      navigate("/home");
    } catch (error) {
      console.log("Error:", error);
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  // Add oil drops animation
  useEffect(() => {
    const createDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'oil-drop';
      
      // Random position, size, and animation properties
      const size = Math.random() * 40 + 15; // Slightly larger drops
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 3; // Slower falling
      const delay = Math.random() * 2;
      const opacity = Math.random() * 0.3 + 0.1; // Random opacity
      
      drop.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
      `;
      
      document.getElementById('signup-drops-container').appendChild(drop);
      
      // Remove drop after animation
      setTimeout(() => {
        drop.remove();
      }, (duration + delay) * 1000);
    };

    // Create drops periodically
    const interval = setInterval(createDrop, 400); // Slightly more frequent drops
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Oil Drops Container */}
      <div id="signup-drops-container" className="absolute inset-0 pointer-events-none">
        {/* Drops will be added here dynamically */}
      </div>

      {/* Add these styles to your global CSS or in a style tag */}
      <style>
        {`
          .oil-drop {
            position: absolute;
            top: -50px;
            background: linear-gradient(145deg, 
              rgba(30, 64, 175, 0.4), 
              rgba(30, 64, 175, 0.1),
              rgba(59, 130, 246, 0.2)
            );
            border-radius: 50%;
            backdrop-filter: blur(8px);
            animation: dropFall linear forwards;
            box-shadow: 
              inset 0 0 20px rgba(255, 255, 255, 0.15),
              0 0 25px rgba(30, 64, 175, 0.3);
            transform-origin: center;
          }

          @keyframes dropFall {
            0% {
              transform: translateY(0) scale(1) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(100vh) scale(0.8) rotate(360deg);
              opacity: 0;
            }
          }

          /* Enhanced shimmer effect */
          .oil-drop::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            background: linear-gradient(
              45deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 45%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0.1) 55%,
              transparent 100%
            );
            animation: shimmer 3s infinite;
            transform: scale(1.1);
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%) rotate(0deg);
            }
            100% {
              transform: translateX(100%) rotate(360deg);
            }
          }

          /* Additional wobble animation */
          .oil-drop {
            animation: dropFall linear forwards, wobble 2s ease-in-out infinite;
          }

          @keyframes wobble {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(10px);
            }
          }
        `}
      </style>

      <Toaster position="bottom-right" />
      <div className="container mx-auto px-4 py-8 h-full relative z-10">
        <div className="flex flex-wrap items-center justify-center h-full">
          {/* Form Section */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="bg-gray-800 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img src={logo} alt="logo" className="w-16 h-16 object-contain" />
              </div>

              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Create your Account
                </h2>
                <p className="text-gray-400">Let's Get Started with FuelFlow</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Google Sign In */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-600 rounded-xl hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <img src={ggl} alt="Google" className="w-5 h-5" />
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-200">
                    Sign In with Google
                  </span>
                </button>

                {/* Divider with Fuel Icons */}
                <div className="relative flex items-center my-8">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <div className="flex-shrink-0 px-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    <span className="text-gray-400 text-sm">or continue with</span>
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                  />
                  <label className="ml-2 text-sm text-gray-300">
                    I agree to the terms and conditions
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-blue-500/20 hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Sign up"
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-400 mt-6">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200"
                  >
                    Log in
                  </button>
                </p>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block md:w-1/2 lg:w-2/5 pl-12">
            {/* <img
              src={signupimg}
              alt="Sign up illustration"
              className="w-full h-auto object-contain max-w-lg mx-auto drop-shadow-2xl"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;