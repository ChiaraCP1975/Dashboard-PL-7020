import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AccessControl = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  if (!permission || hasPermission(permission)) {
    return children;
  }

  return null;
};

export default AccessControl;