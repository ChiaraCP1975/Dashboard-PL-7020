import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFile, FiImage, FiExternalLink, FiDownload, FiEye } = FiIcons;

const AttachmentViewer = ({ attachments = [], images = [], links = [] }) => {
  const hasAnyAttachments = attachments.length > 0 || images.length > 0 || links.length > 0;

  if (!hasAnyAttachments) {
    return null;
  }

  const downloadAttachment = (attachment) => {
    if (attachment.url && attachment.url !== '#') {
      const a = document.createElement('a');
      a.href = attachment.url;
      a.download = attachment.name;
      a.click();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Allegati e Risorse</h2>

      <div className="space-y-6">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiFile} className="w-5 h-5 mr-2" />
              File Allegati ({attachments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiFile} className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-sm text-gray-500">{attachment.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadAttachment(attachment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Scarica file"
                  >
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiImage} className="w-5 h-5 mr-2" />
              Immagini ({images.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group cursor-pointer"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <SafeIcon 
                        icon={FiEye} 
                        className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 truncate">{image.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiExternalLink} className="w-5 h-5 mr-2" />
              Link Utili ({links.length})
            </h3>
            <div className="space-y-3">
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiExternalLink} className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700 text-lg"
                      >
                        {link.title}
                      </a>
                      {link.description && (
                        <p className="text-gray-600 mt-1">{link.description}</p>
                      )}
                      <p className="text-sm text-gray-400 mt-1 break-all">{link.url}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentViewer;