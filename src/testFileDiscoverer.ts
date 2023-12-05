import * as vscode from 'vscode';
import { isCgreenTestFile } from './runner';

export async function discoverCgreenTestFiles(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
    return getAllCgreenTestFilesInWorkspace(workspaceFolder);
}

async function getAllCgreenTestFilesInWorkspace(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
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
