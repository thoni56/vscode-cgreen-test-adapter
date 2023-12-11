import * as vscode from 'vscode';
import { discoverAllTestResults } from './resultsDiscoverer';


export async function activate(context: vscode.ExtensionContext) {
    const controller = vscode.tests.createTestController('cgreenController', 'Cgreen Tests');
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
        for (const test of request.include ?? gatherTestItems(controller.items)) {
            if (cancellation.isCancellationRequested) {
                run.skipped(test);
                continue;
            }
            run.passed(test, 0); // or run.failed(test, 0) based on test result
        }
        run.end();
    }

    async function resolveTestItem(item: vscode.TestItem) {
        // Logic to resolve a single test item
        // Don't know how to do that...
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
        discoverAllTestResults(workspaceFolder, controller);
    } else {
        // Handle the case where there is no open workspace folder
        vscode.window.showInformationMessage('No workspace folder is open.');
    }
}