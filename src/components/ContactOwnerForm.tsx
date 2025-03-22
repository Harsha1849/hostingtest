'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaClock, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ContactOwnerFormProps {
  propertyId: string;
  onClose?: () => void;
}

export default function ContactOwnerForm({ propertyId, onClose }: ContactOwnerFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure the date is in the correct format (YYYY-MM-DD)
      const formattedDate = new Date(formData.preferredDate).toISOString().split('T')[0];
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preferredDate: formattedDate,
          propertyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact request');
      }

      toast.success('Contact request sent successfully!');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting contact request:', error);
      toast.error('Failed to send contact request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-xl border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors text-gray-900 placeholder:text-gray-400";
  const labelClasses = "flex items-center text-sm font-medium text-gray-700";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className={labelClasses}>
          <FaUser className="w-4 h-4 text-gray-400 mr-2" />
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClasses}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          <FaEnvelope className="w-4 h-4 text-gray-400 mr-2" />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClasses}
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          <FaPhone className="w-4 h-4 text-gray-400 mr-2" />
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className={inputClasses}
          placeholder="Your phone number"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="preferredDate" className={labelClasses}>
            <FaCalendar className="w-4 h-4 text-gray-400 mr-2" />
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="preferredTime" className={labelClasses}>
            <FaClock className="w-4 h-4 text-gray-400 mr-2" />
            Preferred Time
          </label>
          <input
            type="time"
            id="preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          <FaComment className="w-4 h-4 text-gray-400 mr-2" />
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={inputClasses}
          placeholder="Any additional information you'd like to share..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl border border-transparent bg-blue-600 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            'Schedule Visit'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
