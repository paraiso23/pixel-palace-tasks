
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'pixel': ['Press Start 2P', 'monospace'],
				'mono': ['Space Mono', 'monospace'],
			},
			colors: {
				// 16-bit color palette
				'neon': {
					green: '#00FF00',
					cyan: '#00FFFF',
					pink: '#FF00FF',
					yellow: '#FFFF00',
				},
				'retro': {
					black: '#000000',
					darkgray: '#1a1a1a',
					gray: '#333333',
					lightgray: '#666666',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'pixel-blink': {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0.3' }
				},
				'pixel-bounce': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'spark': {
					'0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px #00FF00' },
					'50%': { boxShadow: '0 0 20px #00FF00, 0 0 30px #00FF00' }
				}
			},
			animation: {
				'pixel-blink': 'pixel-blink 2s infinite',
				'pixel-bounce': 'pixel-bounce 1s infinite',
				'spark': 'spark 0.6s ease-out',
				'glow': 'glow 2s ease-in-out infinite alternate'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
