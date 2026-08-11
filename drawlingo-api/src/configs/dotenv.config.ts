import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "dotenv";

const DEFAULT_MODE = "development";

const readEnvFile = (file: string): Record<string, string> | null => {
  try {
    return parse(readFileSync(resolve(process.cwd(), file)));
  } catch {
    return null;
  }
};

const resolveMode = (): string => {
  const processMode = process.env.NODE_ENV?.trim();
  if (processMode) return processMode;

  for (const file of [".env.local", ".env"]) {
    const fileMode = readEnvFile(file)?.NODE_ENV?.trim();
    if (fileMode) return fileMode;
  }

  return DEFAULT_MODE;
};

export const getEnvFileCandidates = (mode: string): string[] => {
  if (mode === "test") return [".env.test.local", ".env.test"];

  return [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];
};

export const loadEnvFiles = (): string[] => {
  const mode = resolveMode();
  const loadedFiles: string[] = [];

  for (const file of getEnvFileCandidates(mode)) {
    const parsed = readEnvFile(file);
    if (!parsed) continue;

    for (const [key, value] of Object.entries(parsed)) {
      process.env[key] ??= value;
    }

    loadedFiles.push(file);
  }

  return loadedFiles;
};
