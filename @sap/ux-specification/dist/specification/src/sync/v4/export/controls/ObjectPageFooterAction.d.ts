import type { v4 } from '@sap/ux-specification-types';
export declare class ActionAfterExecutionConfigurationFooter implements v4.ActionAfterExecutionConfiguration {
    navigateToInstance?: boolean;
    enableAutoScroll?: boolean;
}
export declare class FooterActionV4 implements v4.FooterActionV4 {
    afterExecution?: ActionAfterExecutionConfigurationFooter;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
/**
 * Sync class for Position
 */
export declare class CustomFooterActionPositionOP implements v4.CustomFooterActionPositionOP {
    anchor?: string;
    placement: v4.ActionPlacement;
}
export declare class CustomFooterActionOP implements v4.CustomFooterActionOP {
    text: string;
    position: CustomFooterActionPositionOP;
    press: string;
    visible?: boolean;
    enabled?: boolean;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
//# sourceMappingURL=ObjectPageFooterAction.d.ts.map