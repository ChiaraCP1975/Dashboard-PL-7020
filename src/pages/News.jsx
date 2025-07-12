import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useNews } from '../contexts/NewsContext';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiPlus, FiNewspaper, FiEye, FiCalendar, FiUser, FiFilter, FiEdit, FiTrash2 } = FiIcons;

const News = () => {
  const { news, searchNews, deleteNews } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredNews = searchNews(searchQuery).filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    return true;
  });

  const newsCategories = [...new Set(news.map(item => item.category))];

  const handleDelete = (id) => {
    deleteNews(id);
    setShowDeleteConfirm(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600 mt-2">Comunicazioni e notizie per il personale</p>
        </div>
        <Link
          to="/news/add"
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Nuova News
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le categorie</option>
            {newsCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredNews.length} di {news.length} news
          </span>
          <div className="flex items-center space-x-4">
            <SafeIcon icon={FiFilter} className="w-4 h-4" />
            <span>Filtri attivi: {selectedCategory ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-6">
        {filteredNews.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.priority === 'alta' ? 'bg-red-100 text-red-700' :
                      item.priority === 'media' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-3 h-3 mr-1" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Link
                    to={`/news/edit/${item.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifica news"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/news/${item.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Visualizza news"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(item.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Elimina news"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                {item.content.length > 300 ? `${item.content.substring(0, 300)}...` : item.content}
              </p>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiNewspaper} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna news trovata</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia aggiungendo la tua prima news'
            }
          </p>
          <Link
            to="/news/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Nuova News
          </Link>
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
              Sei sicuro di voler eliminare questa news? Questa azione non può essere annullata.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
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

export default News;