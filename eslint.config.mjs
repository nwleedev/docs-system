import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".worktrees/**", "node_modules/**", "temps/**"],
  },
  {
    name: "eslint-config",
    files: ["eslint.config.mjs"],
    extends: [js.configs.recommended],
  },
  {
    name: "node-mjs-scripts",
    files: ["skills/use-words-review/scripts/**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    rules: {
      "array-callback-return": "error",
      "eqeqeq": ["error", "always"],
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-param-reassign": ["error", { props: true }],
      "no-var": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "node:child_process",
              allowImportNames: ["execFile", "spawnSync"],
              message: "Import only execFile and spawnSync from node:child_process.",
            },
            {
              name: "child_process",
              message: "Import the required API from node:child_process.",
            },
            {
              name: "node:process",
              allowImportNames: ["default"],
              message: "Import node:process only as the default process binding.",
            },
          ],
          patterns: [
            {
              regex: "^(?!node:(?:assert/strict|buffer|child_process|fs|fs/promises|path|process|url|util)$)",
              message: "Import only the Node.js built-ins required by this scanner.",
            },
          ],
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "abort",
          message: "Set process.exitCode and let streams finish.",
        },
        {
          object: "process",
          property: "execve",
          message: "Do not replace the running scanner process.",
        },
        {
          object: "process",
          property: "exit",
          message: "Set process.exitCode and let streams finish.",
        },
        {
          object: "process",
          property: "getBuiltinModule",
          message: "Keep imports static and auditable.",
        },
        {
          object: "process",
          property: "kill",
          message: "Let the operating system preserve signal termination.",
        },
        {
          object: "globalThis",
          property: "process",
          message: "Import node:process statically and keep restricted calls visible.",
        },
        {
          object: "globalThis",
          property: "Function",
          message: "Do not execute source text as code.",
        },
        {
          object: "globalThis",
          property: "fetch",
          message: "The scanner must not access the network.",
        },
        {
          object: "globalThis",
          property: "WebSocket",
          message: "The scanner must not access the network.",
        },
        {
          object: "globalThis",
          property: "console",
          message: "Write only the scanner's defined stdout and stderr formats.",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > VariableDeclaration[kind='let']",
          message: "Keep mutable state inside a call.",
        },
        {
          selector: "Program > ExportNamedDeclaration > VariableDeclaration[kind='let']",
          message: "Keep mutable state inside a call.",
        },
        {
          selector: "ImportExpression",
          message: "Keep imports static and limited to Node.js built-ins.",
        },
        {
          selector: "MemberExpression[object.type='MetaProperty'][object.meta.name='import'][computed=false][property.name='main']",
          message: "import.meta.main requires Node.js 22.18.0.",
        },
        {
          selector: "MemberExpression[object.type='MetaProperty'][object.meta.name='import'][computed=true][property.value='main']",
          message: "import.meta.main requires Node.js 22.18.0.",
        },
        {
          selector: "MemberExpression[object.type='MetaProperty'][object.meta.name='import'][computed=true][property.type='TemplateLiteral'][property.expressions.length=0][property.quasis.0.value.cooked='main']",
          message: "import.meta.main requires Node.js 22.18.0.",
        },
        {
          selector: "VariableDeclarator[init.type='MetaProperty'][init.meta.name='import'][init.property.name='meta']",
          message: "Do not alias or destructure import.meta; use import.meta.url directly.",
        },
        {
          selector: "ImportDeclaration[source.value='node:process'] > ImportDefaultSpecifier[local.name!='process']",
          message: "Import node:process as process so restricted calls remain visible.",
        },
        {
          selector: "ImportDeclaration[source.value='node:process'] > ImportSpecifier[imported.name='default']",
          message: "Use a default import named process without import braces.",
        },
        {
          selector: "ImportDeclaration[source.value='node:process'] > ImportSpecifier[imported.value='default']",
          message: "Use a default import named process without import braces.",
        },
        {
          selector: "ImportDeclaration[source.value='node:child_process'] > ImportSpecifier[imported.name='execFile'][local.name!='execFile']",
          message: "Import execFile without an alias so restricted calls remain visible.",
        },
        {
          selector: "ImportDeclaration[source.value='node:child_process'] > ImportSpecifier[imported.value='execFile'][local.name!='execFile']",
          message: "Import execFile without an alias so restricted calls remain visible.",
        },
        {
          selector: "ImportDeclaration[source.value='node:child_process'] > ImportSpecifier[imported.name='spawnSync'][local.name!='spawnSync']",
          message: "Import spawnSync without an alias so restricted calls remain visible.",
        },
        {
          selector: "ImportDeclaration[source.value='node:child_process'] > ImportSpecifier[imported.value='spawnSync'][local.name!='spawnSync']",
          message: "Import spawnSync without an alias so restricted calls remain visible.",
        },
        {
          selector: "CallExpression[callee.name='execFile'] > ObjectExpression > Property[computed=false][key.name='shell']",
          message: "Omit the shell option for execFile.",
        },
        {
          selector: "CallExpression[callee.name='execFile'] > ObjectExpression > Property[computed=false][key.value='shell']",
          message: "Omit the shell option for execFile.",
        },
        {
          selector: "CallExpression[callee.name='spawnSync'] > ObjectExpression > Property[computed=false][key.name='shell']",
          message: "Omit the shell option for spawnSync.",
        },
        {
          selector: "CallExpression[callee.name='spawnSync'] > ObjectExpression > Property[computed=false][key.value='shell']",
          message: "Omit the shell option for spawnSync.",
        },
        {
          selector: "CallExpression[callee.name='execFile'] > ObjectExpression > Property[computed=true]",
          message: "Keep execFile options static and omit the shell option.",
        },
        {
          selector: "CallExpression[callee.name='spawnSync'] > ObjectExpression > Property[computed=true]",
          message: "Keep spawnSync options static and omit the shell option.",
        },
      ],
      "no-throw-literal": "error",
      "no-shadow": ["error", { builtinGlobals: true }],
      "no-unreachable-loop": "error",
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          caughtErrors: "all",
        },
      ],
    },
  },
]);
