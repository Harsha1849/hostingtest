'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DashboardShell from '@/components/DashboardShell';
import { toast } from 'react-hot-toast';
import { FaHome, FaEye, FaHeart, FaEnvelope } from 'react-icons/fa';

interface Property {
  id: string;
  title: string;
  price: number;
  status: string;
  createdAt: string;
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  property: {
    title: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchProperties(),
      fetchContactRequests()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    }
  };

  const fetchContactRequests = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('Failed to fetch contact requests');
      const data = await response.json();
      setContactRequests(data);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      toast.error('Failed to load contact requests');
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    try {
      const response = await fetch(`/api/contact/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      // Refresh contact requests after update
      await fetchContactRequests();
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const stats = [
    {
      name: 'Total Properties',
      value: properties.length.toString(),
      icon: FaHome,
      change: 'Current',
      changeType: 'neutral',
    },
    {
      name: 'Available Properties',
      value: properties.filter(p => p.status === 'available').length.toString(),
      icon: FaEye,
      change: 'Active',
      changeType: 'increase',
    },
    {
      name: 'Pending Sales',
      value: properties.filter(p => p.status === 'pending').length.toString(),
      icon: FaHeart,
      change: 'In Progress',
      changeType: 'neutral',
    },
    {
      name: 'Contact Requests',
      value: contactRequests.length.toString(),
      icon: FaEnvelope,
      change: 'Total',
      changeType: 'increase',
    },
  ];

  // Get the 5 most recent properties
  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get the 5 most recent contact requests
  const recentRequests = [...contactRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center text-sm font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-green-600'
                      : stat.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Properties</h2>
            <div className="space-y-4">
              {recentProperties.length > 0 ? (
                recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <p className="text-sm text-gray-500">
                        Status: {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No properties found</p>
              )}
            </div>
          </div>

          {/* Recent Contact Requests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Contact Requests</h2>
            <div className="space-y-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{request.property.title}</p>
                      <p className="text-sm text-gray-500">
                        From: {request.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Visit: {new Date(request.preferredDate).toLocaleDateString()} at {request.preferredTime}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'PENDING' ? 'bg-amber-500 text-white' :
                      request.status === 'APPROVED' ? 'bg-emerald-500 text-white' :
                      request.status === 'REJECTED' ? 'bg-rose-500 text-white' :
                      'bg-slate-600 text-white'
                    }`}>
                      {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No contact requests found</p>
              )}
            </div>
            {contactRequests.length > 5 && (
              <div className="mt-4 text-right">
                <a href="/dashboard/contact-requests" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all requests →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}