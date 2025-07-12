import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import AccessControl from '../components/AccessControl';
import { useDocuments } from '../contexts/DocumentContext';
import { useNews } from '../contexts/NewsContext';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiNewspaper, FiPlus, FiTrendingUp, FiClock, FiAlert } = FiIcons;

const Dashboard = () => {
  const { documents } = useDocuments();
  const { news } = useNews();

  const recentDocuments = documents.slice(0, 5);
  const recentNews = news.slice(0, 5);

  const highPriorityItems = [...documents, ...news]
    .filter(item => item.priority === 'alta')
    .slice(0, 3);

  const stats = [
    {
      name: 'Documenti Totali',
      value: documents.length,
      icon: FiFileText,
      color: 'blue',
      change: '+12%'
    },
    {
      name: 'News Attive',
      value: news.length,
      icon: FiNewspaper,
      color: 'green',
      change: '+5%'
    },
    {
      name: 'Ordinanze',
      value: documents.filter(doc => doc.type === 'ordinanza').length,
      icon: FiAlert,
      color: 'red',
      change: '+3%'
    },
    {
      name: 'Modelli',
      value: documents.filter(doc => doc.type === 'modello').length,
      icon: FiFileText,
      color: 'purple',
      change: '+8%'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Panoramica generale della bacheca</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">vs mese scorso</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AccessControl permission="create_document">
            <Link
              to="/documents/add"
              className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-center">
                <SafeIcon icon={FiPlus} className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700">
                  Nuovo Documento
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Aggiungi ordinanza, modello o circolare
                </p>
              </div>
            </Link>
          </AccessControl>

          <AccessControl permission="create_news">
            <Link
              to="/news/add"
              className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="text-center">
                <SafeIcon icon={FiPlus} className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-700">
                  Nuova News
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Pubblica un nuovo comunicato
                </p>
              </div>
            </Link>
          </AccessControl>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Documenti Recenti</h3>
                <Link to="/documents" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Vedi tutti
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/documents/${doc.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{doc.category}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            doc.priority === 'alta'
                              ? 'bg-red-100 text-red-700'
                              : doc.priority === 'media'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {doc.priority}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nessun documento disponibile</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent News */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">News Recenti</h3>
                <Link to="/news" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Vedi tutte
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentNews.length > 0 ? (
                <div className="space-y-4">
                  {recentNews.map((item) => (
                    <Link
                      key={item.id}
                      to={`/news/${item.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.priority === 'alta'
                              ? 'bg-red-100 text-red-700'
                              : item.priority === 'media'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nessuna news disponibile</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* High Priority Items */}
      {highPriorityItems.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiAlert} className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-900">Elementi ad Alta Priorità</h3>
            </div>
            <div className="space-y-3">
              {highPriorityItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.type ? `/documents/${item.id}` : `/news/${item.id}`}
                  className="block p-3 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <SafeIcon
                      icon={item.type ? FiFileText : FiNewspaper}
                      className="w-4 h-4 text-red-600"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;