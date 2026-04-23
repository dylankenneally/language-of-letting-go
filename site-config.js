import { readFileSync } from "node:fs";

function readPackageJson() {
  try {
    return JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
  } catch {
    return {};
  }
}

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const { homepage } = readPackageJson();
  if (!homepage) {
    return "";
  }

  return homepage.replace(/\/+$/, "");
}

export function getPathPrefix() {
  const configuredPrefix = process.env.ELEVENTY_PATH_PREFIX;
  if (configuredPrefix) {
    return configuredPrefix;
  }

  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return "/";
  }

  try {
    const pathname = new URL(siteUrl).pathname.replace(/\/+$/, "");
    return pathname || "/";
  } catch {
    return "/";
  }
}
