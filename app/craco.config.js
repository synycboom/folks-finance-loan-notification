const path = require("path");
const fs = require("fs");
const cracoBabelLoader = require("craco-babel-loader");

// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd());
const resolvePackage = (relativePath) =>
  path.resolve(appDirectory, relativePath);

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
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [resolvePackage("node_modules/folks-finance-js-sdk")],
      },
    },
  ],
};
