const fs = require("fs");
const babel = require("@babel/core");
const presetEnv = require("@babel/preset-env");

function compile(module, filename, source) {
  const result = babel.transformSync(source, {
    filename,
    presets: [[presetEnv, { targets: { node: "current" } }]]
  });
  module._compile(result.code, filename);
}

const defaultJavaScriptLoader = require.extensions[".js"];
require.extensions[".js"] = (module, filename) => {
  if (!filename.includes("/src/algorithms/")) {
    defaultJavaScriptLoader(module, filename);
    return;
  }

  compile(module, filename, fs.readFileSync(filename, "utf8"));
};

require.extensions[".vue"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const script = source.match(/<script>([\s\S]*?)<\/script>/);
  if (!script) throw new Error(`No script block found in ${filename}`);
  compile(module, filename, script[1]);
};
