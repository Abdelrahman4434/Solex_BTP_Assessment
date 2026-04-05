import type { Editor } from 'mem-fs-editor';
/**
 * Converts the provided xpath string from `/mvc:View/Page/content` to
 * `/mvc:View/*[local-name()='Page']/*[local-name()='content']`.
 *
 * @param path - the xpath string
 * @returns the augmented xpath string.
 */
export declare const augmentXpathWithLocalNames: (path: string) => string;
/**
 * Returns a list of xpath strings for each element of the xml file provided.
 *
 * @param xmlFilePath - the xml file path
 * @param fs - the file system object for reading files
 * @returns the list of xpath strings & page macro definition if page macro has been added by user.
 */
export declare function getXPathStringsForXmlFile(xmlFilePath: string, fs: Editor): {
    inputChoices: Record<string, string>;
    pageMacroDefinition?: string;
};
/**
 * Method returns ids of specific macro element found in passed xml file.
 *
 * @param viewOrFragmentPath - path to fragment or view file
 * @param fs  - the file system object for reading files
 * @returns an array of ids found in passed xml file.
 */
export declare function getFilterBarIdsInFile(viewOrFragmentPath: string, fs: Editor): Promise<string[]>;
/**
 * Reads existing button groups from XML file using the aggregation path.
 *
 * @param xmlFilePath - Path to the XML file
 * @param aggregationPath - The XPath to the RichTextEditor element
 * @param fs - File system instance
 * @returns Set of existing button group names
 */
export declare function getExistingButtonGroups(xmlFilePath: string, aggregationPath: string, fs: Editor): Promise<Set<string>>;
/**
 * Ensures that a given XML namespace URI is defined in the document and returns its prefix.
 * Handles both default and prefixed namespaces.
 *
 * @param ui5XmlDocument - The XML document
 * @param namespaceUri - The namespace URI to check/add (e.g. 'sap.fe.macros', 'sap.fe.macros.richtexteditor')
 * @param prefix - The preferred prefix to use if adding (e.g. 'macros', 'richtexteditor')
 * @returns The prefix bound to the namespace URI ('' for default, or the prefix)
 */
export declare function getOrAddNamespace(ui5XmlDocument: Document, namespaceUri?: string, prefix?: string): string;
//# sourceMappingURL=xml.d.ts.map