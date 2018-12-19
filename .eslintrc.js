module.exports = {
  "extends": "airbnb-base",
  "parser": "typescript-eslint-parser",
  "plugins": ["prettier", "typescript"],
  "rules": {
    "prettier/prettier": ["warn", {
      "semi": false,
      "trailingComma": "es5",
      "singleQuote": true
    }],
    "semi": [2, "never"],
    "typescript/no-unused-vars": "warn",
    "no-underscore-dangle": ["error", {
      "allowAfterThis": true
    }],
    "import/no-unresolved": "off"
  }
};
