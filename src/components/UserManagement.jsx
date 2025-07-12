import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';

const {
  FiUsers,
  FiEdit,
  FiShield,
  FiUser,
  FiMail,
  FiBadge,
  FiBuilding,
  FiPlus,
  FiTrash2,
  FiX,
  FiCheck,
  FiLock,
  FiSave
} = FiIcons;

const UserManagement = () => {
  const { getAllUsers, updateUserRole, createUser, deleteUser, isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'consultatore',
    department: '',
    badgeNumber: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Errore nel caricamento degli utenti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers(); // Ricarica la lista
      setEditingUser(null);
      setError('');
      setSuccess('Ruolo aggiornato con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Errore nell\'aggiornamento del ruolo');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validazioni
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      setError('Compila tutti i campi obbligatori');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setError('Inserisci un indirizzo email valido');
      return;
    }
    
    if (newUser.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }
    
    try {
      const result = await createUser(newUser);
      if (result.success) {
        setNewUser({
          fullName: '',
          email: '',
          password: '',
          role: 'consultatore',
          department: '',
          badgeNumber: ''
        });
        setShowAddForm(false);
        await loadUsers();
        setSuccess('Utente creato con successo');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Errore nella creazione dell\'utente');
      }
    } catch (err) {
      setError('Errore nella creazione dell\'utente');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        await loadUsers();
        setShowDeleteConfirm(null);
        setSuccess('Utente eliminato con successo');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Errore nell\'eliminazione dell\'utente');
      }
    } catch (err) {
      setError('Errore nell\'eliminazione dell\'utente');
      console.error(err);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Non hai i permessi per accedere a questa sezione.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Gestione Utenti</h2>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {users.length} utenti
          </span>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
            Nuovo Utente
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Form per aggiungere un nuovo utente */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-800">Aggiungi Nuovo Utente</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={newUser.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome e Cognome"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@esempio.it"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimo 6 caratteri"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ruolo
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="consultatore">Consultatore</option>
                  <option value="admin">Amministratore</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dipartimento
                </label>
                <input
                  type="text"
                  name="department"
                  value={newUser.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Es. Comando Centrale"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numero Badge
                </label>
                <input
                  type="text"
                  name="badgeNumber"
                  value={newUser.badgeNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Es. ADM001"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end mt-2">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  Salva Utente
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <SafeIcon
                    icon={user.role === 'admin' ? FiShield : FiUser}
                    className="w-6 h-6 text-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiMail} className="w-3 h-3" />
                      <span>{user.email}</span>
                    </div>
                    {user.department && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiBuilding} className="w-3 h-3" />
                        <span>{user.department}</span>
                      </div>
                    )}
                    {user.badge_number && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiBadge} className="w-3 h-3" />
                        <span>{user.badge_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {editingUser === user.id ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="admin">Amministratore</option>
                      <option value="consultatore">Consultatore</option>
                    </select>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Annulla
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.role === 'admin' ? 'Amministratore' : 'Consultatore'}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {currentUser.id !== user.id && (
                        <>
                          <button
                            onClick={() => setEditingUser(user.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifica ruolo"
                          >
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Elimina utente"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {user.id === currentUser.id && (
              <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                <span className="font-medium">Questo sei tu</span> - Non puoi modificare il tuo ruolo o eliminare il tuo account
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <SafeIcon icon={FiUsers} className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Nessun utente trovato</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conferma Eliminazione
            </h3>
            <p className="text-gray-600 mb-6">
              Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Elimina
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;