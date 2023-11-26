import * as vscode from 'vscode';

export async function discoverCgreenFiles(workspaceFolder: vscode.WorkspaceFolder): Promise<string[]> {
    return getAllSOFilesInWorkspace();
}
function getAllSOFilesInWorkspace(): string[] | PromiseLike<string[]> {
    return [];
}

