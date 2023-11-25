import * as vscode from 'vscode';

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
		// Have to discover at least one test for the test view to show up
        const testItem = controller.createTestItem("testId", "Dummy Test to make test view show up");
		controller.items.add(testItem);
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
