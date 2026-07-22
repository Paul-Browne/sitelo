// src/plugin.ts
import fs6 from "fs";
import path9 from "path";
import { fileURLToPath as fileURLToPath2, pathToFileURL } from "url";
import { transform as esbuildTransform } from "esbuild";
import pLimit from "p-limit";

// src/typegen.ts
import fs from "fs/promises";
import path2 from "path";

// src/page-helper-generator.ts
function paramsTypeFromDefinitions(paramDefinitions) {
  if (paramDefinitions.length === 0) {
    return "{}";
  }
  const fields = paramDefinitions.map((param) => {
    if (param.type === "single") {
      return `${JSON.stringify(param.name)}: string`;
    }
    if (param.type === "catch-all") {
      return `${JSON.stringify(param.name)}: string[]`;
    }
    return `${JSON.stringify(param.name)}?: string[]`;
  });
  return `{ ${fields.join("; ")} }`;
}
function generateTypedPageHelper(page) {
  const paramsType = page ? paramsTypeFromDefinitions(page.paramDefinitions ?? []) : "{}";
  return `
export type PageParams = ${paramsType};

export type StaticParams = PageParams[];

export type DataContext = {
  params: PageParams;
  dev: boolean;
};

export type RenderContext<TData = unknown> = {
  params: PageParams;
  data: TData;
  dev: boolean;
};

export type PageContext<TData = unknown> = {
  params: PageParams;
  data?: TData;
  dev: boolean;
};

export type PageModule<TData = unknown> = {
  generateStaticParams?: () => StaticParams | Promise<StaticParams>;
  data?: (ctx: DataContext) => TData | Promise<TData>;
  render: (ctx: RenderContext<TData>) => any;
};

export function definePage<T extends (ctx: PageContext) => any>(fn: T): T {
  return fn;
}

export function defineData<T extends (ctx: DataContext) => any>(fn: T): T {
  return fn;
}

export function defineStaticParams<
  T extends () => StaticParams | Promise<StaticParams>
>(fn: T): T {
  return fn;
}

export function definePageModule<TData>(
  mod: PageModule<TData>,
): PageModule<TData> {
  return mod;
}
`;
}

// src/path-utils.ts
import path from "path";
function toPosix(value) {
  return value.replace(/\\/g, "/");
}
function normalizeFsPath(value) {
  return path.normalize(value);
}
function normalizeRoutePath(value) {
  const normalized = toPosix(value).replace(/\/+/g, "/");
  if (!normalized || normalized === "/") return "/";
  const withLeadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return withLeadingSlash !== "/" && withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}
function stripPageSuffix(filePath, extensions) {
  const normalized = toPosix(filePath);
  const match = [...extensions].sort((a, b) => b.length - a.length).find((ext) => normalized.endsWith(ext));
  if (!match) return normalized;
  return normalized.slice(0, -match.length);
}

// src/typegen.ts
function pageHelperModuleSource(page) {
  const paramsType = paramsTypeFromDefinitions(page.paramDefinitions ?? []);
  return `export type PageParams = ${paramsType};

export type StaticParams = PageParams[];

export type DataContext = {
  params: PageParams;
  dev: boolean;
};

export type RenderContext<TData = unknown> = {
  params: PageParams;
  data: TData;
  dev: boolean;
};

export type PageContext<TData = unknown> = {
  params: PageParams;
  data?: TData;
  dev: boolean;
};

export type RenderResult = unknown;

export type PageModule<TData = unknown> = {
  generateStaticParams?: () => StaticParams | Promise<StaticParams>;
  data?: (ctx: DataContext) => TData | Promise<TData>;
  render: (ctx: RenderContext<TData>) => RenderResult | Promise<RenderResult>;
};

export declare function definePage<
  T extends (ctx: PageContext) => RenderResult | Promise<RenderResult>
>(fn: T): T;

export declare function defineData<
  T extends (ctx: DataContext) => unknown | Promise<unknown>
>(fn: T): T;

export declare function defineStaticParams<
  T extends () => StaticParams | Promise<StaticParams>
>(fn: T): T;

export declare function definePageModule<TData>(
  mod: PageModule<TData>
): PageModule<TData>;
`;
}
function stripPageExtension(filePath) {
  return filePath.replace(/\.(ht|html)\.(js|ts|jsx|tsx)$/i, "");
}
function getTypesFileName(page) {
  if (!page.dynamic || page.paramDefinitions.length === 0) {
    return "$types.d.ts";
  }
  const parts = page.paramDefinitions.map((param) => {
    if (param.type === "single") {
      return param.name;
    }
    if (param.type === "catch-all") {
      return `${param.name}.all`;
    }
    return `${param.name}.opt`;
  });
  return `$types.${parts.join(".")}.d.ts`;
}
async function listFilesRecursive(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    const err = error;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path2.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listFilesRecursive(fullPath);
      }
      return [fullPath];
    })
  );
  return files.flat();
}
async function removeEmptyDirectories(dir, stopAt) {
  const normalizedDir = normalizeFsPath(dir);
  const normalizedStopAt = normalizeFsPath(stopAt);
  if (normalizedDir === normalizedStopAt) {
    return;
  }
  let entries;
  try {
    entries = await fs.readdir(normalizedDir);
  } catch (error) {
    const err = error;
    if (err.code === "ENOENT") {
      return;
    }
    throw error;
  }
  if (entries.length > 0) {
    return;
  }
  await fs.rmdir(normalizedDir);
  await removeEmptyDirectories(path2.dirname(normalizedDir), normalizedStopAt);
}
function getGeneratedTypesRoot(root) {
  return normalizeFsPath(path2.join(root, ".sitelo", "types"));
}
function getGeneratedHelperPath(args) {
  const pagesRoot = normalizeFsPath(path2.join(args.root, args.pagesDir));
  const relativeFromPagesDir = toPosix(
    path2.relative(pagesRoot, args.page.absolutePath)
  );
  const withoutExt = stripPageExtension(relativeFromPagesDir);
  const outRoot = getGeneratedTypesRoot(args.root);
  const fileName = getTypesFileName(args.page);
  return normalizeFsPath(
    path2.join(outRoot, path2.dirname(withoutExt), fileName)
  );
}
async function removeStalePageTypeDeclarations(args) {
  const outRoot = getGeneratedTypesRoot(args.root);
  const existingFiles = await listFilesRecursive(outRoot);
  const staleFiles = existingFiles.filter((file) => {
    if (!file.endsWith(".d.ts")) {
      return false;
    }
    return !args.expectedFiles.has(normalizeFsPath(file));
  });
  await Promise.all(
    staleFiles.map(async (file) => {
      await fs.unlink(file);
      await removeEmptyDirectories(path2.dirname(file), outRoot);
    })
  );
}
async function writePageTypeDeclarations(args) {
  const outRoot = getGeneratedTypesRoot(args.root);
  await fs.mkdir(outRoot, { recursive: true });
  const outputs = args.entries.map((page) => ({
    page,
    outFile: getGeneratedHelperPath({
      root: args.root,
      pagesDir: args.pagesDir,
      page
    })
  }));
  const expectedFiles = new Set(
    outputs.map(({ outFile }) => normalizeFsPath(outFile))
  );
  await Promise.all(
    outputs.map(async ({ page, outFile }) => {
      await fs.mkdir(path2.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, pageHelperModuleSource(page), "utf8");
    })
  );
  await removeStalePageTypeDeclarations({
    root: args.root,
    expectedFiles
  });
}

// src/format-dev-error.ts
import fs2 from "fs";
import path3 from "path";
import { fileURLToPath } from "url";
import pc from "picocolors";
function extractSourceLocation(error, root) {
  const stack = error.stack ?? "";
  for (const stackLine of stack.split("\n")) {
    const match = stackLine.match(
      /(?:\()?((?:file:\/\/\/)?[^()\n]+?):(\d+):(\d+)\)?\s*$/
    );
    if (!match) continue;
    let file = match[1].trim();
    file = file.replace(/^at\s+(?:.+?\s+\()?/, "");
    file = file.split("?")[0].split("#")[0];
    try {
      if (file.startsWith("file://")) {
        file = fileURLToPath(file);
      } else {
        file = decodeURIComponent(file);
      }
    } catch {
      continue;
    }
    if (!path3.isAbsolute(file)) continue;
    if (file.includes(`${path3.sep}node_modules${path3.sep}`)) continue;
    const relativeFile = path3.relative(root, file);
    if (relativeFile === ".." || relativeFile.startsWith(`..${path3.sep}`)) {
      continue;
    }
    if (!fs2.existsSync(file)) continue;
    return {
      file,
      line: Number(match[2]),
      column: Number(match[3])
    };
  }
  return null;
}
function refineReferenceErrorLocation(error, location) {
  const match = error.message.match(
    /^([A-Za-z_$][A-Za-z0-9_$]*) is not defined$/
  );
  if (!match || !fs2.existsSync(location.file)) {
    return location;
  }
  const identifier = match[1];
  const lines = fs2.readFileSync(location.file, "utf8").split(/\r?\n/);
  const reportedIndex = location.line - 1;
  const start = Math.max(0, reportedIndex - 2);
  const end = Math.min(lines.length - 1, reportedIndex + 3);
  const identifierPattern = new RegExp(
    `\\b${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`
  );
  let bestMatch;
  for (let index = start; index <= end; index++) {
    const column = lines[index].search(identifierPattern);
    if (column === -1) continue;
    const distance = Math.abs(index - reportedIndex);
    if (!bestMatch || distance < bestMatch.distance) {
      bestMatch = {
        line: index + 1,
        column: column + 1,
        distance
      };
    }
  }
  if (!bestMatch) {
    return location;
  }
  return {
    ...location,
    line: bestMatch.line,
    column: bestMatch.column
  };
}
function createSourceFrame(location, contextLines = 3) {
  if (!fs2.existsSync(location.file)) return null;
  const lines = fs2.readFileSync(location.file, "utf8").split(/\r?\n/);
  const errorIndex = location.line - 1;
  const start = Math.max(0, errorIndex - contextLines);
  const end = Math.min(lines.length - 1, errorIndex + contextLines);
  const lineNumberWidth = String(end + 1).length;
  const output = [];
  for (let index = start; index <= end; index++) {
    const number = String(index + 1).padStart(lineNumberWidth, " ");
    const isErrorLine = index === errorIndex;
    const marker = isErrorLine ? pc.red(">") : " ";
    const line = lines[index];
    output.push(
      `${marker} ${pc.dim(number)} ${pc.dim("\u2502")} ${line}`
    );
    if (isErrorLine) {
      const indentation = " ".repeat(Math.max(0, location.column - 1));
      output.push(
        `  ${" ".repeat(lineNumberWidth)} ${pc.dim("\u2502")} ${indentation}${pc.red("^")}`
      );
    }
  }
  return output.join("\n");
}
function formatDevPageError(args) {
  const { root, phase, debug = false } = args;
  const error = args.error instanceof Error ? args.error : new Error(String(args.error));
  const extractedLocation = extractSourceLocation(error, root);
  const location = extractedLocation ? refineReferenceErrorLocation(error, extractedLocation) : null;
  const sourceFrame = location ? createSourceFrame(location) : null;
  const heading = phase === "load" ? "PAGE LOAD ERROR" : "PAGE RELOAD ERROR";
  const fileLabel = location ? ` ${path3.relative(root, location.file)}:${location.line}:${location.column}` : "";
  const separatorLength = Math.max(
    12,
    64 - heading.length - fileLabel.length
  );
  const output = [
    "",
    pc.cyan(
      `\u2500\u2500 ${heading} ${"\u2500".repeat(separatorLength)}${fileLabel}`
    ),
    "",
    `${pc.red(error.name + ":")} ${error.message}`
  ];
  if (location && sourceFrame) {
    output.push("", path3.relative(root, location.file), "", sourceFrame);
  }
  if (debug && error.stack) {
    output.push("", pc.dim(error.stack));
  }
  output.push(
    "",
    pc.yellow("Fix the error and save again."),
    pc.dim("Watching for file changes..."),
    ""
  );
  return output.join("\n");
}

// src/constants.ts
var PLUGIN_NAME = "sitelo";
var VIRTUAL_BUILD_ENTRY_ID = `\0${PLUGIN_NAME}:build-entry`;
var VIRTUAL_PAGE_HELPER_ID = `${PLUGIN_NAME}/page`;
var RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX = `\0${PLUGIN_NAME}/page:`;
var CACHE_DIR_NAME = `node_modules/.cache/${PLUGIN_NAME}`;
var DEFAULT_PAGE_EXTENSIONS = [
  ".ht.js",
  ".html.js",
  ".ht.ts",
  ".html.ts",
  ".ht.jsx",
  ".html.jsx",
  ".ht.tsx",
  ".html.tsx"
];
var VIRTUAL_JSX_RUNTIME_ID = `${PLUGIN_NAME}/jsx-runtime`;
var VIRTUAL_JSX_DEV_RUNTIME_ID = `${PLUGIN_NAME}/jsx-dev-runtime`;
var RESOLVED_VIRTUAL_JSX_RUNTIME_ID = `\0${VIRTUAL_JSX_RUNTIME_ID}`;
var RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID = `\0${VIRTUAL_JSX_DEV_RUNTIME_ID}`;
var VIRTUAL_LOCAL_TYPES_PREFIX = `\0${PLUGIN_NAME}:local-types:`;

// src/discover.ts
import path4 from "path";

// src/route-utils.ts
var DYNAMIC_SEGMENT_RE = /\[([A-Za-z0-9_]+)\]/g;
var CATCH_ALL_SEGMENT_RE = /\[\.\.\.([A-Za-z0-9_]+)\]/g;
var OPTIONAL_CATCH_ALL_SEGMENT_RE = /\[\.\.\.([A-Za-z0-9_]+)\]\?/g;
var ROUTE_GROUP_RE = /(^|\/)\(([^)]+)\)(?=\/|$)/g;
function isDynamicPage(relativeFromPagesDir) {
  return /\[(?:\.\.\.)?[A-Za-z0-9_]+\]\??/.test(relativeFromPagesDir);
}
function toRoutePattern(relativeFromPagesDir, extensions) {
  const noExt = stripPageSuffix(toPosix(relativeFromPagesDir), extensions);
  const withoutGroups = noExt.replace(ROUTE_GROUP_RE, "$1");
  const withoutIndex = withoutGroups.replace(/\/index$/i, "").replace(/^index$/i, "");
  const raw = withoutIndex.replace(OPTIONAL_CATCH_ALL_SEGMENT_RE, "*?:$1").replace(CATCH_ALL_SEGMENT_RE, "*:$1").replace(DYNAMIC_SEGMENT_RE, ":$1");
  return normalizeRoutePath(raw || "/");
}
function encodePathParts(parts) {
  return parts.map((part) => encodeURIComponent(part)).join("/");
}
function normalizeCatchAllValue(value) {
  if (Array.isArray(value)) {
    return value.map((part) => String(part)).filter(Boolean);
  }
  if (value === "") {
    return [];
  }
  return String(value).split("/").filter(Boolean);
}
function normalizePageParams(params) {
  const normalized = {};
  for (const [key, value] of Object.entries(params)) {
    normalized[key] = Array.isArray(value) ? value.map((part) => String(part)) : String(value);
  }
  return normalized;
}
function fillParams(pattern, params) {
  const result = pattern.replace(/\*\?:([A-Za-z0-9_]+)/g, (_, key) => {
    const value = params[key];
    if (value == null) {
      return "";
    }
    const parts = normalizeCatchAllValue(value);
    if (parts.length === 0) {
      return "";
    }
    return encodePathParts(parts);
  }).replace(/\*:([A-Za-z0-9_]+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing catch-all route param "${key}"`);
    }
    const value = params[key];
    const parts = normalizeCatchAllValue(value);
    if (parts.length === 0) {
      throw new Error(`Catch-all route param "${key}" must not be empty`);
    }
    return encodePathParts(parts);
  }).replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing route param "${key}"`);
    }
    const value = params[key];
    if (Array.isArray(value)) {
      throw new Error(`Route param "${key}" must be a string, received array`);
    }
    return encodeURIComponent(String(value));
  });
  return normalizeRoutePath(result || "/");
}
function fileNameFromRoute(routePath, cleanUrls) {
  const normalized = normalizeRoutePath(routePath);
  if (normalized === "/") return "index.html";
  const base = normalized.slice(1);
  return cleanUrls ? `${base}/index.html` : `${base}.html`;
}
function expandStaticPaths(basePage, rows, cleanUrls) {
  return rows.map((row) => {
    const routePath = fillParams(basePage.routePattern, row);
    const params = normalizePageParams(row);
    return {
      ...basePage,
      routePath,
      fileName: fileNameFromRoute(routePath, cleanUrls),
      params
    };
  });
}
function routeMatch(pattern, urlPath) {
  const a = normalizeRoutePath(pattern).split("/").filter(Boolean);
  const b = normalizeRoutePath(urlPath).split("/").filter(Boolean);
  const params = {};
  for (let i = 0; i < a.length; i++) {
    const patternSeg = a[i];
    const urlSeg = b[i];
    if (patternSeg.startsWith("*?:")) {
      const key = patternSeg.slice(3);
      if (i < b.length) {
        params[key] = b.slice(i).map(decodeURIComponent);
      }
      return params;
    }
    if (patternSeg.startsWith("*:")) {
      const rest = b.slice(i);
      if (rest.length === 0) return null;
      params[patternSeg.slice(2)] = rest.map(decodeURIComponent);
      return params;
    }
    if (!urlSeg) return null;
    if (patternSeg.startsWith(":")) {
      params[patternSeg.slice(1)] = decodeURIComponent(urlSeg);
      continue;
    }
    if (patternSeg !== urlSeg) return null;
  }
  return a.length === b.length ? params : null;
}
function matchDynamicPage(entries, urlPath) {
  const candidates = entries.filter((entry) => entry.dynamic).sort((a, b) => compareRoutePriority(a.routePattern, b.routePattern));
  const normalizedUrl = normalizeRoutePath(urlPath);
  for (const entry of candidates) {
    const params = routeMatch(entry.routePattern, normalizedUrl);
    if (params) {
      return {
        ...entry,
        routePath: normalizedUrl,
        params
      };
    }
  }
  return null;
}
function compareRoutePriority(a, b) {
  const aSegs = normalizeRoutePath(a).split("/").filter(Boolean);
  const bSegs = normalizeRoutePath(b).split("/").filter(Boolean);
  const len = Math.max(aSegs.length, bSegs.length);
  for (let i = 0; i < len; i++) {
    const aa = aSegs[i];
    const bb = bSegs[i];
    if (aa == null) return 1;
    if (bb == null) return -1;
    const aOptionalCatchAll = aa.startsWith("*?:");
    const bOptionalCatchAll = bb.startsWith("*?:");
    if (aOptionalCatchAll !== bOptionalCatchAll) {
      return aOptionalCatchAll ? 1 : -1;
    }
    const aCatchAll = aa.startsWith("*:");
    const bCatchAll = bb.startsWith("*:");
    if (aCatchAll !== bCatchAll) {
      return aCatchAll ? 1 : -1;
    }
    const aDynamic = aa.startsWith(":");
    const bDynamic = bb.startsWith(":");
    if (aDynamic !== bDynamic) {
      return aDynamic ? 1 : -1;
    }
  }
  return bSegs.length - aSegs.length;
}

// src/route-params.ts
function parseRouteParamSegment(segment) {
  if (segment.startsWith("*?:")) {
    return {
      name: segment.slice(3),
      type: "optional-catch-all"
    };
  }
  if (segment.startsWith("*:")) {
    return {
      name: segment.slice(2),
      type: "catch-all"
    };
  }
  if (segment.startsWith(":")) {
    return {
      name: segment.slice(1),
      type: "single"
    };
  }
  return null;
}
function extractRouteParamDefinitions(routePattern) {
  return routePattern.split("/").filter(Boolean).map((segment) => parseRouteParamSegment(segment)).filter((value) => value != null);
}

// src/discover.ts
function buildDefaultIncludeGlobs(pagesDir, pageExtensions) {
  return pageExtensions.map((ext) => {
    const cleanExt = ext.startsWith(".") ? ext.slice(1) : ext;
    return `${pagesDir}/**/*.${cleanExt}`;
  });
}
async function discoverEntryPages(root, options) {
  const fgModule = await import("fast-glob");
  const fg2 = fgModule.default ?? fgModule;
  const pagesDir = options.pagesDir ?? "src";
  const pageExtensions = options.pageExtensions?.length ? options.pageExtensions : DEFAULT_PAGE_EXTENSIONS;
  const include = Array.isArray(options.include) ? options.include : options.include ? [options.include] : buildDefaultIncludeGlobs(pagesDir, pageExtensions);
  const exclude = Array.isArray(options.exclude) ? options.exclude : options.exclude ? [options.exclude] : [];
  const pagesRoot = normalizeFsPath(path4.join(root, pagesDir));
  const files = await fg2.glob(include, {
    cwd: root,
    ignore: exclude,
    absolute: true
  });
  return files.sort().map((absolutePath) => {
    const entryPath = normalizeFsPath(absolutePath);
    const relativePath = toPosix(path4.relative(root, entryPath));
    const relativeFromPagesDir = toPosix(path4.relative(pagesRoot, entryPath));
    if (relativeFromPagesDir.startsWith("../") || relativeFromPagesDir === "..") {
      throw new Error(
        `[${PLUGIN_NAME}] Page is outside pagesDir: ${entryPath} (pagesDir: ${pagesDir})`
      );
    }
    const dynamic = isDynamicPage(relativeFromPagesDir);
    const routePattern = toRoutePattern(relativeFromPagesDir, pageExtensions);
    const paramDefinitions = extractRouteParamDefinitions(routePattern);
    return {
      id: entryPath,
      entryPath,
      absolutePath: entryPath,
      relativePath,
      routePattern,
      routePath: routePattern,
      fileName: "",
      dynamic,
      paramNames: paramDefinitions.map((p) => p.name),
      paramDefinitions,
      params: {}
    };
  });
}

// src/dev-server.ts
import fs3 from "fs";
import path6 from "path";

// src/errors.ts
function invalidHtmlReturn(page, value) {
  const type = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  return new Error(
    `[sitelo] ${page.relativePath}: page render must return a string or a JSX/React renderable value, but received ${type}.`
  );
}
function missingDefaultExport(page) {
  return new Error(
    `[${PLUGIN_NAME}] Page "${page.relativePath}" does not export a default renderer`
  );
}
function pageError(page, cause) {
  const message = `[${PLUGIN_NAME}] Failed to render "${page.relativePath}" at route "${page.routePath}"`;
  if (cause instanceof Error) {
    const err = new Error(`${message}: ${cause.message}`);
    if (cause.stack) {
      err.stack = `${err.stack}
Caused by:
${cause.stack}`;
    }
    return err;
  }
  return new Error(`${message}: ${String(cause)}`);
}

// src/react-static-validation.ts
var warnedKeys = /* @__PURE__ */ new Set();
function warnOnce(key, message, onWarn) {
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  onWarn(message);
}
function isEventProp(name) {
  return /^on[A-Z]/.test(name);
}
function getElementName(type) {
  if (typeof type === "string") {
    return `<${type}>`;
  }
  if (typeof type === "function") {
    const maybeNamed = type;
    return maybeNamed.displayName || maybeNamed.name || "AnonymousComponent";
  }
  return "UnknownElement";
}
async function validateStaticJsxTree(node, ctx) {
  const react = await import("react");
  const { isValidElement } = react;
  function inspectElement(el) {
    const props = el.props ?? {};
    for (const [key, value] of Object.entries(props)) {
      if (!isEventProp(key)) continue;
      if (typeof value !== "function") continue;
      const elementName = getElementName(el.type);
      warnOnce(
        `${ctx.page.routePath}:${elementName}:${key}`,
        `[sitelo] ${ctx.page.relativePath ?? ctx.page.routePath}: prop "${key}" on ${elementName} will not be interactive in static TSX/JSX output. Use a client script or future hydration/islands support instead.`,
        ctx.onWarn
      );
    }
  }
  function walk(value) {
    if (value == null || typeof value === "boolean") return;
    if (typeof value === "string" || typeof value === "number") return;
    if (Array.isArray(value)) {
      for (const child of value) {
        walk(child);
      }
      return;
    }
    if (!isValidElement(value)) return;
    inspectElement(value);
    walk(value.props?.children);
  }
  walk(node);
}

// src/render-runtime.ts
function isStructuredPageModule(value) {
  return typeof value === "object" && value !== null && "render" in value && typeof value.render === "function";
}
function ensureDoctype(html) {
  const trimmed = html.trimStart();
  if (/^<!doctype html>/i.test(trimmed)) {
    return html;
  }
  if (/^<html[\s>]/i.test(trimmed)) {
    return "<!DOCTYPE html>" + html;
  }
  return html;
}
async function isRenderableReactResult(value) {
  try {
    const react = await import("react");
    return value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || Array.isArray(value) || react.isValidElement(value);
  } catch {
    return false;
  }
}
async function renderReactResult(value) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  return renderToStaticMarkup(value);
}
async function resolveRenderResult(page, mod, ctx) {
  const entry = mod.default;
  if (entry == null) {
    throw missingDefaultExport(page);
  }
  if (typeof entry === "string") {
    return entry;
  }
  if (typeof entry === "function") {
    return await entry(ctx);
  }
  if (isStructuredPageModule(entry)) {
    if (typeof entry.data === "function") {
      ctx.data = await entry.data(ctx);
    }
    return await entry.render(ctx);
  }
  throw invalidHtmlReturn(page, entry);
}
async function ensureReactAvailable(page) {
  try {
    await import("react");
    await import("react-dom/server");
  } catch {
    throw new Error(
      `[sitelo] ${page.relativePath}: TSX/JSX page rendering requires "react" and "react-dom" to be installed in the consuming app.`
    );
  }
}
async function renderPage(page, mod, dev = false) {
  const ctx = {
    page,
    params: page.params,
    dev
  };
  try {
    if (typeof mod.data === "function") {
      ctx.data = await mod.data(ctx);
    }
    const result = await resolveRenderResult(page, mod, ctx);
    if (result == null) {
      throw invalidHtmlReturn(page, result);
    }
    if (typeof result === "string") {
      return ensureDoctype(result);
    }
    await ensureReactAvailable(page);
    const looksReactRenderable = await isRenderableReactResult(result);
    if (!looksReactRenderable) {
      throw invalidHtmlReturn(page, result);
    }
    if (dev) {
      await validateStaticJsxTree(result, {
        page,
        onWarn(message) {
          console.warn(message);
        }
      });
    }
    const html = await renderReactResult(result);
    return ensureDoctype(html);
  } catch (error) {
    throw pageError(page, error);
  }
}

// src/module-loader.ts
import path5 from "path";
import {
  createServer,
  isRunnableDevEnvironment,
  loadConfigFromFile
} from "vite";
async function importPageModule(server, url) {
  const environment = server.environments.ssr;
  if (!isRunnableDevEnvironment(environment)) {
    throw new Error(
      "[sitelo] The Vite SSR environment is not runnable. A RunnableDevEnvironment is required to evaluate page modules."
    );
  }
  const mod = await environment.runner.import(url);
  return normalizeLoadedPageModule(mod);
}
function isLocalPageTypesImport(id) {
  return /^\.\/\$types(?:\.[A-Za-z0-9_.-]+)?$/.test(id);
}
function normalizeLoadedPageModule(mod) {
  const pageModule = mod ?? {};
  if (isStructuredPageModule(pageModule.default)) {
    const structured = pageModule.default;
    return {
      default: structured.render,
      data: structured.data,
      generateStaticParams: structured.generateStaticParams,
      dynamic: structured.dynamic,
      prerender: structured.prerender
    };
  }
  return pageModule;
}
async function flattenPluginOptions(option) {
  const resolved = await option;
  if (!resolved) return [];
  if (Array.isArray(resolved)) {
    const nested = await Promise.all(
      resolved.map((entry) => flattenPluginOptions(entry))
    );
    return nested.flat();
  }
  return [resolved];
}
async function loadUserConfig(args) {
  if (!args.configFile) {
    return { userConfig: {}, userPlugins: [] };
  }
  const loaded = await loadConfigFromFile(
    { command: "serve", mode: args.mode },
    args.configFile,
    args.root
  );
  if (!loaded) {
    return { userConfig: {}, userPlugins: [] };
  }
  const plugins = await flattenPluginOptions(loaded.config.plugins);
  return {
    userConfig: loaded.config,
    // Filter ourselves out so evaluating page modules does not
    // recursively spawn more build loaders.
    userPlugins: plugins.filter((plugin) => plugin.name !== PLUGIN_NAME)
  };
}
function createPageHelperPlugin(getPages) {
  return {
    name: `${PLUGIN_NAME}:page-helper`,
    resolveId(id, importer) {
      if (id === VIRTUAL_PAGE_HELPER_ID && importer) {
        return `${RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX}${importer}`;
      }
      if (importer && isLocalPageTypesImport(id)) {
        return `${VIRTUAL_LOCAL_TYPES_PREFIX}${importer}::${id}`;
      }
      return null;
    },
    async load(id) {
      if (id.startsWith(VIRTUAL_LOCAL_TYPES_PREFIX)) {
        return `
export {
  definePage,
  defineData,
  defineStaticParams,
  definePageModule
} from 'sitelo/page';
`;
      }
      if (!id.startsWith(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX)) {
        return null;
      }
      const importer = id.slice(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX.length);
      const pages = await getPages();
      const normalizedImporter = path5.resolve(importer);
      const page = pages.find(
        (candidate) => path5.resolve(candidate.absolutePath) === normalizedImporter
      );
      return generateTypedPageHelper(page);
    }
  };
}
async function createPageModuleLoader(args) {
  const { mode, root, server, getPages } = args;
  if (mode === "dev") {
    if (!server) {
      throw new Error("[sitelo] dev server not available");
    }
    return {
      loadModule: async (_entryPath, relativePath) => importPageModule(server, `/${relativePath}`),
      close: async () => {
      }
    };
  }
  if (!getPages) {
    throw new Error(
      "[sitelo] getPages is required in build mode"
    );
  }
  const configMode = args.configMode ?? "production";
  const { userConfig, userPlugins } = await loadUserConfig({
    root,
    configFile: args.configFile,
    mode: configMode
  });
  const config = {
    ...userConfig,
    root,
    mode: configMode,
    configFile: false,
    logLevel: "error",
    appType: "custom",
    esbuild: userConfig.esbuild === false ? false : {
      ...userConfig.esbuild,
      jsx: "automatic",
      jsxImportSource: PLUGIN_NAME
    },
    server: {
      ...userConfig.server,
      middlewareMode: true,
      watch: null
    },
    plugins: [...userPlugins, createPageHelperPlugin(getPages)]
  };
  const buildServer = await createServer(config);
  return {
    loadModule: async (entryPath) => {
      const relativePath = "/" + path5.relative(root, entryPath).replace(/\\/g, "/");
      return importPageModule(buildServer, relativePath);
    },
    close: async () => {
      await buildServer.close();
    }
  };
}

// src/dev-server.ts
function isStaticAssetRequest(url) {
  return url.endsWith(".css") || url.endsWith(".js") || url.endsWith(".mjs") || url.endsWith(".ts") || url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".gif") || url.endsWith(".svg") || url.endsWith(".webp") || url.endsWith(".ico") || url.endsWith(".woff") || url.endsWith(".woff2") || url.endsWith(".ttf") || url.endsWith(".otf");
}
function normalizeRoutePath2(input) {
  let value = input.split("?")[0].split("#")[0];
  if (!value.startsWith("/")) value = "/" + value;
  value = value.replace(/\/+/g, "/");
  if (value.length > 1 && value.endsWith("/")) {
    value = value.slice(0, -1);
  }
  return value;
}
function shouldSkipHtmlRouting(url, pagesDir) {
  return url.startsWith("/@vite") || url.startsWith("/@fs/") || url.startsWith("/node_modules/") || url.startsWith(`/${pagesDir}/`) || url === "/favicon.ico" || isStaticAssetRequest(url);
}
function hasDotDotSegment(url) {
  return url.split("/").includes("..");
}
function tryRewriteRootAssetToSrc(root, pagesDir, url) {
  if (!url.startsWith("/")) return null;
  if (hasDotDotSegment(url)) return null;
  if (!isStaticAssetRequest(url)) return null;
  if (url.startsWith(`/${pagesDir}/`)) return null;
  const candidate = path6.join(root, pagesDir, url.slice(1));
  if (fs3.existsSync(candidate)) {
    return `/${pagesDir}/${url.slice(1)}`;
  }
  return null;
}
function rewriteRootAssetUrlsInDevHtml(html, root, pagesDir) {
  return html.replace(
    /\b(href|src)=["'](\/[^"']+)["']/g,
    (full, attr, url) => {
      if (hasDotDotSegment(url)) return full;
      if (!isStaticAssetRequest(url)) return full;
      if (url.startsWith(`/${pagesDir}/`)) return full;
      const candidate = path6.join(root, pagesDir, url.slice(1));
      if (!fs3.existsSync(candidate)) return full;
      return `${attr}="/${pagesDir}/${url.slice(1)}"`;
    }
  );
}
function installDevServer(args) {
  const { server, root, pagesDir, getPages, getEntries } = args;
  const loaderPromise = createPageModuleLoader({
    mode: "dev",
    root,
    server
  });
  server.middlewares.use(async (req, res, next) => {
    try {
      const originalUrl = req.url ?? "/";
      const url = normalizeRoutePath2(originalUrl);
      const rewrittenAssetUrl = tryRewriteRootAssetToSrc(root, pagesDir, url);
      if (rewrittenAssetUrl) {
        const suffixIndex = originalUrl.search(/[?#]/);
        const suffix = suffixIndex === -1 ? "" : originalUrl.slice(suffixIndex);
        req.url = rewrittenAssetUrl + suffix;
        return next();
      }
      if (shouldSkipHtmlRouting(url, pagesDir)) {
        return next();
      }
      const pages = await getPages();
      let page = pages.find(
        (p) => normalizeRoutePath2(p.routePath) === url
      );
      if (!page && getEntries) {
        page = matchDynamicPage(await getEntries(), url) ?? void 0;
      }
      if (!page) {
        return next();
      }
      const { loadModule } = await loaderPromise;
      const mod = await loadModule(page.entryPath, page.relativePath);
      if (!mod) {
        return next();
      }
      const html = await renderPage(page, mod, true);
      const devHtml = rewriteRootAssetUrlsInDevHtml(
        html,
        root,
        pagesDir
      );
      const transformedHtml = await server.transformIndexHtml(
        url,
        devHtml,
        req.originalUrl
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(transformedHtml);
    } catch (error) {
      server.config.logger.error(
        `[${PLUGIN_NAME}] dev server render failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
      );
      next(error);
    }
  });
}

// src/html-asset-validator.ts
import fs4 from "fs";
import path7 from "path";
function stripQueryAndHash(url) {
  return url.split("#")[0].split("?")[0];
}
function isLocalRootUrl(url) {
  return !!url && url.startsWith("/") && !url.startsWith("//");
}
function fileExistsForPublicUrl(root, pagesDir, url) {
  const clean = stripQueryAndHash(url).slice(1);
  const fromSrc = path7.join(root, pagesDir, clean);
  if (fs4.existsSync(fromSrc)) return true;
  const fromPublic = path7.join(root, "public", clean);
  if (fs4.existsSync(fromPublic)) return true;
  return false;
}
function collectScriptSrcs(html) {
  const out = [];
  for (const match of html.matchAll(
    /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi
  )) {
    out.push(match[1]);
  }
  return out;
}
function collectStylesheetHrefs(html) {
  const out = [];
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/\brel=["']?stylesheet["']?/i.test(tag)) continue;
    const href = tag.match(/\bhref=["']([^"']+)["']/i);
    if (href) out.push(href[1]);
  }
  return out;
}
function collectLiteralDynamicImports(html) {
  const out = [];
  for (const match of html.matchAll(
    /import\s*\(\s*["']([^"'`]+)["']\s*\)/gi
  )) {
    out.push(match[1]);
  }
  return out;
}
function unique(values) {
  return [...new Set(values)];
}
function collectHrefSrcUrls(html) {
  const out = [];
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    out.push(match[1]);
  }
  return out;
}
function collectLocalAssetUrls(html) {
  const candidates = [
    ...collectHrefSrcUrls(html),
    ...collectLiteralDynamicImports(html)
  ];
  return unique(candidates.filter(isLocalRootUrl).map(stripQueryAndHash));
}
function formatPageLabel(pageLabel) {
  return pageLabel ? ` (${pageLabel})` : "";
}
function missingAssetMessage(args) {
  const { pluginName, kind, url, root, pagesDir, pageLabel } = args;
  const clean = stripQueryAndHash(url).slice(1);
  const pageSuffix = formatPageLabel(pageLabel);
  return `[${pluginName}] Missing ${kind}${pageSuffix}: ${url}
Expected one of:
- ${path7.join(root, pagesDir, clean)}
- ${path7.join(root, "public", clean)}`;
}
function reportMissing(args) {
  const message = missingAssetMessage(args);
  if (args.mode === "warn") {
    console.warn(`\u26A0\uFE0F ${message}`);
    return;
  }
  throw new Error(message);
}
function validateHtmlAssetReferences(options) {
  const {
    root,
    pagesDir,
    html,
    pluginName,
    pageLabel,
    missingAssets = "error"
  } = options;
  const scriptSrcs = unique(collectScriptSrcs(html)).filter(isLocalRootUrl);
  const stylesheetHrefs = unique(collectStylesheetHrefs(html)).filter(isLocalRootUrl);
  const literalDynamicImports = unique(collectLiteralDynamicImports(html)).filter(
    isLocalRootUrl
  );
  for (const url of scriptSrcs) {
    if (!fileExistsForPublicUrl(root, pagesDir, url)) {
      reportMissing({
        mode: missingAssets,
        pluginName,
        kind: "JavaScript asset",
        url,
        root,
        pagesDir,
        pageLabel
      });
    }
  }
  for (const url of stylesheetHrefs) {
    if (!fileExistsForPublicUrl(root, pagesDir, url)) {
      reportMissing({
        mode: missingAssets,
        pluginName,
        kind: "stylesheet asset",
        url,
        root,
        pagesDir,
        pageLabel
      });
    }
  }
  for (const url of literalDynamicImports) {
    if (!fileExistsForPublicUrl(root, pagesDir, url)) {
      console.warn(
        `\u26A0\uFE0F ${missingAssetMessage({
          pluginName,
          kind: "literal dynamic import",
          url,
          root,
          pagesDir,
          pageLabel
        })}`
      );
    }
  }
}

// src/page-index.ts
async function buildPageIndex(args) {
  const { entries, modulesByEntry, cleanUrls } = args;
  const pages = [];
  for (const entry of entries) {
    const mod = modulesByEntry.get(entry.entryPath) ?? {};
    if (entry.dynamic) {
      const rows = (mod.generateStaticParams ? await mod.generateStaticParams() : []) ?? [];
      const paramRows = Array.isArray(rows) ? rows : [];
      if (paramRows.length === 0) {
        console.warn(
          `[${PLUGIN_NAME}] \u26A0\uFE0F Dynamic page "${entry.relativePath}" generated no routes. Export generateStaticParams() returning at least one params object to emit pages for it.`
        );
      }
      pages.push(
        ...expandStaticPaths(
          {
            id: entry.id,
            entryPath: entry.entryPath,
            absolutePath: entry.absolutePath,
            relativePath: entry.relativePath,
            routePattern: entry.routePattern,
            dynamic: entry.dynamic,
            paramNames: entry.paramNames,
            paramDefinitions: entry.paramDefinitions
          },
          paramRows,
          cleanUrls
        )
      );
    } else {
      pages.push({
        ...entry,
        routePath: entry.routePattern,
        fileName: fileNameFromRoute(entry.routePattern, cleanUrls),
        params: {}
      });
    }
  }
  pages.sort((a, b) => compareRoutePriority(a.routePattern, b.routePattern));
  const seenRoutes = /* @__PURE__ */ new Map();
  for (const page of pages) {
    const existing = seenRoutes.get(page.routePath);
    if (existing) {
      throw new Error(
        `[${PLUGIN_NAME}] Duplicate route generated: "${page.routePath}" from "${existing.relativePath}" and "${page.relativePath}"`
      );
    }
    seenRoutes.set(page.routePath, page);
  }
  return pages;
}

// src/static-assets.ts
import fs5 from "fs/promises";
import path8 from "path";
import fg from "fast-glob";
import * as esbuild from "esbuild";
import fsSync from "fs";
function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}
function hasAnySuffix(value, suffixes) {
  return suffixes.some((suffix) => value.endsWith(suffix));
}
function shouldIgnoreFile(rel) {
  return rel.endsWith(".d.ts") || rel.endsWith(".map") || rel.endsWith(".tsbuildinfo") || rel.startsWith(".") || rel.includes("/.");
}
function isProcessableAsset(rel) {
  return rel.endsWith(".js") || rel.endsWith(".mjs") || rel.endsWith(".ts") || rel.endsWith(".css");
}
function toOutputFileName(relativePathFromSrc) {
  if (relativePathFromSrc.endsWith(".ts")) {
    return relativePathFromSrc.slice(0, -3) + ".js";
  }
  return relativePathFromSrc;
}
async function collectStaticAssets(args) {
  const { root, pagesDir, pageExtensions } = args;
  const srcDir = path8.join(root, pagesDir);
  const entries = await fg("**/*", {
    cwd: srcDir,
    onlyFiles: true,
    dot: false,
    absolute: false
  });
  const assets = [];
  for (const entry of entries) {
    const rel = normalizeSlashes(entry);
    if (shouldIgnoreFile(rel)) continue;
    if (hasAnySuffix(rel, pageExtensions)) continue;
    const absolutePath = path8.join(srcDir, rel);
    assets.push({
      absolutePath,
      relativePathFromSrc: rel,
      outputFileName: normalizeSlashes(toOutputFileName(rel)),
      kind: isProcessableAsset(rel) ? "process" : "copy"
    });
  }
  return assets;
}
async function copyStaticAssetSource(asset) {
  return fs5.readFile(asset.absolutePath);
}
async function buildProcessedStaticAssets(args) {
  const { root, pagesDir, assets, minify = true, sourcemap = false } = args;
  const processable = assets.filter((a) => a.kind === "process");
  const out = /* @__PURE__ */ new Map();
  if (processable.length === 0) {
    return out;
  }
  const srcDir = path8.join(root, pagesDir);
  const distDir = path8.join(root, "dist");
  const warnedMissingAssets = /* @__PURE__ */ new Set();
  const result = await esbuild.build({
    entryPoints: processable.map((a) => a.absolutePath),
    absWorkingDir: root,
    outbase: srcDir,
    outdir: distDir,
    bundle: true,
    splitting: true,
    treeShaking: true,
    minify,
    sourcemap,
    format: "esm",
    target: "esnext",
    platform: "browser",
    write: false,
    entryNames: "[dir]/[name]",
    assetNames: "[dir]/[name]",
    loader: {
      ".css": "css",
      ".png": "file",
      ".jpg": "file",
      ".jpeg": "file",
      ".gif": "file",
      ".svg": "file",
      ".webp": "file",
      ".woff": "file",
      ".woff2": "file",
      ".ttf": "file",
      ".otf": "file"
    },
    plugins: [
      {
        name: "html-pages-root-url-resolver",
        setup(build2) {
          build2.onResolve({ filter: /^\// }, (resolveArgs) => {
            if (path8.isAbsolute(resolveArgs.path) && fsSync.existsSync(resolveArgs.path)) {
              return { path: resolveArgs.path };
            }
            const cleanPath = resolveArgs.path.slice(1);
            const fromSrc = path8.join(srcDir, cleanPath);
            if (fsSync.existsSync(fromSrc)) {
              return { path: fromSrc };
            }
            const fromPublic = path8.join(root, "public", cleanPath);
            if (fsSync.existsSync(fromPublic)) {
              return {
                path: resolveArgs.path,
                external: true
              };
            }
            const isCssUrlToken = resolveArgs.kind === "url-token";
            if (isCssUrlToken) {
              if (!warnedMissingAssets.has(resolveArgs.path)) {
                warnedMissingAssets.add(resolveArgs.path);
                console.warn(
                  `[sitelo] \u26A0\uFE0F Missing CSS asset: ${resolveArgs.path}
  Looked in:
  - ${fromSrc}
  - ${fromPublic}`
                );
              }
              return {
                path: resolveArgs.path,
                external: true
              };
            }
            return {
              path: fromSrc
            };
          });
        }
      }
    ]
  });
  for (const file of result.outputFiles) {
    const rel = normalizeSlashes(path8.relative(distDir, file.path));
    out.set(rel, file.text ?? file.contents);
  }
  return out;
}

// src/plugin.ts
var hasWarnedESM = false;
var pluginDir = path9.dirname(fileURLToPath2(import.meta.url));
function warnIfNotESM(root) {
  try {
    const pkgPath = path9.join(root, "package.json");
    if (!fs6.existsSync(pkgPath)) return;
    const pkg = JSON.parse(fs6.readFileSync(pkgPath, "utf8"));
    if (pkg.type !== "module") {
      console.warn(
        `[${PLUGIN_NAME}] \u26A0\uFE0F It is recommended to add "type": "module" to your package.json for optimal performance and to avoid Node ESM warnings.`
      );
    }
  } catch {
  }
}
function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function chunkArray(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
var DEFAULT_404_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>404 - Page Not Found</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        font-family: system-ui, sans-serif;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
      }
      main {
        max-width: 40rem;
        text-align: center;
      }
      h1 {
        font-size: 3rem;
        margin: 0 0 1rem;
      }
      p {
        margin: 0.5rem 0;
        line-height: 1.5;
      }
      a {
        color: inherit;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>Page not found.</p>
      <p><a href="/">Go back home</a></p>
    </main>
  </body>
</html>
`;
function isHtJsxFile(id) {
  return id.endsWith(".ht.jsx") || id.endsWith(".html.jsx") || id.endsWith(".ht.tsx") || id.endsWith(".html.tsx");
}
function isHtTsxFile(id) {
  return id.endsWith(".ht.tsx") || id.endsWith(".html.tsx");
}
function isHtJsxImporter(importer) {
  if (!importer) return false;
  const normalized = importer.split("?")[0].replace(/\\/g, "/");
  return isHtJsxFile(normalized);
}
function htPages(options = {}) {
  let root = process.cwd();
  let server = null;
  let devPages = [];
  let watcherAttached = false;
  let userConfigFile;
  let resolvedMode = "production";
  let buildPipelinePromise = null;
  const cleanUrls = options.cleanUrls ?? true;
  const pagesDir = options.pagesDir ?? "src";
  const pageExtensions = options.pageExtensions?.length ? options.pageExtensions : DEFAULT_PAGE_EXTENSIONS;
  function logDebug(enabled, ...args) {
    if (!enabled) return;
    console.log(`[${PLUGIN_NAME}]`, ...args);
  }
  async function loadDevPages() {
    const entries = await discoverEntryPages(root, options);
    await writePageTypeDeclarations({
      root,
      pagesDir,
      entries
    });
    const modulesByEntry = /* @__PURE__ */ new Map();
    logDebug(
      options.debug,
      "discovered entries",
      entries.map((e) => e.relativePath)
    );
    if (!server) return [];
    const loader = await createPageModuleLoader({
      mode: "dev",
      root,
      server
    });
    for (const entry of entries) {
      const mod = await loader.loadModule(entry.entryPath, entry.relativePath);
      modulesByEntry.set(entry.entryPath, mod);
    }
    devPages = await buildPageIndex({
      entries,
      modulesByEntry,
      cleanUrls
    });
    logDebug(
      options.debug,
      "dev pages",
      devPages.map((p) => `${p.routePath} -> ${p.relativePath}`)
    );
    return devPages;
  }
  async function createBuildPipeline() {
    const entries = await discoverEntryPages(root, options);
    await writePageTypeDeclarations({
      root,
      pagesDir,
      entries
    });
    const loader = await createPageModuleLoader({
      mode: "build",
      root,
      getPages: async () => entries,
      configFile: userConfigFile,
      configMode: resolvedMode
    });
    try {
      const modulesByEntry = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        const mod = await loader.loadModule(
          entry.entryPath,
          entry.relativePath
        );
        modulesByEntry.set(entry.entryPath, mod);
      }
      const pages = await buildPageIndex({
        entries,
        modulesByEntry,
        cleanUrls
      });
      return { entries, modulesByEntry, pages, closeLoader: loader.close };
    } catch (error) {
      await loader.close();
      throw error;
    }
  }
  function getBuildPipeline() {
    if (!buildPipelinePromise) {
      buildPipelinePromise = createBuildPipeline();
    }
    return buildPipelinePromise;
  }
  async function closeBuildPipeline() {
    const pending = buildPipelinePromise;
    buildPipelinePromise = null;
    if (!pending) return;
    try {
      const pipeline = await pending;
      await pipeline.closeLoader();
    } catch {
    }
  }
  return {
    name: PLUGIN_NAME,
    config(userConfig, env) {
      if (env.command !== "build") return;
      const hasExplicitInput = userConfig.build?.rollupOptions?.input != null;
      if (hasExplicitInput) return;
      return {
        build: {
          rollupOptions: {
            input: VIRTUAL_BUILD_ENTRY_ID
          }
        }
      };
    },
    resolveId(id, importer) {
      if (id === VIRTUAL_BUILD_ENTRY_ID) {
        return id;
      }
      if (id === VIRTUAL_PAGE_HELPER_ID && importer) {
        return `${RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX}${importer}`;
      }
      if (id === VIRTUAL_JSX_RUNTIME_ID) {
        return RESOLVED_VIRTUAL_JSX_RUNTIME_ID;
      }
      if (id === VIRTUAL_JSX_DEV_RUNTIME_ID) {
        return RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID;
      }
      if (isHtJsxImporter(importer)) {
        if (id === "react/jsx-runtime") {
          return RESOLVED_VIRTUAL_JSX_RUNTIME_ID;
        }
        if (id === "react/jsx-dev-runtime") {
          return RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID;
        }
      }
      if (importer && isLocalPageTypesImport(id)) {
        return `${VIRTUAL_LOCAL_TYPES_PREFIX}${importer}::${id}`;
      }
      return null;
    },
    async load(id) {
      if (id === VIRTUAL_BUILD_ENTRY_ID) {
        return "export default {};";
      }
      if (id === RESOLVED_VIRTUAL_JSX_RUNTIME_ID) {
        return `
export { Fragment, jsx, jsxs, jsxDEV } from ${JSON.stringify(
          pathToFileURL(path9.join(pluginDir, "jsx-runtime.js")).href
        )};
`;
      }
      if (id === RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID) {
        return `
export { Fragment, jsx, jsxs, jsxDEV } from ${JSON.stringify(
          pathToFileURL(path9.join(pluginDir, "jsx-dev-runtime.js")).href
        )};
`;
      }
      if (id.startsWith(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX)) {
        const importer = id.slice(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX.length);
        const entries = await discoverEntryPages(root, options);
        const normalizedImporter = path9.resolve(importer);
        const page = entries.find(
          (candidate) => path9.resolve(candidate.absolutePath) === normalizedImporter
        );
        return generateTypedPageHelper(page);
      }
      if (id.startsWith(VIRTUAL_LOCAL_TYPES_PREFIX)) {
        return `
export {
  definePage,
  defineData,
  defineStaticParams,
  definePageModule
} from 'sitelo/page';
`;
      }
      return null;
    },
    async transform(code, id) {
      const normalizedId = id.split("?")[0].replace(/\\/g, "/");
      if (!isHtJsxFile(normalizedId)) {
        return null;
      }
      const result = await esbuildTransform(code, {
        loader: isHtTsxFile(normalizedId) ? "tsx" : "jsx",
        format: "esm",
        jsx: "automatic",
        jsxImportSource: "sitelo",
        sourcemap: true,
        sourcefile: normalizedId,
        target: "esnext"
      });
      return {
        code: result.code,
        map: result.map
      };
    },
    configResolved(resolved) {
      root = options.root ? path9.resolve(resolved.root, options.root) : resolved.root;
      userConfigFile = resolved.configFile ?? void 0;
      resolvedMode = resolved.mode;
      if (!hasWarnedESM) {
        warnIfNotESM(root);
        hasWarnedESM = true;
      }
    },
    async buildStart() {
      await closeBuildPipeline();
      const entries = await discoverEntryPages(root, options);
      for (const entry of entries) {
        this.addWatchFile(entry.entryPath);
      }
      const staticAssets = await collectStaticAssets({
        root,
        pagesDir,
        pageExtensions
      });
      for (const asset of staticAssets) {
        this.addWatchFile(asset.absolutePath);
      }
      logDebug(
        options.debug,
        "static assets",
        staticAssets.map((asset) => ({
          kind: asset.kind,
          input: asset.relativePathFromSrc,
          output: asset.outputFileName
        }))
      );
    },
    configureServer(_server) {
      server = _server;
      installDevServer({
        server,
        root,
        pagesDir,
        getPages: async () => {
          if (devPages.length > 0) return devPages;
          return loadDevPages();
        },
        getEntries: async () => discoverEntryPages(root, options)
      });
      if (!watcherAttached) {
        watcherAttached = true;
        const reloadAfterChange = async (file) => {
          logDebug(options.debug, "file changed", file);
          try {
            await loadDevPages();
            server?.ws.send({
              type: "full-reload",
              path: "*"
            });
          } catch (error) {
            server?.config.logger.error(
              formatDevPageError({
                error,
                root,
                phase: "reload",
                debug: options.debug
              })
            );
          }
        };
        const pagesRoot = path9.join(root, pagesDir);
        const reload = (file) => {
          const relative = path9.relative(pagesRoot, file);
          if (relative === "" || relative.startsWith("..") || path9.isAbsolute(relative) || relative.split(path9.sep).includes("node_modules")) {
            return;
          }
          void reloadAfterChange(file);
        };
        server.watcher.on("add", reload);
        server.watcher.on("change", reload);
        server.watcher.on("unlink", reload);
      }
      void loadDevPages().catch((error) => {
        server?.config.logger.error(
          formatDevPageError({
            error,
            root,
            phase: "load",
            debug: options.debug
          })
        );
      });
    },
    async generateBundle(_, bundle) {
      try {
        const { modulesByEntry, pages } = await getBuildPipeline();
        logDebug(
          options.debug,
          "emitting pages",
          pages.map((p) => p.fileName)
        );
        const limit = pLimit(options.renderConcurrency ?? 8);
        const batchSize = options.renderBatchSize ?? Math.max(options.renderConcurrency ?? 8, 32);
        const renderedPages = [];
        for (const batch of chunkArray(pages, batchSize)) {
          await Promise.all(
            batch.map(
              (page) => limit(async () => {
                const mod = modulesByEntry.get(page.entryPath);
                if (!mod) {
                  throw new Error(
                    `[${PLUGIN_NAME}] Missing module for page entry: ${page.entryPath}`
                  );
                }
                const html = await renderPage(page, mod, false);
                validateHtmlAssetReferences({
                  root,
                  pagesDir,
                  html,
                  pluginName: PLUGIN_NAME,
                  pageLabel: page.relativePath,
                  missingAssets: options.missingAssets ?? "error"
                });
                renderedPages.push({ page, html });
              })
            )
          );
        }
        const rendered404 = renderedPages.find(
          (rendered) => rendered.page.routePath === "/404"
        );
        const notFoundHtml = rendered404?.html ?? DEFAULT_404_HTML;
        logDebug(
          options.debug,
          rendered404 ? "generated 404.html from user page" : "generated default 404.html"
        );
        const referencedUrls = /* @__PURE__ */ new Set();
        for (const { html } of renderedPages) {
          for (const url of collectLocalAssetUrls(html)) {
            referencedUrls.add(url);
          }
        }
        for (const url of collectLocalAssetUrls(notFoundHtml)) {
          referencedUrls.add(url);
        }
        const staticAssets = await collectStaticAssets({
          root,
          pagesDir,
          pageExtensions
        });
        const isReferenced = (asset) => referencedUrls.has(`/${asset.outputFileName}`) || referencedUrls.has(`/${asset.relativePathFromSrc}`);
        const processableAssets = [];
        const skippedAssets = [];
        for (const asset of staticAssets) {
          if (asset.kind !== "process") continue;
          if (isReferenced(asset)) {
            processableAssets.push(asset);
          } else {
            skippedAssets.push(asset);
          }
        }
        if (skippedAssets.length > 0) {
          logDebug(
            options.debug,
            "skipping unreferenced code assets",
            skippedAssets.map((asset) => asset.relativePathFromSrc)
          );
        }
        logDebug(
          options.debug,
          "emitting static assets",
          staticAssets.filter((asset) => asset.kind === "copy" || isReferenced(asset)).map((asset) => ({
            kind: asset.kind,
            input: asset.relativePathFromSrc,
            output: asset.outputFileName
          }))
        );
        const processedOutputs = await buildProcessedStaticAssets({
          root,
          pagesDir,
          assets: processableAssets,
          minify: true,
          sourcemap: false
        });
        for (const [fileName, source] of processedOutputs) {
          this.emitFile({
            type: "asset",
            fileName,
            source
          });
        }
        for (const asset of staticAssets) {
          if (asset.kind !== "copy") continue;
          const source = await copyStaticAssetSource(asset);
          this.emitFile({
            type: "asset",
            fileName: asset.outputFileName,
            source
          });
        }
        for (const { page, html } of renderedPages) {
          this.emitFile({
            type: "asset",
            fileName: options.mapOutputPath?.(page) ?? page.fileName,
            source: html
          });
        }
        this.emitFile({
          type: "asset",
          fileName: "404.html",
          source: notFoundHtml
        });
        const sitemapBase = (options.site ?? "").replace(/\/+$/, "");
        const sitemapRoutes = [...new Set(pages.map((p) => p.routePath))].filter(
          (route) => !route.includes(":") && !route.includes("*")
        );
        if (sitemapBase && sitemapRoutes.length > 0) {
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(
            (route) => `  <url><loc>${escapeXml(`${sitemapBase}${route}`)}</loc></url>`
          ).join("\n")}
</urlset>
`;
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: sitemap
          });
          logDebug(options.debug, "generated sitemap.xml");
        }
        const rss = options.rss;
        if (rss?.site) {
          const routePrefix = rss.routePrefix ?? "/blog";
          const rssSite = rss.site.replace(/\/+$/, "");
          const rssItems = pages.filter((page) => page.routePath.startsWith(routePrefix)).map((page) => {
            const url = escapeXml(`${rssSite}${page.routePath}`);
            return `  <item>
    <title>${escapeXml(page.routePath)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
  </item>`;
          }).join("\n");
          const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(rss.title ?? PLUGIN_NAME)}</title>
  <link>${escapeXml(rssSite)}</link>
  <description>${escapeXml(rss.description ?? "RSS feed")}</description>
${rssItems}
</channel>
</rss>
`;
          this.emitFile({
            type: "asset",
            fileName: "rss.xml",
            source: rssXml
          });
          logDebug(options.debug, "generated rss.xml");
        }
        for (const [fileName, output] of Object.entries(bundle)) {
          if (output.type === "chunk" && output.facadeModuleId === VIRTUAL_BUILD_ENTRY_ID) {
            delete bundle[fileName];
          }
        }
      } finally {
        await closeBuildPipeline();
      }
    },
    async buildEnd(error) {
      if (error) {
        await closeBuildPipeline();
      }
    },
    async closeBundle() {
      await closeBuildPipeline();
    }
  };
}

// src/fetch-cache.ts
import fs7 from "fs/promises";
import path10 from "path";
import { createHash } from "crypto";
var memoryCache = /* @__PURE__ */ new Map();
function createDefaultCacheKey(input, init) {
  const raw = JSON.stringify({
    url: String(input),
    method: init?.method ?? "GET",
    headers: init?.headers ?? {},
    body: init?.body ?? null
  });
  return createHash("sha256").update(raw).digest("hex");
}
var SAFE_FILE_KEY_RE = /^[A-Za-z0-9._-]{1,200}$/;
function toSafeFileKey(cacheKey) {
  if (SAFE_FILE_KEY_RE.test(cacheKey)) {
    return cacheKey;
  }
  return createHash("sha256").update(cacheKey).digest("hex");
}
function getCacheFilePath(cacheKey) {
  return path10.join(
    process.cwd(),
    CACHE_DIR_NAME,
    "fetch",
    `${toSafeFileKey(cacheKey)}.json`
  );
}
function getEffectiveCacheMode(mode) {
  if (mode === "memory" || mode === "fs" || mode === "none") {
    return mode;
  }
  return process.env.NODE_ENV === "production" ? "fs" : "memory";
}
var BODY_ENCODING_HEADERS = /* @__PURE__ */ new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding"
]);
function sanitizeHeaders(headers) {
  return [...headers.entries()].filter(
    ([name]) => !BODY_ENCODING_HEADERS.has(name.toLowerCase())
  );
}
function toResponse(cached) {
  return new Response(cached.body, {
    status: cached.status,
    statusText: cached.statusText,
    headers: cached.headers
  });
}
function isFresh(cached, maxAgeSeconds) {
  const ageSeconds = (Date.now() - cached.timestamp) / 1e3;
  return ageSeconds <= maxAgeSeconds;
}
async function fetchWithCache(input, init, options = {}) {
  const maxAge = options.maxAge ?? 60 * 60;
  const method = (init?.method ?? "GET").toUpperCase();
  if (method !== "GET" && !options.cacheKey) {
    return fetch(input, init);
  }
  const cacheMode = getEffectiveCacheMode(options.cache);
  const cacheKey = options.cacheKey ?? createDefaultCacheKey(input, init);
  if (cacheMode === "none") {
    return fetch(input, init);
  }
  if (cacheMode === "memory" && !options.forceRefresh) {
    const cached = memoryCache.get(cacheKey);
    if (cached && isFresh(cached, maxAge)) {
      return toResponse(cached);
    }
  }
  const filePath = getCacheFilePath(cacheKey);
  if (cacheMode === "fs") {
    await fs7.mkdir(path10.dirname(filePath), { recursive: true });
    if (!options.forceRefresh) {
      try {
        const raw = await fs7.readFile(filePath, "utf8");
        const cached = JSON.parse(raw);
        if (isFresh(cached, maxAge)) {
          return toResponse(cached);
        }
      } catch {
      }
    }
  }
  const res = await fetch(input, init);
  const body = await res.text();
  const headers = sanitizeHeaders(res.headers);
  if (res.ok) {
    const record = {
      timestamp: Date.now(),
      status: res.status,
      statusText: res.statusText,
      headers,
      body
    };
    if (cacheMode === "memory") {
      memoryCache.set(cacheKey, record);
    } else if (cacheMode === "fs") {
      await fs7.writeFile(filePath, JSON.stringify(record), "utf8");
    }
  }
  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers
  });
}
export {
  htPages as default,
  fetchWithCache
};
//# sourceMappingURL=index.js.map