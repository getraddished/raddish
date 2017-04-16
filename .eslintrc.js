module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-control-regex": "off",
        "no-cond-assign": ["error", "always"],
        "complexity": ["error", 15],
        "consistent-return": "error",
        "curly": "error",
        "guard-for-in": "error",
        "no-eval": "error",
        "no-useless-call": "error",
        "yoda": ["error", "never"],
        "new-cap": ["error", {"capIsNew": true}],
        "comma-style": ["error", "last"],
        "comma-spacing": ["error", {"before": false, "after": true}],
        "array-bracket-spacing": ["error", "never"],
        "camelcase": ["warn", {"properties": "never"}],
        "consistent-this": ["error", "self"],
        "one-var": ["error", {"initialized": "always", "uninitialized": "never"}],
        "no-unneeded-ternary": "error",
        "no-console": "off"
    }
};