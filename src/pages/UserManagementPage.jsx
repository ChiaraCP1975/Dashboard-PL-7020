import React from 'react';
import { motion } from 'framer-motion';
import UserManagement from '../components/UserManagement';

const UserManagementPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestione Utenti</h1>
        <p className="text-gray-600 mt-2">Amministrazione degli utenti e dei ruoli del sistema</p>
      </div>

      {/* User Management Component */}
      <UserManagement />
    </motion.div>
  );
};

export default UserManagementPage;