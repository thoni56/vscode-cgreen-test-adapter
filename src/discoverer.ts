import * as vscode from 'vscode';
import * as child_process from "child_process";

export async function discoverCgreenFiles(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
    return getAllSOFilesInWorkspace(workspaceFolder);
}
async function getAllSOFilesInWorkspace(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
    const pattern = new vscode.RelativePattern(workspaceFolder, '**/*');

    // Use findFiles with the pattern to get all files
    const uris = await vscode.workspace.findFiles(pattern);
    const so_files = uris.filter(uri => uri.path.endsWith(".so"));

    // Now try them as Cgreen files
    const cgreen_files = await so_files.filter(uri => isCgreenTestFile(uri.path));

    return cgreen_files;
}

function isCgreenTestFile(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      child_process.exec(`/usr/bin/cgreen-runner ${filePath}`, null, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(!stdout.includes("No tests found"));
      });
    });
  }
