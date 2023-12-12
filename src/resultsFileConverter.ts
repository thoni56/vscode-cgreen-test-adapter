import * as vscode from 'vscode';
import { createTestItem } from "./testItem";
import { parseXmlFile } from './xmlParser';

export function testItemsFromResultsFile(resultsFileUri: vscode.Uri) : vscode.TestItem {
    // Create a tree of ExtendedTestItems representing all results in the file
    const xml = parseXmlFile(resultsFileUri);
    const suite:vscode.TestItem = createTestItem(`testsuite%${xml.testsuite.name}`, xml.testsuite.name, resultsFileUri);

    if (xml.testsuite.testcase) {
        const testCaseArray = Array.isArray(xml.testsuite.testcase) ? xml.testsuite.testcase : [ xml.testsuite.testcase ];
        testCaseArray.forEach((testcase:any) => {
            const childId = `testcase%${xml.testsuite.name}%${testcase.name}`;
            suite.children.add(createTestItem(childId, testcase.name, resultsFileUri));
        });
    }

    return suite;
}