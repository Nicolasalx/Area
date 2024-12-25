import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import frCommon from '../locales/fr/common.json';
import esCommon from '../locales/es/common.json';
import deCommon from '../locales/de/common.json';
import jpCommon from '../locales/jp/common.json';

i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      en: { common: enCommon },
      fr: { common: frCommon },
      es: { common: esCommon },
      de: { common: deCommon },
      jp: { common: jpCommon },
    },
    defaultNS: 'common',
  });

export default i18next;
