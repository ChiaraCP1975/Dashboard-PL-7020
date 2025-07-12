import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiMail, FiLock, FiEye, FiEyeOff, FiUser } = FiIcons;

const LoginForm = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Inserisci email e password');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result); // Debug log

      if (!result.success) {
        setError(result.error || 'Errore durante il login');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Errore durante il login');
    }
  };

  const demoCredentials = [
    {
      role: 'Amministratore',
      email: 'admin@polizialocale.it',
      password: 'admin123',
      description: 'Accesso completo - può creare, modificare ed eliminare'
    },
    {
      role: 'Consultatore',
      email: 'consultatore@polizialocale.it',
      password: 'user123',
      description: 'Solo lettura - può visualizzare documenti e news'
    },
    {
      role: 'Consultatore',
      email: 'lucia.verdi@polizialocale.it',
      password: 'user123',
      description: 'Solo lettura - può visualizzare documenti e news'
    }
  ];

  const loginWithDemoCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bacheca Polizia Locale</h1>
          <p className="text-gray-600 mt-2">Accedi al sistema di gestione documentale</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiMail}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Inserisci la tua email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiLock}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Inserisci la tua password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8">
          <button
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDemoCredentials ? 'Nascondi' : 'Mostra'} credenziali demo
          </button>

          {showDemoCredentials && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3"
            >
              <p className="text-xs text-gray-600 text-center mb-3">
                Clicca su un utente per utilizzare le credenziali
              </p>

              {demoCredentials.map((cred, index) => (
                <div
                  key={index}
                  onClick={() => loginWithDemoCredentials(cred.email, cred.password)}
                  className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm text-gray-900">
                        {cred.role}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        cred.role === 'Amministratore'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {cred.role === 'Amministratore' ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{cred.email}</p>
                  <p className="text-xs text-gray-500">{cred.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;