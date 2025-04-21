const sass = require("sass");
const fs = require("fs");
const path = require("path");

function compile() {
  // Compiling scss file to css for development
  let style = sass.compile(path.resolve(__dirname, "../sass/style.scss"));

  fs.writeFileSync(
    path.resolve(__dirname, "../public/stylesheets/style.css"),
    style.css
  );
}

module.exports = compile