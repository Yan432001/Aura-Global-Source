import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const DEFAULT_THEME_SETTINGS = {
  fontSize: 14,
  fontFamily: '"Aptos", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  borderRadius: 12,
  lineHeight: 1.5,
  controlHeight: 36,
  padding: 16,
  margin: 16,
  buttonBg: '#eef4ff',
  headerBg: '#ffffff',
  sidebarBg: '#ffffff',
  cardBg: '#ffffff',
  hoverBg: '#f8fafc',
  density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
  elevation: 'medium', // 'flat' | 'subtle' | 'medium' | 'glow'
  glassmorphism: true,
  contrast: 'standard', // 'subtle' | 'standard' | 'high'
  transparentSystem: {
    enabled: true, // Master switch for transparent background system
    preset: 'frosted', // 'crystal' | 'frosted' | 'acrylic' | 'subtle' | 'custom'
    surfaceOpacity: 80, // 20% to 100%
    blurRadius: 20, // 0px to 40px
    saturation: 140, // 100% to 200%
    wallpaper: 'aurora', // 'aurora' | 'cyber' | 'sunset' | 'emerald' | 'cosmic' | 'minimal'
    customWallpaperUrl: '',
    transparentSidebar: true,
    transparentHeader: true,
    transparentCards: true,
    glassBorderGlow: true,
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('admin-theme') || 'light';
  });

  const [themePreset, setThemePreset] = useState(() => {
    return localStorage.getItem('admin-theme-preset') || 'default';
  });

  const [customSettings, setCustomSettings] = useState(() => {
    const saved = localStorage.getItem('admin-custom-theme-settings');
    if (!saved) return DEFAULT_THEME_SETTINGS;
    try {
      return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_THEME_SETTINGS;
    }
  });

  // Calculate density offsets
  const densityMetrics = useMemo(() => {
    switch (customSettings.density) {
      case 'compact':
        return { controlHeight: 30, fontSize: 13, padding: 12, borderRadius: Math.min(customSettings.borderRadius, 8) };
      case 'spacious':
        return { controlHeight: 42, fontSize: 15, padding: 20, borderRadius: Math.max(customSettings.borderRadius, 14) };
      case 'comfortable':
      default:
        return {
          controlHeight: customSettings.controlHeight || 36,
          fontSize: customSettings.fontSize || 14,
          padding: customSettings.padding || 16,
          borderRadius: customSettings.borderRadius || 12,
        };
    }
  }, [customSettings]);

  // Modern Concept Themes matching Aura concept website
  const themeConfigs = useMemo(() => {
    const isDark = themeMode === 'dark';

    const buildTokens = (primary, success, warning, error, info, accentLight, accentDark) => {
      const bgBase = isDark ? '#0b0f19' : '#ffffff';
      const bgContainer = isDark ? '#161f30' : (customSettings.cardBg || '#ffffff');
      const textBase = isDark ? '#f8fafc' : '#0f172a';
      const border = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.85)';
      const bodyBg = isDark ? '#080c14' : '#f8fafc';
      const siderBg = isDark ? '#0f172a' : (customSettings.sidebarBg || '#ffffff');
      const headerBg = isDark ? '#0f172a' : (customSettings.headerBg || '#ffffff');
      const buttonBg = isDark ? 'rgba(255, 255, 255, 0.08)' : (customSettings.buttonBg || '#eef4ff');

      return {
        token: {
          colorPrimary: primary,
          colorSuccess: success,
          colorWarning: warning,
          colorError: error,
          colorInfo: info,
          colorBgBase: bgBase,
          colorTextBase: textBase,
          colorBgContainer: bgContainer,
          colorBorder: border,
          colorBgElevated: isDark ? '#1e293b' : '#ffffff',
          borderRadius: densityMetrics.borderRadius,
          fontSize: densityMetrics.fontSize,
          fontFamily: customSettings.fontFamily,
          lineHeight: customSettings.lineHeight,
          controlHeight: densityMetrics.controlHeight,
          padding: densityMetrics.padding,
          margin: customSettings.margin,
        },
        components: {
          Layout: {
            headerBg,
            bodyBg,
            siderBg,
          },
          Button: {
            defaultBg: buttonBg,
            defaultBorderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(226,232,240,0.9)',
            defaultColor: isDark ? '#f8fafc' : '#0f172a',
            colorPrimary: primary,
            borderRadius: densityMetrics.borderRadius,
            controlHeight: densityMetrics.controlHeight,
          },
          Card: {
            colorBgContainer: bgContainer,
            colorBorderSecondary: border,
            borderRadiusLG: Math.min(densityMetrics.borderRadius + 4, 20),
          },
          Table: {
            colorBgContainer: bgContainer,
            headerBg: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            headerColor: isDark ? '#94a3b8' : '#475569',
            rowHoverBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(47,111,237,0.03)',
            borderColor: border,
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: isDark ? 'rgba(47, 111, 237, 0.2)' : 'rgba(47, 111, 237, 0.08)',
            itemSelectedColor: primary,
            itemHoverBg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(47, 111, 237, 0.04)',
            itemBorderRadius: densityMetrics.borderRadius - 2,
          },
        },
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      };
    };

    return {
      // 1. Default: Aura Concept Blue (Signature Website Concept)
      default: {
        name: 'Aura Concept Blue',
        subtitle: 'Signature electric royal blue with clean slate surfaces',
        tag: 'Official Concept',
        ...buildTokens('#2f6fed', '#10b981', '#f59e0b', '#ef4444', '#2f6fed', '#eef4ff', '#142038'),
      },

      // 2. Emerald Fintech
      emeraldFintech: {
        name: 'Emerald Fintech',
        subtitle: 'Modern banking emerald with teal and gold accents',
        tag: 'Fintech Luxury',
        ...buildTokens('#059669', '#10b981', '#d97706', '#e11d48', '#0284c7', '#ecfdf5', '#06281e'),
      },

      // 3. Violet Prestige
      violetPrestige: {
        name: 'Violet Prestige',
        subtitle: 'Creative Web3 deep violet with high-contrast cyan',
        tag: 'Modern Creative',
        ...buildTokens('#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f5f3ff', '#1f1638'),
      },

      // 4. Amber Elegance
      amberElegance: {
        name: 'Amber Elegance',
        subtitle: 'Warm rich amber gold with espresso slate accents',
        tag: 'Hospitality & POS',
        ...buildTokens('#d97706', '#16a34a', '#f59e0b', '#dc2626', '#ea580c', '#fffbeb', '#2e1c08'),
      },

      // 5. Rose Sunset
      roseSunset: {
        name: 'Rose & Sunset',
        subtitle: 'Vibrant crimson rose with warm sunset coral accents',
        tag: 'Retail & Fashion',
        ...buildTokens('#e11d48', '#10b981', '#f59e0b', '#be123c', '#f43f5e', '#fff1f2', '#301018'),
      },

      // 6. Slate Executive
      slateExecutive: {
        name: 'Slate Executive',
        subtitle: 'Enterprise indigo with crisp cool steel borders',
        tag: 'Corporate Enterprise',
        ...buildTokens('#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#eef2ff', '#151733'),
      },

      // 7. Cyber Cyan
      cyberCyan: {
        name: 'Cyber Cyan',
        subtitle: 'Ultra-modern electric cyan with high-energy accents',
        tag: 'Tech & Logistics',
        ...buildTokens('#0891b2', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ecfeff', '#082530'),
      },

      // 8. Deep Obsidian Dark
      darkModern: {
        name: 'Obsidian Midnight',
        subtitle: 'Deep OLED black with luminescent cobalt glow',
        tag: 'Dark Room Pro',
        ...buildTokens('#3b82f6', '#10b981', '#fbbf24', '#f87171', '#60a5fa', '#1e293b', '#0b1120'),
      },
    };
  }, [themeMode, customSettings, densityMetrics]);

  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('admin-theme', newMode);
  };

  const setThemeModeExplicit = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('admin-theme', mode);
  };

  const changePreset = (preset) => {
    if (!themeConfigs[preset]) return;
    setThemePreset(preset);
    localStorage.setItem('admin-theme-preset', preset);
  };

  const updateCustomTheme = (settings) => {
    const merged = { ...customSettings, ...settings };
    setCustomSettings(merged);
    localStorage.setItem('admin-custom-theme-settings', JSON.stringify(merged));
  };

  const resetToDefaultTheme = () => {
    setThemeMode('light');
    setThemePreset('default');
    setCustomSettings(DEFAULT_THEME_SETTINGS);
    localStorage.removeItem('admin-theme');
    localStorage.removeItem('admin-theme-preset');
    localStorage.removeItem('admin-custom-theme-settings');
  };

  // Apply custom CSS variables for global styles
  useEffect(() => {
    const isDark = themeMode === 'dark';
    const activeCfg = themeConfigs[themePreset] || themeConfigs.default;
    const primary = activeCfg?.token?.colorPrimary || '#2f6fed';

    const styleId = 'aura-admin-theme-vars';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      :root {
        --admin-primary: ${primary};
        --admin-font-family: ${customSettings.fontFamily};
        --admin-font-size: ${densityMetrics.fontSize}px;
        --admin-border-radius: ${densityMetrics.borderRadius}px;
        --admin-line-height: ${customSettings.lineHeight};
        --admin-control-height: ${densityMetrics.controlHeight}px;
        --admin-padding: ${densityMetrics.padding}px;
        --admin-margin: ${customSettings.margin}px;
        --admin-button-bg: ${customSettings.buttonBg};
        --admin-header-bg: ${customSettings.headerBg};
        --admin-sidebar-bg: ${customSettings.sidebarBg};
        --admin-card-bg: ${customSettings.cardBg || (isDark ? '#161f30' : '#ffffff')};
        --admin-hover-bg: ${customSettings.hoverBg || (isDark ? '#1e293b' : '#f8fafc')};
      }
      
      body {
        font-family: ${customSettings.fontFamily} !important;
      }
      
      .ant-btn-primary {
        box-shadow: 0 4px 14px -2px ${primary}55 !important;
        font-weight: 600 !important;
      }
      
      .ant-card {
        border-radius: ${densityMetrics.borderRadius + 4}px !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
    `;
  }, [themeMode, themePreset, customSettings, densityMetrics, themeConfigs]);

  // Update body classes for theme
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${themeMode}`);
    body.setAttribute('data-theme', themePreset);
    body.setAttribute('data-mode', themeMode);
  }, [themeMode, themePreset]);

  const currentTheme = themeConfigs[themePreset] || themeConfigs.default;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode: setThemeModeExplicit,
        themePreset,
        toggleThemeMode,
        changePreset,
        themeConfigs,
        customSettings,
        updateCustomTheme,
        resetToDefaultTheme,
        currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
