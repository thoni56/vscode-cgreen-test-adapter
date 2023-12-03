import * as sinon from 'sinon';

import { discoverCgreenFiles } from "../src/discoverer";

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
        expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
    });

    it("should discover no files in a workspace with no .so files", async () => {
        findFilesStub.resolves([vscode.Uri.file("a.exe")]);
        expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
    });

    it("should not discover any .so file as a Cgreen test file if it has no tests", async () => {
        // Mock findFiles to return .so files
        findFilesStub.resolves([vscode.Uri.file("a.so")]);

        // Mock exec to simulate cgreen-runner not finding tests
        execStub.yields(null, "No tests found");

        const discoveredFiles = await discoverCgreenFiles(
            mockedWorkspaceFolder
        );

        // Assertions
        expect(discoveredFiles).toHaveLength(0);
    });    
});
