import * as vscode from 'vscode';
import { createTestItem } from "./testItem";
import { parseXmlFile } from './xmlParser';

export function testItemsFromResultsFile(resultsFile: vscode.Uri) : vscode.TestItem {
    // Create a tree of ExtendedTestItems representing all results in the file
    const xml = parseXmlFile(resultsFile);
    const suite = createTestItem("id1", xml.testsuite.name, resultsFile);
    suite.children.add(createTestItem("id2", "label2", resultsFile));
    return suite;
}