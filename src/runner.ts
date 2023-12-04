import * as child_process from "child_process";

export async function isCgreenTestFile(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // TODO Allow configuration of XML type (-x or -X)
        child_process.exec(`/usr/bin/cgreen-runner -X TESTPROVIDER ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                resolve(false);
            } else {
                resolve(!stdout.includes("No tests found"));
            }
        });
    });

    function outputIndicatesCgreenTestFile(resolve: (value: boolean | PromiseLike<boolean>) => void): ((error: child_process.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void) | undefined {
        return (error, stdout, stderr) => {
            if (error) {
                resolve(false);
            } else {
                resolve(!stdout.includes("No tests found"));
            }
        };
    }
}
