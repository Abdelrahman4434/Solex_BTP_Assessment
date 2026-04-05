import type { v4 } from '@sap/ux-specification-types';
import { Decorator } from '../../sync-rules';
export declare class FilterBar implements v4.FilterBar {
    selectionFields?: v4.SelectionFields | v4.CompactFilters;
    visualFilters?: v4.VisualFilters;
    hideFilterBar?: boolean;
    initialLayout?: v4.InitialLayoutType;
    layout?: v4.LayoutType;
}
export declare class VisualFilter implements v4.VisualFilter {
    availability?: v4.Availability;
    visualFilterValueList?: string;
}
export declare class CustomFilterFieldPosition extends Decorator implements v4.CustomFilterFieldPosition {
    anchor?: string;
    placement: v4.FilterFieldPlacement;
}
export declare class CustomFilterField implements v4.CustomFilterField {
    label: string;
    property: string;
    template: string;
    required: boolean;
    position: CustomFilterFieldPosition;
}
//# sourceMappingURL=FilterBar.d.ts.map