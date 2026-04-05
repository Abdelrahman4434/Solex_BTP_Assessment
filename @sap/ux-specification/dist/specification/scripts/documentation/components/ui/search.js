"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandNodePath = expandNodePath;
exports.setupInBuiltSearch = setupInBuiltSearch;
const toggle_1 = require("./toggle");
const utils_1 = require("./utils");
/**
 * Creates the path to nodes for search.
 *
 * @param node - The current node in the hierarchy.
 * @param path - The path array to accumulate indices.
 * @returns The path to the node as an array of indices.
 */
function getNodePath(node, path = []) {
    const p = path || [];
    const parent = node.parent;
    if (parent) {
        const children = parent.children || parent.data._children;
        p.unshift(children.indexOf(node));
        return getNodePath(parent, p);
    }
    else {
        return p;
    }
}
/**
 * Sets up the search list.
 *
 * @param root - The root node of the hierarchy.
 * @returns An array of search strings with paths to the nodes.
 */
function createSearchList(root) {
    const searchList = [];
    (0, utils_1.visit)(root, 
    /**
     * Creates the search list with paths to the nodes.
     *
     * @param current - The current node in the hierarchy.
     */
    (current) => {
        if (current) {
            searchList.push(current.data.name + '|' + getNodePath(current, []).join('-'));
        }
    }, 
    /**
     * Gets the children of the current node.
     *
     * @param current - The current node in the hierarchy.
     * @returns The children of the current node.
     */
    (current) => {
        return current.children || current.data._children;
    });
    // Removes name of floorplan from search list
    searchList.splice(searchList.indexOf(root.data.name + '|'), 1).sort((a, b) => a.localeCompare(b));
    return searchList;
}
/**
 * Gets a DOM element by its selector.
 *
 * @param selector - The CSS selector of the element.
 * @returns The DOM element.
 */
function getDOMElement(selector) {
    return document.querySelector(selector);
}
/**
 * Shows a DOM element by setting its display style to 'block'.
 *
 * @param element - The DOM element to show.
 */
function showDOMElement(element) {
    element.style.display = 'block';
}
/**
 * Hides a DOM element by setting its display style to 'none'.
 *
 * @param element - The DOM element to hide.
 */
function hideDOMElement(element) {
    element.style.display = 'none';
}
/**
 * Removes all child elements from a container and hides it.
 *
 * @param container - The container element.
 */
function removeDOMElements(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    hideDOMElement(container);
}
/**
 * Creates and appends a DOM element to a container.
 *
 * @param content - The content to set in the new element.
 * @param container - The container to append the new element to.
 */
function createDOMElements(content, container) {
    const listElement = document.createElement('li');
    listElement.setAttribute('data-path', content.split('|')[1]);
    listElement.textContent = (0, utils_1.splitName)(content.split('|')[0]);
    container.appendChild(listElement);
    showDOMElement(container);
}
/**
 * Handles the search input event.
 *
 * @param items - The list of searchable items.
 * @param inputElement - The input element for search.
 * @param icon - The icon element to show or hide.
 * @param container - The container for search results.
 */
function searchInputEventHandler(items, inputElement, icon, container) {
    const searchValue = inputElement.value.toUpperCase().trim();
    if (searchValue === null || searchValue === '') {
        removeDOMElements(container);
        hideDOMElement(icon);
    }
    else {
        for (const item of items) {
            const listValue = item.split('|')[0].toUpperCase();
            if (listValue.indexOf(searchValue) >= 0 || listValue.replace(/\s/g, '').indexOf(searchValue) >= 0) {
                createDOMElements(item, container);
            }
            showDOMElement(icon);
        }
    }
}
/**
 * Expands the node path in the hierarchy.
 *
 * @param path - The path to expand as an array of indices.
 * @param rootNode - The root node of the hierarchy.
 * @returns The expanded node.
 */
function expandNodePath(path, rootNode) {
    let node = rootNode; // Start with root
    for (const element of path) {
        if (node.data._children) {
            (0, toggle_1.expand)(node);
        }
        node = node.children[element];
    }
    return node;
}
/**
 * Sets up the in-built search functionality.
 *
 * @param treeData - The root node of the hierarchy.
 */
function setupInBuiltSearch(treeData) {
    const searchInputElement = getDOMElement('#search-input');
    const searchResultContainer = getDOMElement('#search-result');
    const searchContainer = getDOMElement('#search-container');
    const searchIcon = getDOMElement('#search-icon');
    const searchCloseIcon = getDOMElement('#search-close-icon');
    if (!searchContainer) {
        return;
    }
    else {
        searchCloseIcon.addEventListener('click', () => {
            searchInputElement.value = null;
            removeDOMElements(searchResultContainer);
            hideDOMElement(searchCloseIcon);
        });
        searchContainer.addEventListener('focusin', () => {
            hideDOMElement(searchIcon);
        });
        searchContainer.addEventListener('focusout', () => {
            showDOMElement(searchIcon);
        });
        searchInputElement.addEventListener('input', () => {
            removeDOMElements(searchResultContainer);
            searchInputEventHandler(createSearchList(treeData), searchInputElement, searchCloseIcon, searchResultContainer);
        });
    }
}
//# sourceMappingURL=search.js.map