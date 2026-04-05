"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readApp = readApp;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const project_access_1 = require("@sap-ux/project-access");
const mem_fs_1 = require("mem-fs");
const mem_fs_editor_1 = require("mem-fs-editor");
const api_1 = require("../api");
const parser_1 = require("./parser");
// Retrieve API version
const ApiVersion = (0, api_1.getApiVersion)();
/**
 * Returns a mem-fs editor instance. If an instance is not provided, a new one is created.
 *
 * @param {Editor} [fs] - An optional mem-fs editor instance.
 * @returns {Editor} - The mem-fs editor instance.
 */
function getFsInstance(fs) {
    return fs ?? (0, mem_fs_editor_1.create)((0, mem_fs_1.create)());
}
/**
 * Reads virtual files for a project located at the given application path.
 *
 * @param options - Parameters for application read.
 * @returns {Promise<ReadAppResult>} A promise that resolves to a ReadAppResult object containing an array of virtual `File` objects.
 */
async function readApp(options) {
    const memFs = getFsInstance(options.fs);
    // Reuse app access or create new instance
    const appAccess = typeof options.app === 'string' ? await (0, project_access_1.createApplicationAccess)(options.app, memFs) : options.app;
    let files = [];
    const manifest = await appAccess.readManifest(memFs);
    if (manifest) {
        const annotationData = await appAccess.readAnnotationFiles(memFs);
        const changeFiles = await appAccess.readFlexChanges(memFs);
        // Import project using specification API
        files = await (0, api_1.importProject)({
            manifest: manifest,
            annotations: annotationData,
            flex: Object.values(changeFiles),
            logger: options.logger
        });
    }
    // Application model
    let applicationModel;
    if (!options.skipParsing) {
        const appFile = files.find((file) => file.dataSourceUri === ux_specification_types_1.FileName.App);
        const application = appFile ? JSON.parse(appFile.fileContent) : {};
        const appSchemaFile = files.find((file) => application.$schema?.endsWith(file.dataSourceUri));
        if (application && appSchemaFile) {
            applicationModel = {
                ...application,
                model: (0, parser_1.getModel)(appSchemaFile.fileContent, application),
                pages: {}
            };
            for (const pageId in application.pages ?? {}) {
                const page = application.pages[pageId];
                // Paths are unified and does not require OS specific handling
                const pageSourceUri = `pages/${pageId}.json`;
                const configFile = files.find((file) => file.dataSourceUri === pageSourceUri);
                const config = configFile ? JSON.parse(configFile.fileContent) : {};
                const schemaFile = files.find((file) => config.$schema?.endsWith(file.dataSourceUri));
                if (schemaFile) {
                    applicationModel.pages[pageId] = {
                        ...page,
                        model: (0, parser_1.getModel)(schemaFile.fileContent, config, page.pageType)
                    };
                }
            }
        }
    }
    const result = {
        files,
        appAccess,
        version: ApiVersion
    };
    if (applicationModel) {
        result.applicationModel = applicationModel;
    }
    return result;
}
//# sourceMappingURL=ftfs.js.map