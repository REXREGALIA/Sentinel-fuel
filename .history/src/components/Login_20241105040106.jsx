import React, { useState } from "react";
import login_img from "../assets/login_img.png";
import logo from "../assets/fuel_logo.png";
import ggl from "../assets/google_img.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleSignup() {
    navigate("/signup");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(name);
    // console.log(email);
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('userId', user.uid);
      setLoading(false);
      navigate("/home");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Login failed. Please check your credentials.");
    }

    // toast("Sign up successfull");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="flex flex-wrap items-center justify-center h-full">
          {/* Image Section - Now on the left */}
          <div className="hidden md:block md:w-1/2 lg:w-2/5 pr-12">
            <img
              src={login_img}
              alt="Login illustration"
              className="w-full h-auto object-contain max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="bg-gray-800 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img src={logo} alt="logo" className="w-16 h-16 object-contain" />
              </div>

              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
                <p className="text-gray-400">Please enter your details</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields */}
                <div className="space-y-6">
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
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                    />
                    <label className="ml-2 text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Forgot Password?
                  </a>
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
                    "Log in"
                  )}
                </button>

                {/* Divider with Fuel Icons */}
                <div className="relative flex items-center my-8">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <div className="flex-shrink-0 px-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
    <div className=" h-screen ">
      <div className="bg-gray-100 relative flex p-4 justify-around h-screen w-screen">
        <div className=" md:block md:w-2/5 hidden md:flex md:justify-center md:items-center">
          <img src={login_img} alt="photo" className="" />
        </div>

        <div className="relative z-2 p-16 bg-white rounded-lg shadow-lg h-full w-full md:w-2/5 gap-4">
          <div className="flex justify-center items-center">
            <img src={logo} alt="logo" className="w-1/6 h-1/6" />
          </div>

          <div className="flex flex-col items-center justify-center my-10">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-400">Please enter your details</p>
          </div>

          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-gray-900 ">Email</p>
              <input
                type="email"
                className="border-b-2 border-b-gray-700 outline-none bg-transparent "
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                required
              />

              <p className="text-gray-900 ">Password</p>
              <input
                type="password"
                className="border-b-2 border-b-gray-700  outline-none bg-transparent"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                required
              />

              <div className="flex justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="text-gray-700 text-sm">Remember me</p>
                </div>

                <a href="" className="text-gray-400 text-sm">
                  Forgot Password?
                </a>
              </div>

              <button
                className={`mt-5 bg-black text-white rounded-full p-3 font-bold text-sm ${
                  loading && "cursor-not-allowed opacity-50"
                }`}
                type="submit"
              >
                {loading ? "Loading" : "Log in"}
              </button>

              <button
                className="bg-[#E9E9E9] text-black rounded-full p-1 font-bold text-sm flex justify-center items-center gap-4"
                type="submit"
              >
                <img src={ggl} alt="" className="w-1/12 h-1/12" />
                Login with Google
              </button>

              <p className="text-sm flex justify-center items-center mt-5">
                Dont have a account?
                <a className="font-bold cursor-pointer" onClick={handleSignup}>
                  &nbsp; Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
