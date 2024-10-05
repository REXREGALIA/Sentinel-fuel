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
