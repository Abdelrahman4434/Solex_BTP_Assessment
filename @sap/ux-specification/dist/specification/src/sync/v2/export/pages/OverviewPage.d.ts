import type { v2 } from '@sap/ux-specification-types';
import type { ListCard, AnalyticalCard, StackCard, LinklistCard, TableCard, CustomCard } from '../controls/Card';
import type { RefreshStrategiesPropDef, ResizableLayoutVariant } from '@ui5/manifest/types/manifest';
/**
 * Imports date settings for the Overview Page.
 *
 * @param manifestSection - The manifest section containing date settings.
 * @returns The imported date settings as a `v2.DateRange` object.
 */
export declare function importDateSettingsOVP(manifestSection: object): v2.DateRange;
/**
 * Imports filter settings for the Overview Page.
 *
 * @param manifestSection - The manifest section containing filter settings.
 * @returns The imported filter settings as an object.
 */
export declare function importFilterSettings(manifestSection: object): object;
/**
 * Exports filter settings for the Overview Page.
 *
 * @param manifestSection - The manifest section to populate.
 * @param configPart - The configuration part containing filter settings.
 */
export declare function exportFilterSettings(manifestSection: object, configPart: v2.FilterSettingsType): void;
type CardClassType = ListCard | AnalyticalCard | StackCard | LinklistCard | TableCard | CustomCard;
/**
 * Represents the Overview Page configuration.
 */
export declare class OverviewPage implements v2.OverviewPageConfigV2 {
    globalFilterModel?: string;
    globalFilterEntityType?: string;
    globalFilterEntitySet?: string;
    showBasicSearch?: boolean;
    disableErrorPage?: boolean;
    smartVariantRequired?: boolean;
    bHeaderExpanded?: boolean;
    containerLayout?: v2.ContainerLayoutType;
    showDateInRelativeFormat?: boolean;
    disableTableCardFlexibility?: boolean;
    enableLiveFilter?: boolean;
    enableLazyRendering?: boolean;
    refreshStrategyOnAppRestore?: RefreshStrategiesPropDef;
    considerAnalyticalParameters?: boolean;
    refreshIntervalInMinutes?: number;
    useDateRangeType?: boolean;
    chartSettings?: v2.ChartSettingsType;
    filterSettings?: v2.FilterSettingsType;
    dataLoadSettings?: v2.DataLoadSettingsType;
    resizableLayout?: {
        [k: string]: ResizableLayoutVariant;
    };
    cards: {
        [k: string]: CardClassType;
    };
}
export {};
//# sourceMappingURL=OverviewPage.d.ts.map