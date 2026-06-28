/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Standard premium B2B colors mapped to existing design tokens
        "primary": "#2563EB",            // Blue
        "primary-container": "#DBEAFE",  // Soft blue container
        "on-primary": "#FFFFFF",
        "on-primary-container": "#1E40AF",

        "secondary": "#14B8A6",          // Teal (Accent)
        "secondary-container": "#CCFBF1", // Soft teal container
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#115E59",

        "background": "#F8FAFC",         // Spacious background
        "on-background": "#0F172A",      // Dark slate text

        "surface": "#FFFFFF",            // Card / Sheet background
        "surface-bright": "#FFFFFF",
        "surface-dim": "#F1F5F9",
        "on-surface": "#0F172A",
        "on-surface-variant": "#475569", // Muted slate text

        "surface-container-lowest": "#FFFFFF", // Standard card background
        "surface-container-low": "#F1F5F9",    // Light background element
        "surface-container": "#E2E8F0",        // Divided/border background
        "surface-container-high": "#CBD5E1",
        "surface-container-highest": "#94A3B8",

        "outline": "#64748B",            // Slate border
        "outline-variant": "#E2E8F0",    // Soft slate border

        "error": "#EF4444",              // Soft red
        "error-container": "#FEE2E2",
        "on-error": "#FFFFFF",
        "on-error-container": "#991B1B",

        // Add semantic classes directly
        "brand-blue": "#2563EB",
        "brand-teal": "#14B8A6",
        "brand-slate": "#0F172A"
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "12px",                     // Rounded 12px
        "xl": "16px",                     // Rounded 16px
        "2xl": "20px",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "40px",
        "container-max": "1440px",
        "sidebar-width": "260px",
        "base": "4px"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "title-md": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "mono-md": ["JetBrains Mono", "monospace"],
        "headline-lg-mobile": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "title-md": ["18px", { "lineHeight": "24px", "fontWeight": "600" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "mono-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "600" }]
      },
      boxShadow: {
        "soft-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        "soft-md": "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        "soft-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        "soft-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03)"
      }
    },
  },
  plugins: [],
}
