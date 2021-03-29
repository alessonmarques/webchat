const defaultTheme = require('tailwindcss/defaultTheme');

const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
        './resources/**/*.vue',
        './resources/**/*.js'
    ],
    whitelistPatterns: [ /-(leave|enter|appear)(|-(to|from|active))$/, /data-v-.*/, /v-deep/ ],
    whitelistPatternsChildren: [ /pretty$/, /xmx-.*$/, /^(.*?)\.tooltip/ ],
    defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
})

module.exports = {
    purge: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    variants: {
        extend: {
            opacity: ['disabled'],
        },
        cursor: ['hover'],
    },


    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('autoprefixer'),
        ...process.env.NODE_ENV === 'production' ? [purgecss] : []
    ],
};



