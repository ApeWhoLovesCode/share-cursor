// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./contents/*.{ts,tsx}",
    "./contents/components/*.{ts,tsx}",
    "./contents/components/*/*.{ts,tsx}"
  ], // your content-script files
  plugins: []
}
