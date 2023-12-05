import { WorkspaceFolder, Uri } from "vscode";
import { discoverCgreenTestFiles } from "./testFileDiscoverer";

interface TestObject {
    uri: Uri;
}

export async function discoverTests(workspaceFolder: WorkspaceFolder): Promise<TestObject[]>  {
    const testFileUris = await discoverCgreenTestFiles(workspaceFolder);
    const testObjects: TestObject[] = testFileUris.map(uri => ({uri: uri}));
    return Promise.resolve(testObjects);
}