import type { v4 } from '@sap/ux-specification-types';
import type { CustomFormActionOP } from './ObjectPageFormAction';
import type { ObjectPageCustomActionMenu } from './ObjectPageToolBarAction';
export declare class ActionAfterExecutionConfigurationForm implements v4.ActionAfterExecutionConfiguration {
    navigateToInstance?: boolean;
    enableAutoScroll?: boolean;
}
export declare class FormActionBase implements v4.FormActionBase {
    afterExecution?: ActionAfterExecutionConfigurationForm;
}
export declare class FormAction extends FormActionBase implements v4.FormAction {
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ObjectPageFormActionGroup implements v4.ObjectPageFormActionGroup {
    [key: string]: FormActionBase | number | v4.ActionPriority;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ObjectPageFormActions implements v4.ObjectPageFormActions {
    [key: string]: FormAction | CustomFormActionOP | ObjectPageCustomActionMenu | ObjectPageFormActionGroup;
}
export declare class ObjectPageForm implements v4.ObjectPageForm {
    actions: ObjectPageFormActions;
}
//# sourceMappingURL=ObjectPageForm.d.ts.map