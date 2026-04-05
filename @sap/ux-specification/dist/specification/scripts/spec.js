"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const project_1 = require("../src/project");
const src_1 = require("../src");
var ExecutionMode;
(function (ExecutionMode) {
    ExecutionMode["Import"] = "import";
})(ExecutionMode || (ExecutionMode = {}));
/**
 * Write a single file.
 *
 * @param path - file path
 * @param content - file content
 */
async function write(path, content) {
    return new Promise((resolve, reject) => {
        (0, fs_1.writeFile)(path, content, { encoding: 'utf8' }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
/**
 * Write files, create target directory if not exists.
 *
 * @param directory - target directory
 * @param files - list of files with name and content
 */
async function writeFiles(directory, files) {
    for (const file of files) {
        const path = (0, path_1.join)(directory, file.dataSourceUri);
        const targetDir = (0, path_1.dirname)(path);
        if (!(await (0, project_1.isDirectory)(targetDir))) {
            (0, fs_1.mkdirSync)(targetDir, { recursive: true });
        }
        await write((0, path_1.join)(directory, file.dataSourceUri), file.fileContent);
    }
}
/**
 * Formats the resulting files into a single string.
 *
 * @param files - List of files as objects containing dataSourceUri and fileContent.
 * @returns A formatted string representing the files and their content.
 */
const formatterFileContent = (files) => files.reduce((result, file) => result + `\nFile: '${file.dataSourceUri}':\n${file.fileContent}`, '');
/**
 * Retrieves configuration and schemas from the specified project and optionally writes them to an output path.
 *
 * @param projectRoot - The root directory of the project where the package.json file is located.
 * @param outputPath - The directory where the files should be written. If not provided, the files are returned as a formatted string.
 * @returns A promise that resolves to a string indicating the result of the operation.
 */
async function importFiles(projectRoot, outputPath) {
    const { annotations, manifest, changes: flex } = await (0, project_1.getProject)(projectRoot);
    let resultString = '';
    const files = await (0, src_1.importProject)({
        annotations,
        manifest,
        flex
    });
    if (outputPath) {
        writeFiles(outputPath, files);
        resultString = `Files written to '${outputPath}'`;
    }
    else {
        resultString = formatterFileContent(files);
    }
    return resultString;
}
/**
 * Parses the command line parameters and validates them.
 *
 * @param args - Content of process.argv.
 * @returns A promise that resolves to the parsed command line parameters.
 */
async function getParameters(args) {
    if (process.argv.length > 3) {
        const [mode, projectRoot, ...commandArgs] = args.slice(2);
        if (mode !== "import" /* ExecutionMode.Import */) {
            throw Error(`Unkown mode: '${mode}'. Please use '${"import" /* ExecutionMode.Import */}'`);
        }
        if (!(await (0, project_1.isDirectory)(projectRoot))) {
            throw Error(`Directory '${projectRoot}' doesn't exist.`);
        }
        const outputPath = commandArgs.find((arg) => arg.toLowerCase().startsWith('--output='))?.substring(9);
        return {
            mode: "import" /* ExecutionMode.Import */,
            projectRoot,
            outputPath
        };
    }
    throw Error(`Usage: ${(0, path_1.basename)(args[0])} ${(0, path_1.basename)(args[1])} import <PROJECT_ROOT_PATH> [--output=<PATH>]`);
}
/**
 * Run the required execution mode, e.g. import a project.
 *
 * @param argv - command line arguments as string array
 */
async function run(argv) {
    const parameters = await getParameters(argv);
    switch (parameters.mode) {
        case "import" /* ExecutionMode.Import */: {
            const result = await importFiles(parameters.projectRoot, parameters.outputPath);
            console.log(result);
            break;
        }
        default: {
            break;
        }
    }
}
/**
 * Usage through command line
 * node spec.js import <PROJECT_ROOT_PATH> [--output=<PATH>]
 */
run(process.argv).catch((e) => console.error(e.message));
//# sourceMappingURL=spec.js.map