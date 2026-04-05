import { FioriElementsVersion } from '@sap/ux-specification-types';
import type { MetadataInstanceInterface } from '../../src/sync/common/decoration/factory';
export type Schema = {
    [name: string]: object;
};
/**
 * This function is used by unit tests. It allows to inject a MetadataInstanceInterface which will be used by function convertInterfaces.
 *
 * @param factory - the instance of MetadataInstanceInterface that overrules the instance that would normally be used by convertInterfaces.
 * Use value undefined to reset the injection.
 */
export declare function setStaticMetadataInstanceInterface(factory?: MetadataInstanceInterface): void;
/**
 * Convert interfaces to json schema.
 *
 * @param path - Path to interfaces.
 * @param files - File names, filename must match the main symbol (interface) in the content of the file.
 * @param version - The version of the schema to generate.
 * @returns Array of generated JSON schemas.
 */
export declare function convertInterfaces(path: string, files: string[], version: FioriElementsVersion): Schema[];
/**
 * Factory giving access to the metadata of the new v2 ListReport page.
 */
export declare const FACTORY_FOR_LIST_REPORT_NEW: MetadataInstanceInterface;
/**
 * Converts all application and page definitions to JSON schema.
 *
 * @param outputPath - The path to write the generated schemas to.
 */
export declare function toJsonSchema(outputPath: string): void;
//# sourceMappingURL=to-json-schema.d.ts.map