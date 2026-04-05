"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindingContextRelative = exports.bindingContextAbsolute = exports.BuildingBlockType = void 0;
/**
 * Building block type.
 *
 * @enum {string}
 */
var BuildingBlockType;
(function (BuildingBlockType) {
    BuildingBlockType["FilterBar"] = "filter-bar";
    BuildingBlockType["Chart"] = "chart";
    BuildingBlockType["CustomFilterField"] = "custom-filter-field";
    BuildingBlockType["Field"] = "field";
    BuildingBlockType["Form"] = "form";
    BuildingBlockType["Page"] = "page";
    BuildingBlockType["Table"] = "table";
    BuildingBlockType["CustomColumn"] = "custom-column";
    BuildingBlockType["RichTextEditor"] = "rich-text-editor";
    BuildingBlockType["RichTextEditorButtonGroups"] = "rich-text-editor-button-groups";
    BuildingBlockType["Action"] = "action";
})(BuildingBlockType || (exports.BuildingBlockType = BuildingBlockType = {}));
exports.bindingContextAbsolute = 'absolute';
exports.bindingContextRelative = 'relative';
//# sourceMappingURL=types.js.map