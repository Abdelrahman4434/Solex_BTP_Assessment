import type { ConvertedMetadata, EntitySet, EntityType } from '@sap-ux/vocabularies-types';
import type { File, ImportProjectParameters, ExtensionLogger } from '@sap/ux-specification-types';
/**
 * Retrieves the entity set by its name from the provided OData service metadata.
 *
 * @param entitySetName - The name of the entity set to retrieve.
 * @param oDataServiceAVT - The OData service metadata containing entity sets.
 * @returns The entity set matching the provided name, or undefined if not found.
 */
export declare function getEntitySetByEntitySetName(entitySetName: string, oDataServiceAVT: ConvertedMetadata): EntitySet;
/**
 * The function returns an EntityType, EntitySet based on the given contextPath or entitySet.
 *
 * @param {ConvertedMetadata} oDataServiceAVT service AVT
 * @param {string} contextPath contextPath of a page
 * @param {string} entitySetName entitySet of a page
 * @param {ExtensionLogger} [logger] - Logger class for logging messages
 * @returns {EntityType} entityType of a page
 */
export declare function getEntityTypeEntitySetFromContextPath(oDataServiceAVT: ConvertedMetadata, contextPath?: string, entitySetName?: string, logger?: ExtensionLogger): {
    entityType: EntityType;
    entitySet: EntitySet;
};
/**
 * Import the schema and config files for a given project.
 *
 * @param importProjectParameters - files of the project: manifest, flex changes, odata files
 * @returns {Promise<File[]>} - list of files containing schema and configuration data
 */
export declare function importProjectSchema(importProjectParameters: ImportProjectParameters): Promise<File[]>;
/**
 * Import the schema and config files for a given project.
 *
 * @param {ImportProjectParameters} importProjectParameters - files of the project: manifest, flex changes, odata files
 * @returns {Promise<File[]>} - list of files containing schema and configuration data
 */
export declare function importProjectSchemaAndConfig(importProjectParameters: ImportProjectParameters): Promise<File[]>;
//# sourceMappingURL=importProject.d.ts.map