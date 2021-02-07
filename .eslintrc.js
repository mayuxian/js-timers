module.exports = {
    env: {
        "browser": true,
        "es2021": true,
        "jest/globals": true
    },
    globals: {
        "window": true,
    },
    extends: [
        "eslint:recommended",
        // "plugin:vue/essential",
        // "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
        "ecmaVersion": 12,
        // "parser": "@typescript-eslint/parser",
        // "sourceType": "module"
    },
    plugins: [
        // "vue",
        // "@typescript-eslint"
    ],
    rules: {
        "semi": [
            2,
            "never"
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "no-param-reassign": [
            0
        ],
        "func-names": [
            0
        ],
        "import/no-extraneous-dependencies": [
            0
        ],
        "import/no-unresolved": [
            2,
            {
                "ignore": [
                    "dayjs"
                ]
            }
        ],
        "import/extensions": [
            2,
            "never"
        ]
    }
}
