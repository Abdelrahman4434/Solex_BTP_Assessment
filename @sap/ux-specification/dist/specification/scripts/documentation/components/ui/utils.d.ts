import type { HierarchyPointNode, HierarchyPointLink, HierarchyNode, Selection } from 'd3';
import type { TreeNode, TreeData } from '../types';
/**
 * Splits a camelCase string into separate words with spaces.
 *
 * @param elem - The camelCase string to be split.
 * @returns The string with words separated by spaces.
 */
export declare function splitName(elem: string): string;
/**
 * Determine the coordinates of an svg element.
 *
 * @param selection - The D3 selection of SVG group elements to determine their bounding boxes.
 */
export declare function getBB(selection: Selection<SVGGElement, HierarchyPointNode<TreeNode>, SVGGElement, {}>): void;
/**
 * Traverses a tree structure and applies a function to each node.
 *
 * @param parent - The root node or data structure to start traversal from.
 * @param visitFn - The function to apply to each visited node.
 * @param childrenFn - The function to retrieve the children of a node.
 */
export declare function visit(parent: HierarchyPointNode<TreeNode> | TreeData | Function, visitFn: Function, childrenFn: Function): void;
/**
 * Counts the number of nodes at each level of the tree.
 *
 * @param levelWidth - An array where each index represents a tree level and its value represents the number of nodes at that level.
 * @param level - The current level in the tree being traversed.
 * @param n - The current node being processed in the tree.
 */
export declare function childCount(levelWidth: number[], level: number, n: HierarchyNode<TreeNode>): void;
/**
 * Draws the links between the nodes.
 *
 * @param d - The link object containing source and target nodes.
 * @returns A string representing the SVG path for the link.
 */
export declare function diagonal(d: HierarchyPointLink<TreeNode>): string;
/**
 * Animates a specific node by fading its text in and out.
 *
 * @param node - The node to be animated.
 */
export declare function animateNode(node: HierarchyPointNode<TreeNode>): void;
//# sourceMappingURL=utils.d.ts.map