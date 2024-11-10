import React, { forwardRef } from "react";

const About = forwardRef((props, ref) => (
  <section ref={ref} className="mt-20">
    <h2 className="text-3xl font-bold mb-10">About Us</h2>
    <p className="text-gray-400">
      Welcome to Sentinel Fuel, a dedicated solution for enhancing
      accountability and security in fuel transportation. Our platform is
      designed for middlemen who manage fuel tankers and oversee fuel deliveries
      to petrol stations. Sentinel Fuel addresses a critical issue in fuel
      logistics: minimizing fuel theft and safeguarding against potential
      monetary losses during transit. 
      Our system envisions integrating IoTdevices like flow meters and GPS trackers in tankers to monitor fuel
      levels in real-time and track exact locations. However, in our current
      phase, we are leveraging innovative methods to estimate distances and
      simulate tracking functionality to provide valuable insights into tanker
      routes and fuel consumption. Our mission is to create a transparent and
      reliable transport chain that empowers fuel managers to ensure that every
      drop of fuel reaches its destination securely. Thank you for choosing
      Sentinel Fuel—where secure fuel logistics drive sustainable business
      growth.
    </p>
  </section>
));

export default About;
