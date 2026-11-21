// @ts-check

import { mkdir, open, rmdir, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

/** @typedef {readonly [english: string, korean: string]} Message */
/** @typedef {{ name: string, description: string, outputDir: string }} Options */
/** @typedef {{ kind: 'help' } | { kind: 'error', message: Message } | { kind: 'create', options: Options }} Command */

const resourceDirectories = ["scripts", "references", "assets"];

/** @type {Message[]} */
const help = [
  [
    "Usage: node scripts/create.mjs --name <name> --description <text> [--output-dir <path>]",
    "사용법: node scripts/create.mjs --name <이름> --description <설명> [--output-dir <스킬의 위치>]",
  ],
  [
    "  --name <name>          Skill name and directory name.",
    "  --name <이름>          스킬 이름과 디렉터리 이름입니다.",
  ],
  [
    "  --description <text>   Non-empty description of the skill and when to use it.",
    "  --description <설명>   스킬의 기능과 적용 상황을 담은 설명입니다.",
  ],
  [
    "  --output-dir <path>    Parent directory (default: ~/.agents/skills).",
    "  --output-dir <스킬의 위치>    상위 디렉터리입니다(기본값: ~/.agents/skills).",
  ],
  [
    "  -h, --help             Show this help.",
    "  -h, --help             도움말을 표시합니다.",
  ],
  [
    'Example: node scripts/create.mjs --name code-review --description "Review written code."',
    '예시: node scripts/create.mjs --name code-review --description "작성한 코드를 리뷰한다."',
  ],
];

/**
 * @param {string} name
 * @param {string} description
 * @param {string} outputDir
 * @returns {Message | undefined}
 */
function validateOptions(name, description, outputDir) {
  if (
    name.length > 64 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name) ||
    name !== name.trim()
  ) {
    return [
      "Provide a valid --name with 1 to 64 lowercase ASCII letters, digits, or single internal hyphens.",
      "--name에 영문 소문자, 숫자, 내부의 단일 하이픈으로 이루어진 1~64자 이름을 지정하세요.",
    ];
  }

  if (description.trim().length === 0 || [...description].length > 1024) {
    return [
      "Provide a non-empty --description of at most 1024 characters.",
      "--description에 공백만으로 이루어지지 않은 1024자 이하의 설명을 지정하세요.",
    ];
  }

  if (outputDir.trim().length === 0 || outputDir.includes("\0")) {
    return [
      "Provide a valid --output-dir path.",
      "--output-dir에 유효한 스킬의 위치를 지정하세요.",
    ];
  }
}

/**
 * @param {string[]} args
 * @param {string} defaultOutputDir
 * @returns {Command}
 */
function readCommand(args, defaultOutputDir) {
  try {
    const { values } = parseArgs({
      args,
      options: {
        name: { type: "string" },
        description: { type: "string" },
        "output-dir": { type: "string" },
        help: { type: "boolean", short: "h" },
      },
    });

    if (values.help) {
      return { kind: "help" };
    }

    const name = values.name ?? "";
    const description = values.description ?? "";
    const outputDir = values["output-dir"] ?? defaultOutputDir;
    const message = validateOptions(name, description, outputDir);
    if (message) {
      return { kind: "error", message };
    }

    return { kind: "create", options: { name, description, outputDir } };
  } catch {
    return {
      kind: "error",
      message: [
        "Invalid command arguments. Use --help to see the available options.",
        "명령 인자가 올바르지 않습니다. --help로 사용 가능한 옵션을 확인하세요.",
      ],
    };
  }
}

/**
 * @param {string} outputDir
 * @param {string} name
 * @param {string} workingDir
 * @returns {string}
 */
function skillPath(outputDir, name, workingDir) {
  return resolve(workingDir, outputDir, name);
}

/**
 * @param {string} value
 * @returns {string}
 */
function yamlString(value) {
  return JSON.stringify(value).replace(
    /[\u007f-\u009f\u2028\u2029\ufffe\uffff]/gu,
    (character) => {
      return "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0");
    }
  );
}

/**
 * @param {string} name
 * @param {string} description
 * @returns {string}
 */
function frontmatter(name, description) {
  return [
    "---",
    `name: ${yamlString(name)}`,
    `description: ${yamlString(description)}`,
    "---",
    "",
  ].join("\n");
}

/**
 * @param {string} directory
 * @param {string} content
 * @returns {Promise<Message | undefined>}
 */
async function createSkill(directory, content) {
  try {
    await mkdir(resolve(directory, ".."), { recursive: true });
    await mkdir(directory);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "EEXIST" &&
      "path" in error &&
      error.path === directory
    ) {
      return [
        `Skill path already exists: ${directory}`,
        `해당 스킬이 이미 존재합니다: ${directory}`,
      ];
    }

    return [
      `Could not create the skill directory: ${directory}`,
      `스킬 디렉터리를 만들 수 없습니다: ${directory}`,
    ];
  }

  const createdDirectories = [];
  const skillFile = join(directory, "SKILL.md");
  let createdFile = false;

  try {
    for (const name of resourceDirectories) {
      const resourcePath = join(directory, name);
      await mkdir(resourcePath);
      createdDirectories.push(resourcePath);
    }

    const file = await open(skillFile, "wx");
    createdFile = true;
    try {
      await file.writeFile(content, "utf8");
    } finally {
      await file.close();
    }
  } catch {
    try {
      if (createdFile) {
        await unlink(skillFile);
      }
      for (const resourcePath of createdDirectories.reverse()) {
        await rmdir(resourcePath);
      }
      await rmdir(directory);
    } catch {
      return [
        `Skill creation failed. The incomplete directory could not be removed: ${directory}`,
        `스킬 생성에 실패했습니다. 미완성 디렉터리를 정리하지 못했습니다: ${directory}`,
      ];
    }

    return [
      `Skill creation failed. The incomplete directory was removed: ${directory}`,
      `스킬 생성에 실패했습니다. 미완성 디렉터리를 정리했습니다: ${directory}`,
    ];
  }
}

/**
 * @param {Message} message
 * @returns {string}
 */
function formatMessage([english, korean]) {
  return `${english}\n${korean}`;
}

/** @returns {Promise<void>} */
async function main() {
  const command = readCommand(
    process.argv.slice(2),
    join(homedir(), ".agents", "skills")
  );
  if (command.kind === "help") {
    console.log(help.map(formatMessage).join("\n"));
    return;
  }

  if (command.kind === "error") {
    console.error(formatMessage(command.message));
    process.exitCode = 1;
    return;
  }

  const { name, description, outputDir } = command.options;
  const directory = skillPath(outputDir, name, process.cwd());
  const failure = await createSkill(directory, frontmatter(name, description));
  if (failure) {
    console.error(formatMessage(failure));
    process.exitCode = 1;
    return;
  }

  console.log(
    formatMessage([
      `Created skill: ${directory}`,
      `스킬을 생성했습니다: ${directory}`,
    ])
  );
}

await main();
