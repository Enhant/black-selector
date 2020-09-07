module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser", 
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    ecmaVersion: 2020,
  },
  plugins: ["react"],
  rules: {
    "react/prop-types" : 0,
    "quotes": 0,
    "no-param-reassign": 0,
    "import/order": 0,
    "comma-dangle": 0,
    "react/no-danger" : 0,
    "no-nested-ternary": 0,
    "no-use-before-define": 0,
    "react/forbid-prop-types": 0
  },
};
