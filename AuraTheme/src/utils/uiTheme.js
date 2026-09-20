export const publicTheme = {
  pageBackground:
    'radial-gradient(circle at 10% 8%, rgba(47, 111, 237, 0.16), transparent 30%), radial-gradient(circle at 90% 4%, rgba(255, 122, 61, 0.12), transparent 26%), radial-gradient(circle at 85% 60%, rgba(47, 111, 237, 0.10), transparent 30%), linear-gradient(180deg, #eef3ff 0%, #f7f9ff 48%, #eef3ff 100%)',
  heroBackground:
    'radial-gradient(circle at 18% 20%, rgba(47, 111, 237, 0.14), transparent 24%), radial-gradient(circle at 84% 10%, rgba(255, 122, 61, 0.14), transparent 24%), linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(240,245,255,0.98) 54%, rgba(238,243,255,0.98) 100%)',
  cardBackground: 'rgba(255, 255, 255, 0.88)',
  cardStrong: '#ffffff',
  cardMuted: 'rgba(240, 244, 255, 0.9)',
  primary: '#2f6fed',
  secondary: '#5b8def',
  accent: '#ff7a3d',
  text: '#1c2333',
  subtext: '#6b7590',
  border: 'rgba(47, 111, 237, 0.16)',
  softBorder: 'rgba(47, 111, 237, 0.12)',
  shadow: '0 24px 70px rgba(47, 111, 237, 0.14)',
  lightShadow: '0 14px 38px rgba(47, 111, 237, 0.1)',
  pill: 'linear-gradient(135deg, rgba(47,111,237,0.12), rgba(91,141,239,0.12))',
  ribbon: 'linear-gradient(135deg, #2f6fed 0%, #5b8def 100%)',
  sunset: 'linear-gradient(135deg, #ff7a3d 0%, #ff9a5c 100%)',
  success: '#22c55e',
  warning: '#f0b429',
  danger: '#f5484d',
};


const adminThemeLight = {
  pageBackground:
    'radial-gradient(circle at 6% 0%, rgba(47, 111, 237, 0.08), transparent 32%), radial-gradient(circle at 96% 12%, rgba(244, 118, 42, 0.07), transparent 28%), linear-gradient(180deg, #eef2fb 0%, #f4f6fc 100%)',
  sidebar: '#ffffff',
  sidebarMuted: '#8a94a6',
  sidebarBorder: 'rgba(20, 24, 33, 0.06)',
  sidebarActiveBg: '#fff1e8',
  sidebarActiveText: '#fa6423',
  sidebarHoverBg: '#f5f7fb',
  sidebarSectionLabel: '#a7acb8',
  topPanel: '#ffffff',
  card: '#ffffff',
  cardMuted: '#f6f8fb',
  text: '#1f2937',
  subtext: '#8a94a6',
  border: 'rgba(20, 24, 33, 0.08)',
  primary: '#2f6fed',
  success: '#22c55e',
  warning: '#f5a623',
  danger: '#f5484d',
  shadow: '0 12px 30px rgba(20, 24, 33, 0.06)',
  systemTeal: '#0f5c68',
  systemTealSoft: '#e3edee',
  systemOrange: '#f4762a',
  systemOrangeSoft: '#fdece0',
};

const adminThemeDark = {
  pageBackground:
    'radial-gradient(circle at 6% 0%, rgba(47, 111, 237, 0.14), transparent 32%), radial-gradient(circle at 96% 12%, rgba(244, 118, 42, 0.1), transparent 28%), linear-gradient(180deg, #10131c 0%, #151926 100%)',
  sidebar: '#141824',
  sidebarMuted: '#7d8699',
  sidebarBorder: 'rgba(255, 255, 255, 0.08)',
  sidebarActiveBg: 'rgba(250, 100, 35, 0.16)',
  sidebarActiveText: '#ff8a4d',
  sidebarHoverBg: 'rgba(255, 255, 255, 0.05)',
  sidebarSectionLabel: '#5b6478',
  topPanel: '#141824',
  card: '#1a1f2e',
  cardMuted: '#212739',
  text: '#e8eaf0',
  subtext: '#8f97ab',
  border: 'rgba(255, 255, 255, 0.08)',
  primary: '#4c86ff',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  shadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
  systemTeal: '#2dd4bf',
  systemTealSoft: 'rgba(45, 212, 191, 0.14)',
  systemOrange: '#ff8a4d',
  systemOrangeSoft: 'rgba(255, 138, 77, 0.16)',
};

// Static default (light) — for any code path outside a component render.
// Prefer `useAdminTheme()` inside components so colors follow the dark-mode
// toggle and the selected Theme Customizer preset.
export const adminTheme = adminThemeLight;

const hexToRgba = (hex, alpha) => {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return hex;
  const full = clean.length === 3 ? clean.split('').map((ch) => ch + ch).join('') : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Reactive admin theme: merges the light/dark palette with the primary
// color chosen in the Theme Customizer, so custom-styled admin pages
// (not just native antd components) follow both settings.
export const useAdminThemeTokens = (themeMode, presetPrimary) => {
  const base = themeMode === 'dark' ? adminThemeDark : adminThemeLight;
  if (!presetPrimary || presetPrimary === base.primary) return base;

  return {
    ...base,
    primary: presetPrimary,
    sidebarActiveText: presetPrimary,
    sidebarActiveBg: hexToRgba(presetPrimary, themeMode === 'dark' ? 0.18 : 0.12),
  };
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

export const formatCompact = (value) => compactFormatter.format(Number(value || 0));
