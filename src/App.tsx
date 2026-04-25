/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Solar, Lunar } from 'lunar-javascript';
import { QUOTES, ADVICE_POOL } from './data/quotes';
import { Palette, X, Download, RefreshCw } from 'lucide-react';
import { toPng } from 'html-to-image';

const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

type ThemeType = 'classic' | 'bold' | 'dark' | 'warm' | 'technical' | 'poster' | 'traditional' | 'editorial' | 'vintage' | 'zen' | 'crimson';
type DateFontType = 'playfair' | 'bebas' | 'cormorant' | 'abril' | 'mono' | 'satisfy' | 'space' | 'outfit';
type QuoteFontType = 'serif' | 'sans' | 'kaiti' | 'calligraphy' | 'handwrite' | 'display' | 'modern' | 'mono';

export default function App() {
  const [theme, setTheme] = useState<ThemeType>('bold');
  const [dateFont, setDateFont] = useState<DateFontType>('playfair');
  const [quoteFont, setQuoteFont] = useState<QuoteFontType>('serif');
  const [scheme, setScheme] = useState<string>('original');
  const [bgId, setBgId] = useState<string>('default');
  const [hasShadow, setHasShadow] = useState(true);
  const [borderRadius, setBorderRadius] = useState(4);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState('#E5E7EB');
  const [isFontSync, setIsFontSync] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'font' | 'quote' | 'scheme' | 'background' | 'setting'>('theme');
  const [randomSeed, setRandomSeed] = useState(0);
  const now = new Date();

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('calendar-theme') as ThemeType;
    if (savedTheme) setTheme(savedTheme);

    const savedFont = localStorage.getItem('calendar-date-font') as DateFontType;
    if (savedFont) setDateFont(savedFont);

    const savedQuoteFont = localStorage.getItem('calendar-quote-font') as QuoteFontType;
    if (savedQuoteFont) setQuoteFont(savedQuoteFont);

    const savedFontSync = localStorage.getItem('calendar-font-sync') === 'true';
    setIsFontSync(savedFontSync);

    const savedScheme = localStorage.getItem('calendar-scheme');
    if (savedScheme) setScheme(savedScheme);

    const savedBgId = localStorage.getItem('calendar-bg-id');
    if (savedBgId) setBgId(savedBgId);

    const savedShadow = localStorage.getItem('calendar-shadow');
    if (savedShadow !== null) setHasShadow(savedShadow === 'true');

    const savedRadius = localStorage.getItem('calendar-radius');
    if (savedRadius) setBorderRadius(parseInt(savedRadius));

    const savedBorderWidth = localStorage.getItem('calendar-border-width');
    if (savedBorderWidth) setBorderWidth(parseInt(savedBorderWidth));

    const savedBorderColor = localStorage.getItem('calendar-border-color');
    if (savedBorderColor) setBorderColor(savedBorderColor);
  }, []);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('calendar-theme', newTheme);
  };

  const handleFontChange = (newFont: DateFontType) => {
    setDateFont(newFont);
    localStorage.setItem('calendar-date-font', newFont);
  };

  const handleQuoteFontChange = (newFont: QuoteFontType) => {
    setQuoteFont(newFont);
    localStorage.setItem('calendar-quote-font', newFont);
  };

  const toggleFontSync = () => {
    const nextState = !isFontSync;
    setIsFontSync(nextState);
    localStorage.setItem('calendar-font-sync', String(nextState));
  };

  const handleSchemeChange = (newScheme: string) => {
    setScheme(newScheme);
    localStorage.setItem('calendar-scheme', newScheme);
  };

  const handleBgChange = (newBg: string) => {
    setBgId(newBg);
    localStorage.setItem('calendar-bg-id', newBg);
  };

  const handleShadowChange = (newVal: boolean) => {
    setHasShadow(newVal);
    localStorage.setItem('calendar-shadow', String(newVal));
  };

  const handleRadiusChange = (newVal: number) => {
    setBorderRadius(newVal);
    localStorage.setItem('calendar-radius', String(newVal));
  };

  const handleBorderWidthChange = (newVal: number) => {
    setBorderWidth(newVal);
    localStorage.setItem('calendar-border-width', String(newVal));
  };

  const handleBorderColorChange = (newVal: string) => {
    setBorderColor(newVal);
    localStorage.setItem('calendar-border-color', newVal);
  };

  const calendarData = useMemo(() => {
    const solar = Solar.fromDate(now);
    const lunar = Lunar.fromSolar(solar);
    
    const year = solar.getYear();
    const month = solar.getMonth();
    const day = solar.getDay();
    const weekIdx = solar.getWeek();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const monthNamesEn = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    const lunarMonth = lunar.getMonthInChinese();
    const lunarDay = lunar.getDayInChinese();
    const lunarYearGanzhi = lunar.getYearInGanZhi();
    const lunarMonthGanzhi = lunar.getMonthInGanZhi();
    const lunarDayGanzhi = lunar.getDayInGanZhi();
    
    const festivals = [...lunar.getFestivals(), ...lunar.getOtherFestivals(), ...solar.getFestivals()];
    const solarTerm = lunar.getJieQi();

    const dateStr = `${year}-${month}-${day}`;
    // Use the base hash if seed is 0, otherwise use randomSeed
    const hash = randomSeed === 0 ? getHash(dateStr) : randomSeed;
    const quote = QUOTES[hash % QUOTES.length];
    const advice = ADVICE_POOL[hash % ADVICE_POOL.length];

    const isModern = ['bold', 'dark', 'technical', 'poster', 'editorial', 'crimson'].includes(theme);

    return {
      year,
      monthName: theme === 'crimson' 
        ? monthNames[month - 1] 
        : (isModern ? `${monthNamesEn[month - 1]} ${monthNames[month - 1]}` : monthNames[month - 1]),
      day,
      weekday: isModern ? `${weekDays[weekIdx]} ${weekDaysEn[weekIdx].toUpperCase()}` : weekDays[weekIdx],
      lunarDate: theme === 'classic' ? `农历${lunarMonth}月${lunarDay}·${festivals.length > 0 ? festivals[0] : solarTerm || ''}` : `农历${lunarMonth}月${lunarDay}`,
      lunarGanzhi: theme === 'classic' || theme === 'traditional' 
        ? `${lunarYearGanzhi}年·${lunarMonthGanzhi}月·${lunarDayGanzhi}日` 
        : `${lunarYearGanzhi}年${lunarMonthGanzhi}月${lunarDayGanzhi}日`,
      festivals: festivals.length > 0 ? festivals[0] : solarTerm || '',
      quote,
      advice
    };
  }, [now, theme, randomSeed]);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const node = document.getElementById('calendar-container');
    if (!node || isDownloading) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure any layout shifts are settled
      await new Promise(resolve => setTimeout(resolve, 100));

      const bgColor = getComputedStyle(node).backgroundColor;

      // Use toPng with more robust options
      const dataUrl = await toPng(node, { 
        pixelRatio: 3, // Higher quality
        backgroundColor: bgColor, // Dynamically use the theme's background color
        cacheBust: true,
        skipFonts: false,
      });
      
      const link = document.createElement('a');
      link.download = `OWSPACE-${calendarData.year}${calendarData.monthName}${calendarData.day}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('下载失败，请稍后重试或尝试在桌面端操作。');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRandomQuote = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setRandomSeed(newSeed);
  };

  const themes: { id: ThemeType; name: string; class: string }[] = [
    { id: 'classic', name: '经典', class: 'bg-[#F5F3F0] border-gray-300' },
    { id: 'bold', name: '包豪斯', class: 'bg-[#E5E5E1] border-black' },
    { id: 'dark', name: '暗夜', class: 'bg-[#121212] border-gray-700' },
    { id: 'warm', name: '和风', class: 'bg-[#EDE0D4] border-[#D7CCC8]' },
    { id: 'technical', name: '蓝图', class: 'bg-[#0A192F] border-[#64FFDA]' },
    { id: 'poster', name: '海报', class: 'bg-white border-red-600' },
    { id: 'traditional', name: '传统', class: 'bg-[#F4EBE2] border-[#B03A2E]' },
    { id: 'editorial', name: '社论', class: 'bg-white border-black' },
    { id: 'vintage', name: '复古', class: 'bg-[#E9C46A] border-[#264653]' },
    { id: 'zen', name: '禅意', class: 'bg-[#F1F8E9] border-[#558B2F]' },
    { id: 'crimson', name: '赤金', class: 'bg-white border-[#800020]' },
  ];

  const fonts: { id: DateFontType; name: string; value: string }[] = [
    { id: 'playfair', name: 'Playfair', value: 'var(--font-date-playfair)' },
    { id: 'bebas', name: 'Bebas', value: 'var(--font-date-bebas)' },
    { id: 'cormorant', name: 'Cormorant', value: 'var(--font-date-cormorant)' },
    { id: 'abril', name: 'Abril', value: 'var(--font-date-abril)' },
    { id: 'mono', name: 'Typewriter', value: 'var(--font-date-mono)' },
    { id: 'satisfy', name: 'Handwrite', value: 'var(--font-date-satisfy)' },
    { id: 'space', name: 'Modern', value: 'var(--font-date-space)' },
    { id: 'outfit', name: 'Minimal', value: 'var(--font-date-outfit)' },
  ];

  const quoteFonts: { id: QuoteFontType; name: string; value: string }[] = [
    { id: 'serif', name: '典雅宋体', value: 'var(--font-quote-serif)' },
    { id: 'sans', name: '现代黑体', value: 'var(--font-quote-sans)' },
    { id: 'kaiti', name: '人文楷体', value: 'var(--font-quote-kaiti)' },
    { id: 'calligraphy', name: '苍劲书法', value: 'var(--font-quote-calligraphy)' },
    { id: 'handwrite', name: '随性手写', value: 'var(--font-quote-handwrite)' },
    { id: 'display', name: '现代美术', value: 'var(--font-quote-display)' },
    { id: 'modern', name: '时尚黄油', value: 'var(--font-quote-modern)' },
    { id: 'mono', name: '极客等宽', value: 'var(--font-quote-mono)' },
  ];

  const colorSchemes = [
    { id: 'original', name: '默认', bg: 'bg-neutral-200' },
    { 
      id: 'sakura', 
      name: '樱花', 
      bg: 'bg-[#FF80AB]', 
      light: { '--bg-page': '#FFF5F7', '--bg-card': '#FFFFFF', '--color-text': '#D81B60', '--color-muted': '#C2185B', '--border-card': '#F8D7DA', '--border-accent': '#D81B60' },
      dark: { '--bg-page': '#1A0B10', '--bg-card': '#2D141C', '--color-text': '#FF80AB', '--color-muted': '#F06292', '--border-card': '#4A0E2E', '--border-accent': '#FF80AB' }
    },
    { 
      id: 'forest', 
      name: '森林', 
      bg: 'bg-[#81C784]', 
      light: { '--bg-page': '#F1F8E9', '--bg-card': '#FFFFFF', '--color-text': '#2E7D32', '--color-muted': '#388E3C', '--border-card': '#C8E6C9', '--border-accent': '#2E7D32' },
      dark: { '--bg-page': '#0D1B12', '--bg-card': '#152A1E', '--color-text': '#81C784', '--color-muted': '#A5D6A7', '--border-card': '#1B3C2A', '--border-accent': '#81C784' }
    },
    { 
      id: 'ocean', 
      name: '海洋', 
      bg: 'bg-[#4FC3F7]', 
      light: { '--bg-page': '#E1F5FE', '--bg-card': '#FFFFFF', '--color-text': '#0277BD', '--color-muted': '#0288D1', '--border-card': '#B3E5FC', '--border-accent': '#0277BD' },
      dark: { '--bg-page': '#010D1A', '--bg-card': '#021B35', '--color-text': '#4FC3F7', '--color-muted': '#81D4FA', '--border-card': '#072F5F', '--border-accent': '#4FC3F7' }
    },
    { 
      id: 'matcha', 
      name: '抹茶', 
      bg: 'bg-[#AED581]', 
      light: { '--bg-page': '#F9FBE7', '--bg-card': '#FFFFFF', '--color-text': '#558B2F', '--color-muted': '#689F38', '--border-card': '#DCEDC8', '--border-accent': '#558B2F' },
      dark: { '--bg-page': '#12160C', '--bg-card': '#1D2413', '--color-text': '#AED581', '--color-muted': '#C5E1A5', '--border-card': '#2A341C', '--border-accent': '#AED581' }
    },
    { 
      id: 'terracotta', 
      name: '陶土', 
      bg: 'bg-[#FF8A65]', 
      light: { '--bg-page': '#FBE9E7', '--bg-card': '#FFFFFF', '--color-text': '#BF360C', '--color-muted': '#D84315', '--border-card': '#FFCCBC', '--border-accent': '#BF360C' },
      dark: { '--bg-page': '#1C100D', '--bg-card': '#2F1A16', '--color-text': '#FF8A65', '--color-muted': '#FFAB91', '--border-card': '#4A281E', '--border-accent': '#FF8A65' }
    },
    { 
      id: 'mist', 
      name: '薄雾', 
      bg: 'bg-[#90A4AE]', 
      light: { '--bg-page': '#ECEFF1', '--bg-card': '#FFFFFF', '--color-text': '#37474F', '--color-muted': '#455A64', '--border-card': '#CFD8DC', '--border-accent': '#37474F' },
      dark: { '--bg-page': '#101416', '--bg-card': '#1B2124', '--color-text': '#90A4AE', '--color-muted': '#B0BEC5', '--border-card': '#263238', '--border-accent': '#90A4AE' }
    },
    { 
      id: 'gold', 
      name: '流金', 
      bg: 'bg-[#FFF176]', 
      light: { '--bg-page': '#FFFDE7', '--bg-card': '#FFFFFF', '--color-text': '#F57F17', '--color-muted': '#FBC02D', '--border-card': '#FFF9C4', '--border-accent': '#F57F17' },
      dark: { '--bg-page': '#1A1400', '--bg-card': '#2B2100', '--color-text': '#FFF176', '--color-muted': '#FFF59D', '--border-card': '#403100', '--border-accent': '#FFF176' }
    },
    { 
      id: 'violet', 
      name: '罗兰', 
      bg: 'bg-[#BA68C8]', 
      light: { '--bg-page': '#F3E5F5', '--bg-card': '#FFFFFF', '--color-text': '#6A1B9A', '--color-muted': '#7B1FA2', '--border-card': '#E1BEE7', '--border-accent': '#6A1B9A' },
      dark: { '--bg-page': '#130A19', '--bg-card': '#21112D', '--color-text': '#CE93D8', '--color-muted': '#E1BEE7', '--border-card': '#311B92', '--border-accent': '#CE93D8' }
    },
  ];

  const backgrounds = [
    { id: 'default', name: '默认', color: 'transparent', preview: 'bg-white' },
    { id: 'white', name: '纯白', color: '#FFFFFF', preview: 'bg-white shadow-inner border-gray-100' },
    { id: 'paper', name: '故纸', color: '#FDFBF7', preview: 'bg-[#FDFBF7]' },
    { id: 'cream', name: '杏黄', color: '#FFF9E1', preview: 'bg-[#FFF9E1]' },
    { id: 'sage', name: '竹青', color: '#E8F0E8', preview: 'bg-[#E8F0E8]' },
    { id: 'mist', name: '瓦青', color: '#F0F4F8', preview: 'bg-[#F0F4F8]' },
    { id: 'rose', name: '藕粉', color: '#FDF0F0', preview: 'bg-[#FDF0F0]' },
    { id: 'charcoal', name: '玄灰', color: '#2C2C2C', preview: 'bg-[#2C2C2C]' },
    { id: 'midnight', name: '黛蓝', color: '#0F172A', preview: 'bg-[#0F172A]' },
  ];

  const currentFontValue = fonts.find(f => f.id === dateFont)?.value || 'var(--font-serif)';
  const currentQuoteFontValue = quoteFonts.find(f => f.id === quoteFont)?.value || 'var(--font-quote-serif)';
  
  const isThemeDark = ['dark', 'technical'].includes(theme);
  const currentSchemeData = colorSchemes.find(s => s.id === scheme);
  const schemeStyles = currentSchemeData ? (isThemeDark ? currentSchemeData.dark : currentSchemeData.light) || {} : {};
  
  const currentBg = backgrounds.find(b => b.id === bgId);
  const bgPageValue = useMemo(() => {
    if (currentBg && currentBg.id !== 'default') return currentBg.color;
    return undefined; // Let CSS handle it via var(--bg-page)
  }, [currentBg]);

  // Sync body background color to avoid gaps on mobile "bounce" or overscroll
  useEffect(() => {
    if (bgPageValue) {
      document.body.style.backgroundColor = bgPageValue;
    } else {
      // Fallback is more complex because it depends on the theme
      // For simplicity, we just set it to the root div's background-color
      const rootDiv = document.getElementById('root-bg');
      if (rootDiv) {
        const computedBg = getComputedStyle(rootDiv).backgroundColor;
        document.body.style.backgroundColor = computedBg;
      }
    }
  }, [bgPageValue, theme, scheme]);

  // Helper for dynamic button classes
  const isDarkBg = ['dark', 'poster', 'technical'].includes(theme) || bgId === 'charcoal' || bgId === 'midnight';
  const btnBaseClass = isDarkBg 
    ? 'bg-black/40 backdrop-blur-md text-white border-white/10 hover:bg-black/60' 
    : 'bg-white text-black border-gray-100 hover:bg-gray-50';
  const mainBtnClass = isDarkBg
    ? 'bg-black text-white border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
    : 'bg-white text-black border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)]';
  const menuClass = isDarkBg
    ? 'bg-neutral-900/80 text-white border-white/10'
    : 'bg-white/80 text-black border-gray-200';
  const tabActiveClass = isDarkBg ? 'bg-white/20 text-white' : 'bg-white text-black shadow-sm';
  const itemHoverClass = isDarkBg ? 'hover:bg-white/10' : 'hover:bg-gray-100/50';
  const itemActiveClass = isDarkBg ? 'bg-white text-black' : 'bg-black text-white';

  return (
    <div 
      id="root-bg"
      className={`min-h-svh w-full flex items-center justify-center p-4 md:p-8 pb-32 transition-colors duration-500 theme-${theme} scheme-${scheme}`} 
      style={{ 
        backgroundColor: bgPageValue || 'var(--bg-page)', 
        ...schemeStyles,
        '--bg-page': bgPageValue
      } as React.CSSProperties}
    >
      <motion.main 
        key={`${theme}-${dateFont}-${bgId}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`calendar-container w-full max-w-[560px] min-h-[500px] md:aspect-[3/4] border relative p-7 md:p-12 overflow-hidden select-none flex flex-col transition-all duration-500 ${hasShadow ? 'shadow-[0_40px_100px_rgba(0,0,0,0.12)]' : 'shadow-none'}`}
        id="calendar-container"
        style={{ 
          '--dynamic-font': currentFontValue,
          fontFamily: isFontSync ? currentQuoteFontValue : 'inherit',
          borderRadius: `${borderRadius}px`,
          borderWidth: `${borderWidth}px`,
          borderColor: borderColor,
          borderStyle: borderWidth > 0 ? 'solid' : 'none',
          boxShadow: hasShadow ? undefined : 'none'
        } as React.CSSProperties}
      >
        <header className="flex justify-between items-start mb-5" id="header">
          <div className="month-box" id="header-month">
            {calendarData.monthName}
          </div>
          <div className="text-right" id="header-advice">
            <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-[1px] mb-1">今日宜</div>
            <div className="text-sm font-semibold" style={{ fontFamily: currentQuoteFontValue }}>{calendarData.advice}</div>
          </div>
        </header>

        <section className="flex-1 relative flex items-center justify-center date-section">
          {calendarData.festivals && theme !== 'classic' && (
            <div className="festival-badge" id="festival-badge">
              {calendarData.festivals}
            </div>
          )}
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2 sidebar sidebar-left" id="side-left">
            {calendarData.lunarDate}
          </div>

          <h1 
            className="date-number" 
            id="center-date"
            style={{ fontFamily: currentFontValue }}
          >
            {calendarData.day}
          </h1>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 sidebar sidebar-right" id="side-right">
            {calendarData.lunarGanzhi}
          </div>
        </section>

        <section className="bottom-section" id="bottom-quote">
          <div 
            className={`quote-text mb-5 ${theme === 'classic' ? 'text-center max-w-[360px] mx-auto' : ''}`} 
            id="quote-text"
            style={{ fontFamily: currentQuoteFontValue }}
          >
            {calendarData.quote.text}
          </div>
          <div className={`quote-meta text-xs text-[var(--color-muted)] italic ${theme === 'classic' ? 'text-center' : 'text-right'}`} id="quote-meta">
            —— {calendarData.quote.author} {calendarData.quote.book ? `《${calendarData.quote.book}》` : ''}
          </div>
        </section>

        <footer className="mt-auto pt-3 md:pt-5 flex justify-between items-end border-t border-current/40" id="footer-main">
          <div className="text-[10px] font-black tracking-[3px] uppercase" id="brand">
            OWSPACE
          </div>
          <div className="text-right flex flex-col items-end gap-0.5" id="footer-day-year">
            <div className="text-xs font-bold">{calendarData.weekday}</div>
            <div className="text-[11px] text-[var(--color-muted)]">{calendarData.year}年</div>
          </div>
        </footer>

        <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </motion.main>

      {/* Floating Preference Switcher */}
      <motion.div 
        className="fixed right-0 top-1/2 -translate-y-1/2 flex items-center z-50 group"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <motion.div 
          variants={{
            hidden: { x: '100%', opacity: 0 },
            visible: { x: 0, opacity: 1 }
          }}
          initial="hidden"
          animate={(isSidebarHovered || isSwitcherOpen) ? 'visible' : 'hidden'}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="flex flex-col items-end gap-4 p-4 pr-3"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all ${btnBaseClass} ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="下载图片"
          >
            {isDownloading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Download size={18} />
              </motion.div>
            ) : (
              <Download size={20} />
            )}
          </motion.button>

          {/* Random Quote Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ rotate: 180, scale: 0.95 }}
            onClick={handleRandomQuote}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all ${btnBaseClass}`}
            title="随机金句"
          >
            <RefreshCw size={20} />
          </motion.button>

          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all ${mainBtnClass}`}
            >
              {isSwitcherOpen ? <X size={20} /> : <Palette size={20} />}
            </button>

            <AnimatePresence>
              {isSwitcherOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className={`fixed right-20 top-1/2 -translate-y-1/2 backdrop-blur-md p-2 rounded-3xl border shadow-xl flex flex-col gap-2 min-w-[200px] transition-colors duration-500 ${menuClass}`}
                >
                  {/* Tabs */}
                  <div className={`grid grid-cols-6 rounded-2xl p-1 mb-1 gap-0.5 ${isDarkBg ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <button 
                      onClick={() => setActiveTab('theme')}
                      className={`text-[8px] py-1.5 rounded-xl transition-all ${activeTab === 'theme' ? tabActiveClass : 'opacity-40'}`}
                    >
                      风格
                    </button>
                    <button 
                      onClick={() => setActiveTab('scheme')}
                      className={`text-[8px] py-1.5 rounded-xl transition-all ${activeTab === 'scheme' ? tabActiveClass : 'opacity-40'}`}
                    >
                      配色
                    </button>
                    <button 
                      onClick={() => setActiveTab('background')}
                      className={`text-[8px] py-1.5 rounded-xl transition-all ${activeTab === 'background' ? tabActiveClass : 'opacity-40'}`}
                    >
                      背景
                    </button>
                    <button 
                      onClick={() => setActiveTab('font')}
                      className={`text-[8px] py-1.5 rounded-xl transition-all ${activeTab === 'font' ? tabActiveClass : 'opacity-40'}`}
                    >
                      日期
                    </button>
                    <button 
                      onClick={() => setActiveTab('quote')}
                      className={`text-[8px] py-1.5 rounded-xl transition-all ${activeTab === 'quote' ? tabActiveClass : 'opacity-40'}`}
                    >
                      金句
                    </button>
                    <button 
                      onClick={() => setActiveTab('setting')}
                      className={`text-[8px] py-1.5 rounded-xl transition-all ${activeTab === 'setting' ? tabActiveClass : 'opacity-40'}`}
                    >
                      设置
                    </button>
                  </div>

                  {/* Theme List */}
                  {activeTab === 'theme' && (
                    <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleThemeChange(t.id)}
                          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            theme === t.id ? itemActiveClass : `${itemHoverClass}`
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border ${t.class}`} />
                          {t.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Scheme List */}
                  {activeTab === 'scheme' && (
                    <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1">
                      {colorSchemes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSchemeChange(s.id)}
                          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            scheme === s.id ? itemActiveClass : `${itemHoverClass}`
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border ${s.bg}`} />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Background List */}
                  {activeTab === 'background' && (
                    <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1">
                      {backgrounds.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleBgChange(b.id)}
                          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            bgId === b.id ? itemActiveClass : `${itemHoverClass}`
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border ${b.preview}`} />
                          {b.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Font List */}
                  {activeTab === 'font' && (
                    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                      {fonts.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => handleFontChange(f.id)}
                          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs transition-all ${
                            dateFont === f.id ? itemActiveClass : `${itemHoverClass}`
                          }`}
                        >
                          <span className="text-lg w-8 overflow-hidden" style={{ fontFamily: f.value }}>88</span>
                          <span className="flex-1 text-left">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quote Font List */}
                  {activeTab === 'quote' && (
                    <div className="flex flex-col gap-1 pr-1">
                      {/* Sync Switch */}
                      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 ${isDarkBg ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <span className="text-[10px] opacity-70">全局字体同步</span>
                        <button 
                          onClick={toggleFontSync}
                          className={`w-8 h-4 rounded-full relative transition-colors ${isFontSync ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                          <motion.div 
                            animate={{ x: isFontSync ? 18 : 2 }}
                            className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      </div>

                      <div className="max-h-[240px] overflow-y-auto flex flex-col gap-1">
                        {quoteFonts.map((f) => (
                          <button
                            key={f.id}
                            onClick={() => handleQuoteFontChange(f.id)}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs transition-all ${
                              quoteFont === f.id ? itemActiveClass : `${itemHoverClass}`
                            }`}
                          >
                            <span className="text-base w-8 overflow-hidden" style={{ fontFamily: f.value }}>文</span>
                            <span className="flex-1 text-left">{f.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'setting' && (
                    <div className="flex flex-col gap-4 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium opacity-60">卡片阴影</span>
                        <button 
                          onClick={() => handleShadowChange(!hasShadow)}
                          className={`w-8 h-4 rounded-full transition-colors relative ${hasShadow ? 'bg-blue-500' : 'bg-gray-400'}`}
                        >
                          <motion.div 
                            animate={{ x: hasShadow ? 18 : 2 }}
                            className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium opacity-60">圆角半径 ({borderRadius}px)</span>
                          <button 
                            onClick={() => handleRadiusChange(borderRadius === 0 ? 4 : 0)}
                            className={`text-[9px] px-2 py-0.5 rounded-md border transition-all ${borderRadius > 0 ? 'bg-blue-500/20 border-blue-500/30 text-blue-500' : 'border-gray-500/20 opacity-50'}`}
                          >
                            {borderRadius === 0 ? '直角' : '圆角'}
                          </button>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="60" 
                          value={borderRadius} 
                          onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium opacity-60">边框粗细 ({borderWidth}px)</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          value={borderWidth} 
                          onChange={(e) => handleBorderWidthChange(parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium opacity-60">边框颜色</span>
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: borderColor }}
                          />
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {['#E5E7EB', '#D1D5DB', '#9CA3AF', '#4B5563', '#1F2937', '#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B'].map(c => (
                            <button
                              key={c}
                              onClick={() => handleBorderColorChange(c)}
                              className={`w-5 h-5 rounded-md border-2 transition-all ${borderColor === c ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <input 
                          type="color" 
                          value={borderColor} 
                          onChange={(e) => handleBorderColorChange(e.target.value)}
                          className="w-full h-8 p-0 rounded-md border-0 cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Trigger Handle - Subtle Vertical Line ALWAYS at the edge */}
        <div className={`w-1 h-32 rounded-l-full cursor-pointer transition-all duration-300 relative z-50 ${isDarkBg ? 'bg-white/20 hover:bg-white/40' : 'bg-black/10 hover:bg-black/30'}`} />
      </motion.div>
    </div>
  );
}
