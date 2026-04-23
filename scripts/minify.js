import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";

const BUILD_DIR = fileURLToPath(new URL("../build/", import.meta.url));

const htmlOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  minifyJS: true,
  preventAttributesEscaping: true,
  processConditionalComments: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: false,
  removeRedundantAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true
};

const cssMinifier = new CleanCSS({
  level: 2
});

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function minifyFile(filePath) {
  if (filePath.endsWith(".html")) {
    const source = await readFile(filePath, "utf8");
    const minified = await minifyHtml(source, htmlOptions);

    if (minified !== source) {
      await writeFile(filePath, minified);
    }

    return "html";
  }

  if (filePath.endsWith(".css")) {
    const source = await readFile(filePath, "utf8");
    const result = cssMinifier.minify(source);

    if (result.errors.length > 0) {
      throw new Error(`Failed to minify CSS in ${filePath}: ${result.errors.join("; ")}`);
    }

    if (result.styles !== source) {
      await writeFile(filePath, result.styles);
    }

    return "css";
  }

  return null;
}

async function main() {
  const buildStats = await stat(BUILD_DIR);

  if (!buildStats.isDirectory()) {
    throw new Error(`Build directory not found: ${BUILD_DIR}`);
  }

  const files = await collectFiles(BUILD_DIR);
  let htmlCount = 0;
  let cssCount = 0;

  for (const filePath of files) {
    const fileType = await minifyFile(filePath);

    if (fileType === "html") {
      htmlCount += 1;
    }

    if (fileType === "css") {
      cssCount += 1;
    }
  }

  console.log(`Minified ${htmlCount} HTML file(s) and ${cssCount} CSS file(s) in ${BUILD_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
