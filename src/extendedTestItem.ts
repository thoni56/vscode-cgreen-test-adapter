import * as vscode from "vscode";

interface AdditionalTestInfo {
    customProperty: string;
    // ... other additional properties
}

export type ExtendedTestItem = {
    testItem: vscode.TestItem;
    additionalInfo: any;
};

let testController!: vscode.TestController;

export function setConstructor(controller: vscode.TestController) {
    testController = controller;
}

export function createExtendedTestItem(
    id: string,
    label: string,
    uri: vscode.Uri,
    customProperty: string
): ExtendedTestItem {
    if (!testController)
        throw new Error("ExtendedTestItem: controller is not initialized");

    const testItem = testController.createTestItem(id, label, uri);
    const additionalInfo = {
        customProperty: customProperty
        // ... potentially other properties constructed here
    };
    return {
        testItem: testItem,
        additionalInfo: additionalInfo,
    };
}
