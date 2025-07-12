import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import News from './pages/News';
import AddDocument from './pages/AddDocument';
import EditDocument from './pages/EditDocument';
import AddNews from './pages/AddNews';
import EditNews from './pages/EditNews';
import DocumentDetail from './pages/DocumentDetail';
import NewsDetail from './pages/NewsDetail';
import UserManagementPage from './pages/UserManagementPage';
import { DocumentProvider } from './contexts/DocumentContext';
import { NewsProvider } from './contexts/NewsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <DocumentProvider>
      <NewsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex">
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: -280 }}
                    animate={{ x: 0 }}
                    exit={{ x: -280 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0"
                  >
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="hidden lg:block">
                <Sidebar />
              </div>

              <main className="flex-1 p-6 lg:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/documents/add" element={<AddDocument />} />
                    <Route path="/documents/edit/:id" element={<EditDocument />} />
                    <Route path="/documents/:id" element={<DocumentDetail />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/add" element={<AddNews />} />
                    <Route path="/news/edit/:id" element={<EditNews />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/users" element={<UserManagementPage />} />
                  </Routes>
                </motion.div>
              </main>
            </div>

            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </Router>
      </NewsProvider>
    </DocumentProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;