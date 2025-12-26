import { createDefaultPreset } from "ts-jest";

const presetConfig = createDefaultPreset();

export default {
  ...presetConfig,
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/build/"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },
};
