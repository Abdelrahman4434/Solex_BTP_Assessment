export declare enum ActionPriority {
    'High' = "High",
    'Low' = "Low",
    'AlwaysOverflow' = "AlwaysOverflow",
    'NeverOverflow' = "NeverOverflow"
}
export interface GroupableAction {
    /**
     * Allows users to set the group for the action or action menu. When there's not enough space to display all grouped actions, they are moved together into overflow.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/#/topic/cbf16c599f2d4b8796e3702f7d4aae6c
     * @TJS-type integer
     */
    overflowGroup?: number;
    /**
     * Allows users to set the priority of the action or action menu. This determines ordering and whether the action or action menu is moved into overflow.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/#/topic/cbf16c599f2d4b8796e3702f7d4aae6c
     */
    priority?: ActionPriority.High | ActionPriority.Low | ActionPriority.AlwaysOverflow | ActionPriority.NeverOverflow;
}
//# sourceMappingURL=Action.d.ts.map