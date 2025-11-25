import i18n from "i18next";
import {initReactI18next} from 'react-i18next'
import { getLocales } from 'expo-localization';
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEnUS from '@/locales/en-US.json';
import translationDeDE from '@/locales/de-DE.json';

const DEFAULT_LOCALE = 'en-US'
const resources ={
    "en-US":{translation: translationEnUS},
    "de-DE":{translation: translationDeDE},
}

export const AVAILABLE_LOCALES = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
];

let isInitialized = false;

const initI18n = async() =>{
    if (isInitialized) return;

    let savedLanguage: string | null = null;

    savedLanguage = await AsyncStorage.getItem('language'); // Check if a locale is already saved

    if(!savedLanguage){
        const deviceLanguage = getLocales()[0];
        //save user locale as preferred locale
        const userLocale = `${deviceLanguage.languageCode}-${deviceLanguage.regionCode}`
        savedLanguage = userLocale

        await AsyncStorage.setItem('language',userLocale)
    }
    const selectedLang = AVAILABLE_LOCALES.some(({code}) => code === savedLanguage) ? savedLanguage!: DEFAULT_LOCALE;

    await i18n
    .use(initReactI18next).init({
        resources,
        lng: selectedLang,
        fallbackLng: DEFAULT_LOCALE,
        interpolation:{
            escapeValue: true
        }
    })

    isInitialized = true;
}


// Initialize immediately
initI18n();

export const changeAppLanguage = async(lang: string) => {
    await AsyncStorage.setItem('language', lang)
    i18n.changeLanguage(lang)
return}

export default initI18n;
