import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('admin-theme') || 'light';
  });
  
  const [themePreset, setThemePreset] = useState(() => {
    return localStorage.getItem('admin-theme-preset') || 'default';
  });
  
  const [customSettings, setCustomSettings] = useState(() => {
    const saved = localStorage.getItem('admin-custom-theme-settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 14,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont',
      borderRadius: 6,
      lineHeight: 1.5715,
      controlHeight: 32,
      padding: 16,
      margin: 16,
      buttonBg: '#f0f2f5',
      headerBg: '#ffffff',
      sidebarBg: '#001529',
      cardBg: '#ffffff',
      hoverBg: '#f5f5f5',
    };
  });

  // New Modern Themes with better color schemes
  const themeConfigs = useMemo(() => ({
    // Default Theme
    default: {
      name: 'Aura Blue',
      token: {
        colorPrimary: '#2f6fed',
        colorSuccess: '#22c55e',
        colorWarning: '#f0b429',
        colorError: '#f5484d',
        colorInfo: '#2f6fed',
        colorBgBase: themeMode === 'dark' ? '#141414' : '#ffffff',
        colorTextBase: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#000000',
        colorBgContainer: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBorder: themeMode === 'dark' ? '#424242' : '#d9d9d9',
        colorBgElevated: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
        borderRadius: customSettings.borderRadius,
        fontSize: customSettings.fontSize,
        fontFamily: customSettings.fontFamily,
        lineHeight: customSettings.lineHeight,
        controlHeight: customSettings.controlHeight,
        padding: customSettings.padding,
        margin: customSettings.margin,
      },
      components: {
        Layout: {
          headerBg: customSettings.headerBg,
          bodyBg: themeMode === 'dark' ? '#141414' : '#f0f2f5',
          siderBg: customSettings.sidebarBg,
        },
        Button: {
          defaultBg: customSettings.buttonBg,
          defaultBorderColor: themeMode === 'dark' ? '#424242' : '#d9d9d9',
          defaultColor: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#000000',
        },
        Card: {
          colorBgContainer: customSettings.cardBg || (themeMode === 'dark' ? '#1f1f1f' : '#ffffff'),
        },
      },
      algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    },
    
    // Modern Blue Theme
    modernBlue: {
      name: 'Modern Blue',
      token: {
        colorPrimary: '#1677ff',
        colorSuccess: '#00b96b',
        colorWarning: '#d48806',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',
        colorBgBase: themeMode === 'dark' ? '#0a0a0a' : '#ffffff',
        colorTextBase: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#1d2129',
        colorBgContainer: themeMode === 'dark' ? '#141414' : '#ffffff',
        colorBorder: themeMode === 'dark' ? '#303030' : '#e4e6eb',
        colorBgElevated: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
        borderRadius: customSettings.borderRadius,
        fontSize: customSettings.fontSize,
        fontFamily: customSettings.fontFamily,
        lineHeight: customSettings.lineHeight,
        controlHeight: customSettings.controlHeight,
        padding: customSettings.padding,
        margin: customSettings.margin,
      },
      components: {
        Layout: {
          headerBg: customSettings.headerBg,
          bodyBg: themeMode === 'dark' ? '#0a0a0a' : '#f7f8fa',
          siderBg: customSettings.sidebarBg,
        },
        Button: {
          defaultBg: customSettings.buttonBg,
          defaultBorderColor: themeMode === 'dark' ? '#303030' : '#e4e6eb',
          defaultColor: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#1d2129',
        },
        Card: {
          colorBgContainer: customSettings.cardBg || (themeMode === 'dark' ? '#141414' : '#ffffff'),
        },
      },
      algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    },
    
    // Purple Theme
    purple: {
      name: 'Purple',
      token: {
        colorPrimary: '#722ed1',
        colorSuccess: '#13c2c2',
        colorWarning: '#fa8c16',
        colorError: '#f5222d',
        colorInfo: '#722ed1',
        colorBgBase: themeMode === 'dark' ? '#0f0a1a' : '#fcfaff',
        colorTextBase: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#1a1325',
        colorBgContainer: themeMode === 'dark' ? '#1a1325' : '#ffffff',
        colorBorder: themeMode === 'dark' ? '#2a1f40' : '#e8e0f5',
        colorBgElevated: themeMode === 'dark' ? '#241b38' : '#ffffff',
        borderRadius: customSettings.borderRadius,
        fontSize: customSettings.fontSize,
        fontFamily: customSettings.fontFamily,
        lineHeight: customSettings.lineHeight,
        controlHeight: customSettings.controlHeight,
        padding: customSettings.padding,
        margin: customSettings.margin,
      },
      components: {
        Layout: {
          headerBg: customSettings.headerBg,
          bodyBg: themeMode === 'dark' ? '#0f0a1a' : '#fcfaff',
          siderBg: customSettings.sidebarBg,
        },
        Button: {
          defaultBg: customSettings.buttonBg,
          defaultBorderColor: themeMode === 'dark' ? '#2a1f40' : '#e8e0f5',
          defaultColor: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#1a1325',
        },
        Card: {
          colorBgContainer: customSettings.cardBg || (themeMode === 'dark' ? '#1a1325' : '#ffffff'),
        },
      },
      algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    },
    
    // Green Theme
    green: {
      name: 'Green',
      token: {
        colorPrimary: '#00a854',
        colorSuccess: '#00a854',
        colorWarning: '#ffbf00',
        colorError: '#f04134',
        colorInfo: '#00a854',
        colorBgBase: themeMode === 'dark' ? '#0a1a0f' : '#f7fff9',
        colorTextBase: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#0f291a',
        colorBgContainer: themeMode === 'dark' ? '#14251a' : '#ffffff',
        colorBorder: themeMode === 'dark' ? '#2a4030' : '#e0f5e8',
        colorBgElevated: themeMode === 'dark' ? '#1c3025' : '#ffffff',
        borderRadius: customSettings.borderRadius,
        fontSize: customSettings.fontSize,
        fontFamily: customSettings.fontFamily,
        lineHeight: customSettings.lineHeight,
        controlHeight: customSettings.controlHeight,
        padding: customSettings.padding,
        margin: customSettings.margin,
      },
      components: {
        Layout: {
          headerBg: customSettings.headerBg,
          bodyBg: themeMode === 'dark' ? '#0a1a0f' : '#f7fff9',
          siderBg: customSettings.sidebarBg,
        },
        Button: {
          defaultBg: customSettings.buttonBg,
          defaultBorderColor: themeMode === 'dark' ? '#2a4030' : '#e0f5e8',
          defaultColor: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#0f291a',
        },
        Card: {
          colorBgContainer: customSettings.cardBg || (themeMode === 'dark' ? '#14251a' : '#ffffff'),
        },
      },
      algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    },
    
    // Orange Theme (New)
    orange: {
      name: 'Orange',
      token: {
        colorPrimary: '#fa8c16',
        colorSuccess: '#52c41a',
        colorWarning: '#fa8c16',
        colorError: '#f5222d',
        colorInfo: '#fa8c16',
        colorBgBase: themeMode === 'dark' ? '#1a0f0a' : '#fffaf5',
        colorTextBase: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#291a0f',
        colorBgContainer: themeMode === 'dark' ? '#251a14' : '#ffffff',
        colorBorder: themeMode === 'dark' ? '#40302a' : '#f5e8e0',
        colorBgElevated: themeMode === 'dark' ? '#30251c' : '#ffffff',
        borderRadius: customSettings.borderRadius,
        fontSize: customSettings.fontSize,
        fontFamily: customSettings.fontFamily,
        lineHeight: customSettings.lineHeight,
        controlHeight: customSettings.controlHeight,
        padding: customSettings.padding,
        margin: customSettings.margin,
      },
      components: {
        Layout: {
          headerBg: customSettings.headerBg,
          bodyBg: themeMode === 'dark' ? '#1a0f0a' : '#fffaf5',
          siderBg: customSettings.sidebarBg,
        },
        Button: {
          defaultBg: customSettings.buttonBg,
          defaultBorderColor: themeMode === 'dark' ? '#40302a' : '#f5e8e0',
          defaultColor: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#291a0f',
        },
        Card: {
          colorBgContainer: customSettings.cardBg || (themeMode === 'dark' ? '#251a14' : '#ffffff'),
        },
      },
      algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    },
    
    // Dark Modern (New)
    darkModern: {
      name: 'Dark Modern',
      token: {
        colorPrimary: '#177ddc',
        colorSuccess: '#49aa19',
        colorWarning: '#d89614',
        colorError: '#a61d24',
        colorInfo: '#177ddc',
        colorBgBase: '#0a0a0a',
        colorTextBase: 'rgba(255,255,255,0.85)',
        colorBgContainer: '#141414',
        colorBorder: '#303030',
        colorBgElevated: '#1f1f1f',
        borderRadius: customSettings.borderRadius,
        fontSize: customSettings.fontSize,
        fontFamily: customSettings.fontFamily,
        lineHeight: customSettings.lineHeight,
        controlHeight: customSettings.controlHeight,
        padding: customSettings.padding,
        margin: customSettings.margin,
      },
      components: {
        Layout: {
          headerBg: '#141414',
          bodyBg: '#0a0a0a',
          siderBg: '#001529',
        },
        Button: {
          defaultBg: '#1f1f1f',
          defaultBorderColor: '#303030',
          defaultColor: 'rgba(255,255,255,0.85)',
        },
        Card: {
          colorBgContainer: '#1f1f1f',
        },
      },
      algorithm: antdTheme.darkAlgorithm,
    },
    
    // Minimalist Light (New)
    minimalist: {
      name: 'Minimalist',
      token: {
        colorPrimary: '#1677ff',
        colorSuccess: '#00b96b',
        colorWarning: '#d48806',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',
        colorBgBase: '#ffffff',
        colorTextBase: '#1d2129',
        colorBgContainer: '#ffffff',
        colorBorder: '#e4e6eb',
        colorBgElevated: '#ffffff',
        borderRadius: 8,
        fontSize: customSettings.fontSize,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont",
        lineHeight: 1.5,
        controlHeight: 36,
        padding: 16,
        margin: 16,
      },
      components: {
        Layout: {
          headerBg: '#ffffff',
          bodyBg: '#f7f8fa',
          siderBg: '#001529',
        },
        Button: {
          defaultBg: '#f7f8fa',
          defaultBorderColor: '#e4e6eb',
          defaultColor: '#1d2129',
        },
        Card: {
          colorBgContainer: '#ffffff',
        },
      },
      algorithm: antdTheme.defaultAlgorithm,
    },
    
    // Material Dark (New)
    materialDark: {
      name: 'Material Dark',
      token: {
        colorPrimary: '#bb86fc',
        colorSuccess: '#03dac6',
        colorWarning: '#ffb74d',
        colorError: '#cf6679',
        colorInfo: '#bb86fc',
        colorBgBase: '#121212',
        colorTextBase: '#ffffff',
        colorBgContainer: '#1e1e1e',
        colorBorder: '#333333',
        colorBgElevated: '#2d2d2d',
        borderRadius: 12,
        fontSize: customSettings.fontSize,
        fontFamily: "'Roboto', sans-serif",
        lineHeight: 1.5,
        controlHeight: 40,
        padding: 20,
        margin: 20,
      },
      components: {
        Layout: {
          headerBg: '#1e1e1e',
          bodyBg: '#121212',
          siderBg: '#1a1a1a',
        },
        Button: {
          defaultBg: '#2d2d2d',
          defaultBorderColor: '#333333',
          defaultColor: '#ffffff',
        },
        Card: {
          colorBgContainer: '#2d2d2d',
        },
      },
      algorithm: antdTheme.darkAlgorithm,
    },
  }), [themeMode, customSettings]);

  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('admin-theme', newMode);
    
    if (newMode === 'light' && ['darkModern', 'materialDark'].includes(themePreset)) {
      setThemePreset('default');
      localStorage.setItem('admin-theme-preset', 'default');
    }
  };

  const changePreset = (preset) => {
    setThemePreset(preset);
    localStorage.setItem('admin-theme-preset', preset);
    
    if (['darkModern', 'materialDark'].includes(preset) && themeMode === 'light') {
      setThemeMode('dark');
      localStorage.setItem('admin-theme', 'dark');
    }
  };

  const updateCustomTheme = (settings) => {
    setCustomSettings(settings);
    localStorage.setItem('admin-custom-theme-settings', JSON.stringify(settings));
  };

  // Apply custom CSS variables for global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --admin-font-family: ${customSettings.fontFamily};
        --admin-font-size: ${customSettings.fontSize}px;
        --admin-border-radius: ${customSettings.borderRadius}px;
        --admin-line-height: ${customSettings.lineHeight};
        --admin-control-height: ${customSettings.controlHeight}px;
        --admin-padding: ${customSettings.padding}px;
        --admin-margin: ${customSettings.margin}px;
        --admin-button-bg: ${customSettings.buttonBg};
        --admin-header-bg: ${customSettings.headerBg};
        --admin-sidebar-bg: ${customSettings.sidebarBg};
        --admin-card-bg: ${customSettings.cardBg || (themeMode === 'dark' ? '#1f1f1f' : '#ffffff')};
        --admin-hover-bg: ${customSettings.hoverBg || (themeMode === 'dark' ? '#2a2a2a' : '#f5f5f5')};
      }
      
      body {
        font-family: ${customSettings.fontFamily} !important;
        font-size: ${customSettings.fontSize}px !important;
        line-height: ${customSettings.lineHeight} !important;
        background-color: ${themeConfigs[themePreset]?.components?.Layout?.bodyBg || '#f0f2f5'} !important;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: ${themeMode === 'dark' ? '#1f1f1f' : '#f1f1f1'};
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: ${themeMode === 'dark' ? '#555' : '#888'};
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: ${themeMode === 'dark' ? '#777' : '#555'};
      }
      
      /* Smooth transitions */
      * {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
      }
      
      /* User dropdown styling */
      .ant-dropdown-menu {
        background-color: ${themeConfigs[themePreset]?.token?.colorBgElevated || '#ffffff'} !important;
        border-radius: ${customSettings.borderRadius}px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
        border: 1px solid ${themeConfigs[themePreset]?.token?.colorBorder || '#d9d9d9'} !important;
      }
      
      .ant-dropdown-menu-item {
        color: ${themeConfigs[themePreset]?.token?.colorTextBase || '#000000'} !important;
        font-family: ${customSettings.fontFamily} !important;
        font-size: ${customSettings.fontSize}px !important;
        border-radius: ${customSettings.borderRadius / 2}px !important;
        margin: 2px 4px !important;
      }
      
      .ant-dropdown-menu-item:hover {
        background-color: var(--admin-hover-bg) !important;
      }
      
      /* Card styling */
      .ant-card {
        transition: all 0.3s ease !important;
      }
      
      /* Button hover effects */
      .ant-btn:not(.ant-btn-primary):not(.ant-btn-danger):hover {
        background-color: var(--admin-hover-bg) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [customSettings, themeMode, themePreset, themeConfigs]);

  // Update body classes for theme
  useEffect(() => {
    const body = document.body;
    
    // Remove all theme classes
    const themeClasses = ['theme-light', 'theme-dark'];
    const presetClasses = ['preset-default', 'preset-modernBlue', 'preset-purple', 'preset-green', 'preset-orange', 'preset-darkModern', 'preset-minimalist', 'preset-materialDark'];
    
    body.classList.remove(...themeClasses, ...presetClasses);
    
    // Add current theme classes
    body.classList.add(`theme-${themeMode}`);
    body.classList.add(`preset-${themePreset}`);
    
    // Add theme name as data attribute for CSS targeting
    body.setAttribute('data-theme', themePreset);
    body.setAttribute('data-mode', themeMode);
  }, [themeMode, themePreset]);

  const currentTheme = themeConfigs[themePreset] || themeConfigs.default;

  return (
    <ThemeContext.Provider value={{
      themeMode,
      themePreset,
      toggleThemeMode,
      changePreset,
      themeConfigs,
      customSettings,
      updateCustomTheme,
      currentTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};