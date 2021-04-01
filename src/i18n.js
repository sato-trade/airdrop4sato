import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";
import en from './locales/en/translation.json';
import cn from './locales/cn/translation.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: en
    },
    cn: {
        translation: cn
    }
};

i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        // lng: localStorage.getItem('lng')||'cn',
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        whitelist: ['en', 'cn'],
        preload: ['en', 'cn']

    });
export default i18next;
