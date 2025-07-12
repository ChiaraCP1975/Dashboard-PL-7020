import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import AttachmentViewer from '../components/AttachmentViewer';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiPrint, FiEdit, FiTrash2, FiCalendar, FiUser, FiTag, FiNewspaper } = FiIcons;

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNews, deleteNews } = useNews();
  const { hasPermission } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const newsItem = getNews(id);

  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiNewspaper} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">News non trovata</h3>
        <Link to="/news" className="text-blue-600 hover:text-blue-700">
          Torna alle news
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/news/edit/${id}`);
  };

  const handleDelete = () => {
    deleteNews(id);
    navigate('/news');
  };

  const canEdit = hasPermission('edit_news');
  const canDelete = hasPermission('delete_news');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/news')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors no-print"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{newsItem.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {newsItem.category}
              </span>
              <span
                className={`px-2 py-1 rounded-full ${
                  newsItem.priority === 'alta'
                    ? 'bg-red-100 text-red-700'
                    : newsItem.priority === 'media'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {newsItem.priority}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 no-print">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Modifica news"
            >
              <SafeIcon icon={FiEdit} className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handlePrint}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Stampa news"
          >
            <SafeIcon icon={FiPrint} className="w-5 h-5" />
          </button>
          {canDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Elimina news"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* News Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informazioni</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Autore</p>
              <p className="font-medium text-gray-900">{newsItem.author}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Data Pubblicazione</p>
              <p className="font-medium text-gray-900">
                {new Date(newsItem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiTag} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {newsItem.tags && newsItem.tags.length > 0 ? (
                  newsItem.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">Nessun tag</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contenuto</h2>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {newsItem.content}
          </div>
        </div>
      </div>

      {/* Attachments Viewer */}
      <AttachmentViewer
        attachments={newsItem.attachments || []}
        images={newsItem.images || []}
        links={newsItem.links || []}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
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
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
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

export default NewsDetail;