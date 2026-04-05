"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionAggregation = void 0;
const i18next_1 = __importDefault(require("i18next"));
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const utils_1 = require("../utils");
/**
 * Represents an aggregation for action object.
 */
class ActionAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.actions = [types_1.AggregationActions.Delete];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.isViewNode = true;
        this.sortableCollection = 'actions';
    }
    /**
     * Method parses object path key and returns action name.
     *
     * @returns Action name.
     */
    getTechnicalName() {
        const key = this.path[this.path.length - 1];
        if (key && typeof key === 'string') {
            const keyParts = key.split('::');
            // Primary method - check for specific key format using 'DATA_FIELD_ACTION'
            let action = '';
            if (keyParts[keyParts.length - 1].includes('.')) {
                for (let i = 0; i < keyParts.length; i++) {
                    if (keyParts[i] === types_1.DATA_FIELD_ACTION && keyParts[i + 1]) {
                        action = keyParts[i + 1];
                    }
                }
            }
            else {
                action = keyParts[keyParts.length - 1];
            }
            if (action) {
                const actionParts = action.split('.');
                return actionParts[actionParts.length - 1];
            }
        }
        return super.getTechnicalName();
    }
    /**
     * Public method to mark action as custom action.
     */
    markAsCustomAction() {
        this.custom = true;
        this.actions = [types_1.AggregationActions.OpenSource];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.additionalText = i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_ACTION');
        this.i18nKey = this.parent?.i18nKey;
        if (this.isMacrosNode()) {
            (0, utils_1.validateMacrosExtension)(this);
        }
        else {
            this.actions.push(types_1.AggregationActions.Delete);
        }
        // Validate anchor
        const anchor = this.aggregations.position?.properties.anchor;
        if (anchor?.value) {
            // Validate anchor if value exists
            const validEntries = anchor.schema.oneOf || [];
            if (!validEntries.some((entry) => entry.const === anchor.value)) {
                (0, utils_1.validateExtension)(this, false, i18next_1.default.t('PAGE_EDITOR_CUSTOM_EXTENSION_NO_ANCHOR'));
            }
        }
    }
    /**
     * Public method to mark action as standard action.
     */
    markAsStandardAction() {
        this.sortableItem = types_1.SortingOptions.Readonly;
        this.additionalText = i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_STANDARD_ACTION');
        this.i18nKey = this.parent?.i18nKey;
        this.removeAction(types_1.AggregationActions.Delete);
    }
    /**
     * Method returns action type from schema data.
     *
     * @returns Action type from schema.
     */
    getActionType() {
        return typeof this.schema?.actionType === 'string' ? this.schema.actionType : undefined;
    }
}
exports.ActionAggregation = ActionAggregation;
//# sourceMappingURL=ActionAggregation.js.map