import React, { forwardRef } from 'react';

const Features = forwardRef((props, ref) => (
  <section ref={ref} className="mt-20">
    <h2 className="text-3xl font-bold mb-10">Our Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">High Quality</h3>
        <p className="text-gray-400">We ensure top-notch quality in all our products and services.</p>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Accuracy</h3>
        <p className="text-gray-400">We ensure accuracy over oil transaction during its transportation</p>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Dealer friendly</h3>
        <p className="text-gray-400">We ensure smooth interaction with the oil tank dealer </p>
      </div>
    </div>
  </section>
));

export default Features;
