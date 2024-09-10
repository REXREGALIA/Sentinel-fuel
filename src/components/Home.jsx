import React, { useContext, useState } from "react";
import { Toaster, toast } from "sonner";
import Card from "../components/Card";
import logo from "../assets/fuel_logo.png"
import Forms from "../components/Forms";
import { AuthContext } from "../AuthContext";


const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false); // State to track form visibility

  const handleClick = () => {
    setShowForm(!showForm); // Toggle the form visibility
  };

  return (
    <>
      <div className="bg-white flex h-screen w-full gap-10">

        <div className="flex flex-col justify-evenly items-center font-semibold text-xl w-1/6 bg-yellow-100 h-screen border-2 border-blue-800 rounded-lg">

          <div className="flex justify-center items-center">
            <img src={logo} alt="logo"  className="w-1/4 h-11/12"/>
            <h1>&nbsp; Sentinel Fuel</h1>
          </div>

          <div className="flex flex-col gap-6">
            <p>Add Driver</p>
            <p>Add Petrol Pump</p>
            <p>Live Truck</p>
            <p>Settings</p>
            <p>Log Out</p>
          </div>

        </div>

        <div className="w-9/12 flex flex-col justify-start gap-10 mt-5 h-full">

          <div className="flex items-center justify-center">
            <h1>Hello {currentUser.displayName}</h1>
          </div>

          <div className="p-5 w-full bg-[#F9F9F9] h-fit rounded-2xl z-2 shadow-2xl ">
            <p>Analytics</p>
            <h1>Total Amount Due</h1>
            <h2>Total number of trucks live</h2>
          </div>

          <div className="bg-[#f9f9f9] z-2 w-max hover:border-2 hover:text-black hover:bg-white hover:border-pink-200 shadow-md p-2 rounded-md flex">
            {/* <p>Add New Orders</p> */}
            <button onClick={handleClick}> Add new stations +</button>
          </div>

          {showForm && (
            <div className={`w-full bg-orange-100 p-5 rounded-md shadow-md`}>
              <Forms />
            </div>
          )}

          <div className={`flex flex-wrap gap-10 ${showForm && "hidden"}`}>
            <Card id="hp pump" add="mohan Nagar" />
            <Card id="Jio" add="jhilmil" />
            <Card id="Reliance" add="dilshad Garden" />
          </div>

        </div>


      </div>
    </>
  );
};

export default Home;
