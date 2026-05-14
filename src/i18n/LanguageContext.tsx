import React, { createContext, useContext, useState } from 'react';

import { translations, Language, TranslationKey } from './translations';



interface LanguageContextType {

    lang: Language;

    setLang: (lang: Language) => void;

    t: (key: TranslationKey | string) => string;

}



const LanguageContext = createContext<LanguageContextType>({

    lang: 'zh',

    setLang: () => {},

    t: (k) => k,

});



export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [lang, setLang] = useState<Language>(() => {

        const sysLang = navigator.language.toLowerCase();

        return sysLang.startsWith('zh') ? 'zh' : 'en';

    });



    const t = (key: TranslationKey | string) => {

        return (translations[lang] as any)?.[key] || key;

    };



    return (

        <LanguageContext.Provider value={{ lang, setLang, t }}>

            {children}

        </LanguageContext.Provider>

    );

};



export const useLanguage = () => useContext(LanguageContext);

