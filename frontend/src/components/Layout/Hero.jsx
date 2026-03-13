import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  "https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?q=80&w=1628&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1715609104589-97585b210c6e?q=80&w=1545&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1546213290-e1b492ab3eee?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D8",
  "https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1601754664414-aa3e4f42e6d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1732563560972-1d2bd22bc3cc?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const Hero = () => {
  return (
    // Hero Section
    <section className="relative w-full h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={false}
        className="w-full h-full z-0"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={`Slide ${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 px-4">
        <div className="text-center text-white max-w-2xl">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold uppercase mb-4 leading-tight">
            Vacation <br />
            <span>Ready</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg mb-6">
            Explore Our Vacation Outfits with Fast National Shipping
          </p>
          <Link
            to="#"
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full text-lg shadow-md hover:bg-e-black hover:text-white transition-all duration-300 ease-in-out"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Custom Pagination Style */}
      <style>{`
        .swiper-pagination-bullet {
          background-color: #007474 /* Orange color */
        }
        .swiper-pagination-bullet-active {
          background-color: #007474 !important; /* Active bullet color */
        }
      `}</style>
    </section>
  );
};

export default Hero;
