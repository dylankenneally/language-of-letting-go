import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { assignAliasSlugs, getMeditationEntries } from "./sync-meditation-title-aliases.js";

async function collectHtmlUrls(outputDir, currentDir = outputDir, rootDir = outputDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const urls = [];

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      urls.push(...await collectHtmlUrls(outputDir, fullPath, rootDir));
      continue;
    }

    if (!entry.isFile() || entry.name !== "index.html") {
      continue;
    }

    const relativeDir = path.relative(rootDir, path.dirname(fullPath));
    const relativeUrl = relativeDir ? `/${relativeDir.split(path.sep).join("/")}/` : "/";

    urls.push(relativeUrl);
  }

  return urls;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateSitemap({ inputDir, outputDir, siteUrl }) {
  const htmlUrls = await collectHtmlUrls(outputDir);
  const meditationEntries = await getMeditationEntries(inputDir);
  const aliasUrls = assignAliasSlugs(meditationEntries).map(({ aliasSlug }) => `/${aliasSlug}/`);

  const urls = Array.from(
    new Set([...htmlUrls, ...aliasUrls])
  ).filter((url) => url !== "/404.html" && url !== "/sitemap.xml");

  urls.sort((a, b) => {
    if (a === "/") {
      return -1;
    }

    if (b === "/") {
      return 1;
    }

    return a.localeCompare(b);
  });

  const xml = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...urls.map((url) => {
      const lines = [
        "  <url>",
        `    <loc>${escapeXml(`${siteUrl}${url}`)}</loc>`
      ];

      if (url === "/") {
        lines.push("    <changefreq>daily</changefreq>");
      }

      lines.push("  </url>");
      return lines.join("\n");
    }),
    "</urlset>",
    ""
  ].join("\n");

  await writeFile(path.join(outputDir, "sitemap.xml"), xml);
}

export async function generateRobotsTxt({ outputDir, siteUrl }) {
  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ""
  ].join("\n");

  await writeFile(path.join(outputDir, "robots.txt"), robotsTxt);
}
