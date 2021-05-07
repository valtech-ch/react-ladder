module.exports = {
    "ignorePatterns": [
        "build"
    ],
    "extends": [
        "@valtech-ch/eslint-config/config",
        "@valtech-ch/eslint-config/rules"
    ],
    parserOptions: {
        createDefaultProgram: true,
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname
    }
}
