var config = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            display: ['"Space Grotesk"', 'sans-serif'],
            sans: ['"Inter"', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
            serif: ['"Playfair Display"', 'serif'],
        },
        extend: {
            colors: {
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
                border: {
                    subtle: 'var(--border-subtle)',
                    hover: 'var(--border-hover)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    muted: 'var(--accent-muted)',
                },
            },
        },
    },
    plugins: [],
};
export default config;
