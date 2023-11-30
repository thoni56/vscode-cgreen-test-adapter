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

import * as child_process from 'child_process';
jest.mock('child_process');

const mockedWorkspaceFolder : vscode.WorkspaceFolder = {
  uri: { scheme: 'file', path: '/path/to/mocked/workspace', toString: () => '/path/to/mocked/workspace' } as vscode.Uri,
  name: "MockedWorkspace",
  index: 0
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('Discoverer Module', () => {
  it('should discover no files in a workspace without files', async () => {
    (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([]);
    expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
  });
  it('should discover no files in a workspace no .so files', async () => {
    (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([vscode.Uri.file("a.exe")]);
    expect(await discoverCgreenFiles(mockedWorkspaceFolder)).toEqual([]);
  });


  it('should discover a single .so file in a simple workspace', async () => {
    (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([vscode.Uri.file("a.exe"), vscode.Uri.file("a.so")]);
    // Action: Run the discoverer on the mock workspace
    const discoveredFiles = await discoverCgreenFiles(mockedWorkspaceFolder);

    // Assertion: Expect discoveredFiles to contain the single .so file
    expect(discoveredFiles).toHaveLength(1);
    expect(discoveredFiles[0].path).toBe("a.so");
  });

  it('should not discover a single .so file as a Cgreen test file', async () => {
    // Mock findFiles to return .so files
    (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([vscode.Uri.file("a.so")]);
  
    // Mock exec to simulate cgreen-runner not finding tests
    jest.spyOn(child_process, 'exec').mockImplementation((_command, _options, callback: (error: child_process.ExecException | null, stdout: string, stderr: string) => void): child_process.ChildProcess => {
      // Simulate output indicating no tests are found
      callback?('No tests found', '');
      return new child_process.ChildProcess();
    });
  
    const discoveredFiles = await discoverCgreenFiles(mockedWorkspaceFolder);
  
    // Assertions
    expect(discoveredFiles).toHaveLength(0);
  });

  // it('should not discover a single .so file as a Cgreen test file', async () => {
  //   // Mock findFiles to return .so files
  //   (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([vscode.Uri.file("a.so")]);
  
  //   // Mock exec to simulate cgreen-runner not finding tests
  //   jest.spyOn(child_process, 'exec').mockImplementation((_command, callback : function(p, channels) => {
  //     const mockChildProcess = {}; // Simple mock of ChildProcess

  //     // Simulate the callback
  //     const mockError = null;
  //     const mockStdout = '...'; // Your mock stdout content
  //     const mockStderr = '';    // Your mock stderr content
  //     callback?(null, {mockError, mockStdout, mockStderr});
    
  //     return mockChildProcess as child_process.ChildProcess; // Cast to ChildProcess
  //   });
  
  //   const discoveredFiles = await discoverCgreenFiles(mockedWorkspaceFolder);
  
  //   // Assertions
  //   expect(discoveredFiles).toHaveLength(0);
  // });
  
});

