"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MacrosRootAggregation = void 0;
const i18next_1 = __importDefault(require("i18next"));
const node_path_1 = require("node:path");
const ObjectAggregation_1 = require("../ObjectAggregation");
const project_access_1 = require("@sap-ux/project-access");
/**
 * Represents an aggregation for macros objects.
 */
class MacrosRootAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `MacrosRootAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.path = ['macros'];
        this.isViewNode = true;
        this.virtual = true;
        this.allowedAnnotationCreationForms = [];
        const filePath = this.schema?.metadata?.filePath;
        if (filePath) {
            this.setFilePath(filePath);
        }
    }
    /**
     * Public method returns display name of aggregation.
     *
     * @returns Display name of building blocks node.
     */
    getDisplayName() {
        return i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_BUILDING_BLOCK');
    }
    /**
     * Method stores passed file path as source of macros node.
     *
     * @param filePath File path to set.
     */
    setFilePath(filePath) {
        this.filePath = (0, node_path_1.join)(project_access_1.DirName.Webapp, filePath);
    }
}
exports.MacrosRootAggregation = MacrosRootAggregation;
//# sourceMappingURL=MacrosRoot.js.map