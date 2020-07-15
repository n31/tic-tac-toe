// Include Babel
// it will parse all code that comes after it.
// (Not recommended for production use).

process.env.NODE_ENV = 'development';
require("@babel/register")({
  ignore: [/\/(build|node_modules)\//],
  presets: ["@babel/preset-env", "@babel/preset-react"]
});

require('./server.js');