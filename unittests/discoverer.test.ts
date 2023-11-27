// There is a "manual mock" in the directory `__mocks__`, `vscode.js`, which is a Jest special
// feature. That mock is required to override Jests attempt to load a real `vscode` module
// otherwise. An option would have been to have mock factories in each test file but that would
// have polluted the code with a lot of unimportant boiler plate code.
jest.mock('vscode');

// We can still control the mocked `vscode` using for example
//     - mockImplementation()
//     - mockResolvedValue()

import * as vscode from 'vscode';
import { discoverCgreenFiles } from '../src/discoverer';

const mockedWorkspaceFolder : vscode.WorkspaceFolder = {
  uri: { scheme: 'file', path: '/path/to/mocked/workspace', toString: () => '/path/to/mocked/workspace' } as vscode.Uri,
  name: "MockedWorkspace",
  index: 0
};

describe('Discoverer Module', () => {
  it('should discover no files in a workspace without files', async () => {
    (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([]);
    expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
  });
  it('should discover no files in a workspace without any .so files', async () => {
    (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([vscode.Uri.file("a.exe")]);
    expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
  });
  it('should discover a single .so file in a simple workspace', async () => {
    // Action: Run the discoverer on the mock workspace
    const discoveredFiles = await discoverCgreenFiles(mockedWorkspaceFolder);

    // Assertion: Expect discoveredFiles to contain the .so file
    expect(discoveredFiles).toContain("");
  });
});
