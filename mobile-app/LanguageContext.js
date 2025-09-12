import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// Import your language translations
import languages from '../mobile-app/languages.json';

// Create the context
const LanguageContext = createContext();

// Language Provider component
export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(true);

  // Language mapping
  const languageMap = {
    "English": "en",
    "Hindi": "hi", 
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Chinese": "zh",
    "Japanese": "ja"
  };

  // Load saved language preference on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save language preference
  const saveLanguagePreference = async (language) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
  };

  // Change language function
  const changeLanguage = async (language) => {
    setSelectedLanguage(language);
    await saveLanguagePreference(language);
  };

  // Get translated text function with nested key support
  const getText = (key) => {
    const langCode = languageMap[selectedLanguage] || "en";
    const keys = key.split('.');
    
    let translation = languages[langCode];
    
    // Navigate through nested objects
    for (const k of keys) {
      if (translation && typeof translation === 'object' && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English if translation not found
        let fallback = languages["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if no translation found
          }
        }
        return fallback;
      }
    }
    
    return translation || key;
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return Object.keys(languageMap);
  };

  const value = {
    selectedLanguage,
    changeLanguage,
    getText,
    getAvailableLanguages,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LanguageContext };