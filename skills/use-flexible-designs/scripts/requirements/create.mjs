import { randomBytes } from "node:crypto";
import { mkdir, open, realpath, stat } from "node:fs/promises";
import { isAbsolute, join, relative, sep } from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";

/** @typedef {{kind: "help"} | {kind: "create", repo: string, topic: string}} Request */
/** @typedef {{directory: string, file: string, relativeFile: string}} PackagePaths */

class InputError extends Error {}

/**
 * @param {readonly string[]} args
 * @returns {Request}
 */
function parseRequest(args) {
  let parsed;
  try {
    parsed = parseArgs({
      args: [...args],
      options: {
        repo: { type: "string" },
        topic: { type: "string" },
        help: { type: "boolean" },
      },
      strict: true,
      allowPositionals: false,
      tokens: true,
    });
  } catch (error) {
    throw new InputError("Invalid arguments. Use --help for usage.", {
      cause: error,
    });
  }

  const seen = new Set();
  for (const token of parsed.tokens) {
    if (token.kind !== "option") continue;
    if (seen.has(token.name)) {
      throw new InputError("Options must not be repeated.");
    }
    seen.add(token.name);
  }

  if (parsed.values.help) {
    if (seen.size !== 1) {
      throw new InputError("Use --help without other options.");
    }
    return { kind: "help" };
  }

  const { repo, topic } = parsed.values;
  if (typeof repo !== "string" || !repo.trim() || !repo.isWellFormed()) {
    throw new InputError("Provide a nonempty --repo value.");
  }
  if (
    typeof topic !== "string" ||
    topic.length > 80 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic)
  ) {
    throw new InputError(
      "Provide --topic using 1-80 lowercase ASCII letters, digits, and single hyphens.",
    );
  }
  return { kind: "create", repo, topic };
}

/**
 * @param {string} root
 * @param {string} candidate
 * @returns {boolean}
 */
function isInside(root, candidate) {
  const location = relative(root, candidate);
  return (
    location !== "" &&
    location !== ".." &&
    !location.startsWith(`..${sep}`) &&
    !isAbsolute(location)
  );
}

/**
 * @param {string} designs
 * @param {string} topic
 * @param {string} suffix
 * @returns {PackagePaths}
 */
function packagePaths(designs, topic, suffix) {
  const name = `${topic}-${suffix}`;
  const directory = join(designs, name);
  return {
    directory,
    file: join(directory, "requirements.md"),
    relativeFile: `docs/designs/${name}/requirements.md`,
  };
}

/**
 * @param {string} repo
 * @returns {Promise<string>}
 */
async function readDesignRoot(repo) {
  try {
    const root = await realpath(repo);
    const designs = await realpath(join(root, "docs", "designs"));
    const authority = await realpath(join(designs, "README.md"));
    if (!isInside(root, designs) || !isInside(root, authority)) {
      throw new InputError("Design locations must stay inside the repository.");
    }
    if (!(await stat(authority)).isFile()) {
      throw new InputError("The design README must be a regular file.");
    }
    return designs;
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError(
      "Cannot read design locations. Provide an existing repository with docs/designs/README.md; use the skill's approval procedure if it is missing.",
      { cause: error },
    );
  }
}

/**
 * @param {PackagePaths} paths
 * @returns {Promise<string>}
 */
async function createEmptyRequirements(paths) {
  try {
    await mkdir(paths.directory);
  } catch (error) {
    throw new InputError(
      "Cannot create a new design folder. Check write permissions and retry; existing folders are preserved.",
      { cause: error },
    );
  }

  try {
    const file = await open(paths.file, "wx");
    await file.close();
  } catch (error) {
    throw new InputError(
      `Cannot finish ${paths.relativeFile}. The new folder may remain; inspect it before retrying. Nothing was removed.`,
      { cause: error },
    );
  }
  return paths.relativeFile;
}

/**
 * @param {readonly string[]} args
 * @returns {Promise<void>}
 */
async function main(args) {
  const request = parseRequest(args);
  if (request.kind === "help") {
    process.stdout.write(
      "Usage: node scripts/requirements/create.mjs --repo <root> --topic <slug>\n" +
        "Requires Node.js 22.0.0+ and an existing docs/designs/README.md.\n" +
        "Creates one new topic folder and an empty requirements.md; prints its repository-relative location.\n" +
        "Topic: 1-80 lowercase ASCII letters, digits, and single hyphens. Options may appear once.\n" +
        "Use --help alone; it creates nothing. Exit status: 0 success, 2 failure.\n" +
        "Existing files are never replaced. A failed creation may leave its new folder; no automatic cleanup is performed.\n",
    );
    return;
  }
  const designs = await readDesignRoot(request.repo);
  const paths = packagePaths(designs, request.topic, randomBytes(3).toString("hex"));
  const created = await createEmptyRequirements(paths);
  process.stdout.write(`${created}\n`);
}

process.exitCode = 2;
try {
  await main(process.argv.slice(2));
  process.exitCode = 0;
} catch (error) {
  const message = error instanceof InputError ? error.message : "Creation failed.";
  process.stderr.write(`${message}\n`);
}
