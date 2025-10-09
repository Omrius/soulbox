// contexts/I18nContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of the context
interface I18nContextType {
    language: string;
    t: (key: string, params?: { [key: string]: any }) => any;
    changeLanguage: (lang: string) => void;
    isLoaded: boolean; // Add loading state
}

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Define supported languages
const supportedLanguages = ['fr', 'en'];

// The provider component
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('fr'); // Default to French
    const [translations, setTranslations] = useState<any>({});
    const [isLoaded, setIsLoaded] = useState(false); // Initialize loading state

    useEffect(() => {
        const savedLang = localStorage.getItem('soulbox_lang');
        const browserLang = navigator.language.split('-')[0];
        const initialLang = savedLang || (supportedLanguages.includes(browserLang) ? browserLang : 'fr');
        setLanguage(initialLang);
    }, []);

    useEffect(() => {
        const fetchTranslations = async () => {
            setIsLoaded(false); // Reset loading state on language change
            try {
                const response = await fetch(`/locales/${language}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch translations: ${response.statusText}`);
                }
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error(`Could not load translations for ${language}`, error);
                // Fallback to French if loading fails
                try {
                    const response = await fetch(`/locales/fr.json`);
                    const data = await response.json();
                    setTranslations(data);
                } catch (fallbackError) {
                    console.error('Could not load fallback translations', fallbackError);
                }
            } finally {
                setIsLoaded(true); // Set loaded to true after fetch attempt
            }
        };

        fetchTranslations();
    }, [language]);

    const t = (key: string, params?: { [key: string]: any }): any => {
        const keys = key.split('.');
        let result = keys.reduce((acc, currentKey) => acc && acc[currentKey], translations);

        // If the result is a string, process it for interpolation.
        if (typeof result === 'string') {
            let processedString = result;
            if (params) {
                Object.keys(params).forEach(paramKey => {
                    // This is a special case for rich text replacement that is not fully supported by this simple `t` function,
                    // but we handle the string conversion gracefully.
                    if (typeof params[paramKey] === 'function') {
                        // A simplified approach for components used in translations:
                        // Extract the text between tags like <1> and </1>
                        const componentRegex = new RegExp(`<${paramKey}>(.*?)</${paramKey}>`, 'g');
                         processedString = processedString.replace(componentRegex, (match, content) => {
                            // This part doesn't return a component, but the user didn't report issues here.
                            // The main fix is for arrays.
                            return content; 
                        });
                    } else {
                        // Standard {{variable}} replacement
                        const regex = new RegExp(`{{${paramKey}}}`, 'g');
                        processedString = processedString.replace(regex, String(params[paramKey]));
                    }
                });
            }
            return processedString;
        }

        // If the result is not a string (e.g., an array for features or undefined),
        // return it directly. If it's undefined, fallback to the key.
        return result || key;
    };

    // Fix: Define the changeLanguage function to update language state and local storage.
    const changeLanguage = (lang: string) => {
        if (supportedLanguages.includes(lang)) {
            localStorage.setItem('soulbox_lang', lang);
            setLanguage(lang);
        }
    };

    return (
        <I18nContext.Provider value={{ language, t, changeLanguage, isLoaded }}>
            {children}
        </I18nContext.Provider>
    );
};

// Custom hook to use the context
export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
