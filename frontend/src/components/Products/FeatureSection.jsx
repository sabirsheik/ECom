import React from 'react'
import { HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard } from 'react-icons/hi2'

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Feature 1 */}
        <div className="premium-panel flex cursor-pointer flex-col items-center p-6 transition-shadow duration-300 hover:shadow-[var(--shadow)]">
          <div className="p-4 bg-green-100 text-green-600 rounded-full mb-4">
            <HiShoppingBag className="text-5xl" />
          </div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--ink)]">
            45 Days Return
          </h4>
          <p className="text-sm text-[var(--ink-soft)]">Money Back Guarantee</p>
        </div>

        {/* Feature 2 */}
        <div className="premium-panel flex cursor-pointer flex-col items-center p-6 transition-shadow duration-300 hover:shadow-[var(--shadow)]">
          <div className="mb-4 bg-[var(--paper)] p-4 text-[var(--bronze-deep)]">
            <HiArrowPathRoundedSquare className="text-5xl" />
          </div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--ink)]">
            Secure Checkout
          </h4>
          <p className="text-sm text-[var(--ink-soft)]">100% Safe Payment</p>
        </div>

        {/* Feature 3 */}
        <div className="premium-panel flex cursor-pointer flex-col items-center p-6 transition-shadow duration-300 hover:shadow-[var(--shadow)]">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full mb-4">
            <HiOutlineCreditCard className="text-5xl" />
          </div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--ink)]">
            Free Shipping
          </h4>
          <p className="text-sm text-[var(--ink-soft)]">On orders over Rs 1000</p>
        </div>

      </div>
    </section>
  )
}

export default FeatureSection
