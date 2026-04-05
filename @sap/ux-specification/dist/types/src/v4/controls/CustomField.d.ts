export declare enum FieldPlacement {
    After = "After",
    Before = "Before"
}
export interface CustomFieldPosition {
    /**
     * The key of another field to be used as placement anchor.
     *
     * @artifactType Manifest
     */
    anchor?: string;
    /**
     * Define the placement, either before or after the anchor field.
     *
     * @artifactType Manifest
     */
    placement: FieldPlacement;
}
/**
 * Custom Field
 *
 * @isViewNode true
 */
export interface CustomField {
    /**
     * The label is shown on the form as the label of the field.
     *
     * @i18nClassification COL: Custom field label
     * @artifactType Manifest
     */
    label?: string;
    /**
     * Defines the position of the field relative to other fields.
     *
     * @artifactType Manifest
     */
    position?: CustomFieldPosition;
    /**
     * Defines a target fragment.
     *
     * @artifactType Manifest
     */
    template: string;
}
//# sourceMappingURL=CustomField.d.ts.map