'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaHome, FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from '@/components/ContactModal';
import { useParams } from 'next/navigation';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  images: string[];
  features: string[];
  type: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-gray-900">Property Not Found</h1>
          <p className="mt-2 text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Property Title and Price */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-display font-bold text-gray-900"
                >
                  {property.title}
                </motion.h1>
                <p className="text-lg text-gray-600 mt-2 flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <p className="text-3xl md:text-4xl font-display font-bold text-blue-600">
                  ₹{property.price.toLocaleString('en-IN')}
                </p>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold mt-2 ${
                  property.status === 'available' ? 'bg-green-100 text-green-800' :
                  property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Property Images */}
          <div className="relative bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                    <FaHome className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="font-display font-semibold text-gray-900">{property.type}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                    <FaBed className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-600">Bedrooms</span>
                    <span className="font-display font-semibold text-gray-900">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                    <FaBath className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-600">Bathrooms</span>
                    <span className="font-display font-semibold text-gray-900">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                    <FaRuler className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-600">Area</span>
                    <span className="font-display font-semibold text-gray-900">{property.area} sqft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">Contact Owner</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FaHome className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium">{property.user.name}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCalendar />
                    Schedule a Visit
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyId={property.id}
      />
    </div>
  );
} 