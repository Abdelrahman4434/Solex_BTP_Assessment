import type { TreeData } from './types';
/**
 * TreeDiagram class that handles the visualization and interaction of tree data.
 *
 */
export declare class TreeDiagram {
    private TreeUI;
    private treeData;
    constructor();
    /**
     * Displays the tree diagram in the specified container.
     *
     * @param container - The ID of the container element to render the tree.
     * @param data - The tree data to display.
     * @param icon - The icon to use for the tree nodes.
     */
    show(container: string, data: TreeData, icon: string): void;
    /**
     * Sends a message to the parent window.
     *
     * @param message - The message to send.
     */
    private sendMessage;
    /**
     * Handles incoming messages from the parent window.
     *
     * @param event - The message event containing the data.
     */
    messageHandler(event: MessageEvent): void;
}
//# sourceMappingURL=TreeDiagram.d.ts.map