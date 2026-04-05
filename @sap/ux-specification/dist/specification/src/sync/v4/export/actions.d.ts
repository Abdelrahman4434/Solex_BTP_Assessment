import { type ExportHandlerFunction } from '@sap/ux-specification-types';
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
export declare const exportActionMenuAction: ExportHandlerFunction;
/**
 * Updates the manifest section by setting its default action based on the provided configuration object
 * and ensuring the default action exists within the menu array if applicable. If constraints are not satisfied,
 * the default action is removed.
 *
 * @param manifestSection - The manifest section object to be updated.
 * @param configObject - The configuration object containing potential default action definitions.
 * @param key - The key used to retrieve the default action value from the configuration object.
 */
export declare const exportActionMenuDefaultAction: ExportHandlerFunction;
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
export declare const exportActionMenuMenu: ExportHandlerFunction;
//# sourceMappingURL=actions.d.ts.map