import React from 'react'
import { HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard } from 'react-icons/hi2'

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center cursor-pointer p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="p-4 bg-green-100 text-green-600 rounded-full mb-4">
            <HiShoppingBag className="text-5xl" />
          </div>
          <h4 className="tracking-widest text-sm font-semibold mb-2 uppercase text-gray-800">
            45 Days Return
          </h4>
          <p className="text-gray-600 text-sm">Money Back Guarantee</p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center cursor-pointer p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
            <HiArrowPathRoundedSquare className="text-5xl" />
          </div>
          <h4 className="tracking-widest text-sm font-semibold mb-2 uppercase text-gray-800">
            Secure Checkout
          </h4>
          <p className="text-gray-600 text-sm">100% Safe Payment</p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center p-6 cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full mb-4">
            <HiOutlineCreditCard className="text-5xl" />
          </div>
          <h4 className="tracking-widest text-sm font-semibold mb-2 uppercase text-gray-800">
            Free Shipping
          </h4>
          <p className="text-gray-600 text-sm">On orders over Rs 1000</p>
        </div>

      </div>
    </section>
  )
}

export default FeatureSection
