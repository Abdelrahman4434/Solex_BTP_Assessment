import { type v4 } from '@sap/ux-specification-types';
import type { CustomHeaderAction } from './HeaderAction';
import { Decorator } from '../../sync-rules';
export declare class HeaderActions extends Decorator implements v4.HeaderActions {
    [key: string]: CustomHeaderAction | any;
    init(): void;
}
export declare class Header extends Decorator implements v4.Header {
    actions?: HeaderActions;
}
//# sourceMappingURL=Header.d.ts.map