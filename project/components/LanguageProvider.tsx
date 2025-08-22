import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Language {
  code: 'en' | 'bn';
  name: string;
  nativeName: string;
}

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

const translations: Translations = {
  // App Navigation
  chats: { en: 'Chats', bn: 'চ্যাট' },
  calls: { en: 'Calls', bn: 'কল' },
  status: { en: 'Status', bn: 'স্ট্যাটাস' },
  settings: { en: 'Settings', bn: 'সেটিংস' },
  
  // Chat Screen
  typeMessage: { en: 'Type a message...', bn: 'বার্তা লিখুন...' },
  online: { en: 'Online', bn: 'অনলাইন' },
  newChat: { en: 'New Chat', bn: 'নতুন চ্যাট' },
  newGroup: { en: 'New Group', bn: 'নতুন গ্রুপ' },
  newContact: { en: 'New Contact', bn: 'নতুন যোগাযোগ' },
  contacts: { en: 'Contacts', bn: 'যোগাযোগ' },
  
  // Status Screen
  myStatus: { en: 'My Status', bn: 'আমার স্ট্যাটাস' },
  tapToAdd: { en: 'Tap to add status update', bn: 'স্ট্যাটাস আপডেট করতে ট্যাপ করুন' },
  recentUpdates: { en: 'Recent updates', bn: 'সাম্প্রতিক আপডেট' },
  viewedUpdates: { en: 'Viewed updates', bn: 'দেখা হয়েছে' },
  
  // Settings Screen
  account: { en: 'Account', bn: 'অ্যাকাউন্ট' },
  privacy: { en: 'Privacy', bn: 'গোপনীয়তা' },
  notifications: { en: 'Notifications', bn: 'নোটিফিকেশন' },
  darkMode: { en: 'Dark Mode', bn: 'ডার্ক মোড' },
  language: { en: 'Language', bn: 'ভাষা' },
  help: { en: 'Help', bn: 'সাহায্য' },
  
  // Common
  search: { en: 'Search', bn: 'খুঁজুন' },
  cancel: { en: 'Cancel', bn: 'বাতিল' },
  save: { en: 'Save', bn: 'সংরক্ষণ' },
  delete: { en: 'Delete', bn: 'মুছুন' },
  edit: { en: 'Edit', bn: 'সম্পাদনা' },
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        const language = languages.find(lang => lang.code === savedLanguage);
        if (language) {
          setCurrentLanguage(language);
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language.code);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (translation && translation[currentLanguage.code]) {
      return translation[currentLanguage.code];
    }
    return key; // Return key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};