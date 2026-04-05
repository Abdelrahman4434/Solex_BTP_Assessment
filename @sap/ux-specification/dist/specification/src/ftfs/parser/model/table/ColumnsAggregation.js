"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnsAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const ColumnAggregation_1 = require("./ColumnAggregation");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const CUSTOM_PROPERTY_NAME = 'custom';
const PAGE_TYPE_DEFAULT_EXTENSION_MAP = new Map([
    [ux_specification_types_1.PageType.ObjectPage, "ResponsiveTableColumnsExtension" /* TableColumnExtensionType.ResponsiveTableColumnsExtension */],
    [ux_specification_types_1.PageType.ListReport, "ResponsiveTableColumnsExtension" /* TableColumnExtensionType.ResponsiveTableColumnsExtension */],
    [ux_specification_types_1.PageType.AnalyticalListPage, "AnalyticalTableColumnsExtension" /* TableColumnExtensionType.AnalyticalTableColumnsExtension */]
]);
/**
 * Represents an aggregation for columns objects.
 */
class ColumnsAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `ColumnsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        // Array of end result ordered columns
        this.customColumns = [];
        this.columnKeys = [];
        this.allowedAnnotationCreationForms = [
            types_1.AggregationCreationForm.NativeBasicColumn,
            types_1.AggregationCreationForm.NativeRatingColumn,
            types_1.AggregationCreationForm.NativeChartColumn,
            types_1.AggregationCreationForm.NativeProgressColumn,
            types_1.AggregationCreationForm.NativeAction,
            types_1.AggregationCreationForm.NativeContactColumn,
            types_1.AggregationCreationForm.NativeNavigation
        ];
        // In case if we would need connect columns and actions separately - in future it can be changed to array ['columns', 'actions']
        this.sortableCollection = 'actions';
        // Child objects as column aggregation
        this.childClass = ColumnAggregation_1.ColumnAggregation;
        if (schema?.properties) {
            let formName;
            if (schema.properties?.custom) {
                formName = types_1.AggregationCreationForm.CustomColumn;
            }
            else if (typeof schema.additionalProperties === 'object' &&
                schema.additionalProperties.$ref &&
                schema.additionalProperties.$ref.indexOf('TableCustomColumn') > -1) {
                formName = types_1.AggregationCreationForm.CustomColumnV4;
                this.isV4 = true;
            }
            else if (this.isMacrosNode()) {
                this.isV4 = true;
            }
            // Custom creation form
            if (formName) {
                this.schemaCreationForms = [
                    {
                        name: formName,
                        kind: types_1.SCHEMA_CREATION_FORM,
                        title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_COLUMNS_TITLE',
                        disabled: false
                    }
                ];
            }
        }
        // Sortable
        this.sortableList = true;
        // i18n key
        this.i18nKey = 'COLUMNS';
    }
    /**
     * Groups all custom table columns by their extension type.
     *
     * @returns Grouped custom table columns by their extension type.
     */
    groupCustomColumnsByExtension() {
        const customColumnGroups = new Map();
        // Sort all columns by index
        const customColumns = [...this.customColumns].sort((column1, column2) => {
            const columnIndex1 = column1.columnIndex ?? 0;
            const columnIndex2 = column2.columnIndex ?? 0;
            if (columnIndex1 === columnIndex2) {
                return 0;
            }
            return columnIndex1 > columnIndex2 ? 1 : -1;
        });
        // Group columns
        for (const customColumn of customColumns) {
            let columns = customColumnGroups.get(customColumn.extensionType);
            if (!columns) {
                columns = [];
                customColumnGroups.set(customColumn.extensionType, columns);
            }
            columns.push(customColumn);
        }
        return customColumnGroups;
    }
    /**
     * Method ensures that 'order' property of aggregation is zero based and does not have any gap.
     */
    ensureColumnOrder() {
        const keys = this.getAggregationKeys();
        for (let i = 0; i < keys.length; i++) {
            const aggregation = this.aggregations[keys[i]];
            if (aggregation) {
                aggregation.order = i;
            }
        }
    }
    /**
     * Data update of custom columns from 'custom' block, V2 scenario.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type
     * @param path Path of columns.
     */
    updatePropertiesFromCustomAggregation(data, page, pageType, path) {
        const formSchema = this.formSchema;
        this.customColumns = data && CUSTOM_PROPERTY_NAME in data ? data[CUSTOM_PROPERTY_NAME] : [];
        if (pageType === ux_specification_types_1.PageTypeV2.ObjectPage) {
            this.sectionId = this.parent?.parent?.schema?.keys?.reduce((key) => key.name === 'ID').value;
        }
        if (this.customColumns.length) {
            // Ensure column order are starting with 0 and does not have any gap
            this.ensureColumnOrder();
            // Array with columns order
            this.columnKeys = Object.keys(this.aggregations);
            const customColumnsGroup = this.groupCustomColumnsByExtension();
            customColumnsGroup.forEach((customColumns) => {
                for (const index in customColumns) {
                    const customColumn = formSchema?.getCopy(ColumnAggregation_1.ColumnAggregation);
                    const columnData = customColumns[index];
                    // Original index in page config array
                    const originalIndex = this.customColumns.indexOf(columnData);
                    // Update some column specific properties by calling methods
                    customColumn.markAsCustomColumn({
                        pageType,
                        originalIndex,
                        columnExtension: columnData.extensionType,
                        isExtensionTypeSupported: this.isExtensionTypeSupported(),
                        i18nKey: this.i18nKey,
                        tableExtension: this.tableColumnExtensionType,
                        isV4: this.isV4,
                        tabkey: columnData.tabKey
                    });
                    customColumn.updatePropertiesValues(columnData, page, pageType, path);
                    customColumn.setTitle(columnData.text);
                    // Get unique column key
                    const columnKey = this.getFreeId(columnData.id || columnData.columnKey || 'customColumn', this.columnKeys);
                    this.columnKeys.push(columnKey);
                    // Add custom column into columns aggregation
                    const columnIndex = this.doesColumnExtensionMatchTableType(columnData)
                        ? columnData.columnIndex
                        : this.getMaxColumnIndex(this.customColumns) + 1;
                    this.addAggregation(columnKey, customColumn, this.path.concat([CUSTOM_PROPERTY_NAME, originalIndex]), columnIndex);
                }
            });
        }
    }
    /**
     * Overwritten method for data update of table columns.
     *
     * @param data - Data which should be used for value population.
     * @param page - Page config data.
     * @param pageType - Page type
     * @param path - Path of columns.
     * @param annotations - Annotations
     */
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        // Detect extension type
        this.resolveTableColumnExtensionType(page, pageType, path);
        // Hold custom column aggregation
        if (!this.isV4) {
            this.formSchema = this.aggregations[CUSTOM_PROPERTY_NAME];
            delete this.aggregations[CUSTOM_PROPERTY_NAME];
            // Custom block is present, V2 scenario
            this.updatePropertiesFromCustomAggregation(data, page, pageType, path);
        }
        else {
            // V4 new custom columns metadata aggregation is stored under 'additionalProperties'
            this.formSchema = this.additionalProperties?.aggregations['columns'];
            // V4 scenario: analyze all customs
            const columns = data || {};
            for (const columnKey in columns) {
                const column = this.aggregations[columnKey];
                if (column.schema && !column.schema.annotationPath) {
                    column.originalIndex = column.schema.propertyIndex;
                    column.markAsCustomColumn({
                        pageType,
                        originalIndex: column.schema.propertyIndex,
                        columnExtension: this.tableColumnExtensionType,
                        isExtensionTypeSupported: this.isExtensionTypeSupported(),
                        i18nKey: this.i18nKey,
                        tableExtension: this.tableColumnExtensionType,
                        isV4: this.isV4,
                        tabkey: column.properties.tabkey?.value
                    });
                }
            }
        }
    }
    /**
     * Method returns available column id for candidate column id.
     *
     * @param id Candidate id.
     * @param existingIds Array of existing ids.
     * @returns Available id.
     */
    getFreeId(id, existingIds) {
        // Find available id
        let counter = 1;
        const originalId = id;
        while (existingIds.includes(id)) {
            id = originalId + counter;
            counter++;
        }
        return id;
    }
    /**
     * Method detects default extension type for current page with table object.
     *
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Path of columns.
     */
    resolveTableColumnExtensionType(page, pageType, path) {
        // Get path for table object
        const tableTypePath = path.splice(0, path.length - 1);
        // Read table type
        tableTypePath.push('type');
        const tableType = (0, utils_2.getProperty)(page, tableTypePath);
        // Use mappings and detect extension type
        this.tableColumnExtensionType =
            typeof tableType === 'string' && tableType in ux_specification_types_1.v2.TableTypeV2
                ? types_1.TABLE_TYPE_EXTENSION_MAP.get(tableType)
                : PAGE_TYPE_DEFAULT_EXTENSION_MAP.get(pageType);
    }
    /**
     * Method returns if passed custom column matches table type.
     * Table can have multiple columns with different 'extensionType', but Runtime will render only those which are matches to table type.
     *
     * @param column - Custom column object from 'page.json'.
     * @returns True if custom column extension type matches table type.
     */
    doesColumnExtensionMatchTableType(column) {
        return !this.isExtensionTypeSupported() || column.extensionType === this.tableColumnExtensionType;
    }
    /**
     * Method checks if custom columns schema supports 'extensionType' property.
     * Old 'spec' version does not support this property, but we still can support custom columns with old spec version.
     *
     * @returns True if 'extensionType' property exists in schema for Custom Column definition.
     */
    isExtensionTypeSupported() {
        return !!this.formSchema?.properties.extensionType;
    }
    /**
     * Method returns maximal order by looping through all aggregations and all custom columns data.
     *
     * @param columnData - Custom column data.
     * @returns Maximal property order index.
     */
    getMaxColumnIndex(columnData) {
        let maxIndex = this.getMaxOrder();
        for (const column of columnData) {
            if (column.columnIndex !== undefined && maxIndex < column.columnIndex) {
                maxIndex = column.columnIndex;
            }
        }
        return maxIndex;
    }
    /**
     * Refreshes node locations based on the annotation node data.
     *
     * @param annotations All page annotation nodes.
     * @param currentUINode Current annotation node.
     */
    updateLocations(annotations, currentUINode) {
        super.updateLocations(annotations, currentUINode);
        (0, utils_1.updateTableChildNodeLocations)(this);
    }
}
exports.ColumnsAggregation = ColumnsAggregation;
//# sourceMappingURL=ColumnsAggregation.js.map