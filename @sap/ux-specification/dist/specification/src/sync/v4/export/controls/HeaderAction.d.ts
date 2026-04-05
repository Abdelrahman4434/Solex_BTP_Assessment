import { type v4 } from '@sap/ux-specification-types';
import { Decorator } from '../../sync-rules/DecoratorClass';
/**
 * Sync class for Position
 */
export declare class CustomHeaderActionPosition implements v4.CustomHeaderActionPosition {
    anchor?: string;
    placement: v4.ActionPlacement;
}
export declare class CustomHeaderAction extends Decorator implements v4.CustomHeaderAction {
    text: string;
    position: CustomHeaderActionPosition;
    press: string;
    visible?: boolean;
    enabled?: boolean;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
    init(): void;
}
//# sourceMappingURL=HeaderAction.d.ts.map