"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeDiagram = void 0;
const filter_1 = require("./filter");
const types_1 = require("./types");
const ui_1 = require("./ui");
/**
 * TreeDiagram class that handles the visualization and interaction of tree data.
 *
 */
class TreeDiagram {
    constructor() {
        this.TreeUI = new ui_1.TreeUI();
        window.addEventListener('message', (event) => this.messageHandler(event));
    }
    /**
     * Displays the tree diagram in the specified container.
     *
     * @param container - The ID of the container element to render the tree.
     * @param data - The tree data to display.
     * @param icon - The icon to use for the tree nodes.
     */
    show(container, data, icon) {
        this.treeData = data;
        this.TreeUI.render(container, data, icon);
    }
    /**
     * Sends a message to the parent window.
     *
     * @param message - The message to send.
     */
    sendMessage(message) {
        window.postMessage(message, document.location.origin);
    }
    /**
     * Handles incoming messages from the parent window.
     *
     * @param event - The message event containing the data.
     */
    messageHandler(event) {
        const { data = {} } = event;
        const { type } = data;
        switch (type) {
            case '[view] search-config-doc': {
                const { query } = data.payload;
                const filteredTreeData = (0, filter_1.filter)(this.treeData, query);
                this.TreeUI.applyFilter(filteredTreeData, query === '');
                break;
            }
            case '[view] expand-config-doc': {
                const { expand } = data.payload;
                this.TreeUI.toggleExpandAll(expand);
                break;
            }
            case '[view] zoom-config-doc': {
                const { level, center } = data.payload;
                const newLevel = this.TreeUI.zoomTree(level, center);
                if (newLevel !== level) {
                    // Notify about change
                    this.sendMessage({
                        type: types_1.CONFIG_DOC_ZOOM_UPDATE,
                        level: newLevel
                    });
                }
                break;
            }
        }
    }
}
exports.TreeDiagram = TreeDiagram;
//# sourceMappingURL=TreeDiagram.js.map