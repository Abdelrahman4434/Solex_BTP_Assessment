"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportActionMenuMenu = exports.exportActionMenuDefaultAction = exports.exportActionMenuAction = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
/**
 * Type guard for "plain object" records that we can safely index into.
 *
 * @param value - The value to be checked.
 * @returns True if the value is a record; otherwise, false.
 */
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Export handler for action-menu `actions`.
 *
 * `actions` is an internal-only (in-memory) helper structure used by the configuration model
 * to represent sub-actions of a menu. It must NOT be written to the exported manifest.
 *
 * The export engine calls this function because the property has a `syncRule.manifest.export` hook.
 * By intentionally doing nothing here, we prevent the default exporter from writing the `actions`
 * property into the manifest.
 *
 */
const exportActionMenuAction = () => {
    // no-op by design
};
exports.exportActionMenuAction = exportActionMenuAction;
/**
 * If `defaultAction` is set, it must be contained in the effective `menu` (when available as an array).
 * We prefer the menu from the configObject (source of truth) and fall back to the current manifest value.
 *
 * IMPORTANT: Export order is not deterministic, so validating against a stale manifest value may lead
 * to non-deterministic results.
 *
 * @param manifestSection - The manifest section that may contain a default action and menu properties.
 * @param configObject - The configuration object that may provide an alternate menu.
 */
function ensureDefaultActionIsInMenu(manifestSection, configObject) {
    const defaultAction = manifestSection[ux_specification_types_1.PropertyName.defaultAction];
    if (!defaultAction) {
        return;
    }
    const menuFromConfig = configObject[ux_specification_types_1.PropertyName.menu];
    const menuEffective = Array.isArray(menuFromConfig) ? menuFromConfig : manifestSection[ux_specification_types_1.PropertyName.menu];
    if (Array.isArray(menuEffective) && !menuEffective.includes(defaultAction)) {
        delete manifestSection[ux_specification_types_1.PropertyName.defaultAction];
    }
}
/**
 * Updates the manifest section by setting its default action based on the provided configuration object
 * and ensuring the default action exists within the menu array if applicable. If constraints are not satisfied,
 * the default action is removed.
 *
 * @param manifestSection - The manifest section object to be updated.
 * @param configObject - The configuration object containing potential default action definitions.
 * @param key - The key used to retrieve the default action value from the configuration object.
 */
const exportActionMenuDefaultAction = (manifestSection, configObject, key) => {
    if (!isRecord(manifestSection) || !isRecord(configObject)) {
        return;
    }
    const value = configObject[key];
    if (typeof value === 'string' && value.length > 0) {
        manifestSection[ux_specification_types_1.PropertyName.defaultAction] = value;
    }
    else {
        delete manifestSection[ux_specification_types_1.PropertyName.defaultAction];
        return;
    }
    ensureDefaultActionIsInMenu(manifestSection, configObject);
};
exports.exportActionMenuDefaultAction = exportActionMenuDefaultAction;
/**
 * Exports the action menu `menu` property to the manifest.
 *
 * Why this export hook exists (similar motivation as for `exportActionMenuAction`):
 * - The exporter runs on top of an existing manifest; values in the manifest can be stale during export.
 * - Export order of properties is not deterministic.
 * Therefore, besides writing `menu`, we also enforce the invariant that `defaultAction` must be included
 * in the (effective) menu list. The validation uses the configObject as the source of truth to avoid
 * order-dependent results.
 *
 * @param manifestSection - The section of the manifest to update.
 * @param configObject - The configuration object containing potential menu values.
 * @param key - The key in the configuration object where menu values reside (usually 'menu').
 */
const exportActionMenuMenu = (manifestSection, configObject, key) => {
    if (!isRecord(manifestSection) || !isRecord(configObject)) {
        return;
    }
    const menuValue = configObject[key];
    if (Array.isArray(menuValue)) {
        manifestSection[key] = menuValue;
    }
    ensureDefaultActionIsInMenu(manifestSection, configObject);
};
exports.exportActionMenuMenu = exportActionMenuMenu;
//# sourceMappingURL=actions.js.map