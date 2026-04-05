"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.augmentXpathWithLocalNames = void 0;
exports.getXPathStringsForXmlFile = getXPathStringsForXmlFile;
exports.getFilterBarIdsInFile = getFilterBarIdsInFile;
exports.getExistingButtonGroups = getExistingButtonGroups;
exports.getOrAddNamespace = getOrAddNamespace;
const xmldom_1 = require("@xmldom/xmldom");
const xpath = __importStar(require("xpath"));
/**
 * Converts the provided xpath string from `/mvc:View/Page/content` to
 * `/mvc:View/*[local-name()='Page']/*[local-name()='content']`.
 *
 * @param path - the xpath string
 * @returns the augmented xpath string.
 */
const augmentXpathWithLocalNames = (path) => {
    const result = [];
    for (const token of path.split('/')) {
        result.push(token === '' || token.includes(':') ? token : `*[local-name()='${token}']`);
    }
    return result.join('/');
};
exports.augmentXpathWithLocalNames = augmentXpathWithLocalNames;
/**
 * Returns a list of xpath strings for each element of the xml file provided.
 *
 * @param xmlFilePath - the xml file path
 * @param fs - the file system object for reading files
 * @returns the list of xpath strings & page macro definition if page macro has been added by user.
 */
function getXPathStringsForXmlFile(xmlFilePath, fs) {
    const result = {};
    let pageMacroDefinition;
    try {
        const xmlContent = fs.read(xmlFilePath);
        const errorHandler = (level, message) => {
            throw new Error(`Unable to parse the xml view file. Details: [${level}] - ${message}`);
        };
        const xmlDocument = new xmldom_1.DOMParser({ errorHandler }).parseFromString(xmlContent);
        const nodes = [{ parentNode: '', node: xmlDocument.firstChild }];
        // check macros namespace and page macro definition
        const macrosNamespace = getOrAddNamespace(xmlDocument);
        pageMacroDefinition = macrosNamespace ? `${macrosNamespace}:Page` : 'macros:Page';
        let hasPageMacroChild = false;
        while (nodes && nodes.length > 0) {
            const { parentNode, node } = nodes.shift();
            if (!node) {
                continue;
            }
            // If the current node does NOT have a <macros:Page> child, add <mvc:View> XPath to the result.
            // This prevents suggesting insertion points outside macros:Page when a macros:Page is present.
            hasPageMacroChild = Array.from(node.childNodes).some((child) => child.nodeType === child.ELEMENT_NODE &&
                child.localName === 'Page' &&
                child.nodeName === pageMacroDefinition);
            if (!hasPageMacroChild) {
                result[`${parentNode}/${node.nodeName}`] = (0, exports.augmentXpathWithLocalNames)(`${parentNode}/${node.nodeName}`);
            }
            const childNodes = Array.from(node.childNodes);
            for (const childNode of childNodes) {
                if (childNode.nodeType === childNode.ELEMENT_NODE) {
                    nodes.push({
                        parentNode: `${parentNode}/${node.nodeName}`,
                        node: childNode
                    });
                }
            }
        }
    }
    catch (error) {
        throw new Error(`An error occurred while parsing the view or fragment xml. Details: ${getErrorMessage(error)}`);
    }
    return { inputChoices: result, pageMacroDefinition };
}
/**
 * Returns the message property if the error is an instance of `Error` else a string representation of the error.
 *
 * @param {Error} error  - the error instance
 * @returns {string} the error message.
 */
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
/**
 * Method returns ids of specific macro element found in passed xml file.
 *
 * @param viewOrFragmentPath - path to fragment or view file
 * @param fs  - the file system object for reading files
 * @returns an array of ids found in passed xml file.
 */
async function getFilterBarIdsInFile(viewOrFragmentPath, fs) {
    const ids = [];
    const buildingBlockSelector = 'macros:FilterBar';
    const xmlContent = fs.read(viewOrFragmentPath);
    const errorHandler = (level, message) => {
        throw new Error(`Unable to parse the xml view file. Details: [${level}] - ${message}`);
    };
    const xmlDocument = new xmldom_1.DOMParser({ errorHandler }).parseFromString(xmlContent);
    const elements = Array.from(xmlDocument.getElementsByTagName(buildingBlockSelector));
    for (const element of elements) {
        const id = element.getAttributeNode('id')?.value;
        if (id) {
            ids.push(id);
        }
    }
    return ids;
}
/**
 * Reads existing button groups from XML file using the aggregation path.
 *
 * @param xmlFilePath - Path to the XML file
 * @param aggregationPath - The XPath to the RichTextEditor element
 * @param fs - File system instance
 * @returns Set of existing button group names
 */
async function getExistingButtonGroups(xmlFilePath, aggregationPath, fs) {
    const existingButtonGroups = new Set();
    try {
        const xmlContent = fs.read(xmlFilePath);
        const errorHandler = (level, message) => {
            throw new Error(`Unable to parse the xml view file. Details: [${level}] - ${message}`);
        };
        const xmlDocument = new xmldom_1.DOMParser({ errorHandler }).parseFromString(xmlContent, 'text/xml');
        // Get namespace map and create xpath selector
        const nsMap = xmlDocument.firstChild?._nsMap || {};
        const xpathSelect = xpath.useNamespaces(nsMap);
        // Query the RichTextEditor element using the aggregation path
        const rteElements = xpathSelect(aggregationPath, xmlDocument);
        if (rteElements.length === 0) {
            return existingButtonGroups;
        }
        const rteElement = rteElements[0];
        // Find the buttonGroups child element inside the RTE
        const buttonGroupsElement = Array.from(rteElement.childNodes).find((child) => child.nodeType === 1 && child.localName === 'buttonGroups');
        if (!buttonGroupsElement) {
            return existingButtonGroups;
        }
        // Get all ButtonGroup children from the buttonGroups element
        const buttonGroupElements = Array.from(buttonGroupsElement.childNodes).filter((child) => child.nodeType === 1 && child.localName === 'ButtonGroup');
        // Extract the 'name' attribute from each ButtonGroup
        buttonGroupElements.forEach((element) => {
            const name = element.getAttribute('name');
            if (name) {
                existingButtonGroups.add(name);
            }
        });
    }
    catch (error) {
        throw new Error(`An error occurred while reading button groups. Details: ${getErrorMessage(error)}`);
    }
    return existingButtonGroups;
}
/**
 * @example
 * // Default namespace (no prefix)
 * // <core:FragmentDefinition xmlns="sap.fe.macros">
 * // findNamespacePrefix(root, 'sap.fe.macros') // returns ''
 * @example
 * // Prefixed namespace
 * // <core:FragmentDefinition xmlns:rte="sap.fe.macros.richtexteditor">
 * // findNamespacePrefix(root, 'sap.fe.macros') // returns 'rte'
 * @example
 * // Default namespace in mvc:View
 * // <mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">
 * // findNamespacePrefix(root, 'sap.m') // returns ''
 * @example
 * // Prefixed namespace in mvc:View
 * // <mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:macros="sap.fe.macros">
 * // findNamespacePrefix(root, 'sap.fe.macros') // returns 'macros'
 * @param {HTMLElement} root - The root XML element to search for namespace declarations.
 * @param {string} namespaceUri - The namespace URI to look for.
 * @returns {string|null} The namespace prefix if found ('' for default namespace, or the prefix string), otherwise null.
 */
function findNamespacePrefix(root, namespaceUri) {
    // Check all namespace attributes for a matching URI
    for (const attr of Array.from(root.attributes)) {
        if (attr.value === namespaceUri) {
            if (attr.name === 'xmlns') {
                // Default namespace (no prefix)
                return '';
            }
            else if (attr.name.startsWith('xmlns:')) {
                // Return prefix
                return attr.name.split(':')[1];
            }
        }
    }
    // Namespace not found
    return null;
}
/**
 * Ensures that a given XML namespace URI is defined in the document and returns its prefix.
 * Handles both default and prefixed namespaces.
 *
 * @param ui5XmlDocument - The XML document
 * @param namespaceUri - The namespace URI to check/add (e.g. 'sap.fe.macros', 'sap.fe.macros.richtexteditor')
 * @param prefix - The preferred prefix to use if adding (e.g. 'macros', 'richtexteditor')
 * @returns The prefix bound to the namespace URI ('' for default, or the prefix)
 */
function getOrAddNamespace(ui5XmlDocument, namespaceUri = 'sap.fe.macros', prefix = 'macros') {
    const root = ui5XmlDocument.documentElement;
    // Check all namespace attributes for a matching URI
    const existingPrefix = findNamespacePrefix(root, namespaceUri);
    if (existingPrefix !== null) {
        return existingPrefix;
    }
    // If not present, add with prefix
    root.setAttributeNS('http://www.w3.org/2000/xmlns/', prefix === '' ? 'xmlns' : `xmlns:${prefix}`, namespaceUri);
    return prefix;
}
//# sourceMappingURL=xml.js.map