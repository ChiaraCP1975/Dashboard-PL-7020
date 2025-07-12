import React, { createContext, useContext, useState, useEffect } from 'react';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Load news from localStorage
    const savedNews = localStorage.getItem('policeNews');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      // Initialize with sample data
      const sampleNews = [
        {
          id: '1',
          title: 'Nuove Disposizioni per il Controllo del Territorio',
          content: 'Sono state emanate nuove disposizioni per il controllo del territorio durante il periodo festivo. Tutti gli agenti sono tenuti a prendere visione delle nuove procedure.',
          category: 'Disposizioni',
          createdAt: new Date('2024-01-20').toISOString(),
          updatedAt: new Date('2024-01-20').toISOString(),
          author: 'Comando Centrale',
          priority: 'alta',
          tags: ['controllo territorio', 'procedure', 'festivo'],
          attachments: [
            { id: '1', name: 'disposizioni_territorio.pdf', type: 'file', size: '1.2 MB', url: '#' }
          ],
          images: [
            { id: '1', name: 'mappa_territori.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }
          ],
          links: [
            { id: '1', title: 'Portale Procedure Operative', url: 'https://www.example.com/procedure', description: 'Accesso alle procedure complete' }
          ]
        },
        {
          id: '2',
          title: 'Corso di Aggiornamento Codice della Strada',
          content: 'È programmato per il prossimo mese un corso di aggiornamento sul nuovo Codice della Strada. Le iscrizioni sono aperte fino al 31 gennaio.',
          category: 'Formazione',
          createdAt: new Date('2024-01-18').toISOString(),
          updatedAt: new Date('2024-01-18').toISOString(),
          author: 'Ufficio Formazione',
          priority: 'media',
          tags: ['formazione', 'codice strada', 'corso'],
          attachments: [
            { id: '2', name: 'programma_corso.pdf', type: 'file', size: '845 KB', url: '#' }
          ],
          images: [],
          links: [
            { id: '2', title: 'Iscrizioni Online', url: 'https://www.example.com/iscrizioni', description: 'Modulo per le iscrizioni al corso' }
          ]
        }
      ];

      setNews(sampleNews);
      localStorage.setItem('policeNews', JSON.stringify(sampleNews));
    }
  }, []);

  const saveNews = (newNews) => {
    console.log("Saving news:", newNews);
    setNews(newNews);
    localStorage.setItem('policeNews', JSON.stringify(newNews));
  };

  const addNews = (newsItem) => {
    console.log("Adding news:", newsItem);
    const newNewsItem = {
      ...newsItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: newsItem.attachments || [],
      images: newsItem.images || [],
      links: newsItem.links || []
    };
    const newNewsList = [newNewsItem, ...news];
    saveNews(newNewsList);
    return newNewsItem;
  };

  const updateNews = (id, updates) => {
    console.log("Updating news:", id, updates);
    const newNewsList = news.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
        : item
    );
    saveNews(newNewsList);
    return newNewsList.find(item => item.id === id);
  };

  const deleteNews = (id) => {
    console.log("Deleting news:", id);
    const newNewsList = news.filter(item => item.id !== id);
    saveNews(newNewsList);
  };

  const getNews = (id) => {
    return news.find(item => item.id === id);
  };

  const searchNews = (query) => {
    if (!query) return news;
    
    const lowercaseQuery = query.toLowerCase();
    return news.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) || 
      item.content.toLowerCase().includes(lowercaseQuery) || 
      item.category.toLowerCase().includes(lowercaseQuery) || 
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  };

  const getNewsByCategory = (category) => {
    return news.filter(item => item.category === category);
  };

  const value = {
    news,
    addNews,
    updateNews,
    deleteNews,
    getNews,
    searchNews,
    getNewsByCategory
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};