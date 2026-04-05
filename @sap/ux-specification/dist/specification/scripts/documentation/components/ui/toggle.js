"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collapse = collapse;
exports.expand = expand;
exports.expandAll = expandAll;
exports.toggleChildren = toggleChildren;
/**
 * Collapses the given node by hiding its children and storing them in `_children`.
 *
 * @param d - The node to collapse.
 */
function collapse(d) {
    if (d.children) {
        // d.data.children = expanded children
        d.data._children = d.children;
        d.data._children.forEach(collapse);
        d.children = null;
    }
}
/**
 * Expands the given node by restoring its children from `_children`.
 *
 * @param d - The node to expand.
 */
function expand(d) {
    if (d.data._children) {
        // d.data._children = collapsed children
        d.children = d.data._children;
        d.data._children = null;
    }
}
/**
 * Expands all nodes in the hierarchy starting from the given node.
 *
 * @param d - The root node to start expanding from.
 */
function expandAll(d) {
    if (d.data._children) {
        d.children = d.data._children;
        d.data._children = null;
    }
    const children = d.children ? d.children : d.data._children;
    if (children) {
        children.forEach(expandAll);
    }
}
/**
 * Toggles the children of the given node. If the node is expanded, it will be collapsed, and vice versa.
 *
 * @param d - The node to toggle.
 * @returns The toggled node.
 */
function toggleChildren(d) {
    if (d.children) {
        collapse(d);
    }
    else if (d.data._children) {
        expand(d);
    }
    return d;
}
//# sourceMappingURL=toggle.js.map