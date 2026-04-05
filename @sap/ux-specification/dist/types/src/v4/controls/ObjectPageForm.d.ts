import type { ActionAfterExecutionConfiguration } from '../webapp/manifest/ManifestSettings';
import type { CustomActionOP, ObjectPageCustomActionMenu } from './CustomAction';
import type { ActionPriority, GroupableAction } from './Action';
import type { CustomField } from './CustomField';
interface ActionAfterExecutionConfigurationForm extends ActionAfterExecutionConfiguration {
}
export interface CustomFormActionOP extends CustomActionOP {
}
export interface FormActionBase {
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfigurationForm;
}
export interface FormAction extends FormActionBase, GroupableAction {
}
/**
 * Object Page Form
 *
 * @isViewNode true
 */
export interface ObjectPageForm {
    fields?: ObjectPageFormFields;
    actions?: ObjectPageFormActions;
}
export interface ObjectPageFormFields {
    [key: string]: CustomField;
}
export interface ObjectPageFormActions {
    [key: string]: FormAction | CustomFormActionOP | ObjectPageCustomActionMenu | ObjectPageFormActionGroup;
}
export interface ObjectPageFormActionGroup extends GroupableAction {
    [id: string]: FormActionBase | number | ActionPriority;
}
export {};
//# sourceMappingURL=ObjectPageForm.d.ts.map