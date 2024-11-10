import React, { forwardRef } from "react";

const About = forwardRef((props, ref) => (
  <section ref={ref} className="mt-20">
    <h2 className="text-3xl font-bold mb-10">About Us</h2>
    <p className="text-gray-400 mx-100">
      Sentinel Fuel is a fuel logistics platform aimed at securing fuel
      transportation by minimizing theft and loss. Designed for middlemen
      overseeing tanker deliveries, our system monitors tanker routes and fuel
      levels to ensure secure and transparent fuel distribution. While we aim to
      integrate advanced GPS and flowmeter tracking, our current model uses
      innovative methods to simulate route monitoring and fuel tracking.
      Sentinel Fuel is committed to safe, efficient, and accountable fuel
      logistics.
    </p>

    
  </section>
));

export default About;
