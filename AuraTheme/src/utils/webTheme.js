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