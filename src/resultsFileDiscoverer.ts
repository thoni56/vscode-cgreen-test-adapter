import * as vscode from "vscode";
import { isResultsFile } from "./xmlParser";

export async function discoverAllResultsFiles(
    workspaceFolder: vscode.WorkspaceFolder
): Promise<vscode.Uri[]> {
    return getAllResultsFilesInWorkspace(workspaceFolder);
}

async function getAllResultsFilesInWorkspace(
    workspaceFolder: vscode.WorkspaceFolder
): Promise<vscode.Uri[]> {
    const pattern = new vscode.RelativePattern(workspaceFolder, "**/*");

    // Use findFiles with the pattern to get all files
    const uris = await vscode.workspace.findFiles(pattern);
    const xmlFiles = uris.filter((uri) => uri.path.endsWith(".xml"));

    // First, map each URI to a promise returned by isResultsFile()
    const resultsFilesPromises = xmlFiles.map((uri) => isResultsFile(uri.path));

    // Use Promise.all to wait for all promises to resolve
    const resultsFileUris = await Promise.all(resultsFilesPromises);

    // Filter the original URIs based on the results
    const resultsFiles = xmlFiles.filter((_uri, index) => resultsFileUris[index]);

    return resultsFiles;
}


