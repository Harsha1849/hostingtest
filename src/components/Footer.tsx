'use client';

import Link from 'next/link';
import { FaHome, FaPhone, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            <Link href="/" className="text-2xl font-display font-bold text-white">
              Sri Basaveshwara Real Estate
            </Link>
            <p className="text-gray-400 mt-4">
              Your trusted partner in real estate since 2003. We bring decades of experience and integrity to every property transaction.
            </p>
            <div className="mt-4">
              <p className="text-gray-400">Owners:</p>
              <p className="text-white font-semibold">Mr. Shivakumar & Mrs. Lallithamma</p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-bold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <FaHome className="text-blue-500" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <FaBuilding className="text-blue-500" />
                  <span>Properties</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-bold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FaPhone className="text-blue-500" />
                <a href="tel:+919731436993">+91 97314 36993</a>
              </div>
              {/* <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FaWhatsapp className="text-blue-500" />
                <a href="https://wa.me/919449782786">+91 94497 82786</a>
              </div> */}
              <div className="flex items-start gap-2 text-gray-400">
                <FaMapMarkerAlt className="text-blue-500 mt-1" />
                <p>Sri Basaveshwara Real Estate<br />Near Bandemarrama Bus Stand<br />Nagarbhavi 9th Block Bengaluru, Karnataka</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} Sri Basaveshwara Real Estate. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
} 