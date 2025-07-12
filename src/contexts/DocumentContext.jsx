import React, { createContext, useContext, useState, useEffect } from 'react';

const DocumentContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Load documents from localStorage
    const savedDocuments = localStorage.getItem('policeDocuments');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    } else {
      // Initialize with sample data
      const sampleDocuments = [
        {
          id: '1',
          title: 'Ordinanza Traffico Centro Storico',
          type: 'ordinanza',
          category: 'Traffico',
          content: 'Ordinanza per la regolamentazione del traffico nel centro storico durante le festività natalizie.',
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString(),
          author: 'Comandante Rossi',
          tags: ['traffico', 'centro storico', 'ordinanza'],
          priority: 'alta',
          attachments: [
            {
              id: '1',
              name: 'planimetria_centro.pdf',
              type: 'file',
              size: '2.3 MB',
              url: '#'
            }
          ],
          images: [
            {
              id: '1',
              name: 'mappa_zona.jpg',
              url: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=400'
            }
          ],
          links: [
            {
              id: '1',
              title: 'Codice della Strada - Art. 7',
              url: 'https://www.gazzettaufficiale.it',
              description: 'Riferimento normativo'
            }
          ]
        },
        {
          id: '2',
          title: 'Modello Verbale Contravvenzioni',
          type: 'modello',
          category: 'Procedure',
          content: 'Modello standard per la compilazione dei verbali di contravvenzione al Codice della Strada.',
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          author: 'Ufficio Procedure',
          tags: ['verbale', 'contravvenzioni', 'modello'],
          priority: 'media',
          attachments: [
            {
              id: '2',
              name: 'modello_verbale.doc',
              type: 'file',
              size: '156 KB',
              url: '#'
            }
          ],
          images: [],
          links: [
            {
              id: '2',
              title: 'Guida Compilazione Verbali',
              url: 'https://www.example.com/guida',
              description: 'Tutorial per la corretta compilazione'
            }
          ]
        }
      ];
      setDocuments(sampleDocuments);
      localStorage.setItem('policeDocuments', JSON.stringify(sampleDocuments));
    }
  }, []);

  const saveDocuments = (newDocuments) => {
    setDocuments(newDocuments);
    localStorage.setItem('policeDocuments', JSON.stringify(newDocuments));
  };

  const addDocument = (document) => {
    const newDocument = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: document.attachments || [],
      images: document.images || [],
      links: document.links || []
    };
    const newDocuments = [newDocument, ...documents];
    saveDocuments(newDocuments);
  };

  const updateDocument = (id, updates) => {
    const newDocuments = documents.map(doc =>
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
    );
    saveDocuments(newDocuments);
  };

  const deleteDocument = (id) => {
    const newDocuments = documents.filter(doc => doc.id !== id);
    saveDocuments(newDocuments);
  };

  const getDocument = (id) => {
    return documents.find(doc => doc.id === id);
  };

  const searchDocuments = (query) => {
    if (!query) return documents;
    
    const lowercaseQuery = query.toLowerCase();
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.content.toLowerCase().includes(lowercaseQuery) ||
      doc.category.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getDocumentsByType = (type) => {
    return documents.filter(doc => doc.type === type);
  };

  const getDocumentsByCategory = (category) => {
    return documents.filter(doc => doc.category === category);
  };

  const value = {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    searchDocuments,
    getDocumentsByType,
    getDocumentsByCategory
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};