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

    // First, map each URI to a promise returned by isCgreenTestFile
    const cgreen_files_promises = so_files.map(uri => isCgreenTestFile(uri.path));

    // Use Promise.all to wait for all promises to resolve
    const cgreen_files_results = await Promise.all(cgreen_files_promises);

    // Filter the original URIs based on the results
    const cgreen_files = so_files.filter((_uri, index) => cgreen_files_results[index]);

    return cgreen_files;
}

function isCgreenTestFile(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // TODO Allow configuration of XML type (-x or -X)
        child_process.exec(`/usr/bin/cgreen-runner -X TESTPROVIDER ${filePath}`, null, (error, stdout, stderr) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(!stdout.includes("No tests found"));
                }
            });
    });
}
