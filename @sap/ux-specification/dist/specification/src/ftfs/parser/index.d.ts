import type { PageConfig, PageType } from '@sap/ux-specification-types';
import type { PageAnnotations } from './model';
import { TreeModel } from './model';
export * from './model';
/**
 * Method initializes and returns model.
 *
 * @param schema JSON schema.
 * @param data Page or application config.
 * @param pageType Page type.
 * @param annotation Page annotations.
 * @returns Initialized model.
 */
export declare function getModel(schema: string, data: PageConfig, pageType?: PageType, annotation?: PageAnnotations): TreeModel;
//# sourceMappingURL=index.d.ts.map