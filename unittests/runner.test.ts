import * as sinon from "sinon";

import * as child_process from "child_process";

import { isCgreenTestFile } from "../src/runner";

let execStub: sinon.SinonStub;

beforeEach(() => {
    // Create a Sinon stub for the findFiles method
    execStub = sinon.stub(child_process, "exec");
    execStub.callsFake((command: string, ...args: any[]) => {
      // Exec is overloaded so we can't use a single signature,
      // collect all variants and pull out the callback...
      const callback = args.find((arg) => typeof arg === "function");

      // Use naming as indicator of what to return
      if (command.includes("non_cgreen_file.so")) {
          callback(null, "No tests found", "");
      } else if (command.includes("cgreen_file.so")) {
          callback(
              null,
              'Running "cgreen_tests" (38 tests)...\n  "Options": 94 passes, 2 skipped in 20ms.\nCompleted "cgreen_tests": 94 passes, 2 skipped in 20ms.',
              ""
          );
      }
  });
});

afterEach(() => {
    // Restore the original methods
    execStub.restore();
});

describe("Runner Module", () => {
    it("should not indicate that an .so file is a Cgreen test file if doesn't have tests", async () => {
        expect(await isCgreenTestFile("non_cgreen_file.so")).toBeFalsy();
    });
    it("should indicate that an .so file is a Cgreen test file if it has tests", async () => {
      expect(await isCgreenTestFile("cgreen_file.so")).toBeTruthy();
  });
});
