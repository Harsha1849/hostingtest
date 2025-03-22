'use client';

import Link from 'next/link';
import { FaSearch, FaHome, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const staggerChildren = {
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

const searchBoxVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.5
    }
  }
};

// Loading skeleton component
function PropertySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Properties list component
function PropertiesList({ properties }) {
  if (properties.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-600">No properties found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
      {properties.map((property) => (
        <motion.div
          key={property.id}
          variants={scaleIn}
          whileHover={{ y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/properties/${property.id}`}
            className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={property.images?.[0] || '/placeholder-house.jpg'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
              <p className="text-2xl font-bold text-blue-700 mb-4">
                ₹{property.price.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-4 text-gray-700 flex-wrap">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>{property.city}, {property.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBed className="text-blue-600" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBath className="text-blue-600" />
                  <span>{property.bathrooms} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaRulerCombined className="text-blue-600" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// Properties section component
function PropertiesSection() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProperties() {
      try {
        const response = await fetch('/api/public/properties?limit=6');
        const data = await response.json();
        if (mounted) {
          setProperties(data);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        if (mounted) {
          setProperties([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="text-3xl font-bold text-gray-900 text-center mb-12"
      >
        Featured Properties
      </motion.h2>
      {isLoading ? (
        <PropertySkeleton />
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <PropertiesList properties={properties} />
        </motion.div>
      )}
    </section>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            scale: {
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            },
            opacity: {
              duration: 1.5,
              ease: "easeOut"
            }
          }}
          className="absolute inset-0 bg-cover bg-center transform"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          }}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
          />
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"
        >
          <motion.div
            variants={heroTextVariants}
            className="mb-8"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              animate={{ 
                backgroundPosition: ["0%", "100%"],
                transition: { 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              Sri Basaveshwara Real Estate
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-200"
              variants={fadeInUp}
            >
              Your Trusted Partner in Property Since 1998
            </motion.p>
          </motion.div>

          <motion.div
            // variants={searchBoxVariants}
            // className="backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-2xl"
          >
            {/* <div className="flex flex-col md:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <input
                  type="text"
                  placeholder="Enter location..."
                  className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 shadow-inner"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <select className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-inner">
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="site">Site</option>
                  <option value="rental-house">Rental House</option>
                  <option value="farm">Farm</option>
                </select>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-semibold"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaSearch className="text-lg" />
                </motion.div>
                Search
              </motion.button>
            </div> */}
          </motion.div>
        </motion.div>
      </section>

      {/* About Owner Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Image Column */}
            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/owner-image.jpg"
                  alt="Shivakumar & Lallithamma - Real Estate Experts"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl"
              >
                <p className="text-4xl font-bold text-blue-600">27+</p>
                <p className="text-gray-600">Years of Excellence</p>
              </motion.div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              variants={fadeInUp}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
                  Sri Basaveshwara Real Estate - A Legacy of Trust
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Founded by Mr. Shivakumar & Mrs. Lallithamma, Sri Basaveshwara Real Estate has been a cornerstone of trust in the real estate market for nearly 3 decades. Our family-oriented approach and deep-rooted values have made us the most reliable name in property dealings.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-gray-900">Why Choose Us?</h3>
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Since 1998</h3>
                    <p className="text-gray-600">27 years of excellence in serving our community with honesty and dedication.</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Extensive Property Network</h3>
                    <p className="text-gray-600">Access to the best properties in the region with transparent dealings.</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Market Experts</h3>
                    <p className="text-gray-600">Deep understanding of local property markets and investment opportunities.</p>
                  </div>
                </motion.div>
              </div>

              <div className="pt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                >
                  <blockquote className="text-gray-700 italic">
                    "At Sri Basaveshwara Real Estate, we believe in building relationships, not just closing deals. Our commitment to values and transparency has made us the most trusted name in real estate for the past 27 years."
                  </blockquote>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <p className="font-display font-semibold text-blue-600">Sri Basaveshwara Real Estate</p>
                  </div>
                </motion.div>
        </div>

              <div className="flex gap-4 pt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-50 p-4 rounded-xl text-center flex-1"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-1">1000+</p>
                  <p className="text-gray-600">Properties Sold</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-50 p-4 rounded-xl text-center flex-1"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-1">98%</p>
                  <p className="text-gray-600">Client Satisfaction</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-50 p-4 rounded-xl text-center flex-1"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-1">24/7</p>
                  <p className="text-gray-600">Support</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PropertiesSection />
      </div>
    </div>
  );
}