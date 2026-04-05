"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPageTreeTableV4 = exports.ObjectPageGridTableV4 = exports.ObjectPageAnalyticalTableV4 = exports.ObjectPageAnalyticalConfiguration = exports.ObjectPageResponsiveTableV4 = exports.ObjectPageTableRowCountable = exports.ObjectPageTable = exports.QuickVariantSelectionV4OP = exports.PersonalizationTypeOP = exports.TableCreationModeExternalOPTable = exports.TableCreationModeCreationDialogOPTable = exports.TableCreationModeNewPageOPTable = exports.TableCreationModeInlineCreationsRowsOPGridTable = exports.TableCreationModeInlineCreationsRowsOPResponsiveTable = exports.TableCreationModeInlineOPTable = exports.TableCreationModeCreationDialogOPTreeTable = exports.TableCreationModeInlineOPTreeTable = exports.TableCreationModeNewPageOPTreeTable = exports.TableCreationModeOPTreeTable = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const decorators_1 = require("../../../common/decoration/decorators");
const application_1 = require("../../application");
const Table_1 = require("./Table");
class TableCreationModeOPTreeTable {
}
exports.TableCreationModeOPTreeTable = TableCreationModeOPTreeTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeOPTreeTable.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7cf7a31fd1ee490ab816ecd941bd2f1f')
], TableCreationModeOPTreeTable.prototype, "createInPlace", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7cf7a31fd1ee490ab816ecd941bd2f1f')
], TableCreationModeOPTreeTable.prototype, "isCreateEnabled", void 0);
class TableCreationModeNewPageOPTreeTable extends TableCreationModeOPTreeTable {
}
exports.TableCreationModeNewPageOPTreeTable = TableCreationModeNewPageOPTreeTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeNewPageOPTreeTable.prototype, "name", void 0);
class TableCreationModeInlineOPTreeTable extends TableCreationModeOPTreeTable {
}
exports.TableCreationModeInlineOPTreeTable = TableCreationModeInlineOPTreeTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeInlineOPTreeTable.prototype, "name", void 0);
class TableCreationModeCreationDialogOPTreeTable extends TableCreationModeOPTreeTable {
}
exports.TableCreationModeCreationDialogOPTreeTable = TableCreationModeCreationDialogOPTreeTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeCreationDialogOPTreeTable.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeCreationFieldsProperty,
            import: Table_1.importCreationModeCreationFieldsProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7fee938d7cba4bfd86810cfe6d011eb0')
], TableCreationModeCreationDialogOPTreeTable.prototype, "creationFields", void 0);
class TableCreationModeInlineOPTable {
}
exports.TableCreationModeInlineOPTable = TableCreationModeInlineOPTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeInlineOPTable.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeInlineOPTable.prototype, "createAtEnd", void 0);
class TableCreationModeInlineCreationsRowsOPResponsiveTable {
}
exports.TableCreationModeInlineCreationsRowsOPResponsiveTable = TableCreationModeInlineCreationsRowsOPResponsiveTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeInlineCreationsRowsOPResponsiveTable.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeInlineCreationsRowsOPResponsiveTable.prototype, "inlineCreationRowsHiddenInEditMode", void 0);
class TableCreationModeInlineCreationsRowsOPGridTable {
}
exports.TableCreationModeInlineCreationsRowsOPGridTable = TableCreationModeInlineCreationsRowsOPGridTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeInlineCreationsRowsOPGridTable.prototype, "name", void 0);
class TableCreationModeNewPageOPTable {
}
exports.TableCreationModeNewPageOPTable = TableCreationModeNewPageOPTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeNewPageOPTable.prototype, "name", void 0);
class TableCreationModeCreationDialogOPTable {
}
exports.TableCreationModeCreationDialogOPTable = TableCreationModeCreationDialogOPTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeCreationDialogOPTable.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeCreationFieldsProperty,
            import: Table_1.importCreationModeCreationFieldsProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7fee938d7cba4bfd86810cfe6d011eb0')
], TableCreationModeCreationDialogOPTable.prototype, "creationFields", void 0);
class TableCreationModeExternalOPTable {
}
exports.TableCreationModeExternalOPTable = TableCreationModeExternalOPTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/cfb04f0c58e7409992feb4c91aa9410b')
], TableCreationModeExternalOPTable.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportCreationModeProperty,
            delete: Table_1.deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/5c2bc2ea8a7e482e968124959354d736')
], TableCreationModeExternalOPTable.prototype, "outbound", void 0);
class PersonalizationTypeOP {
}
exports.PersonalizationTypeOP = PersonalizationTypeOP;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP, // Here we are using path of parent to have correct value for manifestSection
            export: Table_1.exportPersonalizationProperty,
            delete: Table_1.deletePersonalizationProperty
        }
    })
], PersonalizationTypeOP.prototype, "column", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP, // Here we are using path of parent to have correct value for manifestSection
            export: Table_1.exportPersonalizationProperty,
            delete: Table_1.deletePersonalizationProperty
        }
    })
], PersonalizationTypeOP.prototype, "sort", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportPersonalizationProperty,
            delete: Table_1.deletePersonalizationProperty
        }
    })
], PersonalizationTypeOP.prototype, "filter", void 0);
class QuickVariantSelectionV4OP {
}
exports.QuickVariantSelectionV4OP = QuickVariantSelectionV4OP;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId) => (0, application_1.getTableSettingsPathForOP)(pageName, manifest, sectionId) + ux_specification_types_1.QUICKVARPATH
        }
    })
], QuickVariantSelectionV4OP.prototype, "paths", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId) => (0, application_1.getTableSettingsPathForOP)(pageName, manifest, sectionId) + ux_specification_types_1.QUICKVARPATH
        }
    })
], QuickVariantSelectionV4OP.prototype, "hideTableTitle", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId) => (0, application_1.getTableSettingsPathForOP)(pageName, manifest, sectionId) + ux_specification_types_1.QUICKVARPATH
        }
    })
], QuickVariantSelectionV4OP.prototype, "showCounts", void 0);
class ObjectPageTable {
}
exports.ObjectPageTable = ObjectPageTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTable.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            export: Table_1.exportPersonalization
        }
    }),
    (0, decorators_1.validity)({
        since: '1.86.0'
    })
], ObjectPageTable.prototype, "personalization", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTable.prototype, "selectionMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTable.prototype, "selectAll", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTable.prototype, "selectionLimit", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/4bab6f2043814257974b52d4dafe1dcd')
], ObjectPageTable.prototype, "enableExport", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTable.prototype, "quickVariantSelection", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/f3cc057e405c4fd58ee2ed42c557797c')
], ObjectPageTable.prototype, "condensedTableLayout", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.86.0'
    })
], ObjectPageTable.prototype, "enableFullScreen", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTable.prototype, "enablePaste", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.117.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7f844f1021cd4791b8f7408eac7c1cec')
], ObjectPageTable.prototype, "hierarchyQualifier", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.120.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/c0f6592a592e47f9bb6d09900de47412')
], ObjectPageTable.prototype, "widthIncludingColumnHeader", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.123.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/c0f6592a592e47f9bb6d09900de47412')
], ObjectPageTable.prototype, "disableCopyToClipboard", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            import: Table_1.importEnableMassEdit,
            export: Table_1.exportEnableMassEdit
        }
    }),
    (0, decorators_1.validity)({
        since: '1.126.0'
    })
], ObjectPageTable.prototype, "enableMassEdit", void 0);
class ObjectPageTableRowCountable extends ObjectPageTable {
}
exports.ObjectPageTableRowCountable = ObjectPageTableRowCountable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.120.0'
        /**
         * since '1.130.0': 'Interactive', special message in sync/v4/generate/objectPage.ts
         */
    })
], ObjectPageTableRowCountable.prototype, "rowCountMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.120.0'
    })
], ObjectPageTableRowCountable.prototype, "rowCount", void 0);
class ObjectPageResponsiveTableV4 extends ObjectPageTable {
}
exports.ObjectPageResponsiveTableV4 = ObjectPageResponsiveTableV4;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageResponsiveTableV4.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            import: Table_1.importCreationMode
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/api/sap.fe.macros.Table%23controlProperties'),
    (0, decorators_1.validity)({
        since: '1.130.0'
    })
], ObjectPageResponsiveTableV4.prototype, "creationMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ObjectPageResponsiveTableV4.prototype, "popinLayout", void 0);
class ObjectPageAnalyticalConfiguration {
}
exports.ObjectPageAnalyticalConfiguration = ObjectPageAnalyticalConfiguration;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableAnalyticalConfigurationPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    })
], ObjectPageAnalyticalConfiguration.prototype, "aggregationOnLeafLevel", void 0);
class ObjectPageAnalyticalTableV4 extends ObjectPageTableRowCountable {
}
exports.ObjectPageAnalyticalTableV4 = ObjectPageAnalyticalTableV4;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageAnalyticalTableV4.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    })
], ObjectPageAnalyticalTableV4.prototype, "analyticalConfiguration", void 0);
class ObjectPageGridTableV4 extends ObjectPageTableRowCountable {
}
exports.ObjectPageGridTableV4 = ObjectPageGridTableV4;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageGridTableV4.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            import: Table_1.importCreationMode
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/api/sap.fe.macros.Table%23controlProperties'),
    (0, decorators_1.validity)({
        since: '1.130.0'
    })
], ObjectPageGridTableV4.prototype, "creationMode", void 0);
class ObjectPageTreeTableV4 extends ObjectPageTableRowCountable {
}
exports.ObjectPageTreeTableV4 = ObjectPageTreeTableV4;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageTreeTableV4.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForOP,
            import: Table_1.importCreationMode
        }
    }),
    (0, decorators_1.validity)({
        since: '1.130.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/api/sap.fe.macros.Table%23controlProperties')
], ObjectPageTreeTableV4.prototype, "creationMode", void 0);
//# sourceMappingURL=ObjectPageTable.js.map