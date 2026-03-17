import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";

type Language = "javascript" | "typescript" | "python" | "css" | "html" | "json" | "rust" | "go";

/**
 * Each entry defines a language and a set of weighted pattern signals.
 * The language with the highest total score wins.
 */
const LANGUAGE_SIGNALS: Array<{
  language: Language;
  patterns: Array<{ regex: RegExp; weight: number }>;
}> = [
  {
    language: "python",
    patterns: [
      { regex: /^def\s+\w+\s*\(/m, weight: 3 },
      { regex: /^class\s+\w+.*:/m, weight: 3 },
      { regex: /if\s+__name__\s*==\s*['"]__main__['"]/m, weight: 5 },
      { regex: /^from\s+\w[\w.]+\s+import\s+/m, weight: 3 },
      { regex: /^import\s+\w[\w.]+$/m, weight: 1 },
      { regex: /:\s*$|^\s{4}/m, weight: 1 }, // colon-ended lines or 4-space indent
    ],
  },
  {
    language: "rust",
    patterns: [
      { regex: /^fn\s+\w+/m, weight: 3 },
      { regex: /^impl\s+/m, weight: 4 },
      { regex: /\blet\s+mut\b/, weight: 4 },
      { regex: /^use\s+\w[\w:]+;/m, weight: 3 },
      { regex: /->\s*\w+\s*\{/, weight: 2 }, // return type arrow
      { regex: /println!\s*\(/, weight: 3 },
    ],
  },
  {
    language: "go",
    patterns: [
      { regex: /^package\s+\w+/m, weight: 5 },
      { regex: /^func\s+\w+/m, weight: 4 },
      { regex: /^import\s+\(/, weight: 4 },
      { regex: /\bdefer\s+/, weight: 3 },
      { regex: /:=/, weight: 3 }, // short variable declaration
    ],
  },
  {
    language: "html",
    patterns: [
      { regex: /<!doctype\s+html/i, weight: 10 },
      { regex: /<html[\s>]/i, weight: 8 },
      { regex: /<\/(div|span|p|body|head|script|style)>/i, weight: 3 },
      { regex: /<[a-z]+(\s+[a-z-]+=["'].*?["'])*\s*>/i, weight: 1 },
    ],
  },
  {
    language: "css",
    patterns: [
      { regex: /^[.#]?[\w-]+\s*\{[^}]*\}/m, weight: 3 }, // selector block
      { regex: /^\s{2,}(color|background|margin|padding|font|display)\s*:/m, weight: 4 },
      { regex: /@(media|keyframes|import|charset)\b/, weight: 4 },
      { regex: /:\s*(px|em|rem|%|vh|vw|auto|none|block|flex)\b/, weight: 2 },
    ],
  },
  {
    language: "json",
    patterns: [
      { regex: /^\s*[\[{]/, weight: 1 },
      { regex: /"[\w-]+":\s*["{\[0-9tfn]/, weight: 4 }, // "key": value
      { regex: /:\s*(true|false|null)\b/, weight: 3 },
      { regex: /^\s*[\]},]\s*$/m, weight: 1 },
    ],
  },
  {
    language: "typescript",
    patterns: [
      { regex: /^interface\s+\w+/m, weight: 5 },
      { regex: /^type\s+\w+\s*=/m, weight: 5 },
      { regex: /:\s*(string|number|boolean|void|never|unknown|any)\b/, weight: 3 },
      { regex: /<[A-Z]\w*>/, weight: 2 }, // generics like Array<T>
      { regex: /as\s+\w+/, weight: 2 },
      { regex: /^(export|import)\s+(type\s+)?/m, weight: 2 },
    ],
  },
  {
    language: "javascript",
    patterns: [
      { regex: /^(const|let|var)\s+/m, weight: 2 },
      { regex: /=>\s*[\w{(]/, weight: 2 }, // arrow functions
      { regex: /^(export|import)\s+/m, weight: 2 },
      { regex: /console\.(log|warn|error)\s*\(/, weight: 3 },
      { regex: /require\s*\(['"]/, weight: 3 },
      { regex: /^function\s+\w+\s*\(/m, weight: 2 },
    ],
  },
];

const MIN_SCORE = 2; // Ignore very-weak matches

export function detectLanguage(code: string): Language {
  const scores = new Map<Language, number>();

  for (const { language, patterns } of LANGUAGE_SIGNALS) {
    const score = patterns.reduce(
      (sum, { regex, weight }) => sum + (regex.test(code) ? weight : 0),
      0
    );
    if (score >= MIN_SCORE) {
      scores.set(language, score);
    }
  }

  if (scores.size === 0) return "javascript";

  return [...scores.entries()].reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0];
}

/**
 * CodeMirror extension map — built once, reused on every call.
 * TypeScript uses javascript({ typescript: true }) per the CodeMirror API.
 */
const LANGUAGE_EXTENSIONS: Record<Language, ReturnType<typeof javascript | typeof python>> = {
  javascript: javascript({ jsx: true }),
  typescript: javascript({ typescript: true, jsx: true }),
  python: python(),
  css: css(),
  html: html(),
  json: json(),
  rust: rust(),
  go: go(),
};

export function getLanguageExtension(language: string) {
  return LANGUAGE_EXTENSIONS[language as Language] ?? LANGUAGE_EXTENSIONS.javascript;
}