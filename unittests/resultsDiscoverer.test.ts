import * as sinon from 'sinon';

// Mocked modules, need to import the complete module for sinon mocks
import * as vscode from 'vscode';
import * as resultsFileDiscoverer from '../src/resultsFileDiscoverer';
import * as resultsFileConverter from '../src/resultsFileConverter';

// Unit under test
import { discoverAllTestItems } from '../src/resultsDiscoverer';

let discoverAllResultsFilesStub = sinon.stub();
let testItemFromResultsFileStub = sinon.stub();

beforeEach(() => {
    discoverAllResultsFilesStub = sinon.stub(resultsFileDiscoverer, 'discoverAllResultsFiles');
    testItemFromResultsFileStub = sinon.stub(resultsFileConverter, 'testItemsFromResultsFile');
});

afterEach(() => {
    discoverAllResultsFilesStub.restore();
    testItemFromResultsFileStub.restore();
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

const mockedTestController = {} as vscode.TestController;

describe("resultsDiscoverer", () => {
    it("should find no TestItems if there are no result files", async () => {
        discoverAllResultsFilesStub.resolves([]);
        expect(await discoverAllTestItems(mockedWorkspaceFolder)).toEqual([]);
    });
    it("should return one (suite) TestItem if there is one file with only a suite", async () => {
        discoverAllResultsFilesStub.resolves([vscode.Uri.file("a/results/file.xml")]);
        testItemFromResultsFileStub.returns({ id: "1", uri: vscode.Uri.file("a/results/file.xml"), label: "options_tests" } as vscode.TestItem);
        const discoveredResults = await discoverAllTestItems(mockedWorkspaceFolder);
        expect(discoveredResults.length).toEqual(1);
        expect(discoveredResults[0].uri!.path).toEqual("a/results/file.xml");
        expect(discoveredResults[0].label).toEqual("options_tests");
    });
});