module.exports = {
  babel: {
    plugins: [
      [
        require("babel-plugin-rewrite-require"),
        {
          aliases: {
            crypto: "crypto-browserify",
            stream: "readable-stream",
          },
          throwForNonStringLiteral: true,
        },
      ],
    ],
  },
};
