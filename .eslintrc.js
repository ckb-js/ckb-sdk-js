module.exports = {
  "extends": ["airbnb-base", "plugin:prettier/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "jest"],
  "rules": {
    "comma-dangle": [2, {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "ignore"
    }],
    "import/no-extraneous-dependencies": [2, {
      "devDependencies": true
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "local",
      "args": "after-used",
      "ignoreRestSiblings": false
    }],
    "no-underscore-dangle": ["error", {
      "allowAfterThis": true
    }],
    "import/no-unresolved": "off",
    "semi": [2, "never"],
    "no-console": [0],
    "no-unused-vars": [0],
    "arrow-parens": [0],
    "indent": ["error", 2],
    "no-mixed-operators": [0],
    "implicit-arrow-linebreak": [0],
    "no-unused-expression": [0],
    "no-plusplus": [0],
    "no-bitwise": [0],
    "no-control-regex": [0],
    "operator-linebreak": [2, "after", {
      "overrides": {
        "?": "before",
        ":": "before"
      }
    }],
    "max-len": [2, 120],
    "object-curly-newline": ["error", {
      "consistent": true
    }],
    "spaced-comment": ["error", "always", {
      "markers": ["/"]
    }],
    "max-classes-per-file": [0],
    "import/extensions": [2, {
      "ts": "never"
    }]
  },
  "globals": {
    "BigInt": "readonly"
  },
  "env": {
    "node": true,
    "jest": true
  }
}
