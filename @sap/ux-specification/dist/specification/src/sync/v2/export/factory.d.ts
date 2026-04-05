import * as controls from './controls';
import type { MetadataInstanceInterface } from '../../common/decoration/factory';
import { MetadataFactory } from '../../common/decoration/factory';
export declare const pageTypes: {
    AnalyticalListPage: {};
    ListReport: {
        Table: typeof controls.ResponsiveTable;
        ResponsiveTableWithMultiSelect: typeof controls.ResponsiveTable;
        ResponsiveTableWithInlineDelete: typeof controls.ResponsiveTable;
    };
    ObjectPage: {
        "sap.ui.core.mvc.View": typeof controls.ObjectPageCustomSectionView;
        "sap.ui.core.Fragment": typeof controls.ObjectPageCustomSectionFragment;
        Table: typeof controls.ObjectPageResponsiveTable;
        ObjectPageResponsiveTableWithMultiSelect: typeof controls.ObjectPageResponsiveTable;
        ObjectPageResponsiveTableWithInlineDelete: typeof controls.ObjectPageResponsiveTable;
    };
    OverviewPage: {
        listCardSettings: typeof controls.ListCard;
        listCardSettingsv4: typeof controls.ListCard;
        analyticalCardSettings: typeof controls.AnalyticalCard;
        analyticalCardSettingsv4: typeof controls.AnalyticalCard;
        stackCardSettings: typeof controls.StackCard;
        linkListCardSettings: typeof controls.LinklistCard;
        tableCardSettings: typeof controls.TableCard;
        tableCardSettingsv4: typeof controls.TableCard;
    };
};
/**
 * V2 specific factory class for creating instances of (reflect) metadata classes
 */
export declare class MetadataInstanceFactoryV2 extends MetadataFactory implements MetadataInstanceInterface {
    constructor();
}
//# sourceMappingURL=factory.d.ts.map