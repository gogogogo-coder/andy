import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getTranslations } from './services/api';

const apiBackend = {
  type: 'backend' as const,
  init: () => {},
  read: (language: string, namespace: string, callback: (error: Error | null, data: any) => void) => {
    getTranslations(language)
      .then((translations) => {
        callback(null, translations);
      })
      .catch((error) => {
        console.error("Failed to load translations:", error);
        callback(error, null);
      });
  },
};

i18n
  .use(apiBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
        useSuspense: true,
    }
  });

export default i18n;