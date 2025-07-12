import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiFile, FiImage, FiLink, FiUpload, FiTrash2, FiExternalLink } = FiIcons;

const AttachmentManager = ({
  attachments = [],
  images = [],
  links = [],
  onAttachmentsChange,
  onImagesChange,
  onLinksChange
}) => {
  const [activeTab, setActiveTab] = useState('attachments');
  const [showAddForm, setShowAddForm] = useState(null);

  // Form states
  const [linkForm, setLinkForm] = useState({ title: '', url: '', description: '' });
  const [imageForm, setImageForm] = useState({ name: '', url: '' });

  const handleFileUpload = (event) => {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      
      const newAttachments = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file),
        file: file
      }));
      
      const updatedAttachments = [...attachments, ...newAttachments];
      onAttachmentsChange(updatedAttachments);
      console.log("Attachments updated:", updatedAttachments);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleImageUpload = (event) => {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      
      const newImages = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        file: file
      }));
      
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
      console.log("Images updated:", updatedImages);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const addImageFromUrl = () => {
    if (!imageForm.name || !imageForm.url) return;
    
    try {
      const newImage = {
        id: Date.now(),
        name: imageForm.name,
        url: imageForm.url
      };
      
      const updatedImages = [...images, newImage];
      onImagesChange(updatedImages);
      console.log("Image added from URL:", newImage);
      console.log("Updated images:", updatedImages);
      
      // Reset form
      setImageForm({ name: '', url: '' });
      setShowAddForm(null);
    } catch (error) {
      console.error("Error adding image from URL:", error);
    }
  };

  const addLink = (e) => {
    // Prevent form submission if inside a form
    if (e) e.preventDefault();
    
    if (!linkForm.title || !linkForm.url) return;
    
    try {
      const newLink = {
        id: Date.now(),
        title: linkForm.title,
        url: linkForm.url,
        description: linkForm.description || ''
      };
      
      const updatedLinks = [...links, newLink];
      onLinksChange(updatedLinks);
      console.log("Link added:", newLink);
      console.log("Updated links:", updatedLinks);
      
      // Reset form
      setLinkForm({ title: '', url: '', description: '' });
      setShowAddForm(null);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const removeAttachment = (id) => {
    const updatedAttachments = attachments.filter(att => att.id !== id);
    onAttachmentsChange(updatedAttachments);
    console.log("Attachment removed. Updated attachments:", updatedAttachments);
  };

  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id);
    onImagesChange(updatedImages);
    console.log("Image removed. Updated images:", updatedImages);
  };

  const removeLink = (id) => {
    const updatedLinks = links.filter(link => link.id !== id);
    onLinksChange(updatedLinks);
    console.log("Link removed. Updated links:", updatedLinks);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'attachments', label: 'Allegati', icon: FiFile, count: attachments.length },
    { id: 'images', label: 'Immagini', icon: FiImage, count: images.length },
    { id: 'links', label: 'Link', icon: FiLink, count: links.length }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Allegati e Risorse</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">File Allegati</h3>
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                Carica File
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                />
              </label>
            </div>

            <AnimatePresence>
              {attachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiFile} className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-sm text-gray-500">{attachment.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {attachments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiFile} className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nessun file allegato</p>
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Immagini</h3>
              <div className="flex space-x-2">
                <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                  Carica
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddForm(showAddForm === 'image' ? null : 'image')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiLink} className="w-4 h-4 mr-2" />
                  Da URL
                </button>
              </div>
            </div>

            {/* Add Image from URL Form */}
            <AnimatePresence>
              {showAddForm === 'image' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Nome immagine"
                    value={imageForm.name}
                    onChange={(e) => setImageForm({ ...imageForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="URL immagine (https://...)"
                    value={imageForm.url}
                    onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={addImageFromUrl}
                      disabled={!imageForm.name || !imageForm.url}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Aggiungi
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group"
                  >
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 truncate">{image.name}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {images.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiImage} className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nessuna immagine caricata</p>
              </div>
            )}
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Link Utili</h3>
              <button
                type="button"
                onClick={() => setShowAddForm(showAddForm === 'link' ? null : 'link')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Aggiungi Link
              </button>
            </div>

            {/* Add Link Form */}
            <AnimatePresence>
              {showAddForm === 'link' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <form onSubmit={addLink}>
                    <input
                      type="text"
                      placeholder="Titolo del link"
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    />
                    <input
                      type="url"
                      placeholder="URL (https://...)"
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    />
                    <textarea
                      placeholder="Descrizione (opzionale)"
                      value={linkForm.description}
                      onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={!linkForm.title || !linkForm.url}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Aggiungi
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annulla
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-blue-600" />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {link.title}
                      </a>
                    </div>
                    {link.description && (
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 break-all">{link.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {links.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiLink} className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nessun link aggiunto</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentManager;