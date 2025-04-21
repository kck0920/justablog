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
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				heading: ['Paperlogy', 'serif'],
				sans: ['Inter', 'sans-serif']
			},
			colors: {
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
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-in-out'
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'none',
						color: 'inherit',
						a: {
							color: 'inherit',
							textDecoration: 'underline',
							fontWeight: 'inherit',
						},
						strong: {
							fontWeight: '600',
							color: 'inherit',
						},
						h1: {
							fontWeight: '700',
							color: 'inherit',
						},
						h2: {
							fontWeight: '600',
							color: 'inherit',
						},
						h3: {
							fontWeight: '600',
							color: 'inherit',
						},
						h4: {
							fontWeight: '600',
							color: 'inherit',
						},
						code: {
							color: 'inherit',
							backgroundColor: 'var(--tw-prose-pre-bg)',
							borderRadius: '0.25rem',
							paddingTop: '0.125rem',
							paddingRight: '0.25rem',
							paddingBottom: '0.125rem',
							paddingLeft: '0.25rem',
							'&::before': {
								content: 'none',
							},
							'&::after': {
								content: 'none',
							},
						},
						pre: {
							backgroundColor: 'var(--tw-prose-pre-bg)',
							borderRadius: '0.25rem',
							overflow: 'auto',
							padding: '1rem',
							code: {
								backgroundColor: 'transparent',
								padding: '0',
								borderRadius: '0',
							}
						},
						blockquote: {
							fontWeight: '400',
							fontStyle: 'italic',
							borderLeftWidth: '0.25rem',
							borderLeftColor: 'var(--tw-prose-quote-borders)',
							quotes: 'none',
							paddingLeft: '1rem',
							p: {
								'&::before': {
									content: 'none',
								},
								'&::after': {
									content: 'none',
								},
							}
						},
						img: {
							margin: 'auto',
						},
					},
				},
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography")
	],
} satisfies Config;
