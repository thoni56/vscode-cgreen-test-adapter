import * as vscode from 'vscode';
import { discoverAllTestItems as discoverAllTestItems } from './testItemDiscoverer';
import { setControllerForTestItems } from './testItem';


export async function activate(context: vscode.ExtensionContext) {
    const controller = vscode.tests.createTestController('cgreenController', 'Cgreen Tests');
    setControllerForTestItems(controller);
    
    context.subscriptions.push(controller);

    controller.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, runHandler, true);

    controller.resolveHandler = async item => {
        if (!item) {
            await discoverAllTests(controller);
            return;
        }
        await resolveTestItem(item);
    };

    async function runHandler(request: vscode.TestRunRequest, cancellation: vscode.CancellationToken) {
        const run = controller.createTestRun(request);
        for (const test of (request.include ?? gatherTestItems(controller.items))) {
            if (cancellation.isCancellationRequested) {
                run.skipped(test);
                continue;
            }
            run.passed(test, 0); // or run.failed(test, 0) based on test result
        }
        run.end();
    }

    async function resolveTestItem(item: vscode.TestItem) {
        // Resolve means to complete the information in the TestItem in case it was incomplete
    }

    function gatherTestItems(collection: vscode.TestItemCollection) {
        const items: vscode.TestItem[] = [];
  
        collection.forEach(item => items.push(item));
        return items;
    }
}

async function discoverAllTests(controller : vscode.TestController) {
    const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : null;
    if (workspaceFolder) {
        const discoveredTestItems = await discoverAllTestItems(workspaceFolder);
        const workspaceTestItem = controller.createTestItem(workspaceFolder.uri.path, workspaceFolder.name);
        controller.items.add(workspaceTestItem);
        discoveredTestItems.forEach(testItem => {workspaceTestItem.children.add(testItem);});
    } else {
        // No open workspace folder
        vscode.window.showInformationMessage('No workspace folder is open.');
    }
}