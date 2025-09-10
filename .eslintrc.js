module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "commonjs"
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "off",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",
    "template-curly-spacing": "error",
    "arrow-spacing": "error",
    "comma-dangle": ["error", "never"],
    "quotes": ["error", "single", { avoidEscape: true }],
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "max-len": ["warn", { code: 120 }],
    "eol-last": "error",
    "no-trailing-spaces": "error"
  },
  globals: {
    console: "readonly",
    process: "readonly",
    Buffer: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    module: "readonly",
    require: "readonly",
    exports: "readonly",
    global: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly"
  }
};