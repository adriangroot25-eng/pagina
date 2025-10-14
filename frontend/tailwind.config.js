/** @type {import('tailwindcss').Config} */
export default { 
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'brand': ['Dancing Script', 'cursive'],
        'sans': ['Raleway', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse 2s infinite',
      },
      backgroundImage: {
        'gradient-sport': 'linear-gradient(135deg, #1a365d 0%, #2d5a87 25%, #4299e1 50%, #68d391 75%, #38a169 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      },
    },
  },
  plugins: [],
}