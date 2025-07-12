import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useDocuments } from '../contexts/DocumentContext';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiPlus, FiFileText, FiDownload, FiEye, FiFilter, FiCalendar, FiUser, FiPaperclip, FiImage, FiLink, FiEdit, FiTrash2 } = FiIcons;

const Documents = () => {
  const { documents, searchDocuments, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredDocuments = searchDocuments(searchQuery).filter(doc => {
    if (selectedType && doc.type !== selectedType) return false;
    if (selectedCategory && doc.category !== selectedCategory) return false;
    return true;
  });

  const documentTypes = [...new Set(documents.map(doc => doc.type))];
  const documentCategories = [...new Set(documents.map(doc => doc.category))];

  const exportDocument = (document) => {
    const attachmentsList = document.attachments?.length > 0 
      ? `\n\nAllegati:\n${document.attachments.map(att => `- ${att.name} (${att.size})`).join('\n')}`
      : '';
    
    const imagesList = document.images?.length > 0 
      ? `\n\nImmagini:\n${document.images.map(img => `- ${img.name}: ${img.url}`).join('\n')}`
      : '';
    
    const linksList = document.links?.length > 0 
      ? `\n\nLink:\n${document.links.map(link => `- ${link.title}: ${link.url}${link.description ? ` (${link.description})` : ''}`).join('\n')}`
      : '';

    const content = `
Titolo: ${document.title}
Tipo: ${document.type}
Categoria: ${document.category}
Autore: ${document.author}
Data Creazione: ${new Date(document.createdAt).toLocaleDateString()}
Data Aggiornamento: ${new Date(document.updatedAt).toLocaleDateString()}
Priorità: ${document.priority}
Tags: ${document.tags.join(', ')}

Contenuto:
${document.content}${attachmentsList}${imagesList}${linksList}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllDocuments = () => {
    const content = filteredDocuments.map(doc => {
      const attachmentsList = doc.attachments?.length > 0 
        ? `\n\nAllegati:\n${doc.attachments.map(att => `- ${att.name} (${att.size})`).join('\n')}`
        : '';
      
      const imagesList = doc.images?.length > 0 
        ? `\n\nImmagini:\n${doc.images.map(img => `- ${img.name}: ${img.url}`).join('\n')}`
        : '';
      
      const linksList = doc.links?.length > 0 
        ? `\n\nLink:\n${doc.links.map(link => `- ${link.title}: ${link.url}${link.description ? ` (${link.description})` : ''}`).join('\n')}`
        : '';

      return `
=====================================
Titolo: ${doc.title}
Tipo: ${doc.type}
Categoria: ${doc.category}
Autore: ${doc.author}
Data Creazione: ${new Date(doc.createdAt).toLocaleDateString()}
Priorità: ${doc.priority}
Tags: ${doc.tags.join(', ')}

Contenuto:
${doc.content}${attachmentsList}${imagesList}${linksList}
=====================================
      `;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documenti_polizia_locale_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAttachmentCount = (document) => {
    const attachments = document.attachments?.length || 0;
    const images = document.images?.length || 0;
    const links = document.links?.length || 0;
    return attachments + images + links;
  };

  const handleDelete = (id) => {
    deleteDocument(id);
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
          <h1 className="text-3xl font-bold text-gray-900">Documenti</h1>
          <p className="text-gray-600 mt-2">Gestione ordinanze, modelli e circolari</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={exportAllDocuments}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Esporta Tutti
          </button>
          <Link
            to="/documents/add"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Nuovo Documento
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca documenti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i tipi</option>
            {documentTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le categorie</option>
            {documentCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredDocuments.length} di {documents.length} documenti
          </span>
          <div className="flex items-center space-x-4">
            <SafeIcon icon={FiFilter} className="w-4 h-4" />
            <span>Filtri attivi: {[selectedType, selectedCategory].filter(Boolean).length}</span>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {document.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {document.type}
                    </span>
                    <span>{document.category}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    document.priority === 'alta' ? 'bg-red-100 text-red-700' :
                    document.priority === 'media' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {document.priority}
                  </span>
                  {getAttachmentCount(document) > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <SafeIcon icon={FiPaperclip} className="w-3 h-3" />
                      <span>{getAttachmentCount(document)}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {document.content}
              </p>

              <div className="flex items-center text-xs text-gray-500 mb-4">
                <SafeIcon icon={FiUser} className="w-3 h-3 mr-1" />
                <span className="mr-4">{document.author}</span>
                <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                <span>{new Date(document.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Attachment indicators */}
              {(document.attachments?.length > 0 || document.images?.length > 0 || document.links?.length > 0) && (
                <div className="flex items-center space-x-3 mb-4 text-xs text-gray-500">
                  {document.attachments?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiFileText} className="w-3 h-3" />
                      <span>{document.attachments.length}</span>
                    </div>
                  )}
                  {document.images?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiImage} className="w-3 h-3" />
                      <span>{document.images.length}</span>
                    </div>
                  )}
                  {document.links?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiLink} className="w-3 h-3" />
                      <span>{document.links.length}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{document.tags.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <Link
                    to={`/documents/edit/${document.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifica documento"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => exportDocument(document)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Esporta documento"
                  >
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/documents/${document.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Visualizza documento"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(document.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Elimina documento"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiFileText} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun documento trovato</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedType || selectedCategory
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia aggiungendo il tuo primo documento'
            }
          </p>
          <Link
            to="/documents/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Nuovo Documento
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
              Sei sicuro di voler eliminare questo documento? Questa azione non può essere annullata.
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

export default Documents;