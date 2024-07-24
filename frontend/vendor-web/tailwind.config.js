module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["dark", "light"], // Cấu hình các chủ đề muốn sử dụng
    darkTheme: "light", // Thiết lập chủ đề mặc định là dark
  },
}
