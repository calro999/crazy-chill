export type Locale = 'ja' | 'en';

const dictionaries = {
  ja: () => import('./ja.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.ja();
};
