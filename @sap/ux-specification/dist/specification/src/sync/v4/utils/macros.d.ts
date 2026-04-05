import type { Element } from 'xml-js';
import type { XMLDocument } from '@xml-tools/ast';
import type { MacrosXMLPath, ExtensionLogger, FileData, SchemaDefinition } from '@sap/ux-specification-types';
export interface TraverseData<T = {}> {
    fullSchema: SchemaDefinition;
    schema: SchemaDefinition;
    element: Element;
    contextPath: MacrosXMLPath;
    config: object;
    /** Indicates if all properties of an element were removed during traversal. */
    removed?: boolean;
    /** Reference to the parent traversal data. */
    parent?: TraverseData<T>;
    /** Reference to the parent XML element. */
    parentElement?: Element;
    /** Custom data for traversal. */
    data?: T;
}
export type TraverseCallback<T = {}> = (traverseData: TraverseData<T>, property: SchemaDefinition, config: object, name: string) => boolean;
/**
 * Method traverses schema together with XML element.
 *
 * @param {TraverseData} traverseData Traverse data object.
 * @param {TraverseCallback} callback Callbck to handle export or import.
 * @param {TraverseCallback} [onElementDeleteCallback]  - Callback invoked when an element is deleted during traversal.
 * @returns {boolean} Is changes applied during export or import.
 */
export declare function traverseSchema<T = {}>(traverseData: TraverseData<T>, callback: TraverseCallback<T>, onElementDeleteCallback?: TraverseCallback<T>): boolean;
/**
 * Method parses XML file and returns parsed object.
 *
 * @param {FileData} xmlFile XML file.
 * @param {boolean} providePositions - If true then parsing result will contain information about elements and attributes positions.
 * @param {ExtensionLogger} [logger] - Logger class for logging messages.
 * @returns {Element | undefined} Parsed XML.
 */
export declare function parseXML(xmlFile: FileData, providePositions: true, logger?: ExtensionLogger): XMLDocument | undefined;
export declare function parseXML(xmlFile: FileData, providePositions: false, logger?: ExtensionLogger): Element | undefined;
/**
 * Resolves definition key for custom extension fragment.
 *
 * @param {string} fragmentName Name of the fragment.
 * @returns {string} Definition key for custom extension fragment.
 */
export declare function getCustomExtensionFragmentDefinitionKey(fragmentName: string): string;
/**
 * Method find first renderable element for passed definition element.
 *
 * @param element Definition element.
 * @returns First renderable element.
 */
export declare function getRootElement(element?: Element): Element | undefined;
//# sourceMappingURL=macros.d.ts.map