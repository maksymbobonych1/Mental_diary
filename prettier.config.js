export default {
  trailingComma: "es5",

  overrides: [
    {
      files: [".eslintrc", ".prettierrc", "tsconfig.json"],
      options: {
        trailingComma: "none",
      },
    },
  ],
};
