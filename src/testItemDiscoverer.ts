import * as vscode from "vscode";
import { discoverAllResultsFiles } from "./resultsFileDiscoverer";
import { testItemsFromResultsFile as testItemStructureFromResultsFile } from "./resultsFileConverter";


export async function discoverAllTestItems(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.TestItem[]> {
    const resultsFiles = await discoverAllResultsFiles(workspaceFolder);
    const testItems = resultsFiles.map((f) => { return testItemStructureFromResultsFile(f); });
    return testItems;
}

