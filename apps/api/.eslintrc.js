module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
  ],
  "plugins": [
    "simple-import-sort",
    "import",
  ],
  "overrides": [
    {
      "env": {
        "node": true,
      },
      "files": [
        ".eslintrc.{js,cjs}",
      ],
      "parserOptions": {
        "sourceType": "script",
      },
    },
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "rules": {
    "@typescript-eslint/semi": [
      "error",
      "never",
    ],
    "comma-dangle": ["error", "always-multiline"],
    "no-trailing-spaces": "error",
    "@typescript-eslint/no-var-requires": "off",
  },
}
