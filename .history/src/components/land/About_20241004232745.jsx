import React, { forwardRef } from 'react';

const About = forwardRef((props, ref) => (
  <section ref={ref} className="mt-20">
    <h2 className="text-3xl font-bold mb-10">About Us</h2>
    <p className="text-gray-400">
      Sentinelfuel is dedicated to helping businesses optimize fuel consumption through cutting-edge IOT technology.
    </p>
  </section>
));

export default About;
