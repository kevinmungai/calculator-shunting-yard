module.exports = {
  purge: {
    content: ["./src/**/*.svelte", "./src/**/*.html"],
    options: {
      safelist: ["[/svelte-/]"],
      defaultExtractor: (content) => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    },
  },
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "text-color": "var(--text-color)",
        "bkg-color": "var(--bkg-color)",
        "calculator-pad": "var(--calculator-pad)",
        "operator-color": "var(--operator-color)",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
