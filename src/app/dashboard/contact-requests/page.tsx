'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import DashboardShell from '@/components/DashboardShell';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
  property: {
    title: string;
  };
}

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch contact requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      toast.error('Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      toast.success('Status updated successfully');
      fetchContactRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update status');
    }
  };

  const content = loading ? (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ) : requests.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-gray-600">No contact requests found.</p>
    </div>
  ) : (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {requests.map((request) => (
          <li key={request.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  Property: {request.property.title}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>From: {request.name} ({request.email})</p>
                  <p>Phone: {request.phone}</p>
                  <p>Preferred Date: {format(new Date(request.preferredDate), 'PPP')}</p>
                  <p>Preferred Time: {request.preferredTime}</p>
                  {request.message && (
                    <p className="mt-2">Message: {request.message}</p>
                  )}
                  <p className="mt-2">
                    Requested on: {format(new Date(request.createdAt), 'PPP')}
                  </p>
                </div>
              </div>
              <div className="ml-6">
                <select
                  value={request.status}
                  onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                    request.status === 'PENDING' ? 'bg-amber-50 border-amber-300 text-amber-800 focus:ring-amber-500' :
                    request.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 focus:ring-emerald-500' :
                    request.status === 'REJECTED' ? 'bg-rose-50 border-rose-300 text-rose-800 focus:ring-rose-500' :
                    request.status === 'COMPLETED' ? 'bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-500' :
                    'border-gray-300'
                  }`}
                >
                  <option value="PENDING" className="bg-amber-50 text-amber-800">Pending</option>
                  <option value="APPROVED" className="bg-emerald-50 text-emerald-800">Approved</option>
                  <option value="REJECTED" className="bg-rose-50 text-rose-800">Rejected</option>
                  <option value="COMPLETED" className="bg-blue-50 text-blue-800">Completed</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contact Requests</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage contact requests from potential clients.
          </p>
        </div>
        {content}
      </div>
    </DashboardShell>
  );
} 
//         </div>
//         {content}
//       </div>
//     </DashboardShell>
//   );
// } 