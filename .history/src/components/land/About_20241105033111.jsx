import React, { forwardRef } from "react";

const About = forwardRef((props, ref) => (
  <section ref={ref} className="mt-20">
    <h2 className="text-3xl font-bold mb-10">About Us</h2>
    <p className="text-gray-400">
    Sentinel Fuel is a fuel logistics platform aimed at securing fuel transportation by minimizing theft and loss. Designed for middlemen overseeing tanker deliveries, our system monitors tanker routes and fuel levels to ensure secure and transparent fuel distribution. While we aim to integrate advanced GPS and flowmeter tracking, our current model uses innovative methods to simulate route monitoring and fuel tracking. Sentinel Fuel is committed to safe, efficient, and accountable fuel logistics.
    </p>

    <p className="text-gray-400">
      Our system envisions integrating IoT devices like flow meters and GPS
      trackers in tankers to monitor fuel levels in real-time and track exact
      locations. However, in our current phase, we are leveraging innovative
      methods to estimate distances and simulate tracking functionality to
      provide valuable insights into tanker routes and fuel consumption. Our
      mission is to create a transparent and reliable transport chain that
      empowers fuel managers to ensure that every drop of fuel reaches its
      destination securely.
    </p>

    <p className="text-gray-400">
      Thank you for choosing Sentinel Fuel—where secure fuel logistics drive
      sustainable business growth.
    </p>

  </section>
));

export default About;
