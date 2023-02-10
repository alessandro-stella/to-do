/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                customBlack: "#1E1A20",
                customGrey: "#36323C",
                customViolet: "#6F5ADC",
            },
        },
    },
    plugins: [],
};
