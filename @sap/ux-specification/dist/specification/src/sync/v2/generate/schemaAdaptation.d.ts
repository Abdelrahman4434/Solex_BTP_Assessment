/**
 * @file This file provides a function that generically creates a page specific schema out of a generic schema for a page
 * of a FE v2 app (function getAdaptedSchema).
 * In addition to that it exposes some generic helper functions that can be used to configure the generation process.
 * Unit tests for this class are located in test.unit.genericSchemaHandling.schemaAdaptation.test.ts.
 */
import type { Definition } from 'typescript-json-schema';
import type { AccessorPath, ExtensionLogger, FileData, Manifest } from '@sap/ux-specification-types';
import type { SyncRuleProvider } from '@sap/ux-specification-types/src';
import type { ConvertedMetadata } from '@sap-ux/vocabularies-types';
/**
 * An instance of this type describes a page within an FE v2 app. It also includes all artifacts that are needed to build the schema for that page.
 *
 * @property appId - id of the app. Note that this should not be taken from the manifest, since the manifest may still contain a placeholder.
 * @property manifest - manifest of the FE v2 app
 * @property pagePath - manifest path identifying the page
 * @property annotations - the annotations relevant for this page, may be omitted when parsedAnnotations is available
 * @property parsedAnnotations - parsed annotations relevant for this page, may be omitted when annotations is available
 * @property fragments - fragments defined for the app
 */
export type PageSpec = {
    appId: string;
    manifest: Manifest;
    pagePath: AccessorPath;
    annotations?: FileData[];
    parsedAnnotations?: ConvertedMetadata;
    fragments?: FileData[];
};
/**
 * An instance of this type provides the rules how a specific schema can be generated.
 *
 * @property genericSchema - the generic schema that is used as basis for the specific schema
 * @property syncRuleProvider - the class that gives access to the top level sync rule and the top-level properties of the schema
 */
export type SpecificSchemaGenerationInfo = {
    genericSchema: Definition;
    syncRuleProvider: SyncRuleProvider;
};
/**
 * An instance of this type allows to get the rules how to generate a specific schema for all supported page types.
 *
 * @param componentName - name of the template component describing the page
 * @returns the information how a page specific schema for that page should be created (resp. undefined if componentName does not specify a supported page type)
 */
export type GenericSchemaInfoProvider = (componentName: string) => SpecificSchemaGenerationInfo | undefined;
/**
 * Creates a page-specific schema for an FE v2 app page.
 * For this purpose it takes an instance of the generic schema for the page type.
 * The transformation into the specific schema is controlled by syncRules (in particular the property processingRuleAdapter).
 * The generated schema will contain information how its properties are mapped into manifest properties resp. flex changes.
 * - manifest properties contain properties `artifactType: "Manifest"` and `manifestPath: AccessorSpec`.
 *   In rare cases an additional non-standard mapping needs to be applied when moving values back and forth between manifest
 *   and configuration. For such cases a conversionExit specification is added to the schema as well.
 * - flexChanges contain properties `artifactType: "FlexChange"`, `controlId` and `controlType`.
 *
 * @param pageSpec - the page for which the schema should be generated
 * @param getGenericSchemaInfo - function providing base data for schema generation process (template component dependent)
 * @param logger - log information during schema generation process
 * @returns page-specific schema
 */
export declare function getAdaptedSchema(pageSpec: PageSpec, getGenericSchemaInfo: GenericSchemaInfoProvider, logger?: ExtensionLogger): Definition;
//# sourceMappingURL=schemaAdaptation.d.ts.map