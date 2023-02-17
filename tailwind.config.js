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
                customViolet: {
                    50:"hsl(250, 65%, 05%)",
                    100:"hsl(250, 65%, 10%)",
                    150:"hsl(250, 65%, 15%)",
                    200:"hsl(250, 65%, 20%)",
                    250:"hsl(250, 65%, 25%)",
                    300:"hsl(250, 65%, 30%)",
                    350:"hsl(250, 65%, 35%)",
                    400:"hsl(250, 65%, 40%)",
                    450:"hsl(250, 65%, 45%)",
                    500:"hsl(250, 65%, 50%)",
                    550:"hsl(250, 65%, 55%)",
                    600:"hsl(250, 65%, 60%)",
                    650:"hsl(250, 65%, 65%)",
                    700:"hsl(250, 65%, 70%)",
                    750:"hsl(250, 65%, 75%)",
                    800:"hsl(250, 65%, 80%)",
                    850:"hsl(250, 65%, 85%)",
                    900:"hsl(250, 65%, 90%)",
                    950:"hsl(250, 65%, 95%)",
                },
            },
        },
    },
    plugins: [],
};
