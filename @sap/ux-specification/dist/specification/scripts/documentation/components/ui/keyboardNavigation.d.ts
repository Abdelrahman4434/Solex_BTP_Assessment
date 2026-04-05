import type { TreeNode, NavigationResult } from '../types';
import type { HierarchyPointNode } from 'd3';
/**
 * Checks if a node is within the viewport of a container.
 *
 * @param rect - The bounding rectangle of the node.
 * @param containerRect - The bounding rectangle of the container.
 * @returns True if the node is within the viewport, otherwise false.
 */
export declare function checkIfNodeInViewport(rect: DOMRect, containerRect: DOMRect): boolean;
/**
 * Toggles the tabindex attribute of the specified node.
 *
 * @param d - The node for which to toggle the tabindex.
 */
export declare function toggleTabIndex(d: HierarchyPointNode<TreeNode>): void;
/**
 * Toggles the active focus on the specified node.
 *
 * @param d - The node to toggle active focus on.
 */
export declare function toggleActiveFocus(d: HierarchyPointNode<TreeNode>): void;
export declare const handleNavigationKeys: (key: string, d: HierarchyPointNode<TreeNode>) => NavigationResult;
//# sourceMappingURL=keyboardNavigation.d.ts.map