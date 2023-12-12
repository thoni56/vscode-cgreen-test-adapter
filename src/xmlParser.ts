import * as vscode from "vscode";
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";


export function parseXmlFile(uri: vscode.Uri): any {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const xmlSource = readFileSync(uri.path);
    const xml = parser.parse(xmlSource);

    if (!xml.testsuite) {
        throw Error;
    }

    return xml;
}

export async function isResultsFile(path: string) {
    // TODO Should investigate if the file is actually a results file, probably by looking for "<TestSuite ..." as the top node
    return Promise.resolve(true);
}

