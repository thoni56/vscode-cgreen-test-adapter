import * as vscode from 'vscode';
import { createExtendedTestItem } from "./extendedTestItem";

export function testItemsFromResultsFile(resultsFile: vscode.Uri) {
    return createExtendedTestItem("id", "label", resultsFile, "custom");
}