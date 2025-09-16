﻿module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react-hooks/exhaustive-deps": "off"
  }
};