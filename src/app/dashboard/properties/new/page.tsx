'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'house',
    status: 'available',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    features: [] as string[],
    images: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse numeric values before sending
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        features: formData.features.filter(Boolean), // Remove empty features
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create property');
      }

      toast.success('Property created successfully!');
      router.push('/dashboard/properties');
      router.refresh();
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter property title"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Describe the property"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-900">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-900">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="site">Site</option>
                <option value="rental-house">Rental House</option>
                <option value="farm">Farm</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-900">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-900">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter street address"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-900">City</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-gray-900">State</label>
            <input
              type="text"
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter state"
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-900">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              required
              value={formData.zipCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter ZIP code"
            />
          </div>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-900">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              min="0"
              value={formData.bedrooms}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Number of bedrooms"
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-semibold text-gray-900">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              min="0"
              step="0.5"
              value={formData.bathrooms}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Number of bathrooms"
            />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-semibold text-gray-900">Area (sqft)</label>
            <input
              type="number"
              id="area"
              name="area"
              min="0"
              value={formData.area}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Property area"
            />
          </div>
        </div>

        {/* Features Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Features</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter a feature"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <FaPlus /> Add Feature
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
} 
