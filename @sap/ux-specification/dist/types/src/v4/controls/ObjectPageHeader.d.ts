import type { HeaderSections } from './ObjectPageHeaderSection';
import type { ActionAfterExecutionConfiguration } from '../webapp/manifest/ManifestSettings';
import type { CustomActionMenuBase, CustomActionOP, CustomActionPositionOP } from './CustomAction';
import type { ActionPriority, GroupableAction } from './Action';
export interface ActionAfterExecutionConfigurationObjectPageHeader extends ActionAfterExecutionConfiguration {
}
export interface CustomHeaderActionPositionOP extends CustomActionPositionOP {
}
export interface CustomHeaderActionOP extends CustomActionOP {
    position?: CustomHeaderActionPositionOP;
}
export interface ObjectPageHeaderActionBase {
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfigurationObjectPageHeader;
}
export interface ObjectPageHeaderAction extends ObjectPageHeaderActionBase, GroupableAction {
}
export interface SemanticObjectPropertyMapping {
    [id: string]: string;
}
/**
 * @isViewNode true
 */
export interface AdditionalSemanticObject {
    /**
     * Define the list of semantic object links displayed under the Related Apps button.
     */
    allowedActions?: string[];
    /**
     * Determines the navigation actions of the semantic object that are hidden from under the Related Apps button.
     */
    unavailableActions?: string[];
    /**
     * Mapping, defined for a semantic object, consists of key value pairs. The key defines the way in which the source application (object page) passes the context. The value represents the term used for the same entity in the target app.
     */
    mapping?: SemanticObjectPropertyMapping;
}
/**
 * Adds additional links under the Related Apps button by specifying semantic objects.
 *
 * @isViewNode true
 */
export interface AdditionalSemanticObjects {
    [id: string]: AdditionalSemanticObject;
}
export interface RelatedApps {
    /**
     * Set showRelatedApps to true to show the navigation button for related apps.
     */
    showRelatedApps?: boolean;
    /**
     * Additional Semantic Objects
     */
    additionalSemanticObjects: AdditionalSemanticObjects;
}
export interface ObjectPageHeaderActionGroup extends GroupableAction {
    [id: string]: ObjectPageHeaderActionBase | number | ActionPriority;
}
/**
 * @isViewNode true
 */
export interface ObjectPageHeaderCustomActionMenu extends CustomActionMenuBase {
    /**
     * List of actions.
     *
     * @hidden true
     * @isViewNode false
     */
    actions?: ObjectPageHeaderCustomActionMenuActions;
    position?: CustomHeaderActionPositionOP;
}
/**
 * @isViewNode false
 */
export interface ObjectPageHeaderCustomActionMenuActions {
    [id: string]: ObjectPageHeaderAction | CustomHeaderActionOP | RelatedApps | ObjectPageHeaderActionGroup;
}
export interface ObjectPageHeaderActions {
    [id: string]: ObjectPageHeaderAction | CustomHeaderActionOP | ObjectPageHeaderCustomActionMenu | RelatedApps | ObjectPageHeaderActionGroup;
}
/**
 * Header
 *
 * @isViewNode true
 */
export interface ObjectPageHeader {
    /**
     * Set editableHeaderContent to true to make the header fields editable.
     */
    editableHeaderContent?: boolean;
    /**
     * Set visible to true to make the header visible.
     */
    visible?: boolean;
    /**
     * Determines whether the anchor bar is displayed.
     */
    anchorBarVisible?: boolean;
    actions?: ObjectPageHeaderActions;
    sections?: HeaderSections;
}
//# sourceMappingURL=ObjectPageHeader.d.ts.map