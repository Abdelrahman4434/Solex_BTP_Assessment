import type { v4 } from '@sap/ux-specification-types';
import type { PopinLayout } from 'sap/m/library';
export declare class TableCreationModeOPTreeTable implements v4.TableCreationModeOPTreeTable {
    name?: v4.TableCreationModeType.NewPage | v4.TableCreationModeType.Inline | v4.TableCreationModeType.CreationDialog;
    createInPlace?: boolean;
    isCreateEnabled?: string;
}
export declare class TableCreationModeNewPageOPTreeTable extends TableCreationModeOPTreeTable implements v4.TableCreationModeNewPageOPTreeTable {
    name?: v4.TableCreationModeType.NewPage;
}
export declare class TableCreationModeInlineOPTreeTable extends TableCreationModeOPTreeTable implements v4.TableCreationModeInlineOPTreeTable {
    name?: v4.TableCreationModeType.Inline;
}
export declare class TableCreationModeCreationDialogOPTreeTable extends TableCreationModeOPTreeTable implements v4.TableCreationModeCreationDialogOPTreeTable {
    name?: v4.TableCreationModeType.CreationDialog;
    creationFields?: string[];
}
export declare class TableCreationModeInlineOPTable implements v4.TableCreationModeInlineOPTable {
    name?: v4.TableCreationModeType.Inline;
    createAtEnd?: boolean;
}
export declare class TableCreationModeInlineCreationsRowsOPResponsiveTable implements v4.TableCreationModeInlineCreationsRowsOPResponsiveTable {
    name?: v4.TableCreationModeType.InlineCreationRows;
    inlineCreationRowsHiddenInEditMode?: boolean;
}
export declare class TableCreationModeInlineCreationsRowsOPGridTable implements v4.TableCreationModeInlineCreationsRowsOPGridTable {
    name?: v4.TableCreationModeType.InlineCreationRows;
}
export declare class TableCreationModeNewPageOPTable implements v4.TableCreationModeNewPageOPTable {
    name?: v4.TableCreationModeType.NewPage;
}
export declare class TableCreationModeCreationDialogOPTable implements v4.TableCreationModeCreationDialogOPTable {
    name?: v4.TableCreationModeType.CreationDialog;
    creationFields?: string[];
}
export declare class TableCreationModeExternalOPTable implements v4.TableCreationModeExternalOPTable {
    name?: v4.TableCreationModeType.External;
    outbound?: string;
}
export declare class PersonalizationTypeOP implements v4.PersonalizationTypeOP {
    column?: boolean;
    sort?: boolean;
    filter?: boolean;
}
export declare class QuickVariantSelectionV4OP implements v4.QuickVariantSelectionV4 {
    paths: v4.AnnotationPathAsObject[];
    hideTableTitle?: boolean;
    showCounts?: boolean;
}
export declare class ObjectPageTable implements v4.ObjectPageTable {
    type?: v4.TableTypeV4;
    personalization?: PersonalizationTypeOP | boolean;
    selectionMode?: v4.SelectionMode;
    selectAll?: boolean;
    selectionLimit?: number;
    enableExport?: boolean;
    quickVariantSelection?: QuickVariantSelectionV4OP;
    condensedTableLayout?: boolean;
    enableFullScreen?: boolean;
    enablePaste?: boolean;
    hierarchyQualifier?: string;
    widthIncludingColumnHeader?: boolean;
    disableCopyToClipboard?: boolean;
    enableMassEdit?: v4.EnableMassEdit;
}
export declare class ObjectPageTableRowCountable extends ObjectPageTable implements v4.RowCountable {
    rowCountMode?: v4.RowCountMode;
    rowCount?: number;
}
export declare class ObjectPageResponsiveTableV4 extends ObjectPageTable implements v4.ObjectPageResponsiveTableV4 {
    type?: v4.TableTypeV4.ResponsiveTable;
    creationMode?: TableCreationModeInlineOPTable | TableCreationModeInlineCreationsRowsOPResponsiveTable | TableCreationModeNewPageOPTable | TableCreationModeCreationDialogOPTable | TableCreationModeExternalOPTable;
    popinLayout?: PopinLayout;
}
export declare class ObjectPageAnalyticalConfiguration implements v4.ObjectPageAnalyticalConfiguration {
    aggregationOnLeafLevel?: boolean;
}
export declare class ObjectPageAnalyticalTableV4 extends ObjectPageTableRowCountable implements v4.ObjectPageAnalyticalTableV4 {
    type?: v4.TableTypeV4.AnalyticalTable;
    analyticalConfiguration?: ObjectPageAnalyticalConfiguration;
}
export declare class ObjectPageGridTableV4 extends ObjectPageTableRowCountable implements v4.ObjectPageGridTableV4 {
    type?: v4.TableTypeV4.GridTable;
    creationMode?: TableCreationModeInlineOPTable | TableCreationModeInlineCreationsRowsOPGridTable | TableCreationModeNewPageOPTable | TableCreationModeCreationDialogOPTable | TableCreationModeExternalOPTable;
}
export declare class ObjectPageTreeTableV4 extends ObjectPageTableRowCountable implements v4.ObjectPageTreeTableV4 {
    type?: v4.TableTypeV4.TreeTable;
    creationMode?: TableCreationModeNewPageOPTreeTable | TableCreationModeInlineOPTreeTable | TableCreationModeCreationDialogOPTreeTable;
}
//# sourceMappingURL=ObjectPageTable.d.ts.map