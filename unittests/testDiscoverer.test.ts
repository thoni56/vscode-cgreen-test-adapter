import * as sinon from 'sinon';

// Mocked modules, need to import the complete module for sinon mocks
import * as testFileDiscoverer from "../src/testFileDiscoverer";
import * as vscode from "vscode";

// Unit under test
import { discoverTests } from "../src/testDiscoverer";

let discoverCgreenTestFileStub: sinon.SinonStub;

beforeEach(() => {
  discoverCgreenTestFileStub = sinon.stub(testFileDiscoverer, 'discoverCgreenTestFiles');
});

afterEach(() => {
  discoverCgreenTestFileStub.restore();
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

describe('Test Discoverer', () => {
    it('should create no test objects if no test files found', async () => {
        // Given a workspace that contains no Cgreen test files
        discoverCgreenTestFileStub.resolves([]);
        expect(await discoverTests(mockedWorkspaceFolder)).toEqual([]);
    });
    
    it('should create a test object with correct path for one test file', async () => {
        // Given a workspace that contains a single Cgreen test file
        discoverCgreenTestFileStub.resolves([vscode.Uri.file("the/path/of/the/testfile.so")]);

        // When we discover tests
        const testObjects = await discoverTests(mockedWorkspaceFolder);

        // Then we get one test object with the correct path back
        expect(testObjects.length).toEqual(1);
        expect(testObjects[0].uri.path).toEqual("the/path/of/the/testfile.so");
    });
});