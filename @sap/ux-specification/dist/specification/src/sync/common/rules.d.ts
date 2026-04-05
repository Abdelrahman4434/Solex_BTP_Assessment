import { type NamedRule } from './ManifestDrivenSchemaProcessor';
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the Table class in src/sync/v4/export/controls/Table.ts.
 * The creationMode property is now hidden via `@hide(when(custom.table.type, 'AnalyticalTable'))`.
 */
export declare const LR_CREATION_MODE_FOR_ANALYTICAL_TABLE: NamedRule;
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the TableCreationModeLR class in src/sync/v4/export/controls/Table.ts.
 * The createInPlace and isCreateEnabled properties are now hidden via decorators.
 */
export declare const LR_CREATION_MODE_FOR_NON_TREE_TABLE: NamedRule;
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the TableCreationModeLR class in src/sync/v4/export/controls/Table.ts.
 * The creationFields property is now hidden via `@hide(notWhen(custom.table.creationMode.name, 'CreationDialog'))`.
 */
export declare const LR_CREATION_MODE_FOR_NON_CREATION_DIALOG_MODE: NamedRule;
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the Table class in src/sync/v4/export/controls/Table.ts.
 * The analyticalConfiguration property is now hidden via `@hide(notWhen(custom.table.type, 'AnalyticalTable'))`.
 */
export declare const LR_ANALYTICAL_CONFIGURATION_FOR_NON_ANALYTICAL_TABLE: NamedRule;
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the Table class in src/sync/v4/export/controls/Table.ts.
 * The popinLayout property is now hidden via `@hide(notWhen(custom.table.type, 'ResponsiveTable'))`.
 */
export declare const LR_POPIN_LAYOUT_FOR_NON_RESPONSIVE_TABLE: NamedRule;
//# sourceMappingURL=rules.d.ts.map