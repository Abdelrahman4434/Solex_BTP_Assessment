import type { HierarchyPointNode, Selection } from 'd3';
import type { TreeNode, TooltipCoordinates } from '../types';
/**
 * Removes the tooltip from the DOM and restores focus to the previously focused element.
 *
 * @param tooltipDiv - The D3 selection of the tooltip HTMLDivElement to be removed.
 */
export declare function removeTooltip(tooltipDiv: Selection<HTMLDivElement, TreeNode, HTMLElement, {}>): void;
/**
 * Generates the HTML elements for the tooltip based on the provided data.
 *
 * @param d - The data node containing information to populate the tooltip.
 * @returns The HTML string representing the tooltip elements.
 */
export declare const tooltipElements: (d: HierarchyPointNode<any>) => string;
/**
 * Function to display tooltip depending on data.
 *
 * @param coordinates - The x and y coordinates where the tooltip should be displayed.
 * @param d - The data node containing information to populate the tooltip.
 * @param tooltipDiv - The D3 selection of the tooltip HTMLDivElement to be displayed.
 */
export declare function showTooltip(coordinates: TooltipCoordinates, d: HierarchyPointNode<TreeNode>, tooltipDiv: Selection<HTMLDivElement, TreeNode, HTMLElement, {}>): void;
/**
 * Calculates the tooltip coordinates based on the target element's bounding rectangle.
 *
 * @param event - The keyboard event containing the target element.
 * @returns The x and y coordinates for the tooltip.
 */
export declare function getTooltipCoordinates(event: KeyboardEvent): TooltipCoordinates;
//# sourceMappingURL=tooltip.d.ts.map