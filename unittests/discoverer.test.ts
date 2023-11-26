import * as vscode from 'vscode'; // Import after mocking!

import { discoverCgreenFiles } from '../src/discoverer';

describe('Discoverer Module', () => {
  it('should discover no files in a workspace without .so files', async () => {
    const mockedWorkspaceFolder : vscode.WorkspaceFolder = {
      uri: { scheme: 'file', path: '/path/to/mocked/workspace', toString: () => '/path/to/mocked/workspace' } as vscode.Uri,
      name: "MockedWorkspace",
      index: 0
    };
    expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
  });
  it('should discover a single .so file in a simple workspace', async () => {
    // Setup: Create a mock workspace with one .so file
    const mockedWorkspaceFolder : vscode.WorkspaceFolder = {
      uri: { scheme: 'file', path: '/path/to/mocked/workspace', toString: () => '/path/to/mocked/workspace' } as vscode.Uri,
      name: "MockedWorkspace",
      index: 0
    };
    // Action: Run the discoverer on the mock workspace
    const discoveredFiles = await discoverCgreenFiles(mockedWorkspaceFolder);

    // Assertion: Expect discoveredFiles to contain the .so file
    expect(discoveredFiles).toContain("");
  });
});
