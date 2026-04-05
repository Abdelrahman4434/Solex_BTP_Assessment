import type { CommonAppSettings, FlexibleColumnLayout, TableColumnVerticalAlignment, DraftDiscardConfirmationSettings, StatePreservationMode } from '../common';
import type { CreateMode } from './controls';
export interface GlobalApplicationTableSettings {
    /**
     * This property acts as a global default for all pages and tables in the application. Page-level or table-level definitions override this setting.
     * You can set the following values for this property:
     * - creationRows: Used to enable empty rows mode. In create and edit mode, an empty row is added to the table.
     * - creationRowsHiddenInEditMode: Similar to "creationRows", but in edit mode, the empty row is only displayed when the user clicks the "Create" button. This option is available starting with SAPUI5 version 1.110.
     * - inline: In create and edit mode, users can use the "Create" button to add new entries to the table. We recommend to use "creationRows" instead.
     * By default, an empty row is not provided and the "Create" button automatically navigates to the item's object page for the newly created entry.
     *
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/cfb04f0c58e7409992feb4c91aa9410b
     */
    createMode?: CreateMode.creationRows | CreateMode.creationRowsHiddenInEditMode | CreateMode.inline;
}
export interface AppSettings extends CommonAppSettings {
    /**
     * If forceGlobalRefresh is not explicitly set to false, a global model refresh is triggered when the annotated side effects are executed.
     */
    forceGlobalRefresh?: boolean;
    /**
     * The flexible column layout allows users to see more details on the page, and to expand and collapse the screen areas.
     */
    flexibleColumnLayout?: FlexibleColumnLayout;
    /**
     * tableColumnVerticalAlignment provides an option for vertical alignment for the whole responsive table.
     */
    tableColumnVerticalAlignment?: TableColumnVerticalAlignment;
    /**
     * Allows applications to configure confirmation popups in various scenarios.
     */
    draftDiscardConfirmationSettings?: DraftDiscardConfirmationSettings;
    /**
     * Allows applications to configure persistence mode in an object page. Persistence mode retains the tab selection made on an object page in certain cases.
     */
    statePreservationMode?: StatePreservationMode;
    /**
     * Settings for all tables.
     */
    globalTableSettings?: GlobalApplicationTableSettings;
}
//# sourceMappingURL=application.d.ts.map