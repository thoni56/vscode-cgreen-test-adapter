import * as vscode from 'vscode';

export async function discoverCgreenFiles(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
    return getAllSOFilesInWorkspace(workspaceFolder);
}
async function getAllSOFilesInWorkspace(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
    const pattern = new vscode.RelativePattern(workspaceFolder, '**/*');

    // Use findFiles with the pattern to get all files
    const uris = await vscode.workspace.findFiles(pattern);

    return uris.filter(uri => uri.path.endsWith(".so"));
}

