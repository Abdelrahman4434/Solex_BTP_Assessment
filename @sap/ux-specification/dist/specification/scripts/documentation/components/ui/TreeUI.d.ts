import type { HierarchyPointNode, HierarchyNode, Selection } from 'd3';
import type { TreeNode, TreeData } from '../types';
export declare class TreeUI {
    private innerHeight;
    private innerWidth;
    private maxLabelLength;
    private levelWidth;
    private countID;
    private duration;
    private rawTreeData;
    root: HierarchyNode<TreeNode>;
    rootNode: HierarchyPointNode<TreeNode>;
    private treeIcon;
    private searchResultContainer;
    private buttonContainer;
    svgTreeContainer: Selection<SVGSVGElement, TreeNode, HTMLElement, {}>;
    svgTreeGroup: Selection<SVGGElement, TreeNode, HTMLElement, {}>;
    private toolTip;
    private treeLayout;
    private nodes;
    private links;
    private zoomListener;
    private canvasOffset;
    constructor();
    /**
     * Renders the tree in the specified container with the provided data and icon.
     *
     * @param container - The CSS selector for the container element where the tree will be rendered.
     * @param data - The hierarchical tree data to be rendered.
     * @param icon - The icon to be displayed for the root node.
     */
    render(container: string, data: TreeData, icon: string): void;
    /**
     * Toggles the expand/collapse state of all nodes in the tree.
     *
     * @param expand - A boolean indicating whether to expand (true) or collapse (false) all nodes in the tree.
     */
    toggleExpandAll(expand: boolean): void;
    /**
     * Applies the filter to the tree based on the updated tree data.
     *
     * @param updatedTreeData - The updated hierarchical tree data to apply the filter.
     * @param clear - A boolean indicating whether to clear the filter (true) or not (false).
     */
    applyFilter(updatedTreeData: TreeData, clear: boolean): void;
    /**
     * Zooms the tree based on the zoom event.
     *
     * @param event - The zoom event containing transformation details.
     */
    private zoom;
    /**
     * Zooms the tree to a specified scale value and optionally centers it.
     *
     * @param value - The zoom scale value. If 0, fits the tree to the canvas.
     * @param center - Whether to center the tree after zooming.
     * @returns The applied zoom scale value.
     */
    zoomTree(value: number, center?: boolean): number;
    /**
     * Fits the tree to the canvas by adjusting the zoom scale and position.
     *
     * @returns The applied zoom scale value.
     */
    private fitToCanvas;
    /**
     * Centers the tree or a specific node in the tree.
     *
     * @param source - The source node to center in the tree.
     * @param ratio - The ratio used to calculate the position for centering the node.
     */
    private centerNode;
    private centerTree;
    private updateCanvasSize;
    /**
     * Creates the root hierarchy for the tree structure based on the provided tree data.
     *
     * @param rootData - The hierarchical tree data used to create the root hierarchy.
     * @returns The root hierarchy node of the tree.
     */
    private createRootHierarchy;
    private setupEventListeners;
    /**
     * Attaches event listeners to a node element and invokes a callback on specific events.
     *
     * @param element - The D3 selection of the node element to attach events to.
     * @param cb - The callback function to execute on click or keydown events.
     * @returns The updated D3 selection with event listeners attached.
     */
    private handleEventOnNode;
    /**
     * Updates the tree structure and repositions nodes and links based on the provided source node.
     *
     * @param source - The source node from which the tree update starts.
     */
    private updateTree;
    /**
     * Calculates and returns the content height of the tree based on the number of levels.
     *
     * @returns The calculated content height in pixels.
     */
    private getContentHeight;
    /**
     * Toggles the expand or collapse state of a tree node based on the event.
     *
     * @param event - The event triggering the toggle action (e.g., click or keydown).
     * @param d - The tree node to be toggled.
     */
    private toggleExpandOrCollapse;
}
//# sourceMappingURL=TreeUI.d.ts.map