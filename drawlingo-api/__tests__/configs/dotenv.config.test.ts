import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

interface DotenvConfigModule {
  getEnvFileCandidates: (mode: string) => string[];
  loadEnvFiles: () => string[];
}

describe("dotenv.config", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let tempDir: string;

  const writeEnvFile = (name: string, content: string): void => {
    writeFileSync(join(tempDir, name), content);
  };

  const loadModule = (): DotenvConfigModule =>
    jest.requireActual<DotenvConfigModule>("@/configs/dotenv.config");

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    tempDir = mkdtempSync(join(tmpdir(), "dotenv-config-test-"));
    jest.spyOn(process, "cwd").mockReturnValue(tempDir);
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
    jest.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("getEnvFileCandidates", () => {
    it("should return the four candidates in precedence order for development", () => {
      const { getEnvFileCandidates } = loadModule();

      const candidates: string[] = getEnvFileCandidates("development");

      expect(candidates).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
    });

    it("should return the four candidates in precedence order for production", () => {
      const { getEnvFileCandidates } = loadModule();

      const candidates: string[] = getEnvFileCandidates("production");

      expect(candidates).toEqual([
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env",
      ]);
    });

    it("should return only the two test candidates for test", () => {
      const { getEnvFileCandidates } = loadModule();

      const candidates: string[] = getEnvFileCandidates("test");

      expect(candidates).toEqual([".env.test.local", ".env.test"]);
    });
  });

  describe("loadEnvFiles", () => {
    it("should return an empty list when no env files exist", () => {
      process.env.NODE_ENV = "development";
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([]);
    });

    it("should load variables from .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env");
    });

    it("should not override variables already present in process.env", () => {
      process.env.NODE_ENV = "development";
      process.env.DOTENV_TEST_KEY = "from-process";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-file");
      const { loadEnvFiles } = loadModule();

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_KEY).toBe("from-process");
    });

    it("should prefer .env.local over .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-local");
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.local", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-local");
    });

    it("should prefer .env.<mode> over .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-mode");
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.development", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-mode");
    });

    it("should prefer .env.local over .env.<mode>", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-local");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-mode");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.local", ".env.development"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-local");
    });

    it("should prefer .env.<mode>.local over every other file", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.development.local", "DOTENV_TEST_KEY=from-mode-local");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-local");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-mode");
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-mode-local");
    });

    it("should prefer the NODE_ENV of the process over the one declared in files", () => {
      process.env.NODE_ENV = "production";
      writeEnvFile(".env", "NODE_ENV=development");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-production");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-development");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.production", ".env"]);
    });

    it("should resolve the mode from the NODE_ENV declared in .env", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env", "NODE_ENV=production");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-production");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.production", ".env"]);
      expect(process.env.NODE_ENV).toBe("production");
    });

    it("should prefer the NODE_ENV declared in .env.local over the one in .env", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env.local", "NODE_ENV=production");
      writeEnvFile(".env", "NODE_ENV=development");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-production");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.local", ".env.production", ".env"]);
      expect(process.env.NODE_ENV).toBe("production");
    });

    it("should default the mode to development when NODE_ENV is not declared anywhere", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-development");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.development"]);
    });

    it("should ignore .env and .env.local in test mode but load .env.test", () => {
      process.env.NODE_ENV = "test";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-local");
      writeEnvFile(".env.test", "DOTENV_TEST_KEY=from-test");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.test"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-test");
    });

    it("should prefer .env.test.local over .env.test in test mode", () => {
      process.env.NODE_ENV = "test";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.test.local", "DOTENV_TEST_KEY=from-test-local");
      writeEnvFile(".env.test", "DOTENV_TEST_KEY=from-test");
      const { loadEnvFiles } = loadModule();

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.test.local", ".env.test"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-test-local");
    });
  });
});
