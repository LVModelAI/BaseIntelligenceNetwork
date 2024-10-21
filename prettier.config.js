/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ["prettier-plugin-tailwindcss"],
    tabWidth: 4,
    trailingComma: "es5",
    semi: true,
    tailwindConfig: "./tailwind.config.ts"
};

export default config;
