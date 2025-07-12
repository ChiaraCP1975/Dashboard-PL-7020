import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiFileText, FiNewspaper, FiPlus, FiX } = FiIcons;

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Documenti', href: '/documents', icon: FiFileText },
    { name: 'News', href: '/news', icon: FiNewspaper },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-64 bg-white h-screen shadow-lg border-r border-gray-200 flex flex-col"
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center lg:justify-center">
        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
        >
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}

        <div className="pt-6 border-t border-gray-200 mt-6">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Azioni Rapide
          </p>
          
          <Link
            to="/documents/add"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-3" />
            Nuovo Documento
          </Link>
          
          <Link
            to="/news/add"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-3" />
            Nuova News
          </Link>
        </div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;