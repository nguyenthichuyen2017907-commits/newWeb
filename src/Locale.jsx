import { createContext, useContext, useEffect, useState } from 'react'
import copy from './copy.json'

const Locale = createContext(null)
export const useLocale = () => useContext(Locale)

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('navfull-language') === 'en' ? 'en' : 'zh' } catch { return 'zh' }
  })
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'
    document.title = language === 'en' ? 'Navfull | Marine Weather Routing' : 'Navfull | 船舶气象导航'
    try { localStorage.setItem('navfull-language', language) } catch { /* Browsing remains available without storage. */ }
  }, [language])
  const t = key => copy[key]?.[language] ?? key
  return <Locale.Provider value={{ language, setLanguage, t }}>{children(language)}</Locale.Provider>
}

export function LanguageSwitch() {
  const { language, setLanguage } = useLocale()
  return <div className="nf-language" role="group" aria-label={language === 'en' ? 'Language' : '语言'}>
    <button type="button" lang="zh-CN" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中</button>
    <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
  </div>
}
