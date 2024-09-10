import React, { useContext, useState } from "react";
import login from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import logo from "../assets/fuel_logo.png";
import ggl from "../assets/google_img.png";
import { Toaster, toast } from "sonner";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthContext } from "../AuthContext";

const SignIn = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigate("/");
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


      console.log("Display Name:", user.displayName); // Check if displayName is set

      navigate("/home");
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-screen">
      <div className="bg-white relative flex p-6 justify-around w-screen">
        <div className="relative z-2 p-16 bg-white rounded-lg shadow-lg h-full w-full md:w-2/5 gap-4">
          <div className="flex justify-center items-center">
            <img src={logo} alt="logo" className="w-1/6 h-1/6" />
          </div>

          <div className="flex flex-col items-center justify-center my-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your Account
            </h2>
            <p className="text-gray-400">Lets Get Started</p>
          </div>

          <div className="">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <button
                className="bg-white border-2 border-black  text-black rounded-full p-1 font-bold text-sm flex justify-center items-center gap-2"
                type="submit"
              >
                <img src={ggl} alt="" className="w-1/12 h-1/12" />
                Sign In with Google
              </button>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <p className="text-gray-900 ">Name</p>
              <input
                type="name"
                className="border-b-2 border-b-gray-700 outline-none bg-transparent "
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                required
              />

              <p className="text-gray-900 ">Email</p>
              <input
                type="email"
                className="border-b-2 border-b-gray-700  outline-none bg-transparent"
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

              <div className="flex justify-center items-center w-full">
                <input type="checkbox" />
                <p className="text-gray-700 text-sm">
                  &nbsp; I agree to the terms and conditions
                </p>
              </div>

              <button
                className={`mt-5 bg-black text-white rounded-full p-3 font-bold text-sm ${
                  loading && "cursor-not-allowed opacity-50"
                }`}
                type="submit"
              >
                {loading ? "Loading..." : "Sign up"}
              </button>

              <p className="text-sm flex justify-center items-center mt-5">
                Already have a account?
                <a className="font-bold cursor-pointer" onClick={handleLogin}>
                  &nbsp; Log in
                </a>
              </p>
            </form>
          </div>
        </div>

        <div className=" md:block md:w-2/5 hidden md:flex md:justify-center md:items-center">
          <img src={login} alt="photo" className="" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
