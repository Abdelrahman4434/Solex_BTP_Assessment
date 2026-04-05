"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readExternalServiceMetadata = readExternalServiceMetadata;
const node_path_1 = require("node:path");
const posix_1 = require("node:path/posix");
const promises_1 = require("node:fs/promises");
/**
 * Reads the metadata of external services based on the provided definitions and returns a map of the service URI to its metadata content and local file path.
 *
 * @param metadataFilePath - main metadata file path used to resolve the location of external service metadata files.
 * @param relativeBackendPath - relative path from which the external service paths are defined, used to resolve the location of external service metadata files.
 * @param externalServiceDefinitions - A map of external service definitions where the key is the target and the value is an array of references containing the annotation element, its location, and the URIs of the external services.
 * @returns A map where the key is the service URI and the value is an object containing the metadata content and the local file path.
 */
async function readExternalServiceMetadata(metadataFilePath, relativeBackendPath, externalServiceDefinitions) {
    const externalServices = new Map();
    for (const [target, references] of externalServiceDefinitions.entries()) {
        for (const reference of references) {
            for (const value of reference.uris) {
                const relativeServicePath = getRelativeServicePath(relativeBackendPath, value);
                const serviceRoot = (0, node_path_1.join)(metadataFilePath, '..', relativeServicePath, target
                    .split('/')
                    .map((segment) => segment.split('.').pop())
                    .join('/'));
                const metadataPath = (0, node_path_1.join)(serviceRoot, `metadata.xml`);
                let exists;
                try {
                    await (0, promises_1.access)(metadataPath, promises_1.constants.R_OK);
                    exists = true;
                }
                catch {
                    exists = false;
                }
                const data = exists ? await (0, promises_1.readFile)(metadataPath, 'utf-8') : '';
                externalServices.set(value, { data, localFilePath: metadataPath });
            }
        }
    }
    return externalServices;
}
function getRelativeServicePath(backendPath, relativeExternalServicePath) {
    const externalServiceMetadataPath = (0, posix_1.join)(backendPath, relativeExternalServicePath.replace('/$metadata', ''));
    const [valueListServicePath] = externalServiceMetadataPath.split(';');
    const segments = valueListServicePath.split('/');
    let prefix = '/';
    let currentSegment = segments.shift();
    while (currentSegment !== undefined) {
        const next = (0, posix_1.join)(prefix, currentSegment);
        if (!backendPath.startsWith(next)) {
            break;
        }
        prefix = next;
        currentSegment = segments.shift();
    }
    return valueListServicePath.replace(prefix, '');
}
//# sourceMappingURL=external-services.js.map