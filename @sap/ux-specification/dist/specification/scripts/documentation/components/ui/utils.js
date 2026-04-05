"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitName = splitName;
exports.getBB = getBB;
exports.visit = visit;
exports.childCount = childCount;
exports.diagonal = diagonal;
exports.animateNode = animateNode;
const d3_1 = require("d3");
const jquery_1 = __importDefault(require("jquery"));
// function to split CamelCase
/**
 * Splits a camelCase string into separate words with spaces.
 *
 * @param elem - The camelCase string to be split.
 * @returns The string with words separated by spaces.
 */
function splitName(elem) {
    const splitElem = elem
        .split(/(?=[A-Z])/)
        .map(function (p) {
        return p.charAt(0).toUpperCase() + p.slice(1);
    })
        .join(' ');
    return splitElem;
}
/**
 * Determine the coordinates of an svg element.
 *
 * @param selection - The D3 selection of SVG group elements to determine their bounding boxes.
 */
function getBB(selection) {
    selection.each(function (d) {
        d.data.bbox = this.getBBox();
    });
}
/**
 * Traverses a tree structure and applies a function to each node.
 *
 * @param parent - The root node or data structure to start traversal from.
 * @param visitFn - The function to apply to each visited node.
 * @param childrenFn - The function to retrieve the children of a node.
 */
function visit(parent, visitFn, childrenFn) {
    if (!parent) {
        return;
    }
    visitFn(parent);
    const children = childrenFn(parent);
    if (children) {
        const count = children.length;
        for (let i = 0; i < count; i++) {
            visit(children[i], visitFn, childrenFn);
        }
    }
}
/**
 * Counts the number of nodes at each level of the tree.
 *
 * @param levelWidth - An array where each index represents a tree level and its value represents the number of nodes at that level.
 * @param level - The current level in the tree being traversed.
 * @param n - The current node being processed in the tree.
 */
function childCount(levelWidth, level, n) {
    if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) {
            levelWidth.push(0);
        }
        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function (d) {
            childCount(levelWidth, level + 1, d);
        });
    }
}
/**
 * Draws the links between the nodes.
 *
 * @param d - The link object containing source and target nodes.
 * @returns A string representing the SVG path for the link.
 */
function diagonal(d) {
    let nodeGroup, width = 0;
    if (d.source.data.id) {
        nodeGroup = (0, d3_1.select)('#n-' + d.source.data.id).node();
    }
    // get width of node group element to set path accordingly
    if (nodeGroup) {
        width = nodeGroup.getBBox().width;
    }
    const path = 'M' + (d.source.y + width + 20) + ',' + d.source.x + 'H' + (d.target.y - 15) + 'V' + d.target.x + ('h' + 15);
    return path;
}
/**
 * Animates a specific node by fading its text in and out.
 *
 * @param node - The node to be animated.
 */
function animateNode(node) {
    for (let i = 0; i < 3; i++) {
        (0, jquery_1.default)('#n-' + node.data.id + ' .node-text')
            .fadeTo(400, 0)
            .fadeTo(400, 1);
    }
}
//# sourceMappingURL=utils.js.map