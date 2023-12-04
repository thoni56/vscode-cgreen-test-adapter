import * as sinon from 'sinon';

import { discoverCgreenTestFiles } from "../src/discoverer";

import * as vscode from "vscode";
import * as child_process from "child_process";

let findFilesStub: sinon.SinonStub;
let execStub: sinon.SinonStub;

beforeEach(() => {
  // Create a Sinon stub for the findFiles method
  findFilesStub = sinon.stub(vscode.workspace, 'findFiles');
  execStub = sinon.stub(child_process, 'exec');
});

afterEach(() => {
  // Restore the original methods
  findFilesStub.restore();
  execStub.restore();
});


const mockedWorkspaceFolder: vscode.WorkspaceFolder = {
    uri: {
        scheme: "file",
        path: "/path/to/mocked/workspace",
        toString: () => "/path/to/mocked/workspace",
    } as vscode.Uri,
    name: "MockedWorkspace",
    index: 0,
};


describe("Discoverer Module", () => {
    it("should discover no files in a workspace without files", async () => {
        findFilesStub.resolves([]);
        expect(await discoverCgreenTestFiles(mockedWorkspaceFolder)).toEqual([]);
    });

    it("should discover no files in a workspace with no .so files", async () => {
        findFilesStub.resolves([vscode.Uri.file("non-cgreen.exe")]);
        expect(await discoverCgreenTestFiles(mockedWorkspaceFolder)).toEqual([]);
    });

    it("should not discover any .so file as a Cgreen test file if it has no tests", async () => {
        // Mock findFiles to return .so files
        findFilesStub.resolves([vscode.Uri.file("non_cgreen_file.so")]);

        // Mock exec to simulate cgreen-runner not finding tests
        execStub.yields(null, "No tests found");

        const discoveredFiles = await discoverCgreenTestFiles(
            mockedWorkspaceFolder
        );

        // Assertions
        expect(discoveredFiles).toHaveLength(0);
    });
    
    it("should discover one .so file as a Cgreen test file if it has tests", async () => {
        execStub.callsFake((command: string, ...args: any[]) => {
            // Exec is overloaded so we can't use a single signature,
            // collect all variants and pull out the callback...
            const callback = args.find(arg => typeof arg === 'function'); 

            if (command.includes('non_cgreen_file.so')) {
              callback(null, 'No tests found', '');
            } else if (command.includes('cgreen_tests.so')) {
              callback(null, 'Running "cgreen_tests" (38 tests)...\n  "Options": 94 passes, 2 skipped in 20ms.\nCompleted "cgreen_tests": 94 passes, 2 skipped in 20ms.', ''); 
            }
        });
        
        // Mock findFiles to return .so files
        findFilesStub.resolves([vscode.Uri.file("non_cgreen_file.so"), vscode.Uri.file("cgreen_tests.so")]);

        const discoveredFiles = await discoverCgreenTestFiles(
            mockedWorkspaceFolder
        );

        // Assertions
        expect(discoveredFiles).toHaveLength(1);
        expect(discoveredFiles[0].path).toEqual("cgreen_tests.so");
    });  
});
