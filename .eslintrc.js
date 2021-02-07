module.exports = {
    env: {
        "browser": true,
        "node": true,
        // "es2021": true,
        // "jest/globals": true
    },
    globals: {
        "window": true,
    },
    extends: [
        "eslint:recommended",
        // "plugin:jest/recommended",
        // "plugin:vue/essential",
        // "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        // "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    plugins: [
        // "vue",
        // "@typescript-eslint"
    ],
    rules: {
        // "off"或0 -关闭规则
        // "warn" 或1 - 开启规则, 使用警告 程序不会退出
        // "error"或2 - 开启规则, 使用错误 程序退出
        "no-unused-vars": 'off',
        "no-extra-semi": 'off'
    }
}
