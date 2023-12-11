import * as vscode from "vscode";
import { discoverAllResultsFiles } from "./resultsFileDiscoverer";
import { testItemsFromResultsFile } from "./resultsFileConverter";
import { ExtendedTestItem } from "./extendedTestItem";


export async function discoverAllTestResults(workspaceFolder: vscode.WorkspaceFolder, controller : vscode.TestController): Promise<ExtendedTestItem[]>  {
    const resultsFiles = await discoverAllResultsFiles(workspaceFolder);
    const extendedTestItems = resultsFiles.map((f) => { return testItemsFromResultsFile(f); });
    return extendedTestItems;
}

