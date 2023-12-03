import * as vscode from 'vscode';
import { discoverCgreenFiles } from './discoverer';

export async function activate(context: vscode.ExtensionContext) {
    const controller = vscode.tests.createTestController('cgreenController', 'Cgreen Tests');
    context.subscriptions.push(controller);

    controller.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, runHandler, true);

    controller.resolveHandler = async item => {
        if (!item) {
            await discoverAllTests();
            return;
        }
        await resolveTestItem(item);
    };

    async function runHandler(request: vscode.TestRunRequest, cancellation: vscode.CancellationToken) {
        const run = controller.createTestRun(request);
        for (const test of request.include ?? gatherTestItems(controller.items)) {
            if (cancellation.isCancellationRequested) {
                run.skipped(test);
                continue;
            }
            run.passed(test, 0); // or run.failed(test, 0) based on test result
        }
        run.end();
    }

    async function discoverAllTests() {
		// Have to discover at least one test for the test view to show up...
        const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : null;

        if (workspaceFolder) {
            const discoveredFiles : vscode.Uri[] = await discoverCgreenFiles(workspaceFolder);
            for (const file of discoveredFiles) {
                const testItem = controller.createTestItem(file.path, file.path);
                controller.items.add(testItem);
            }
        } else {
            // Handle the case where there is no open workspace folder
            vscode.window.showInformationMessage('No workspace folder is open.');
        }

    }

    async function resolveTestItem(item: vscode.TestItem) {
        // Logic to resolve a single test item
    }

    function gatherTestItems(collection: vscode.TestItemCollection) {
        const items: vscode.TestItem[] = [];
		
        collection.forEach(item => items.push(item));
        return items;
    }
}
