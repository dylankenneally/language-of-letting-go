import { readFile, readdir, mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { formatDate } from "../src/meditation-date.js";

const ALIAS_MANIFEST = ".meditation-title-aliases.json";

function slugifyTitle(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTitleFromFrontMatter(source) {
  const frontMatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) {
    return null;
  }

  const titleMatch = frontMatterMatch[1].match(/^title:\s*(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

export async function getMeditationEntries(inputDir) {
  const filenames = (await readdir(inputDir))
    .filter((filename) => filename.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const entries = [];

  for (const filename of filenames) {
    const fullPath = path.join(inputDir, filename);
    const source = await readFile(fullPath, "utf8");
    const title = getTitleFromFrontMatter(source);
    if (!title) {
      continue;
    }

    entries.push({
      fileSlug: path.basename(filename, ".md"),
      title
    });
  }

  return entries;
}

export function assignAliasSlugs(entries) {
  const counts = new Map();

  entries.forEach(({ title }) => {
    const baseSlug = slugifyTitle(title);
    counts.set(baseSlug, (counts.get(baseSlug) || 0) + 1);
  });

  return entries.map(({ fileSlug, title }) => {
    const baseSlug = slugifyTitle(title);
    const aliasSlug = counts.get(baseSlug) > 1
      ? `${baseSlug}-${formatDate(fileSlug)}`
      : baseSlug;

    return {
      aliasSlug,
      dateSlug: formatDate(fileSlug)
    };
  });
}

async function removePreviousAliases(outputDir) {
  const manifestPath = path.join(outputDir, ALIAS_MANIFEST);

  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    await Promise.all(
      manifest.aliases.map((aliasSlug) => rm(path.join(outputDir, aliasSlug), { recursive: true, force: true }))
    );
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function syncMeditationTitleAliases(inputDir, outputDir) {
  const entries = await getMeditationEntries(inputDir);
  const aliases = assignAliasSlugs(entries);

  await removePreviousAliases(outputDir);

  for (const { aliasSlug, dateSlug } of aliases) {
    const sourceFile = path.join(outputDir, dateSlug, "index.html");
    const destinationDir = path.join(outputDir, aliasSlug);
    const destinationFile = path.join(destinationDir, "index.html");

    await mkdir(destinationDir, { recursive: true });
    await copyFile(sourceFile, destinationFile);
  }

  await writeFile(
    path.join(outputDir, ALIAS_MANIFEST),
    JSON.stringify({ aliases: aliases.map(({ aliasSlug }) => aliasSlug) }, null, 2) + "\n"
  );
}
