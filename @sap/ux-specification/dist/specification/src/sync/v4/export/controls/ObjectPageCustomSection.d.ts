import type { v4 } from '@sap/ux-specification-types';
import type { CustomSectionActionOP } from './ObjectPageSectionAction';
import { Decorator } from '../../sync-rules';
export declare class ObjectPageCustomSectionActions implements v4.ObjectPageCustomSectionActions {
    [key: string]: CustomSectionActionOP;
}
export declare class ObjectPageCustomSectionFragment extends Decorator implements v4.ObjectPageCustomSectionFragment {
    relatedFacet: string;
    relativePosition: v4.SectionPosition;
    title: string;
    fragmentName: string;
    controls: object;
    actions: ObjectPageCustomSectionActions;
}
export declare class ObjectPageCustomSubSectionFragment extends ObjectPageCustomSectionFragment implements v4.ObjectPageCustomSubSectionFragment {
    relatedFacet: string;
    relativePosition: v4.SectionPosition;
    title: string;
    fragmentName: string;
    controls: object;
}
//# sourceMappingURL=ObjectPageCustomSection.d.ts.map