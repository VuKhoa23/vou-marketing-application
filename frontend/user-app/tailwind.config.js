module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["dark", {
      light: {
        primary: "#7cb3dd",
      },
    }],
    darkTheme: "light"
  }
};
