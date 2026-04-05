import type { PopinLayout } from 'sap/m/library';
import type { CommonAppSettings, Dependencies, ViewTypes } from '../common';
import type { EmptyOption, TableCreationModeType } from './controls';
import type { FlexibleColumnLayoutV4, SapUi5ControllerExtensionV4 } from './webapp';
export interface AppSettings extends CommonAppSettings {
    /**
     * The flexible column layout allows users to see more details on the page, and to expand and collapse the screen areas.
     */
    flexibleColumnLayout?: FlexibleColumnLayoutV4;
    /**
     * Represents a prefix that is prepended in front of the viewName
     */
    path?: string;
    /**
     * standard view type of views
     */
    viewType?: ViewTypes;
    /**
     * Controller extensions allow users to extensiate default behaviour with custom controllers code.
     */
    controllerExtensions?: ControllerExtensions;
    /**
     * Dependencies of the application.
     */
    dependencies?: Dependencies;
    /**
     * Hidden draft features.
     */
    hideDraft?: HideDraft;
    /**
     * Define the default creation mode that is used for all tables, unless a specific creation mode has been set.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/cfb04f0c58e7409992feb4c91aa9410b
     */
    defaultCreationMode?: TableCreationModeType.InlineCreationRows | EmptyOption;
    /**
     * Defines the default layout options of the table popins. A separate layout options of the table popins can be set for each responsive table in the application.
     *
     * @descriptionSrcURL https://help.sap.com/docs/SAPUI5/b1cda5dc7a7644eb886bc6ac04c0b438/7f844f1021cd4791b8f7408eac7c1cec.html
     */
    defaultPopinLayout?: PopinLayout.Block | PopinLayout.GridSmall | PopinLayout.GridLarge;
    /**
     * Enables lazy loading for sections in object pages. If a specific object page defines its own `enableLazyLoading` property, that page-level setting overrides this application-level setting.
     *
     * @descriptionSrcURL https://ui5.sap.com/#/topic/ac035701f0f94bcca2d051bba9f1880d
     */
    enableLazyLoading?: boolean;
}
export type HideDraft = {
    /**
     * All features related to draft handling can be hidden from the UI while the draft functionality remains active in the background. To achieve this, enable the 'Hide Draft' property.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/ed9aa41c563a44b18701529c8327db4d
     */
    enabled: true;
    /**
     * Determines whether to stay on the current page after saving an object.
     * To ensure a consistent experience, set this and 'Stay On Current Page After Cancel' to the same value.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/ed9aa41c563a44b18701529c8327db4d
     */
    stayOnCurrentPageAfterSave?: boolean;
    /**
     * Determines whether to stay on the current page after canceling an object.
     * To ensure a consistent experience, set this and 'Stay On Current Page After Save' to the same value.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/ed9aa41c563a44b18701529c8327db4d
     */
    stayOnCurrentPageAfterCancel?: boolean;
    /**
     * Controls the visibility of the 'Create Next' button.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/ed9aa41c563a44b18701529c8327db4d
     */
    hideCreateNext?: boolean;
} | {
    /**
     * All features related to draft handling can be hidden from the UI while the draft functionality remains active in the background. To achieve this, enable the 'Hide Draft' property.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/ed9aa41c563a44b18701529c8327db4d
     */
    enabled?: false;
};
export interface ControllerExtensions {
    [key: string]: SapUi5ControllerExtensionV4;
}
//# sourceMappingURL=application.d.ts.map