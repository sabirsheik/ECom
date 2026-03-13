import React from 'react'
import { Link } from 'react-router-dom'

const GenderCollectionSection = () => {
    const man = "https://i.postimg.cc/5tHbgm44/man.jpg";
    const woman = "https://i.postimg.cc/9XPVL0h7/woman.jpg";
  return (
    <>
      <section className='py-16 px-4 lg:px-0'>
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
          {/* Woman's Collections */}
          <div className="relative flex-1">
            <img 
              src={woman} 
              alt="Woman's Collections" 
              className='w-full h-[500px] object-cover rounded-lg shadow-xl transition-transform duration-500 ease-in-out transform hover:scale-105'
            />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
              <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Woman's Collections</h2>
              <Link to="/collections?gender=Women" className="text-gray-800 underline text-base hover:text-e-hover">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Man's Collections */}
          <div className="relative flex-1">
            <img 
              src={man} 
              alt="Man's Collections" 
              className='w-full h-[500px] object-cover rounded-lg shadow-xl transition-transform duration-500 ease-in-out transform hover:scale-105'
            />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
              <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Man's Collections</h2>
              {/* <Link to="/collection/all?gender=Man" className="text-gray-800 underline text-base hover:text-e-hover"> */}
              <Link to="/collections?gender=Men" className="text-gray-800 underline text-base hover:text-e-hover">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
};

export default GenderCollectionSection;
