import type { XMLElement } from '@xml-tools/ast';
import type { MacrosSchemaMetadata } from '@sap/ux-specification-types';
/**
 * Method to get value of xml attribute by attribute name.
 *
 * @param {XMLElement} node XML node
 * @param {string} name Attribute name
 * @returns {string | undefined} Value of xml attribute
 */
export declare function getAttribute(node: XMLElement, name: string): string | undefined;
/**
 * Method to get node by node name.
 *
 * @param {XMLElement} node XML node with children
 * @param {string} name Name of children node to search
 * @returns {XMLElement | undefined} Found children XML node
 */
export declare function getNodeByName(node: XMLElement, name: string): XMLElement | undefined;
/**
 * Adds displayInfo to metadata if the node is a higher-level building block.
 * Skips custom XML elements like Column, Action, FilterField.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {string} name Node name.
 * @param {MacrosSchemaMetadata} metadata Metadata object to update.
 */
export declare function addDisplayInfoForBuildingBlock(node: XMLElement, name: string, metadata: MacrosSchemaMetadata): void;
/**
 * Returns a description and optional icon for a view node.
 * - For higher-level building blocks, description is "<name> #value" for 'id', or "<name> value" for others.
 * - For custom building blocks, uses the attribute value directly, or the node name if not found.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {string} name Node name.
 * @returns {{ description: string; icon?: string }} Object containing the description and optional icon.
 */
export declare function getViewNodeDescriptionAndIcon(node: XMLElement, name: string): {
    description: string;
    icon?: string;
};
//# sourceMappingURL=utils.d.ts.map