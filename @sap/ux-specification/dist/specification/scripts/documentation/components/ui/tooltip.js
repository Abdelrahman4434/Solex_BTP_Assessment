"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tooltipElements = void 0;
exports.removeTooltip = removeTooltip;
exports.showTooltip = showTooltip;
exports.getTooltipCoordinates = getTooltipCoordinates;
const d3_1 = require("d3");
const icons_1 = require("./icons");
let restoreFocus;
/**
 * Removes the tooltip from the DOM and restores focus to the previously focused element.
 *
 * @param tooltipDiv - The D3 selection of the tooltip HTMLDivElement to be removed.
 */
function removeTooltip(tooltipDiv) {
    tooltipDiv.attr('tabindex', '-1').style('opacity', 1e-6).style('display', 'none');
    restoreFocus?.focus();
    restoreFocus = undefined;
}
/**
 * Generates the HTML elements for the tooltip based on the provided data.
 *
 * @param d - The data node containing information to populate the tooltip.
 * @returns The HTML string representing the tooltip elements.
 */
const tooltipElements = function (d) {
    const closeButton = '<div id="tooltip_close-button">' + icons_1.closeIcon + '</div>', name = '<div class="tip_prop">' + d.data.name + ' </div>', description = '<div class="tip_desc">' + d.data.description + '</div>', type = '<div class="tip_type">' + d.data.type + '</div>', enums = '<div class="tip_enums">' + d.data.type.replaceAll('|', ' | ') + '</div>', controlType = '<div class="tip_control">' + d.data.control + '</div>';
    let elements = closeButton;
    elements += name;
    // checks which data exist
    if (d.data.description) {
        elements += description;
    }
    if (d.data.type) {
        elements += '<div class="tip_type-container">';
        if (d.data.type.includes('|')) {
            elements += enums;
        }
        else {
            elements += type;
        }
    }
    if (d.data.artifact) {
        elements += '<div class="tip_type">' + d.data.artifact + '</div>';
    }
    if (d.data.control) {
        elements += controlType;
    }
    if (d.data.type) {
        elements += '</div>';
    }
    return elements;
};
exports.tooltipElements = tooltipElements;
/**
 * Function to display tooltip depending on data.
 *
 * @param coordinates - The x and y coordinates where the tooltip should be displayed.
 * @param d - The data node containing information to populate the tooltip.
 * @param tooltipDiv - The D3 selection of the tooltip HTMLDivElement to be displayed.
 */
function showTooltip(coordinates, d, tooltipDiv) {
    restoreFocus = document.activeElement;
    const outerSVG = (0, d3_1.select)('svg#tree-container').node();
    // get dimensions of svg container to position tooltip
    const outWidth = outerSVG.getBoundingClientRect().width - 420;
    const outHeight = outerSVG.getBoundingClientRect().height - 300;
    if (coordinates.x > outWidth && coordinates.y > outHeight) {
        tooltipDiv
            .style('top', coordinates.y - 20 + 'px')
            .style('left', coordinates.x - 20 + 'px')
            .style('transform', 'translate(-100%, -100%)');
    }
    else if (coordinates.x > outWidth && coordinates.y <= outHeight) {
        tooltipDiv
            .style('top', coordinates.y + 20 + 'px')
            .style('left', coordinates.x - 20 + 'px')
            .style('transform', 'translate(-100%, 0)');
    }
    else if (coordinates.x <= outWidth && coordinates.y > outHeight) {
        tooltipDiv
            .style('top', coordinates.y - 20 + 'px')
            .style('left', coordinates.x + 20 + 'px')
            .style('transform', 'translate(0, -100%)');
    }
    else {
        tooltipDiv
            .style('top', coordinates.y + 20 + 'px')
            .style('left', coordinates.x + 20 + 'px')
            .style('transform', 'translate(0, 0)');
    }
    if (d.data.description || d.data.type) {
        tooltipDiv.html((0, exports.tooltipElements)(d));
        tooltipDiv.style('opacity', 1).style('display', 'flex').attr('tabindex', '0').node().focus();
        (0, d3_1.select)('#tooltip_close-button').on('click', function () {
            removeTooltip(tooltipDiv);
        });
    }
    else if (!d.data.type) {
        removeTooltip(tooltipDiv);
    }
}
/**
 * Calculates the tooltip coordinates based on the target element's bounding rectangle.
 *
 * @param event - The keyboard event containing the target element.
 * @returns The x and y coordinates for the tooltip.
 */
function getTooltipCoordinates(event) {
    if (event.target instanceof Element) {
        const targetRect = event.target.getBoundingClientRect();
        return {
            x: targetRect.x,
            y: targetRect.y
        };
    }
}
//# sourceMappingURL=tooltip.js.map