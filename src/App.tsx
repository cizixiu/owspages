/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Solar, Lunar } from 'lunar-javascript';
import { QUOTES, ADVICE_POOL } from './data/quotes';
import { Palette, X, Download, RefreshCw, RotateCcw, Type, Baseline, Layers, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toCanvas } from 'html-to-image';

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
  const [quoteFontSize, setQuoteFontSize] = useState<number | undefined>(undefined);
  const [adviceFontSize, setAdviceFontSize] = useState<number | undefined>(undefined);
  const [dayFontSize, setDayFontSize] = useState<number | undefined>(undefined);
  const [dayStyle, setDayStyle] = useState<string>('standard');
  const [hasShadow, setHasShadow] = useState(true);
  const [borderRadius, setBorderRadius] = useState<number | undefined>(undefined);
  const [borderWidth, setBorderWidth] = useState<number | undefined>(undefined);
  const [borderColor, setBorderColor] = useState<string>('');
  const [isFontSync, setIsFontSync] = useState(false);
  const [cardBg, setCardBg] = useState<string>('');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('');
  const [customAppBgColor, setCustomAppBgColor] = useState<string>('');
  const [customCardBgColor, setCustomCardBgColor] = useState<string>('');
  const [customQuoteText, setCustomQuoteText] = useState<string>('');
  const [customQuoteSource, setCustomQuoteSource] = useState<string>('');
  const [customBorderColor, setCustomBorderColor] = useState<string>('');
  const [isCustomBorder, setIsCustomBorder] = useState(false);
  const [isCustomCardBg, setIsCustomCardBg] = useState(false);
  const [cardTexture, setCardTexture] = useState('none');
  const [footerText, setFooterText] = useState('Your Day');

  const cardBgs = [
    { id: 'white', color: '#FFFFFF', label: '纯白' },
    { id: 'paper', color: '#FDFCF8', label: '纸张' },
    { id: 'sepia', color: '#F4ECD8', label: '复古' },
    { id: 'dark', color: '#1A1A1A', label: '深邃' },
    { id: 'cream', color: '#F5F5DC', label: '奶油' },
    { id: 'blue', color: '#EBF5FF', label: '淡蓝' },
    { id: 'green', color: '#F0FDF4', label: '浅艾' },
    { id: 'oat', color: '#F4F1EA', label: '燕麦' },
    { id: 'wheat', color: '#FBF8F1', label: '麦香' },
    { id: 'glacier', color: '#F0FDFA', label: '冰川' },
    { id: 'shell', color: '#FFFBF0', label: '贝耳' },
  ];
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'font' | 'quote' | 'scheme' | 'background' | 'card' | 'border' | 'setting'>('theme');
  const [randomSeed, setRandomSeed] = useState(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const actionButtonsRef = useRef<HTMLDivElement>(null);

  // Click away to close settings panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isSwitcherOpen) return;

      const target = event.target as Node;
      
      // Check if click is inside the panel
      if (panelRef.current?.contains(target)) return;
      
      // Check if click is inside the trigger button
      if (triggerRef.current?.contains(target)) return;
      
      // Check if click is inside the action buttons (download, random)
      if (actionButtonsRef.current?.contains(target)) return;

      // If outside all of the above, close the panel
      setIsSwitcherOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwitcherOpen]);
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

    const savedQuoteFontSize = localStorage.getItem('calendar-quote-font-size');
    if (savedQuoteFontSize) setQuoteFontSize(parseInt(savedQuoteFontSize));

    const savedAdviceFontSize = localStorage.getItem('calendar-advice-font-size');
    if (savedAdviceFontSize) setAdviceFontSize(parseInt(savedAdviceFontSize));

    const savedDayFontSize = localStorage.getItem('calendar-day-font-size');
    if (savedDayFontSize) setDayFontSize(parseInt(savedDayFontSize));

    const savedDayStyle = localStorage.getItem('calendar-day-style');
    if (savedDayStyle) setDayStyle(savedDayStyle);

    const savedRadius = localStorage.getItem('calendar-radius');
    if (savedRadius) setBorderRadius(parseInt(savedRadius));

    const savedBorderWidth = localStorage.getItem('calendar-border-width');
    if (savedBorderWidth) setBorderWidth(parseInt(savedBorderWidth));

    const savedBorderColor = localStorage.getItem('calendar-border-color');
    if (savedBorderColor) {
      setBorderColor(savedBorderColor);
      setCustomBorderColor(savedBorderColor);
      setIsCustomBorder(localStorage.getItem('calendar-border-custom') === 'true');
    }

    const savedCardBg = localStorage.getItem('calendar-card-bg');
    if (savedCardBg) {
      setCardBg(savedCardBg);
      setIsCustomCardBg(localStorage.getItem('calendar-card-custom') === 'true');
    }

    const savedCustomPrimary = localStorage.getItem('calendar-custom-primary');
    if (savedCustomPrimary) setCustomPrimaryColor(savedCustomPrimary);

    const savedCustomAppBg = localStorage.getItem('calendar-custom-app-bg');
    if (savedCustomAppBg) setCustomAppBgColor(savedCustomAppBg);

    const savedCustomCardBg = localStorage.getItem('calendar-custom-card-bg');
    if (savedCustomCardBg) setCustomCardBgColor(savedCustomCardBg);

    const savedCustomQuote = localStorage.getItem('calendar-custom-quote');
    if (savedCustomQuote) setCustomQuoteText(savedCustomQuote);

    const savedCustomSource = localStorage.getItem('calendar-custom-source');
    if (savedCustomSource) setCustomQuoteSource(savedCustomSource);

    const savedFooterText = localStorage.getItem('calendar-footer-text');
    if (savedFooterText) setFooterText(savedFooterText);
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

  const handleCustomPrimaryChange = (color: string) => {
    setCustomPrimaryColor(color);
    setScheme('custom');
    localStorage.setItem('calendar-custom-primary', color);
    localStorage.setItem('calendar-scheme', 'custom');
  };

  const handleBgChange = (newBg: string) => {
    setBgId(newBg);
    localStorage.setItem('calendar-bg-id', newBg);
  };

  const handleFooterTextChange = (text: string) => {
    // Limit to 20 Chinese or 40 English
    // Simple heuristic: Chinese characters count as 2, English as 1
    let totalLen = 0;
    let slicedText = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      totalLen += (charCode >= 0 && charCode <= 128) ? 1 : 2;
      if (totalLen <= 40) {
        slicedText += text[i];
      } else {
        break;
      }
    }
    setFooterText(slicedText);
    localStorage.setItem('calendar-footer-text', slicedText);
  };

  const handleCustomQuoteChange = (text: string) => {
    const val = text.slice(0, 300);
    setCustomQuoteText(val);
    localStorage.setItem('calendar-custom-quote', val);
  };

  const handleCustomSourceChange = (text: string) => {
    const val = text.slice(0, 50);
    setCustomQuoteSource(val);
    localStorage.setItem('calendar-custom-source', val);
  };

  const handleCustomAppBgChange = (color: string) => {
    setCustomAppBgColor(color);
    setBgId('custom-color');
    localStorage.setItem('calendar-custom-app-bg', color);
    localStorage.setItem('calendar-bg-id', 'custom-color');
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

  const handleQuoteFontSizeChange = (newSize: number) => {
    setQuoteFontSize(newSize);
    localStorage.setItem('calendar-quote-font-size', String(newSize));
  };

  const handleAdviceFontSizeChange = (newSize: number) => {
    setAdviceFontSize(newSize);
    localStorage.setItem('calendar-advice-font-size', String(newSize));
  };

  const handleDayFontSizeChange = (newSize: number) => {
    setDayFontSize(newSize);
    localStorage.setItem('calendar-day-font-size', String(newSize));
  };

  const handleDayStyleChange = (style: string) => {
    setDayStyle(style);
    localStorage.setItem('calendar-day-style', style);
  };

  const handleAdjustDate = (days: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + days);
    setCurrentDate(nextDate);
  };

  const handleBorderColorChange = (newColor: string, isCustom = false) => {
    setBorderColor(newColor);
    setIsCustomBorder(isCustom);
    if (isCustom) setCustomBorderColor(newColor);
    localStorage.setItem('calendar-border-color', newColor);
    localStorage.setItem('calendar-border-custom', String(isCustom));
  };

  const handleCardBgChange = (newVal: string) => {
    setCardBg(newVal);
    setIsCustomCardBg(false);
    localStorage.setItem('calendar-card-bg', newVal);
    localStorage.setItem('calendar-card-custom', 'false');
  };

  const handleCustomCardBgChange = (color: string) => {
    setCustomCardBgColor(color);
    setCardBg(color);
    setIsCustomCardBg(true);
    localStorage.setItem('calendar-custom-card-bg', color);
    localStorage.setItem('calendar-card-bg', color);
    localStorage.setItem('calendar-card-custom', 'true');
  };

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDefaults = () => {
    // Reset Overrides to Theme Defaults (undefined/empty)
    setBorderRadius(undefined);
    setBorderWidth(undefined);
    setQuoteFontSize(undefined);
    setAdviceFontSize(undefined);
    setDayFontSize(undefined);
    setDayStyle('standard');
    setBorderColor('');
    setCardBg('');
    setCardTexture('none');
    setScheme('original');
    setBgId('default');
    setCustomQuoteText('');
    setCustomQuoteSource('');
    setIsFontSync(false);
    setIsCustomBorder(false);
    setIsCustomCardBg(false);
    setFooterText('Your Day');
    
    // Clear custom color inputs
    setCustomPrimaryColor('');
    setCustomAppBgColor('');
    setCustomCardBgColor('');
    setCustomBorderColor('');

    // Clear LocalStorage overrides
    const overrideKeys = [
      'calendar-scheme',
      'calendar-bg-id', 
      'calendar-radius', 
      'calendar-shadow', 
      'calendar-border-width',
      'calendar-border-color', 
      'calendar-card-bg', 
      'calendar-font-sync',
      'calendar-custom-primary', 
      'calendar-custom-app-bg', 
      'calendar-custom-card-bg',
      'calendar-quote-font-size',
      'calendar-advice-font-size',
      'calendar-day-font-size',
      'calendar-day-style',
      'calendar-footer-text',
      'calendar-custom-quote',
      'calendar-custom-source'
    ];
    overrideKeys.forEach(key => localStorage.removeItem(key));
    
    // Provide feedback
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  const calendarData = useMemo(() => {
    const solar = Solar.fromDate(currentDate);
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
    
    // Custom Quote Logic
    const quote = customQuoteText 
      ? { text: customQuoteText, author: customQuoteSource, book: '' }
      : QUOTES[hash % QUOTES.length];
      
    const advice = ADVICE_POOL[hash % ADVICE_POOL.length];

    const isModern = ['bold', 'dark', 'technical', 'poster', 'editorial', 'crimson'].includes(theme);

    return {
      year,
      monthName: theme === 'crimson' 
        ? monthNames[month - 1] 
        : (isModern ? `${monthNamesEn[month - 1]} ${monthNames[month - 1]}` : monthNames[month - 1]),
      day,
      weekday: isModern ? `${weekDays[weekIdx]} ${weekDaysEn[weekIdx].toUpperCase()}` : weekDays[weekIdx],
      lunarDate: theme === 'classic' ? `农历${lunarMonth}月${lunarDay}${festivals.length > 0 ? '·' + festivals[0] : solarTerm ? '·' + solarTerm : ''}` : `农历${lunarMonth}月${lunarDay}`,
      lunarGanzhi: theme === 'classic' || theme === 'traditional' 
        ? `${lunarYearGanzhi}年·${lunarMonthGanzhi}月·${lunarDayGanzhi}日` 
        : `${lunarYearGanzhi}年${lunarMonthGanzhi}月${lunarDayGanzhi}日`,
      festivals: festivals.join(' '),
      solarTerm: solarTerm || '',
      quote,
      advice
    };
  }, [currentDate, theme, randomSeed, customQuoteText, customQuoteSource]);

  const handleRandomQuote = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setRandomSeed(newSeed);
  };

  const handleRandomStyle = () => {
    // 1. Random Theme
    const themeList: ThemeType[] = ['classic', 'bold', 'dark', 'warm', 'technical', 'poster', 'traditional', 'editorial', 'vintage', 'zen', 'crimson'];
    const newTheme = themeList[Math.floor(Math.random() * themeList.length)];
    setTheme(newTheme);

    // 2. Random Scheme
    const schemes = ['default', 'monochrome', 'vibrant', 'soft', 'earth', 'midnight', 'rose', 'forest', 'original'];
    const newScheme = schemes[Math.floor(Math.random() * schemes.length)];
    setScheme(newScheme);

    // 3. Random Fonts
    const fontIds = ['serif', 'sans', 'pixel', 'technical', 'display', 'brush', 'classic'];
    const newDateFont = fontIds[Math.floor(Math.random() * fontIds.length)] as any;
    const newQuoteFont = fontIds[Math.floor(Math.random() * fontIds.length)] as any;
    setDateFont(newDateFont);
    setQuoteFont(newQuoteFont);

    // 4. Random Layout Styles
    const dayStyles = ['standard', 'outline', 'shadow', 'neumorphic', 'minimal'];
    const newDayStyle = dayStyles[Math.floor(Math.random() * dayStyles.length)];
    setDayStyle(newDayStyle);

    // 5. Borders and Corners
    setBorderRadius(Math.floor(Math.random() * 40));
    setBorderWidth(Math.floor(Math.random() * 6));

    // 6. Other Params
    setHasShadow(Math.random() > 0.5);
    
    // 7. Background Style
    const bgs = ['default', 'glass', 'mesh', 'paper', 'gradient'];
    const newBg = bgs[Math.floor(Math.random() * bgs.length)];
    setBgId(newBg);

    // Reset custom colors to let scheme take over
    setCustomPrimaryColor('');
    setCustomAppBgColor('');
  };

  const themes: { id: ThemeType; name: string; class: string }[] = [
    { id: 'classic', name: '经典', class: 'bg-[#F5F3F0] border-gray-300' },
    { id: 'bold', name: '包豪斯', class: 'bg-[#E5E5E1] border-black' },
    { id: 'dark', name: '暗夜', class: 'bg-[#121212] border-gray-700' },
    { id: 'warm', name: '和风', class: 'bg-[#EDE0D4] border-[#D7CCC8]' },
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
    { 
      id: 'slate', 
      name: '石板', 
      bg: 'bg-[#475569]', 
      light: { '--bg-page': '#F1F5F9', '--bg-card': '#FFFFFF', '--color-text': '#334155', '--color-muted': '#475569', '--border-card': '#E2E8F0', '--border-accent': '#334155' },
      dark: { '--bg-page': '#0F172A', '--bg-card': '#1E293B', '--color-text': '#94A3B8', '--color-muted': '#CBD5E1', '--border-card': '#334155', '--border-accent': '#94A3B8' }
    },
    { 
      id: 'amber', 
      name: '琥珀', 
      bg: 'bg-[#D97706]', 
      light: { '--bg-page': '#FFFBEB', '--bg-card': '#FFFFFF', '--color-text': '#92400E', '--color-muted': '#B45309', '--border-card': '#FEF3C7', '--border-accent': '#92400E' },
      dark: { '--bg-page': '#451A03', '--bg-card': '#78350F', '--color-text': '#FBBF24', '--color-muted': '#FCD34D', '--border-card': '#92400E', '--border-accent': '#FBBF24' }
    },
    { 
      id: 'rosewood', 
      name: '檀香', 
      bg: 'bg-[#991B1B]', 
      light: { '--bg-page': '#FEF2F2', '--bg-card': '#FFFFFF', '--color-text': '#7F1D1D', '--color-muted': '#991B1B', '--border-card': '#FEE2E2', '--border-accent': '#7F1D1D' },
      dark: { '--bg-page': '#450A0A', '--bg-card': '#7F1D1D', '--color-text': '#FCA5A5', '--color-muted': '#FECACA', '--border-card': '#991B1B', '--border-accent': '#FCA5A5' }
    },
    { 
      id: 'ebony', 
      name: '乌木', 
      bg: 'bg-[#1A1A1A]', 
      light: { '--bg-page': '#F5F5F5', '--bg-card': '#FFFFFF', '--color-text': '#1A1A1A', '--color-muted': '#666666', '--border-card': '#E5E5E5', '--border-accent': '#1A1A1A' },
      dark: { '--bg-page': '#0A0A0A', '--bg-card': '#121212', '--color-text': '#FFFFFF', '--color-muted': '#A0A0A0', '--border-card': '#1A1A1A', '--border-accent': '#FFFFFF' }
    },
    { 
      id: 'clay', 
      name: '粘土', 
      bg: 'bg-[#8D6241]', 
      light: { '--bg-page': '#FDF9F6', '--bg-card': '#FFFFFF', '--color-text': '#8D6241', '--color-muted': '#A6866D', '--border-card': '#F3E9E2', '--border-accent': '#8D6241' },
      dark: { '--bg-page': '#1A120B', '--bg-card': '#2A1D12', '--color-text': '#C59A78', '--color-muted': '#A6866D', '--border-card': '#3D2A1B', '--border-accent': '#C59A78' }
    },
    { 
      id: 'nordic', 
      name: '北欧', 
      bg: 'bg-[#2C3E50]', 
      light: { '--bg-page': '#F0F4F7', '--bg-card': '#FFFFFF', '--color-text': '#2C3E50', '--color-muted': '#7F8C8D', '--border-card': '#D6DBDF', '--border-accent': '#2C3E50' },
      dark: { '--bg-page': '#0C1117', '--bg-card': '#161B22', '--color-text': '#8B949E', '--color-muted': '#C9D1D9', '--border-card': '#30363D', '--border-accent': '#58A6FF' }
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
    { id: 'snow', name: '积雪', color: '#F9FAFB', preview: 'bg-[#F9FAFB]' },
    { id: 'obsidian', name: '曜石', color: '#171717', preview: 'bg-[#171717]' },
    { id: 'silk', name: '蚕丝', color: '#F8F7F3', preview: 'bg-[#F8F7F3]' },
    { id: 'cloud', name: '云中', color: '#E8EEF2', preview: 'bg-[#E8EEF2]' },
    { id: 'dust', name: '烟粉', color: '#F4E7E7', preview: 'bg-[#F4E7E7]' },
    { id: 'pine', name: '松针', color: '#DAE2D8', preview: 'bg-[#DAE2D8]' },
  ];

  const currentFontValue = fonts.find(f => f.id === dateFont)?.value || 'var(--font-serif)';
  const currentQuoteFontValue = quoteFonts.find(f => f.id === quoteFont)?.value || 'var(--font-quote-serif)';
  
  const isThemeDark = ['dark', 'technical'].includes(theme);
  
  const hexToRgb = (hex: string): string => {
    if (!hex) return '0, 0, 0';
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map(char => char + char).join('');
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return isNaN(r) ? '0, 0, 0' : `${r}, ${g}, ${b}`;
  };

  const schemeStyles = useMemo(() => {
    let styles: any = {};
    if (scheme === 'custom' && customPrimaryColor) {
      styles = { 
        '--color-primary': customPrimaryColor,
        '--border-accent': customPrimaryColor,
        '--color-text': customPrimaryColor,
        '--color-muted': customPrimaryColor
      };
    } else {
      const currentSchemeData = colorSchemes.find(s => s.id === scheme);
      styles = currentSchemeData ? (isThemeDark ? currentSchemeData.dark : currentSchemeData.light) || {} : {};
    }
    
    // Ensure --border-accent is set if not present but --color-primary is
    if (styles['--color-primary'] && !styles['--border-accent']) {
      styles['--border-accent'] = styles['--color-primary'];
    }

    // Extract primary color for RGB variable usage in filters/shadows
    const primary = styles['--color-primary'] || styles['--border-accent'] || '#000000';
    styles['--color-primary-rgb'] = hexToRgb(primary);
    
    return styles;
  }, [scheme, customPrimaryColor, isThemeDark]);

  const [isDownloading, setIsDownloading] = useState(false);

  const primaryColor = useMemo(() => {
    return schemeStyles['--color-primary'] || schemeStyles['--border-accent'] || (isThemeDark ? '#FDA4AF' : '#E11D48');
  }, [schemeStyles, isThemeDark]);

  const handleDownload = async () => {
    const node = document.getElementById('calendar-container');
    if (!node || isDownloading) return;

    setIsDownloading(true);
    
    // Increased timeout for mobile devices
    const TIMEOUT_DURATION = 35000;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Download timeout')), TIMEOUT_DURATION)
    );

    const performRendering = async (scale: number) => {
      // Ensure all fonts are loaded before capturing
      if ('fonts' in document) {
        await (document as any).fonts.ready;
      }

      return await toCanvas(node, { 
        pixelRatio: scale, 
        backgroundColor: getComputedStyle(node).backgroundColor || '#ffffff',
        cacheBust: true,
        style: {
          transform: 'scale(1)', 
        },
        filter: (domNode) => {
          if (domNode instanceof HTMLElement && domNode.classList.contains('download-overlay')) {
            return false;
          }
          return true;
        }
      });
    };

    try {
      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      let canvas: HTMLCanvasElement;
      
      try {
        // Try high resolution first
        canvas = await Promise.race([
          performRendering(2),
          timeoutPromise
        ]) as HTMLCanvasElement;
      } catch (err) {
        console.warn('High-res render failed or timed out, trying standard resolution...', err);
        // Fallback to standard resolution if high-res fails or times out
        canvas = await performRendering(1.2);
      }
      
      if (!canvas) throw new Error('Failed to generate canvas');

      // Use a more compatible way to trigger download
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
      
      if (!blob || blob.size < 100) throw new Error('Generated image is empty');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Du-Almanac-${calendarData.year}${calendarData.monthName}${calendarData.day}.png`;
      link.href = url;
      link.target = '_blank'; // Essential for some mobile browsers
      
      // For iOS Safari compatibility
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        if (link.parentNode) document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);
      
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (err) {
      console.error('Download failed:', err);
      const errorMsg = err instanceof Error ? err.message : '未知错误';
      alert(`下载遇到了点困难 (${errorMsg})。\n\n常见解决方案：\n1. 稍等几秒后刷新页面重试\n2. 尝试切换网络环境\n3. 在电脑浏览器上打开可获得最佳下载体验`);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const bgPageValue = useMemo(() => {
    if (bgId === 'custom-color' && customAppBgColor) return customAppBgColor;
    const currentBg = backgrounds.find(b => b.id === bgId);
    if (currentBg && currentBg.id !== 'default') return currentBg.color;
    return undefined; // Let CSS handle it via var(--bg-page)
  }, [bgId, customAppBgColor]);

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
  const itemActiveClass = isDarkBg ? 'bg-white text-black' : 'bg-white text-black ring-2 ring-rose-600 shadow-sm';

  return (
    <div 
      id="root-bg"
      className={`min-h-svh w-full flex items-center justify-center p-4 md:p-8 pb-32 transition-colors duration-500 theme-${theme} scheme-${scheme}`} 
      style={{ 
        backgroundColor: bgPageValue || 'var(--bg-page)', 
        ...schemeStyles,
        '--bg-page': bgPageValue || undefined
      } as React.CSSProperties}
    >
      <motion.main 
        key={`${theme}-${dateFont}-${bgId}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`calendar-container w-full max-w-[560px] min-h-[500px] md:aspect-[3/4] border relative p-7 md:p-12 ${dayStyle === 'shadow' ? '' : 'overflow-hidden'} select-none flex flex-col transition-all duration-500 ${hasShadow ? 'shadow-[0_40px_100px_rgba(0,0,0,0.12)]' : 'shadow-none'}`}
        id="calendar-container"
        style={{ 
          '--dynamic-font': currentFontValue,
          ...schemeStyles,
          fontFamily: isFontSync ? currentQuoteFontValue : 'inherit',
          backgroundColor: cardBg || undefined,
          borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
          borderWidth: borderWidth !== undefined ? `${borderWidth}px` : undefined,
          borderColor: borderColor || undefined,
          borderStyle: (borderWidth !== undefined && borderWidth > 0) ? 'solid' : undefined,
          boxShadow: hasShadow ? undefined : 'none'
        } as React.CSSProperties}
      >
        <header className="flex justify-between items-start mb-5" id="header">
          <div className="month-box" id="header-month">
            {calendarData.monthName}
          </div>
          <div className="text-right" id="header-advice">
            <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-[1px] mb-1">今日宜</div>
            <div className="text-sm font-semibold" style={{ fontFamily: currentQuoteFontValue, fontSize: adviceFontSize ? `${adviceFontSize}px` : undefined }}>{calendarData.advice}</div>
          </div>
        </header>

        <section className="flex-1 relative flex items-center justify-center date-section">
          {/* Theme-specific Festival/Solar Term Layouts */}
          {(calendarData.festivals || calendarData.solarTerm) && theme !== 'classic' && (
            <div className="absolute inset-0 pointer-events-none select-none" id="festival-layer">
              {/* 1. Traditional/Vintage: Red Stamp Style */}
              {(theme === 'traditional' || theme === 'vintage') && (
                <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
                  {calendarData.festivals && (
                    <div className="transform rotate-6 flex items-center justify-center">
                      <div className="border-2 border-red-600/60 text-red-600/70 p-0.5 rounded-sm flex items-center justify-center min-w-[32px] min-h-[32px]">
                        <div className="border border-red-600/40 px-1 py-1 text-[10px] font-serif font-black leading-tight flex flex-col items-center">
                          {calendarData.festivals.split(' ')[0].split('').map((char, index) => (
                            <span key={index}>{char}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {calendarData.solarTerm && (
                    <div className="transform -rotate-6 flex items-center justify-center self-end -mt-2">
                      <div className="border border-red-600/40 text-red-600/50 p-0.5 rounded-sm flex items-center justify-center min-w-[28px] min-h-[28px]">
                        <div className="px-0.5 py-0.5 text-[8px] font-serif font-bold leading-tight flex flex-col items-center">
                          {calendarData.solarTerm.split('').map((char, index) => (
                            <span key={index}>{char}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Editorial/Crimson: Vertical Label */}
              {(theme === 'editorial' || theme === 'crimson') && (
                <div 
                  className="absolute flex items-start gap-1 z-10"
                  style={{ top: '-12px', right: '2px' }}
                >
                  {calendarData.festivals && (
                    <div className="bg-[var(--color-primary)] text-[var(--color-bg)] py-1 px-1 flex flex-col items-center gap-0.5">
                      <div className="w-[1px] h-1.5 bg-current opacity-30 mb-0.5" />
                      <div className="text-[9px] font-bold [writing-mode:vertical-rl] tracking-[1px] py-1">
                        {calendarData.festivals.split(' ')[0]}
                      </div>
                      <div className="w-[1px] h-1.5 bg-current opacity-30 mt-0.5" />
                    </div>
                  )}
                  {calendarData.solarTerm && (
                    <div className={`bg-[var(--color-primary)]/10 text-[var(--color-primary)] py-1 px-0.5 flex flex-col items-center gap-0.5 ${
                      theme === 'crimson' ? 'border border-[var(--color-primary)]/20 rounded-full px-1' : 
                      theme === 'editorial' ? 'border-b border-[var(--color-primary)]/20' : 
                      'border border-[var(--color-primary)]/20'
                    }`}>
                      <div className="text-[10px] font-bold [writing-mode:vertical-rl] tracking-[1px] py-1">
                        {calendarData.solarTerm}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Poster: Top Left below Month/Year */}
              {theme === 'poster' && (
                <div className="absolute left-1 top-10 flex flex-col items-start gap-1 z-10">
                  {calendarData.festivals && (
                    <div className="bg-[var(--color-primary)] text-[var(--color-bg)] px-2 py-0.5 flex items-center gap-2">
                      <div className="text-[9px] font-black uppercase tracking-[2px]">
                        {calendarData.festivals.split(' ')[0]}
                      </div>
                    </div>
                  )}
                  {calendarData.solarTerm && (
                    <div className="border border-[var(--color-primary)] text-[var(--color-primary)] px-2 py-0.5 flex items-center gap-2">
                      <div className="text-[8px] font-bold uppercase tracking-[1px]">
                        {calendarData.solarTerm}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Technical: New Refined Badge - Standard position */}
              {(theme === 'technical') && (
                <div className="absolute top-0 right-1 flex flex-col items-end gap-1 z-10">
                  {calendarData.festivals && (
                    <div className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-bg)] px-3 py-1 text-[11px] font-black tracking-widest leading-none">
                      {calendarData.festivals.split(' ')[0]}
                      <span className="opacity-50 text-[8px]">●</span>
                    </div>
                  )}
                  {calendarData.solarTerm && (
                    <div className="flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] px-2 py-0.5 text-[9px] font-bold tracking-wider leading-none">
                      {calendarData.solarTerm}
                      <span className="opacity-30 text-[6px]">○</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2 sidebar sidebar-left" id="side-left">
            {calendarData.lunarDate}
          </div>

          <h1 
            className={`date-number date-style-${dayStyle}`} 
            id="center-date"
            data-date={calendarData.day}
            style={{ 
              fontFamily: currentFontValue, 
              '--date-font-size': dayFontSize ? `${dayFontSize}px` : undefined,
              '--card-border-color': customBorderColor || (scheme === 'original' ? 'rgba(0,0,0,0.1)' : undefined),
              '--card-border-width': borderWidth !== undefined ? `${borderWidth}px` : undefined
            } as React.CSSProperties}
          >
            {calendarData.day}
          </h1>

          {/* 5. Minimal & New Below-Date Styles: Festivals as subtext under the day */}
          {(calendarData.festivals || calendarData.solarTerm) && (
            <>
              {(theme === 'zen' || theme === 'minimal' || theme === 'journal') && (
                <div className="absolute bottom-6 right-0 left-0 text-center animate-in fade-in duration-700 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold tracking-[6px] uppercase opacity-40 border-t border-current/20 pt-1">
                    {[calendarData.festivals.split(' ')[0], calendarData.solarTerm].filter(Boolean).join(' · ')}
                  </span>
                </div>
              )}

              {(theme === 'bold' || theme === 'dark' || theme === 'warm') && (
                <div className="absolute bottom-2 md:bottom-4 right-0 left-0 text-center animate-in slide-in-from-top-2 duration-500 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3">
                    {calendarData.festivals && (
                      <span className={`text-[10px] font-black tracking-[4px] uppercase ${theme === 'bold' ? 'bg-[var(--color-primary)] text-[var(--color-bg)] px-3 py-0.5' : 'opacity-60'}`}>
                        {calendarData.festivals.split(' ')[0]}
                      </span>
                    )}
                    {calendarData.solarTerm && (
                      <span className="text-[9px] font-bold tracking-[2px] uppercase opacity-40 border-l border-current/30 pl-3">
                        {calendarData.solarTerm}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="absolute right-0 top-1/2 -translate-y-1/2 sidebar sidebar-right" id="side-right">
            {calendarData.lunarGanzhi}
          </div>
        </section>

        <section className="bottom-section" id="bottom-quote">
          <div 
            className={`quote-text mb-5 ${theme === 'classic' ? 'text-center max-w-[360px] mx-auto' : ''}`} 
            id="quote-text"
            style={{ fontFamily: currentQuoteFontValue, fontSize: quoteFontSize ? `${quoteFontSize}px` : undefined }}
          >
            {calendarData.quote.text}
          </div>
          <div className={`quote-meta text-xs text-[var(--color-muted)] italic ${theme === 'classic' ? 'text-center' : 'text-right'}`} id="quote-meta">
            —— {calendarData.quote.author} {calendarData.quote.book ? `《${calendarData.quote.book}》` : ''}
          </div>
        </section>

        <footer className="mt-auto pt-3 md:pt-5 flex justify-between items-end border-t border-current/40" id="footer-main">
          <div className="text-xs font-black tracking-[3px] uppercase" id="brand">
            {footerText}
          </div>
          <div className="text-right flex flex-col items-end gap-0.5" id="footer-day-year">
            <div className="text-xs font-bold">{calendarData.weekday}</div>
            <div className="text-[11px] text-[var(--color-muted)]">{calendarData.year}年</div>
          </div>
        </footer>

        <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        {cardTexture === 'grain' && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        )}
        {cardTexture === 'linen' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute -inset-[50px] opacity-[0.04]" style={{ 
              background: `
                repeating-radial-gradient(#000 0 0.0001%,#fff 0 0.0002%) 60% 60%/3000px 3000px,
                repeating-conic-gradient(#000 0 0.0001%,#fff 0 0.0002%) 40% 40%/4000px 3000px
              `,
              backgroundBlendMode: 'difference',
              filter: 'blur(1px) contrast(120) brightness(110)',
            }} />
          </div>
        )}
        {cardTexture === 'recycled' && (
          <>
            <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-100" style={{ 
              backgroundImage: `
                radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                repeating-linear-gradient(
                  0deg,
                  rgba(0,0,0,0.03),
                  rgba(0,0,0,0.03) 1px,
                  transparent 1px,
                  transparent 3px
                )
              `,
              backgroundSize: '3px 3px, 5px 5px, auto'
            }} />
            <div className="absolute inset-0 pointer-events-none opacity-100" style={{ 
              background: 'radial-gradient(ellipse at center, transparent 70%, rgba(200,180,120,0.15))' 
            }} />
          </>
        )}
      </motion.main>

      {/* Global Download Progress Overlay (Circular Design) */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              backgroundColor: ["rgba(0,0,0,0.9)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)"],
              backdropFilter: ["blur(20px)", "blur(12px)", "blur(4px)"]
            }}
            exit={{ opacity: 0 }}
            transition={{
              backgroundColor: { duration: 12, times: [0, 0.1, 1], ease: "linear" },
              backdropFilter: { duration: 12, times: [0, 0.1, 1], ease: "linear" },
              opacity: { duration: 0.3 }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden download-overlay"
          >
            <div className="relative flex items-center justify-center">
              {/* Circular Progress Path (Background) */}
              <svg className="absolute w-[260px] h-[260px] rotate-[-90deg]">
                <circle
                  cx="130"
                  cy="130"
                  r="128"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                {/* Animated Progress Path */}
                <motion.circle
                  cx="130"
                  cy="130"
                  r="128"
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 0.75, 0.99] }}
                  transition={{ 
                    duration: 12, 
                    times: [0, 0.2, 1],
                    ease: "linear" 
                  }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${primaryColor})`
                  }}
                />
              </svg>

              {/* Main Circular Window */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-[240px] h-[240px] bg-white/10 backdrop-blur-2xl rounded-full shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-4 border border-white/20 relative overflow-hidden"
              >
                {/* Inner decorative light */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(to top right, ${primaryColor}20, transparent)` 
                  }}
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ 
                      backgroundColor: primaryColor,
                      boxShadow: `0 10px 15px -3px ${primaryColor}40`
                    }}
                  >
                    <Download size={20} className="text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-bold text-white tracking-widest uppercase">正在高清渲染</h3>
                    <p className="text-[10px] text-white/60 leading-relaxed font-medium">
                      正在合成视网膜级画面<br/>请保持页面开启
                    </p>
                  </div>

                  {/* Pulse active indicator */}
                  <div className="flex gap-1.5 items-center justify-center pt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Preference Switcher */}
      <motion.div 
        className="fixed right-0 top-1/2 -translate-y-1/2 flex items-center z-50 group"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <motion.div 
          ref={actionButtonsRef}
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
            onClick={() => handleAdjustDate(-1)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all ${btnBaseClass}`}
            title="前一天"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdjustDate(1)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all ${btnBaseClass}`}
            title="后一天"
          >
            <ChevronRight size={20} />
          </motion.button>

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

          {/* Random Style Combination Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ rotate: 180, scale: 0.95 }}
            onClick={handleRandomStyle}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all ${btnBaseClass}`}
            title="生成随机样式组合"
          >
            <RefreshCw size={20} />
          </motion.button>

          <div className="relative" ref={triggerRef}>
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all ${mainBtnClass}`}
            >
              {isSwitcherOpen ? <X size={20} /> : <Palette size={20} />}
            </button>

            <AnimatePresence>
              {isSwitcherOpen && (
                <motion.div 
                  ref={panelRef}
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className={`fixed right-20 top-1/2 -translate-y-1/2 backdrop-blur-md p-2 rounded-3xl border shadow-xl flex flex-col gap-2 min-w-[220px] transition-colors duration-500 ${menuClass}`}
                >
                  {/* Tabs */}
                  <div className={`grid grid-cols-4 rounded-2xl p-1 mb-1 gap-0.5 ${isDarkBg ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <button 
                      onClick={() => setActiveTab('theme')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'theme' ? tabActiveClass : 'opacity-40'}`}
                    >
                      风格
                    </button>
                    <button 
                      onClick={() => setActiveTab('scheme')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'scheme' ? tabActiveClass : 'opacity-40'}`}
                    >
                      配色
                    </button>
                    <button 
                      onClick={() => setActiveTab('background')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'background' ? tabActiveClass : 'opacity-40'}`}
                    >
                      背景
                    </button>
                    <button 
                      onClick={() => setActiveTab('card')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'card' ? tabActiveClass : 'opacity-40'}`}
                    >
                      卡片
                    </button>
                    <button 
                      onClick={() => setActiveTab('border')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'border' ? tabActiveClass : 'opacity-40'}`}
                    >
                      边框
                    </button>
                    <button 
                      onClick={() => setActiveTab('font')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'font' ? tabActiveClass : 'opacity-40'}`}
                    >
                      日期
                    </button>
                    <button 
                      onClick={() => setActiveTab('quote')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'quote' ? tabActiveClass : 'opacity-40'}`}
                    >
                      金句
                    </button>
                    <button 
                      onClick={() => setActiveTab('setting')}
                      className={`text-[11px] py-1.5 rounded-xl transition-all ${activeTab === 'setting' ? tabActiveClass : 'opacity-40'}`}
                    >
                      设置
                    </button>
                  </div>

                                    {/* Theme List */}
                  {activeTab === 'theme' && (
                    <div className="flex flex-col gap-5 pr-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 pt-2 pb-4">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className={`flex flex-col items-start gap-1 p-3.5 rounded-2xl text-xs transition-all border ${
                              theme === t.id 
                                ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/20' 
                                : 'bg-black/5 border-transparent hover:bg-black/10'
                            }`}
                          >
                            <span className="text-sm truncate w-full text-left font-medium">{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scheme List */}
                  {activeTab === 'scheme' && (
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 pb-4">
                      <div className="grid grid-cols-4 gap-3 gap-y-5 px-1 pt-3">
                        {colorSchemes.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleSchemeChange(s.id)}
                            className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center mx-auto ${
                              scheme === s.id ? 'ring-2 ring-rose-600 border-rose-600' : 'hover:scale-110 border-black/5 opacity-80 hover:opacity-100'
                            } ${s.bg}`}
                            title={s.name}
                          />
                        ))}
                        <label
                          className={`w-7 h-7 rounded-full bg-white border transition-all flex items-center justify-center mx-auto cursor-pointer shadow-sm ${
                            scheme === 'custom' ? 'ring-2 ring-rose-600 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-125'
                          }`}
                          title="自定义颜色"
                        >
                          <input 
                            type="color" 
                            value={customPrimaryColor || '#3B82F6'} 
                            onChange={(e) => handleCustomPrimaryChange(e.target.value)}
                            className="sr-only"
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ 
                              backgroundColor: customPrimaryColor || '#3B82F6',
                              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                            }} 
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Background List */}
                  {activeTab === 'background' && (
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 pb-4">
                      <div className="grid grid-cols-4 gap-3 gap-y-5 px-1 pt-3">
                        {backgrounds.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => handleBgChange(b.id)}
                            className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center mx-auto ${
                              bgId === b.id ? 'ring-2 ring-rose-600 border-rose-600' : 'hover:scale-110 border-black/5 opacity-80 hover:opacity-100'
                            } ${b.preview}`}
                            title={b.name}
                            style={{ backgroundColor: b.color }}
                          />
                        ))}
                        <label
                          className={`w-7 h-7 rounded-full bg-white border transition-all flex items-center justify-center mx-auto cursor-pointer shadow-sm ${
                            bgId === 'custom-color' ? 'ring-2 ring-rose-600 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-125'
                          }`}
                          title="自定义配色"
                        >
                          <input 
                            type="color" 
                            value={customAppBgColor || '#F5F5F5'} 
                            onChange={(e) => handleCustomAppBgChange(e.target.value)}
                            className="sr-only"
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ 
                              backgroundColor: customAppBgColor || '#F5F5F5',
                              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                            }} 
                          />
                        </label>
                      </div>
                    </div>
                  )}
{/* Card Background Tab */}
                   {activeTab === 'card' && (
                     <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1 pb-4">
                       {/* 纸张纹理选择 */}
                       <div className="px-1 pt-3">
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                           <Layers className="w-3 h-3" />
                           纸张纹理
                         </div>
                         <div className="grid grid-cols-4 gap-2">
                           {[
                             { id: 'none', label: '无', class: 'bg-white' },
                             { id: 'grain', label: '细砂', class: 'bg-gray-100' },
                             { id: 'linen', label: '亚麻', class: 'bg-gray-200' },
                             { id: 'recycled', label: '再生', class: 'bg-[#F4F1EA]' }
                           ].map(t => (
                             <button
                               key={t.id}
                               onClick={() => setCardTexture(t.id)}
                               className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                                 cardTexture === t.id 
                                   ? 'bg-rose-600 border-rose-600 text-white' 
                                   : 'bg-black/5 border-transparent hover:bg-black/10'
                               }`}
                             >
                               <div className={`w-full h-5 rounded-lg shadow-inner ${t.class} relative overflow-hidden`}>
                                 {t.id === 'grain' && <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />}
                                 {t.id === 'linen' && (
                                   <div className="absolute inset-0 opacity-[0.07] overflow-hidden">
                                     <div className="absolute -inset-[20px]" style={{ 
                                       background: `
                                         repeating-radial-gradient(#000 0 0.0001%,#fff 0 0.0002%) 60% 60%/1000px 1000px,
                                         repeating-conic-gradient(#000 0 0.0001%,#fff 0 0.0002%) 40% 40%/1000px 1000px
                                       `,
                                       backgroundBlendMode: 'difference',
                                       filter: 'blur(0.5px) contrast(100) brightness(110)',
                                       mixBlendMode: 'lighten'
                                     }} />
                                   </div>
                                 )}
                                 {t.id === 'recycled' && (
                                   <div className="absolute inset-0 opacity-40">
                                     <div className="absolute inset-0" style={{ 
                                       backgroundImage: `radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)`,
                                       backgroundSize: '2px 2px, 3px 3px'
                                     }} />
                                     <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(200,180,120,0.4))' }} />
                                   </div>
                                 )}
                               </div>
                               <span className="text-[9px] font-bold uppercase tracking-tight">{t.label}</span>
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="px-1 mt-2">
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-wider mb-2">背景色</div>
                         <div className="grid grid-cols-4 gap-3 gap-y-5 px-1 pt-3">
                           {cardBgs.map((bg) => (
                             <button
                               key={bg.id}
                               onClick={() => handleCardBgChange(bg.color)}
                               className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center mx-auto ${
                                 cardBg === bg.color && !isCustomCardBg ? 'ring-2 ring-rose-600 border-rose-600' : 'hover:scale-110 border-black/5 opacity-80 hover:opacity-100'
                               }`}
                               style={{ backgroundColor: bg.color }}
                               title={bg.label}
                             />
                           ))}
                           <label
                             className={`w-7 h-7 rounded-full bg-white border transition-all flex items-center justify-center mx-auto cursor-pointer shadow-sm ${
                               isCustomCardBg ? 'ring-2 ring-rose-600 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-125'
                             }`}
                             title="自定义卡片背景"
                           >
                             <input 
                               type="color" 
                               value={customCardBgColor || '#FFFFFF'} 
                               onChange={(e) => handleCustomCardBgChange(e.target.value)}
                               className="sr-only"
                             />
                             <div 
                               className="w-4 h-4 rounded-full" 
                               style={{ 
                                 backgroundColor: customCardBgColor || '#FFFFFF',
                                 boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                               }} 
                             />
                           </label>
                         </div>
                       </div>
                        
                        {/* 卡片效果 */}
                        <div className="px-1 mt-4 pt-4 border-t border-black/5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">卡片阴影</span>
                            <button 
                              onClick={() => handleShadowChange(!hasShadow)}
                              className={`w-8 h-4 rounded-full transition-colors relative ${hasShadow ? "bg-rose-600" : "bg-gray-400"}`}
                            >
                              <motion.div 
                                animate={{ x: hasShadow ? 18 : 2 }}
                                className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                              />
                            </button>
                          </div>
                        </div>
                     </div>
                   )}

                   {/* Border Tab */}
                   {activeTab === 'border' && (
                     <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1 pb-4">
                        <div className="grid grid-cols-4 gap-3 gap-y-5 px-1 pt-3">
                          {['#E5E7EB', '#D1D5DB', '#9CA3AF', '#4B5563', '#1F2937', '#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(c => (
                            <button
                              key={c}
                              onClick={() => handleBorderColorChange(c)}
                              className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center mx-auto ${
                                borderColor === c && !isCustomBorder ? 'ring-2 ring-rose-600 border-rose-600' : 'hover:scale-110 border-black/5 opacity-80 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                          <label
                            className={`w-7 h-7 rounded-full bg-white border transition-all flex items-center justify-center mx-auto cursor-pointer shadow-sm ${
                              isCustomBorder ? 'ring-2 ring-rose-600 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-125'
                            }`}
                            title="自定义边框颜色"
                          >
                            <input 
                              type="color" 
                              value={customBorderColor || '#000000'} 
                              onChange={(e) => handleBorderColorChange(e.target.value, true)}
                              className="sr-only"
                            />
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ 
                                backgroundColor: customBorderColor || '#000000',
                                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                              }} 
                            />
                          </label>
                        </div>

                        <div className="space-y-4 pt-4 px-1">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">圆角半径 ({borderRadius !== undefined ? `${borderRadius}px` : '主题默认'})</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="60" 
                                value={borderRadius !== undefined ? borderRadius : 4} 
                                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-rose-600"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">边框粗细 ({borderWidth !== undefined ? `${borderWidth}px` : '主题默认'})</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="10" 
                                value={borderWidth !== undefined ? borderWidth : 1} 
                                onChange={(e) => handleBorderWidthChange(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-rose-600"
                              />
                            </div>
                          </div>
                     </div>
                   )}

                  {/* Font List */}
                  {activeTab === 'font' && (
                    <div className="flex flex-col gap-5 pr-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Typography Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Type className="w-3.5 h-3.5 opacity-50" />
                          <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">字体选择</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                          {fonts.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => handleFontChange(f.id)}
                              className={`flex flex-col items-start gap-1 py-2 px-3 rounded-2xl text-xs transition-all border ${
                                dateFont === f.id 
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/20' 
                                  : 'bg-black/5 border-transparent hover:bg-black/10'
                              }`}
                            >
                              <span className="text-sm truncate w-full text-left" style={{ fontFamily: f.value }}>{f.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Baseline className="w-3.5 h-3.5 opacity-50" />
                          <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">排版尺寸</span>
                        </div>
                        <div className="bg-black/5 rounded-2xl p-3 space-y-3">
                          <div className="flex gap-1.5">
                            {[120, 160, 200, 280, 360].map((size) => (
                              <button
                                key={size}
                                onClick={() => handleDayFontSizeChange(size)}
                                className={`flex-1 h-9 rounded-xl text-[10px] font-bold transition-all ${
                                  dayFontSize === size || (!dayFontSize && size === 200)
                                    ? 'bg-white text-rose-700 shadow-sm'
                                    : 'text-black/40 hover:text-black/80'
                                }`}
                              >
                                {size === 200 ? '默认' : size}
                              </button>
                            ))}
                          </div>
                          <input 
                            type="range" 
                            min="80" 
                            max="500" 
                            step="10"
                            value={dayFontSize || 200} 
                            onChange={(e) => handleDayFontSizeChange(parseInt(e.target.value))}
                            className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-rose-600"
                          />
                        </div>
                      </div>

                      {/* Style Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Layers className="w-3.5 h-3.5 opacity-50" />
                          <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">展现样式</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'standard', name: '默认' },
                            { id: 'shadow', name: '投影' },
                            { id: 'glow', name: '流光' },
                            { id: 'hollow', name: '描边' }
                          ].map((s) => (
                            <button
                              key={s.id}
                              onClick={() => handleDayStyleChange(s.id)}
                              className={`flex items-center justify-center h-12 rounded-2xl transition-all border font-medium ${
                                dayStyle === s.id
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                                  : 'bg-black/5 border-transparent hover:bg-black/10'
                              }`}
                            >
                              <span className="text-[11px]">{s.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quote Font List */}
                  {activeTab === 'quote' && (
                    <div className="flex flex-col gap-3 pr-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Random Quote Button */}
                      <button 
                        onClick={handleRandomQuote}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                          isDarkBg 
                            ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' 
                            : 'bg-rose-50 border-rose-100 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RefreshCw className={`w-3 h-3 ${isDarkBg ? 'text-rose-400' : 'text-rose-600'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkBg ? 'text-rose-300' : 'text-rose-600'}`}>随机切换金句</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-rose-500/10 text-[9px] font-bold text-rose-500">
                          RANDOM
                        </div>
                      </button>

                      {/* Sync Switch */}
                      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${isDarkBg ? 'bg-white/5 border-white/5' : 'bg-black/5 border-transparent'}`}>
                        <div className="flex items-center gap-2">
                          <RefreshCw className={`w-3 h-3 ${isFontSync ? 'text-green-500' : 'opacity-40'}`} />
                          <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">全局字体同步</span>
                        </div>
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

                      {/* Font Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <Type className="w-3.5 h-3.5 opacity-50" />
                          <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">金句字体</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                          {quoteFonts.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => handleQuoteFontChange(f.id)}
                              className={`flex flex-col items-start gap-0.5 py-1.5 px-3 rounded-xl text-xs transition-all border ${
                                quoteFont === f.id 
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/20' 
                                  : 'bg-black/5 border-transparent hover:bg-black/10'
                              }`}
                            >
                              <span className="text-xs truncate w-full text-left" style={{ fontFamily: f.value }}>{f.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 px-1">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 px-1">
                            <Baseline className="w-3.5 h-3.5 opacity-50" />
                            <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">字号调节</span>
                          </div>
                          
                          <div className="bg-black/5 rounded-2xl p-2 space-y-2">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">金句字号</span>
                                <span className="text-[10px] font-bold text-rose-600">{quoteFontSize || 18}px</span>
                              </div>
                              <div className="flex gap-1.5">
                                {[14, 18, 24, 32, 40].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleQuoteFontSizeChange(size)}
                                    className={`flex-1 h-6 rounded-lg text-[10px] font-bold transition-all ${
                                      quoteFontSize === size || (!quoteFontSize && size === 18)
                                        ? 'bg-white text-rose-700 shadow-sm'
                                        : 'text-black/40 hover:text-black/80'
                                    }`}
                                  >
                                    {size === 18 ? '默认' : size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">今日宜字号</span>
                                <span className="text-[10px] font-bold text-rose-600">{adviceFontSize || 14}px</span>
                              </div>
                              <div className="flex gap-1.5">
                                {[10, 14, 18, 22, 26].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleAdviceFontSizeChange(size)}
                                    className={`flex-1 h-6 rounded-lg text-[10px] font-bold transition-all ${
                                      adviceFontSize === size || (!adviceFontSize && size === 14)
                                        ? 'bg-white text-rose-700 shadow-sm'
                                        : 'text-black/40 hover:text-black/80'
                                    }`}
                                  >
                                    {size === 14 ? '默认' : size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'setting' && (
                    <div className="flex flex-col gap-4 p-3 pr-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">系统设置</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-1.5 px-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">自定义金句</span>
                            <span className="text-[9px] opacity-30 italic">{customQuoteText.length}/300</span>
                          </div>
                          <div className={`relative rounded-xl border transition-all flex flex-col overflow-hidden ${isDarkBg ? 'bg-white/5 border-white/10 focus-within:border-white/30' : 'bg-black/5 border-transparent focus-within:border-black/20'}`}>
                            <textarea 
                              value={customQuoteText}
                              onChange={(e) => handleCustomQuoteChange(e.target.value)}
                              placeholder="输入你想展示的金句内容..."
                              rows={3}
                              className="w-full bg-transparent px-3 py-2 text-[11px] leading-relaxed resize-none focus:outline-none"
                            />
                            {customQuoteText && (
                              <button 
                                onClick={() => handleCustomQuoteChange('')}
                                className="absolute right-1 top-1 p-1.5 opacity-40 hover:opacity-100 transition-all"
                                title="清除内容"
                              >
                                <RotateCcw size={10} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 px-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">金句署名/来源</span>
                            <span className="text-[9px] opacity-30 italic">{customQuoteSource.length}/50</span>
                          </div>
                          <div className={`relative rounded-xl border transition-all flex items-center overflow-hidden ${isDarkBg ? 'bg-white/5 border-white/10 focus-within:border-white/30' : 'bg-black/5 border-transparent focus-within:border-black/20'}`}>
                            <input 
                              type="text"
                              value={customQuoteSource}
                              onChange={(e) => handleCustomSourceChange(e.target.value)}
                              placeholder="署名或书名..."
                              className="w-full bg-transparent px-3 py-2 text-xs font-medium focus:outline-none"
                            />
                            {customQuoteSource && (
                              <button 
                                onClick={() => handleCustomSourceChange('')}
                                className="px-2 py-2 opacity-40 hover:opacity-100 transition-all"
                                title="清除署名"
                              >
                                <RotateCcw size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 px-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">底部文字</span>
                            <span className="text-[9px] opacity-30 italic">限制20中/40英</span>
                          </div>
                          <div className={`relative rounded-xl border transition-all flex items-center overflow-hidden ${isDarkBg ? 'bg-white/5 border-white/10 focus-within:border-white/30' : 'bg-black/5 border-transparent focus-within:border-black/20'}`}>
                            <input 
                              type="text"
                              value={footerText}
                              onChange={(e) => handleFooterTextChange(e.target.value)}
                              placeholder="输入底部显示的文字..."
                              className="w-full bg-transparent px-3 py-2 text-xs font-medium focus:outline-none"
                            />
                            {footerText !== 'Your Day' && (
                              <button 
                                onClick={() => handleFooterTextChange('Your Day')}
                                className="px-2 py-2 opacity-40 hover:opacity-100 transition-all"
                                title="恢复默认"
                              >
                                <RotateCcw size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-[9px] opacity-40 italic mt-1 px-1">
                        更多自定义功能开发中...
                      </div>
                      
                      <button
                        onClick={handleResetDefaults}
                        className={`w-full mt-1 py-2 px-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-[10px] font-bold ${
                          resetSuccess 
                            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' 
                            : 'border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <RotateCcw size={12} className={resetSuccess ? 'animate-spin' : ''} />
                        {resetSuccess ? '已完成重置' : '恢复全站默认设置'}
                      </button>
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
