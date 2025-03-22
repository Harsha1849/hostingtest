'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  price: number;
  status: string;
  city: string;
  state: string;
  images: string[];
}

export default function PropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          {session?.user?.isOwner && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/dashboard/properties/new"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                Add New Property
              </Link>
            </motion.div>
          )}
        </motion.div>

        {properties.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <p className="text-xl text-gray-600 mb-4">No properties found.</p>
            {session?.user?.isOwner && (
              <Link
                href="/dashboard/properties/new"
                className="text-blue-600 hover:text-blue-700 font-semibold text-lg hover:underline"
              >
                Add your first property
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={property.images?.[0] || '/placeholder-house.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                      {property.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                      {property.title}
                    </h2>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      ₹{property.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-600 mb-4">
                      {property.city}, {property.state}
                    </p>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link
                          href={`/properties/${property.id}`}
                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                          title="View Property"
                        >
                          <FaEye size={20} />
                        </Link>
                      </motion.div>
                      {session?.user?.isOwner && (
                        <>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link
                              href={`/dashboard/properties/${property.id}/edit`}
                              className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                              title="Edit Property"
                            >
                              <FaEdit size={20} />
                            </Link>
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-red-600 hover:text-red-700 transition-colors"
                            title="Delete Property"
                          >
                            <FaTrash size={20} />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
} 