/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.js",
        "./node_modules/flowbite/**/*.js"
    ],
    plugins: [
        require('flowbite/plugin')
    ]
}