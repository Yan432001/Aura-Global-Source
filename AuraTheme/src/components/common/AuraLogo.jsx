import React from 'react';

/**
 * Aura "AS" Interlocking Monogram Logo
 * Matches the user-provided brand design:
 * Angular geometric "A" with glowing sunset orange peak (#ea580c -> #f97316 -> #fb923c)
 * seamlessly interlocking with curved "S" in deep navy (#0f172a / #1e293b).
 */
export default function AuraLogo({
  size = 36,
  showText = true,
  textColor = 'inherit',
  subtitle = 'SUPPLY',
  className = '',
  style = {},
}) {
  const height = size;
  const width = size;

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', ...style }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.22))' }}
      >
        <defs>
          <linearGradient id="auraAsOrange" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="45%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="auraAsNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0a1322" />
          </linearGradient>
          <linearGradient id="auraAsBlend" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="55%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>

        {/* Outer Circular/Soft-Shield Ambient Glow (Optional Subtle Backdrop) */}
        <circle cx="60" cy="60" r="56" fill="url(#auraAsNavy)" fillOpacity="0.04" />

        {/* Left Leg of "A" (Deep Navy) */}
        <path
          d="M18 96 L48 24 C50 19 54 16 60 16 C66 16 70 19 72 24 L78 37 L58 48 L46 72 L72 72 L64 85 L28 85 L18 96 Z"
          fill="url(#auraAsNavy)"
        />

        {/* Peak & Right Arm of "A" transitioning into Gradient Sunset Orange */}
        <path
          d="M54 22 C56 18 64 18 66 22 L86 64 C83 66 79 69 75 73 L60 41 L54 22 Z"
          fill="url(#auraAsOrange)"
        />

        {/* Dynamic Interlocking "S" - Upper Arc (Orange to Coral) */}
        <path
          d="M66 38 C75 30 89 30 98 38 C105 45 105 56 97 64 C91 70 82 72 72 74 C78 68 86 66 90 61 C95 56 95 48 90 43 C84 37 75 37 68 44 L66 38 Z"
          fill="url(#auraAsOrange)"
        />

        {/* Dynamic Interlocking "S" - Lower Sweep & Tail (Navy / Blend) */}
        <path
          d="M72 74 C62 76 50 82 50 93 C50 104 62 110 75 110 C88 110 100 102 104 90 L92 84 C89 93 82 98 74 98 C67 98 62 95 62 89 C62 84 68 80 77 77 L72 74 Z"
          fill="url(#auraAsBlend)"
        />

        {/* Modern Accent Cut dot */}
        <circle cx="98" cy="94" r="3.5" fill="#f97316" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontWeight: 900,
              fontSize: size * 0.52,
              letterSpacing: '-0.03em',
              color: textColor === 'inherit' ? '#0f172a' : textColor,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span>AURA</span>
            <span style={{ color: '#f97316' }}>.</span>
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: Math.max(9, size * 0.24),
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f97316',
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
