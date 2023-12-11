import * as vscode from 'vscode';
import { createTestItem } from "./testItem";

export function testItemsFromResultsFile(resultsFile: vscode.Uri) : vscode.TestItem {
    // Create a tree of ExtendedTestItems representing all results in the file
    const top = createTestItem("id", "label", resultsFile);
    top.children.add(createTestItem("id2", "label2", resultsFile));
    return top;
}