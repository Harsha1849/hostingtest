'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaUser, FaBars, FaTimes, FaHome, FaBuilding, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-gradient-to-b from-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
          >
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Sri Basaveshwara Real Estate
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6 ml-10">
              <Link 
                href="/" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </Link>
              <Link 
                href="/properties" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <FaBuilding className="text-lg" />
                <span>Properties</span>
              </Link>
              {session?.user?.isOwner && (
                <Link 
                  href="/dashboard/properties" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaChartLine className="text-lg" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
          >
            {session ? (
              <div className="flex items-center space-x-4">
                <motion.span 
                  className={`${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
                  whileHover={{ scale: 1.05 }}
                >
                  {session.user?.name}
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border border-white/50 text-white/90 hover:bg-white/10 hover:border-white hover:text-white'
                  }`}
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn('google')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white/10 text-white backdrop-blur-sm border border-white/50 hover:bg-white/20'
                }`}
              >
                <FaUser />
                <span>Sign In</span>
              </motion.button>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden flex items-center"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              <Link
                href="/properties"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaBuilding />
                <span>Properties</span>
              </Link>
              {session?.user?.isOwner && (
                <Link
                  href="/dashboard/properties"
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaChartLine />
                  <span>Dashboard</span>
                </Link>
              )}
              {session ? (
                <>
                  <div className="px-4 py-3 text-gray-700 font-medium">
                    {session.user?.name}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signIn('google');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <FaUser />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}