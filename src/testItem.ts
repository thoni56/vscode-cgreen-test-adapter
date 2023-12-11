import * as vscode from "vscode";


export type ExtendedTestItemInfo = {
    someInfo: any;
};

// Here we can store extended data for a TestItem
const extendedTestItemInfoMap = new Map<vscode.TestItem, ExtendedTestItemInfo>();


// The controller to be used to create the TestItems
let testController!: vscode.TestController;
export function setController(controller: vscode.TestController) {
    testController = controller;
}


export function createTestItem(
    id: string,
    label: string,
    uri: vscode.Uri,
    // add additional properties here as parameters
): vscode.TestItem {
    if (!testController)
        throw new Error("ExtendedTestItem: controller is not initialized");

    const testItem = testController.createTestItem(id, label, uri);
    // ... potentially other properties constructed and added to the extendedTestItemInfoMap
    return testItem;
}
