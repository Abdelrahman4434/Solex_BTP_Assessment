import type { PageConfig, FlexibleColumnLayoutType } from '../../common';
import type { GlobalChartSettings, ObjectPageHeader, ObjectPageLayout, GenericSections, CustomSections, ObjectPageFooter, GlobalTableSettings, CreateMode } from '../controls';
export interface ObjectPageConfigV2 extends PageConfig {
    /**
     * Set showConfirmationOnDraftActivate to true to enable a confirmation before a save if you have pending warnings.
     */
    showConfirmationOnDraftActivate?: boolean;
    /**
     * If you set this property to true, the navigation chevron is hidden in case the launchpad indicates that the user has no authorization to navigate.
     */
    hideChevronForUnauthorizedExtNav?: boolean;
    /**
     * Restricts deep linking to certain object page levels.
     */
    allowDeepLinking?: boolean;
    /**
     * If you set navToListOnSave to true, the application will navigate back to the list on a save.
     */
    navToListOnSave?: boolean;
    /**
     * If this flag is set, then during inbound navigation to flexible column layout application, if the navigation context points to a unique object, the object page is opened in full screen mode.
     */
    defaultLayoutTypeIfExternalNavigation?: FlexibleColumnLayoutType.MidColumnFullScreen;
    /**
     * Settings for all tables of the object page.
     */
    globalTableSettings?: GlobalTableSettings;
    /**
     * Settings for all charts on an object page.
     */
    globalChartSettings?: GlobalChartSettings;
    header?: ObjectPageHeader;
    layout?: ObjectPageLayout;
    sections?: GenericSections | CustomSections;
    footer?: ObjectPageFooter;
    /**
     * This property applies to all tables within the page. Individual tables can override this setting by defining the property explicitly at table level.
     * You can set the following values for this property:
     * - creationRows: Used to enable empty rows mode. In create and edit mode, an empty row is added to the table.
     * - creationRowsHiddenInEditMode: Similar to "creationRows", but in edit mode, the empty row is only displayed when the user clicks the "Create" button. This option is available starting with SAPUI5 version 1.110.
     * - inline: In create and edit mode, users can use the "Create" button to add new entries to the table. We recommend to use "creationRows" instead.
     * By default, an empty row is not provided and the "Create" button automatically navigates to the item's object page for the newly created entry.
     */
    createMode?: CreateMode;
}
//# sourceMappingURL=ObjectPageConfigV2.d.ts.map