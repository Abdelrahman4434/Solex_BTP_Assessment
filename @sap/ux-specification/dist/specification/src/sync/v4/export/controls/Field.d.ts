import type { v4 } from '@sap/ux-specification-types';
/**
 * Sync class for Custom Field Position
 */
export declare class CustomFieldPosition implements v4.CustomFieldPosition {
    anchor?: string;
    placement: v4.FieldPlacement;
}
/**
 * Sync class for Custom Field
 */
export declare class CustomField implements v4.CustomField {
    template: string;
    label: string;
    position: CustomFieldPosition;
}
//# sourceMappingURL=Field.d.ts.map