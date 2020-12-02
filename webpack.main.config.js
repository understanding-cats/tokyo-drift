module.exports = {
  // This is the main entry point for your application, it's the first file
  // that runs in the main process.
  entry: {
    app: "./src/main.js",
    timer: "./src/timer.js",
  },
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
};
