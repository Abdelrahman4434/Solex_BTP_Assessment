import type { HierarchyPointNode } from 'd3';
import type { TreeNode } from '../types';
/**
 * Expands the node path in the hierarchy.
 *
 * @param path - The path to expand as an array of indices.
 * @param rootNode - The root node of the hierarchy.
 * @returns The expanded node.
 */
export declare function expandNodePath(path: string[], rootNode: HierarchyPointNode<TreeNode>): HierarchyPointNode<TreeNode>;
/**
 * Sets up the in-built search functionality.
 *
 * @param treeData - The root node of the hierarchy.
 */
export declare function setupInBuiltSearch(treeData: HierarchyPointNode<TreeNode>): void;
//# sourceMappingURL=search.d.ts.map