import React from "react";
import { Link } from "react-router-dom";

const FeatureCollection = () => {
  return (
    <section className="py-20 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-gradient-to-r from-green-100 to-green-50 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Content */}
        <div className="lg:w-1/2 p-10 text-center lg:text-left space-y-6">
          <h2 className="text-base font-semibold text-green-700 tracking-widest uppercase">
            Comfort Meets Style
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Apparel Made for You
          </h1>
          <p className="text-lg text-gray-700">
            Discover high-quality, comfortable clothing that effortlessly
            blends fashion and function. Designed to make you look and feel
            great every day.
          </p>
          <Link
            to="/collections"
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-500 transition duration-300"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2">
          <img
            src="https://i.postimg.cc/Dygp7Mqj/featured.webp"
            alt="FeatureImg"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureCollection;
