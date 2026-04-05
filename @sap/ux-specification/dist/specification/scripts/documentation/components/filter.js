"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = filter;
/**
 * Checks if a tree node matches the given search term.
 *
 * @param child - The tree node to check.
 * @param searchTerm - The term to search for in the node's name.
 * @returns True if the node matches the search term, otherwise false.
 */
function isNodeMatching(child, searchTerm) {
    const { name } = child;
    return name.toLowerCase().includes(searchTerm);
}
/**
 * Filters a tree node and its children based on the search term.
 *
 * @param result - The array to store the filtered nodes.
 * @param innerChild - The current tree node being checked.
 * @param searchTerm - The term to search for in the node's name.
 * @returns True if the node or any of its children match the search term, otherwise false.
 */
function filterNode(result, innerChild, searchTerm) {
    let found = false;
    let childClone = { ...innerChild, children: [] };
    const isNodeMatched = isNodeMatching(innerChild, searchTerm);
    if (isNodeMatched) {
        found = true;
    }
    const innerFound = filterNodes(childClone.children, innerChild, searchTerm);
    if (innerFound) {
        found = true;
        childClone = {
            ...innerChild,
            children: childClone.children
        };
    }
    if (isNodeMatched || innerFound) {
        result.push(childClone);
    }
    return found;
}
/**
 * Filters the children of a tree node based on the search term.
 *
 * @param result - The array to store the filtered nodes.
 * @param child - The current tree node whose children are being checked.
 * @param searchTerm - The term to search for in the children's names.
 * @returns True if any of the children match the search term, otherwise false.
 */
function filterNodes(result, child, searchTerm) {
    let found = false;
    for (const innerChild of child.children) {
        found = filterNode(result, innerChild, searchTerm) || found;
    }
    return found;
}
/**
 * Filters a tree structure based on a search term.
 *
 * @param input - The root of the tree structure to filter.
 * @param searchTerm - The term to search for in the tree nodes.
 * @returns The filtered tree structure if matches are found, otherwise undefined.
 */
function filter(input, searchTerm) {
    const resultNodes = [];
    // Case insensitive search
    searchTerm = searchTerm.trim().toLowerCase().replace(/\s/g, '');
    if (!searchTerm) {
        //return input;
        return undefined;
    }
    // Apply search
    const found = filterNode(resultNodes, input, searchTerm);
    return found ? resultNodes[0] : undefined;
}
//# sourceMappingURL=filter.js.map