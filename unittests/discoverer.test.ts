// There is a "manual mock" in the directory `__mocks__`, `vscode.js`, which is a Jest special
// feature. That mock is required to override Jests attempt to load a real `vscode` module
// otherwise. An option would have been to have mock factories in each test file but that would
// have polluted the code with a lot of unimportant boiler plate code.
jest.mock("vscode");

// We can still control the mocked `vscode` using for example
//     - mockImplementation()
//     - mockResolvedValue()


import { discoverCgreenFiles } from "../src/discoverer";

// Imports of things that will be mocked need to be done in exactly the same way as in the Unit Under Test
import * as vscode from "vscode";

import * as child_process from "child_process";
jest.mock("child_process");

const mockedWorkspaceFolder: vscode.WorkspaceFolder = {
    uri: {
        scheme: "file",
        path: "/path/to/mocked/workspace",
        toString: () => "/path/to/mocked/workspace",
    } as vscode.Uri,
    name: "MockedWorkspace",
    index: 0,
};

afterEach(() => {
    jest.resetAllMocks();
});

describe("Discoverer Module", () => {
    it("should discover no files in a workspace without files", async () => {
        (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([]);
        expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
    });
    it("should discover no files in a workspace no .so files", async () => {
        (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([
            vscode.Uri.file("a.exe"),
        ]);
        expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
    });

    it("should not discover any .so file as a Cgreen test file if it has no tests", async () => {
        // Mock findFiles to return .so files
        (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([
            vscode.Uri.file("a.so"),
        ]);

        // Mock exec to simulate cgreen-runner not finding tests
        jest.spyOn(child_process, "exec").mockImplementationOnce(
            (
                _command: any,
                _options: any,
                callback: ((
                          error: any,
                          stdout: string | Buffer,
                          stderr: string | Buffer
                      ) => void)
                    | undefined
            ) => {
                // Simulate output indicating no tests are found
                callback!(null, "No tests found in ...", "");
                return {} as child_process.ChildProcess;
            }
        );

        const discoveredFiles = await discoverCgreenFiles(
            mockedWorkspaceFolder
        );

        // Assertions
        expect(discoveredFiles).toHaveLength(0);
    });
    
});
