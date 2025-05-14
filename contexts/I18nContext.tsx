import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import translations from '@/constants/translations';

type I18nContextType = {
  t: (key: string, params?: Record<string, any>) => string;
  currentLanguage: string;
  setLanguage: (language: string) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
};

export const I18nContext = createContext<I18nContextType>({
  t: (key: string) => key,
  currentLanguage: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isRTL: false,
});

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  // Detect device language, default to 'en' if not supported
  const getDeviceLanguage = () => {
    const deviceLang = Localization.locale.split('-')[0];
    return ['en', 'ar'].includes(deviceLang) ? deviceLang : 'en';
  };

  const [language, setLanguage] = useState(getDeviceLanguage());
  const isRTL = language === 'ar';

  useEffect(() => {
    // Configure RTL layout based on language
    const configure = async () => {
      // Only change if current RTL setting doesn't match the language
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
      }
    };
    
    configure();
  }, [language, isRTL]);

  const t = (key: string, params?: Record<string, any>) => {
    // Get translation string for current language
    const translationString = translations[language]?.[key] || translations.en[key] || key;
    
    if (!params) return translationString;
    
    // Replace parameters in the string
    return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
      return result.replace(new RegExp(`{${paramKey}}`, 'g'), paramValue.toString());
    }, translationString);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <I18nContext.Provider value={{ t, currentLanguage: language, setLanguage, toggleLanguage, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}