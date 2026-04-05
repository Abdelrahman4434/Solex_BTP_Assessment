import type { HierarchyPointNode } from 'd3';
import type { TreeNode } from '../types';
/**
 * Collapses the given node by hiding its children and storing them in `_children`.
 *
 * @param d - The node to collapse.
 */
export declare function collapse(d: HierarchyPointNode<TreeNode>): void;
/**
 * Expands the given node by restoring its children from `_children`.
 *
 * @param d - The node to expand.
 */
export declare function expand(d: HierarchyPointNode<TreeNode>): void;
/**
 * Expands all nodes in the hierarchy starting from the given node.
 *
 * @param d - The root node to start expanding from.
 */
export declare function expandAll(d: HierarchyPointNode<TreeNode>): void;
/**
 * Toggles the children of the given node. If the node is expanded, it will be collapsed, and vice versa.
 *
 * @param d - The node to toggle.
 * @returns The toggled node.
 */
export declare function toggleChildren(d: HierarchyPointNode<TreeNode>): HierarchyPointNode<TreeNode>;
//# sourceMappingURL=toggle.d.ts.map