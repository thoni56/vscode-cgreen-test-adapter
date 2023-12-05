import * as sinon from 'sinon';

import { discoverCgreenTestFiles } from "../src/testFileDiscoverer";

import * as vscode from "vscode";
import * as runner from '../src/runner';

let findFilesStub: sinon.SinonStub;
let isCgreenTestFileStub: sinon.SinonStub;

beforeEach(() => {
  // Create a Sinon stub for the findFiles method
  findFilesStub = sinon.stub(vscode.workspace, 'findFiles');
  isCgreenTestFileStub = sinon.stub(runner, 'isCgreenTestFile');
});

afterEach(() => {
  // Restore the original methods
  findFilesStub.restore();
  isCgreenTestFileStub.restore();
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


describe("Test File Discoverer Module", () => {
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

        // Mock isCgreenTestFile() to simulate cgreen-runner not thinking it is a test file
        isCgreenTestFileStub.resolves(false);

        const discoveredFiles = await discoverCgreenTestFiles(
            mockedWorkspaceFolder
        );

        // Assertions
        expect(discoveredFiles).toHaveLength(0);
    });
    
    it("should discover one .so file as a Cgreen test file if it has tests", async () => {
        // Mock findFiles to return .so files
        findFilesStub.resolves([vscode.Uri.file("non_cgreen_file.so"), vscode.Uri.file("cgreen_file.so")]);
        
        isCgreenTestFileStub.withArgs("non_cgreen_file.so").resolves(false);
        isCgreenTestFileStub.withArgs("cgreen_file.so").resolves(true);

        const discoveredFiles = await discoverCgreenTestFiles(
            mockedWorkspaceFolder
        );

        // Assertions
        expect(discoveredFiles).toHaveLength(1);
        expect(discoveredFiles[0].path).toEqual("cgreen_file.so");
    });
});
