'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Favorite {
  id: string;
  property: {
    id: string;
    title: string;
    price: number;
    address: string;
    city: string;
    state: string;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success('Property removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaHeart className="text-red-500 w-6 h-6 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4"> You haven&apos;t favorited any properties yet..</p>
          <Link
            href="/properties"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <Link
                    href={`/properties/${favorite.property.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {favorite.property.title}
                  </Link>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  ₹{favorite.property.price.toLocaleString('en-IN')}
                </p>
                <p className="text-gray-600 mt-2">
                  {favorite.property.address}, {favorite.property.city}, {favorite.property.state}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 