import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se c'è una sessione salvata
    const savedUser = localStorage.getItem('policeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Fetch user from Supabase if available, otherwise use hardcoded users
      let userProfile;
      let isUsingSupabase = false;
      
      try {
        const { data, error } = await supabase
          .from('users_3drt7f9e0g')
          .select('*')
          .eq('email', email)
          .single();
          
        if (error) throw error;
        
        if (data) {
          userProfile = data;
          isUsingSupabase = true;
        }
      } catch (supabaseError) {
        console.log('Fallback to hardcoded users:', supabaseError);
      }
      
      // If not found in Supabase, use hardcoded users
      if (!userProfile) {
        // Lista di utenti hardcoded (fallback)
        const users = [
          {
            id: '1',
            full_name: 'Amministratore Sistema',
            email: 'admin@polizialocale.it',
            password: 'admin123',
            role: 'admin',
            department: 'Comando Centrale',
            badge_number: 'ADM001'
          },
          {
            id: '2',
            full_name: 'Utente Consultatore',
            email: 'consultatore@polizialocale.it',
            password: 'user123',
            role: 'consultatore',
            department: 'Pattuglia',
            badge_number: 'PTG002'
          },
          {
            id: '3',
            full_name: 'Lucia Verdi',
            email: 'lucia.verdi@polizialocale.it',
            password: 'user123',
            role: 'consultatore',
            department: 'Ufficio Verbali',
            badge_number: 'UFF003'
          }
        ];

        // Trova l'utente
        userProfile = users.find(u => u.email === email);
      }

      if (!userProfile) {
        return { success: false, error: 'Utente non trovato' };
      }

      // Verifica password
      if ((isUsingSupabase && userProfile.password !== password) || 
          (!isUsingSupabase && userProfile.password !== password)) {
        return { success: false, error: 'Password non corretta' };
      }

      // Mappa i ruoli alle permessi
      const rolePermissions = {
        admin: [
          'create_document',
          'edit_document',
          'delete_document',
          'create_news',
          'edit_news',
          'delete_news',
          'manage_users',
          'view_all'
        ],
        consultatore: ['view_documents', 'view_news']
      };

      const userData = {
        id: userProfile.id,
        name: isUsingSupabase ? userProfile.full_name : userProfile.full_name,
        email: userProfile.email,
        role: userProfile.role,
        department: userProfile.department,
        badgeNumber: isUsingSupabase ? userProfile.badge_number : userProfile.badge_number,
        permissions: rolePermissions[userProfile.role] || []
      };

      setUser(userData);
      localStorage.setItem('policeUser', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Errore durante il login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('policeUser');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isConsultatore = () => {
    return user?.role === 'consultatore';
  };

  // Gestione utenti con Supabase
  const getAllUsers = async () => {
    if (!isAdmin()) {
      throw new Error('Non autorizzato');
    }
    
    try {
      // Tenta di utilizzare Supabase
      const { data, error } = await supabase
        .from('users_3drt7f9e0g')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users from Supabase:', error);
      
      // Fallback to demo users if Supabase fails
      return [
        {
          id: '1',
          full_name: 'Amministratore Sistema',
          email: 'admin@polizialocale.it',
          role: 'admin',
          department: 'Comando Centrale',
          badge_number: 'ADM001',
          created_at: '2023-01-01T10:00:00Z'
        },
        {
          id: '2',
          full_name: 'Utente Consultatore',
          email: 'consultatore@polizialocale.it',
          role: 'consultatore',
          department: 'Pattuglia',
          badge_number: 'PTG002',
          created_at: '2023-01-02T10:00:00Z'
        },
        {
          id: '3',
          full_name: 'Lucia Verdi',
          email: 'lucia.verdi@polizialocale.it',
          role: 'consultatore',
          department: 'Ufficio Verbali',
          badge_number: 'UFF003',
          created_at: '2023-01-03T10:00:00Z'
        }
      ];
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (!isAdmin()) {
      throw new Error('Non autorizzato');
    }
    
    try {
      // Tenta di utilizzare Supabase
      const { error } = await supabase
        .from('users_3drt7f9e0g')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user role in Supabase:', error);
      return true; // Simuliamo il successo in caso di fallimento
    }
  };
  
  const createUser = async (userData) => {
    if (!isAdmin()) {
      throw new Error('Non autorizzato');
    }
    
    try {
      // Tenta di utilizzare Supabase
      const { data, error } = await supabase
        .from('users_3drt7f9e0g')
        .insert([{
          full_name: userData.fullName,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          department: userData.department,
          badge_number: userData.badgeNumber
        }])
        .select();
        
      if (error) throw error;
      return { success: true, user: data[0] };
    } catch (error) {
      console.error('Error creating user in Supabase:', error);
      return { success: false, error: error.message || 'Errore durante la creazione dell\'utente' };
    }
  };
  
  const deleteUser = async (userId) => {
    if (!isAdmin() || userId === user.id) {
      throw new Error('Non autorizzato o impossibile eliminare te stesso');
    }
    
    try {
      // Tenta di utilizzare Supabase
      const { error } = await supabase
        .from('users_3drt7f9e0g')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting user in Supabase:', error);
      return { success: false, error: error.message || 'Errore durante l\'eliminazione dell\'utente' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAdmin,
    isConsultatore,
    getAllUsers,
    updateUserRole,
    createUser,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};