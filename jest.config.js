/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["./src/*"],
  //setupFilesAfterEnv: ["./jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        "ts-jest": {
          tsconfig: "tsconfig.json",
        },
      },
    ],
  },
};
