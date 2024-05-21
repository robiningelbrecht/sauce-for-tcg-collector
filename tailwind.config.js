/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "popup/popup.html",
        "./node_modules/flowbite/**/*.js"
    ],
    plugins: [
        require('flowbite/plugin')
    ]
}