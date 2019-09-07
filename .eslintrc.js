module.exports = {
  "extends": "airbnb-base",
  "parser": "@typescript-eslint/parser",
  "plugins": ["prettier", "@typescript-eslint", "jest"],
  "rules": {
    "prettier/prettier": ["warn", {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "es5",
      "printWidth": 120
    }],
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
      "ObjectExpression": {
        "minProperties": 1,
        "multiline": true
      },
      "ObjectPattern": {
        "consistent": true
      },
      "ImportDeclaration": "never",
      "ExportDeclaration": {
        "multiline": true,
        "minProperties": 3
      }
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
