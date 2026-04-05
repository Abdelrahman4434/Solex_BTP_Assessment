import type { Application } from '../common';
import type { Page as PageV2 } from '../v2';
import type { Page as PageV4 } from '../v4';
import type { TreeModel } from './model';
export interface PageWithModelV2 extends PageV2 {
    model: TreeModel;
}
export interface PageWithModelV4 extends PageV4 {
    model: TreeModel;
}
interface PagesV2 {
    [key: string]: PageWithModelV2;
}
interface PagesV4 {
    [key: string]: PageWithModelV4;
}
export interface ApplicationModel extends Application {
    model: TreeModel;
    pages: PagesV2 | PagesV4;
}
export {};
//# sourceMappingURL=application.d.ts.map