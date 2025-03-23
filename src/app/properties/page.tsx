'use client';

import { useState, useEffect } from 'react';
import { FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  state: string;
  images: string[];
}

// const propertyTypes = ['All Types', 'House', 'Apartment', 'Site', 'Rental House', 'Farm'];
// const priceRanges = [
//   { label: 'All Prices', min: 0, max: Infinity },
//   { label: 'Under ₹20,00,000', min: 0, max: 2000000 },
//   { label: '₹20,00,000 - ₹40,00,000', min: 2000000, max: 4000000 },
//   { label: '₹40,00,000 - ₹60,00,000', min: 4000000, max: 6000000 },
//   { label: '₹60,00,000+', min: 6000000, max: Infinity },
// ];

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [showFilters, setShowFilters] = useState(false);
  // const [selectedType, setSelectedType] = useState('All Types');
  // const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${property.city}, ${property.state}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || property.type.toLowerCase() === selectedType.toLowerCase();
    
    const selectedRange = priceRanges.find(range => range.label === selectedPriceRange);
    const matchesPrice = property.price >= selectedRange!.min && property.price <= selectedRange!.max;

    return matchesSearch && matchesType && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filter Section */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                {/* <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                {/* <input
                  type="text"
                  placeholder="Search by title or location..."
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> */}
              </div>
            </div>
            <motion.button
              // whileHover={{ scale: 1.02 }}
              // whileTap={{ scale: 0.98 }}
              // onClick={() => setShowFilters(!showFilters)}
              // className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <FaFilter />
              {/* Filters */}
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                // initial={{ opacity: 0, height: 0 }}
                // animate={{ opacity: 1, height: 'auto' }}
                // exit={{ opacity: 0, height: 0 }}
                // transition={{ duration: 0.3 }}
                // className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
              >
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select> */}
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                  >
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/properties/${property.id}`}>
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* <div className="relative h-64">
                    <img
                      src={property.images?.[0] || '/placeholder-house.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                      {property.status}
                    </div>
                  </div> */}
                  <div className="relative h-64">
  <Image
    src={property.images?.[0] || '/placeholder-house.jpg'}
    alt={property.title}
    layout="fill" // Ensures the image covers the div
    objectFit="cover" // Maintains aspect ratio while filling the space
    priority // Improves performance for above-the-fold images
  />
  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
    {property.status}
  </div>
</div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      ₹{property.price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="line-clamp-1">{property.city}, {property.state}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaBed className="text-blue-500" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBath className="text-blue-500" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaRulerCombined className="text-blue-500" />
                        <span>{property.area}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        <AnimatePresence>
          {filteredProperties.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 