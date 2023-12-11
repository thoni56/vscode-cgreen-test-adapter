import * as sinon from 'sinon';

// Mocked modules, need to import the complete module for sinon mocks
import * as vscode from 'vscode';
import * as resultsFileDiscoverer from '../src/resultsFileDiscoverer';
import * as resultsFileConverter from '../src/resultsFileConverter';

// Unit under test
import { discoverAllTestResults } from '../src/resultsDiscoverer';

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
        expect(await discoverAllTestResults(mockedWorkspaceFolder, mockedTestController)).toEqual([]);
    });
    it("should return one (suite) TestItem if there is one file with only a suite", async () => {
        discoverAllResultsFilesStub.resolves([vscode.Uri.file("a/results/file.xml")]);
        testItemFromResultsFileStub.returns({ testItem: {}, additionalInfo: { uri: vscode.Uri.file("a/results/file.xml"), name: "options_tests" } });
        const discoveredResults = await discoverAllTestResults(mockedWorkspaceFolder, mockedTestController);
        expect(discoveredResults.length).toEqual(1);
        expect(discoveredResults[0].additionalInfo.uri.path).toEqual("a/results/file.xml");
        expect(discoveredResults[0].additionalInfo.name).toEqual("options_tests");
    });
});