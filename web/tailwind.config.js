/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    daisyui: {
        themes: ["business"],
    },
    plugins: [require("daisyui")],
};
