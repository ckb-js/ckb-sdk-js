module.exports = {
  "extends": "airbnb-base",
  "parser": "typescript-eslint-parser",
  "plugins": ["prettier", "typescript", "jest"],
  "rules": {
    "prettier/prettier": ["warn", {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "all"
    }],
    "typescript/no-unused-vars": "warn",
    // "comma-dangle": [2, "always"],
    "no-underscore-dangle": ["error", {
      "allowAfterThis": true
    }],
    "import/no-unresolved": "off",
    "semi": [2, "never"],
    "no-console": [0],
    "no-unused-vars": [0],
    "arrow-parens": [0],
    "import/no-extraneous-dependencies": ['./'],
    "indent": ["error", 2],
    "no-mixed-operators": [0],
    "implicit-arrow-linebreak": [0]

  },
  "env": {
    "node": true,
    "jest": true
  }
}
