"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectAggregation = exports.CUSTOM_EXTENSION_ANCHOR_PROPERTIES = void 0;
const types_1 = require("./types");
const NodeProperty_1 = require("./NodeProperty");
const utils_1 = require("./utils");
const annotations_1 = require("../annotations");
const ROOT_SORTING_NAMES = {
    top: ['header', 'filterBar']
};
exports.CUSTOM_EXTENSION_ANCHOR_PROPERTIES = ['anchor', 'relatedFacet'];
/**
 * Represents an aggregation for objects.
 */
class ObjectAggregation {
    /**
     * Creates an instance of `ObjectAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        // Path
        this.path = [];
        // Standard properties for aggregation and properties
        this.aggregations = {};
        this.properties = {};
        // Properties variants - multiple variation of properties and aggregations. Depending on values - other properties or aggregation may be hidden/disabled.
        this.variants = [];
        // Public creation form - (+) button would appear on UI and form will be opened
        this.annotationCreationForms = [];
        this.allowedAnnotationCreationForms = [];
        this.schemaCreationForms = [];
        // Validation state
        this.state = types_1.ValidationState.Valid;
        // Aggregation type - currently object or array
        this.type = types_1.AggregationType.Object;
        // Custom
        this.custom = false;
        this.isTable = false;
        if (data) {
            this.aggregations = data.aggregations;
            this.properties = data.properties;
        }
        if (schema) {
            this.schema = schema;
        }
    }
    /**
     * Method adds aggregation object.
     *
     * @param name Name of aggregation.
     * @param aggregation Aggregation to add.
     * @param path Array of path to aggregation.
     * @param order Order index.
     * @param overwrite Overwrite existing aggregation.
     * @returns Added aggregation.
     */
    addAggregation(name, aggregation, path, order, overwrite) {
        if (this.aggregations[name] && !overwrite) {
            return this.aggregations[name];
        }
        // Append new
        aggregation.name = name;
        if (order !== undefined && !Number.isNaN(order)) {
            // Looks like we need place aggregation in certain place - recalculate other aggregations
            for (const key in this.aggregations) {
                const existingOrder = this.aggregations[key].order;
                if (existingOrder !== undefined && !Number.isNaN(existingOrder) && existingOrder >= order) {
                    this.aggregations[key].order = existingOrder + 1;
                }
            }
            aggregation.order = order;
        }
        else {
            aggregation.order = Object.keys(this.aggregations).length;
        }
        // Define parent, but as not writable
        Object.defineProperty(aggregation, 'parent', {
            value: this,
            writable: false
        });
        this.aggregations[name] = aggregation;
        // Update path and apply path to childs
        this.updatePath(this.aggregations[name], path);
        return aggregation;
    }
    /**
     * Method adds property object.
     *
     * @param name Name of property.
     * @param schema Schema object of property.
     * @returns Instance of new property.
     */
    addProperty(name, schema) {
        if (exports.CUSTOM_EXTENSION_ANCHOR_PROPERTIES.includes(name)) {
            schema = (0, utils_1.updateAnchorSchema)(this, schema);
        }
        const displayName = schema.displayName || (0, utils_1.startCase)(name);
        const property = new NodeProperty_1.NodeProperty(schema, displayName);
        this.properties[name] = property;
        return property;
    }
    /**
     * Public method returns display name of aggregation.
     * Is used as display name in outline.
     *
     * @param i18nBundle I18n translation entries which should be looked up if display value persists.
     * @returns Display name of aggregation with applied i18n.
     */
    getDisplayName(i18nBundle = {}) {
        const nameResolutionMethods = [
            // Read translatable value
            () => {
                const name = this.getRawDisplayName();
                const i18nValue = (0, utils_1.resolveI18nValue)(name, i18nBundle);
                if (i18nValue) {
                    return i18nValue;
                }
                return name;
            },
            // Use technical name resolution method - not every aggregations support it
            this.getTechnicalName.bind(this),
            // Use name property based on property key in schema path
            () => {
                const name = this.getFormattedName();
                return name ? (0, utils_1.startCase)(name) : undefined;
            }
        ];
        let displayName = '';
        for (const resolutionMethod of nameResolutionMethods) {
            displayName = resolutionMethod() || '';
            if (displayName) {
                break;
            }
        }
        return displayName;
    }
    /**
     * Retrieves the supported aggregation actions for this instance.
     *
     * @returns A list of supported aggregation actions.
     */
    getSupportedActions() {
        const actions = [...(this.actions ?? [])];
        if (this.locations?.length) {
            actions.push(types_1.AggregationActions.OpenSource);
        }
        return actions;
    }
    /**
     * Public method that returns keys from schema for an aggregation object.
     *
     * @returns Array of keys.
     */
    getKeys() {
        if (this.schema?.keys) {
            return this.schema.keys;
        }
        else {
            return undefined;
        }
    }
    /**
     * Method returns value of passed schema key.
     *
     * @param name Name to search.
     * @returns Value for passed key's name.
     */
    getValueOfSchemaKey(name) {
        const keyObject = this.getKeys()?.find((schemaKey) => schemaKey.name === name);
        return keyObject?.value;
    }
    /**
     * Public method that returns technical name for an aggregation object.
     * Currently it is used to display in tooltip.
     *
     * @returns technical name.
     */
    getTechnicalName() {
        return undefined;
    }
    /**
     * Protected method returns display name of aggregation without applying i18n translation.
     *
     * @returns Display name of aggregation.
     */
    getRawDisplayName() {
        if (this.isViewNode) {
            const description = this.formatTextForDisplay(this.description);
            if (description) {
                return description;
            }
        }
        return this.formatTextForDisplay(this.schema?.title);
    }
    /**
     * Method formats text for display.
     * Trim is used to avoid whitespaces.
     *
     * @param text Text to format.
     * @returns Formatted text.
     */
    formatTextForDisplay(text = '') {
        return text.trim();
    }
    /**
     * Method updates value of aggregatipn properties and child aggregations.
     *
     * @param data Data which should be used for value population.
     */
    updateValues(data) {
        const propertyKeys = Object.keys(this.properties);
        const aggregationKeys = Object.keys(this.aggregations);
        if (data) {
            for (const name in data) {
                if (propertyKeys.includes(name)) {
                    this.properties[name].value = data[name];
                }
                if (aggregationKeys.includes(name)) {
                    this.aggregations[name].value = data[name];
                }
            }
        }
    }
    /**
     * Public method which recursively updates aggregation's properties with values from passed data object.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     * @param parser Model parser parameters.
     */
    updatePropertiesValues(data, page, pageType, path, annotations, parser) {
        this.updateValues(data);
        this.updateAnnotationData(annotations);
        this.annotationCreationForms = this.getNativeNodeCreationForms(annotations);
        // Go with recursion
        for (const rootName in this.aggregations) {
            const pathPart = this.type === types_1.AggregationType.Array ? Number.parseInt(rootName, 10) : rootName;
            const names = this.aggregations[rootName].union?.originalNames || [rootName];
            for (const name of names) {
                this.aggregations[rootName].updatePropertiesValues(data?.[name], page, pageType, path.concat([pathPart]), annotations, parser);
            }
            this.aggregations[rootName].onPropertiesUpdated();
        }
        if (this.isAtomic) {
            this.handleAtomicObject(data, path);
        }
    }
    /**
     * Method which called when properties and aggregation data was applied and updated.
     */
    onPropertiesUpdated() {
        // no-op
    }
    /**
     * Refreshes internal data based on latest annotation node data.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations) {
        const currentUINode = this.getCurrentUINode(annotations);
        const directNode = currentUINode?.direct ? currentUINode.node : undefined;
        this.setAllowedParents(annotations, directNode);
        this.updateLocations(annotations, directNode);
        // Handle readonly node
        if (currentUINode?.node && !(0, annotations_1.isTooComplex)(currentUINode.node) && currentUINode.node.readonly) {
            this.applyReadonlyAnnotationNode(currentUINode.node.readonlyTooltip);
        }
        // Check if annotation node resolution failed and we should disable sorting and deletion
        if (!this.custom && this.sortableItem === types_1.SortingOptions.Enabled && !this.annotationNodeId) {
            // Disable sorting - it is not custom extension node and annotation id resolution failed
            this.sortableItem = types_1.SortingOptions.Readonly;
            this.removeAction(types_1.AggregationActions.Delete);
        }
    }
    /**
     * Method checks if annotation contains allowedSubnodeTypes
     * and sets disabled param for add action button.
     *
     * @param annotations Page annotations.
     * @param uiNode Annotation node.
     */
    setAllowedParents(annotations, uiNode) {
        if (uiNode) {
            this.dropUINodes = uiNode?.allowedParentNodes;
        }
    }
    /**
     * Refreshes node locations based on the annotation node data.
     *
     * @param annotations All page annotation nodes.
     * @param currentUINode Current annotation node.
     */
    updateLocations(annotations, currentUINode) {
        this.locations = this.locations || [];
        const currentLocationsCount = this.locations.length;
        // Do not append annotation locations to macros nodes if macro node has location assigned
        if (!currentUINode || (currentLocationsCount && this.isMacrosNode())) {
            return;
        }
        const locations = (0, utils_1.getNodeLocations)(currentUINode);
        if (locations.length > 0) {
            if (currentLocationsCount) {
                // Locations exists merge locations
                for (const location of this.locations) {
                    if (locations.some((_location) => _location.fileUri !== location.fileUri)) {
                        locations.push(location);
                    }
                }
            }
            this.locations = locations;
        }
    }
    /**
     * Method provides creation options based on its related annotation node.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    getNativeNodeCreationForms(annotations) {
        if (!this.name || !annotations) {
            return [];
        }
        const annotationNodeId = this.annotationNodeId || this.getParentAnnotationNodeId();
        if (!annotationNodeId) {
            return this.getDefaultNativeCreationForms(annotations);
        }
        return [];
    }
    /**
     * Method provides default creation options, when no matching annotation node exists.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDefaultNativeCreationForms(annotations) {
        return [];
    }
    /**
     * Method recursively searches for parent with 'annotationNodeId' and returns 'annotationNodeId' as current context.
     *
     * @returns Annotation node id.
     */
    getParentAnnotationNodeId() {
        let parent = this.parent;
        while (parent) {
            if (parent.annotationNodeId) {
                return parent.annotationNodeId;
            }
            parent = parent ? parent.parent : undefined;
        }
    }
    /**
     * Method get valid object of properties.
     * There can be case when aggregation can have several variants of property combination - we are returning currently valid, depending on entered values.
     *
     * @returns Object of properties.
     */
    getProperties() {
        return this.properties;
    }
    /**
     * Method returns copy of ObjectAggregation object.
     *
     * @param type Type of aggregation.
     * @returns Copy of ObjectAggregation.
     */
    getCopy(type = ObjectAggregation) {
        const cloneData = JSON.parse(JSON.stringify(this, (key, value) => {
            if (key === 'parent') {
                return undefined;
            }
            return value;
        }));
        const cloneObject = new type(cloneData);
        this.createAggregations(cloneObject, type);
        return new type(cloneObject);
    }
    /**
     * Recursive method to use for copying aggregations objects.
     *
     * @param aggregation Original aggregation for copy.
     * @param type Type of aggregation.
     */
    createAggregations(aggregation, type = ObjectAggregation) {
        if (!aggregation.aggregations) {
            return;
        }
        for (const name in aggregation.aggregations) {
            aggregation.aggregations[name] = new type(aggregation.aggregations[name]);
            this.createAggregations(aggregation.aggregations[name]);
        }
        if (aggregation.additionalProperties?.aggregations) {
            aggregation.additionalProperties = new type(aggregation.additionalProperties);
        }
    }
    /**
     * Method sorts aggregation by 'order' property.
     *
     * @param name1 Aggregation name.
     * @param name2 Aggregation name.
     * @returns Sort result.
     */
    aggregationOrderSorter(name1, name2) {
        // Ordering when order is represented in aggregation
        const order1 = this.aggregations[name1] ? this.aggregations[name1].order || -1 : -1;
        const order2 = this.aggregations[name2] ? this.aggregations[name2].order || -1 : -1;
        if (order1 === order2) {
            return 0;
        }
        return order1 > order2 ? 1 : -1;
    }
    /**
     * Method returns array of ordered aggregation keys/names.
     *
     * @param viewNodesOnly Return only aggregations for view.
     * @param sortBy Sorting type. Currently aggregations can be sorted by 'ViewNode' to move visible nodes to top.
     * @returns Array of aggregations keys/names.
     */
    getAggregationKeys(viewNodesOnly = false, sortBy) {
        let aggregationKeys = Object.keys(this.aggregations).sort(this.aggregationOrderSorter.bind(this));
        if (!this.sortableList) {
            // Like 'header', 'filter' - render on top if aggregations are not sortable in UI.
            aggregationKeys = aggregationKeys.sort((obj1, obj2) => {
                // index of first priority prop
                const indexOfFirstRoot = ROOT_SORTING_NAMES.top.indexOf(obj1);
                // index of second priority prop
                const indexOfSecondRoot = ROOT_SORTING_NAMES.top.indexOf(obj2);
                if (indexOfFirstRoot !== -1 && indexOfSecondRoot !== -1 && indexOfFirstRoot > indexOfSecondRoot) {
                    return 1;
                }
                if (indexOfFirstRoot !== -1) {
                    return -1;
                }
                return indexOfSecondRoot !== -1 ? 1 : 0;
            });
        }
        if (viewNodesOnly) {
            aggregationKeys = aggregationKeys.filter((key) => this.aggregations[key].isViewNode && !this.aggregations[key].hidden);
        }
        if (sortBy === types_1.AggregationSortBy.ViewNode) {
            aggregationKeys = aggregationKeys.sort(this.getViewNodeSorter.bind(this));
        }
        return aggregationKeys;
    }
    /**
     * Aggregation key sorter by view node.
     * Sorter also sorts by aggregation key in scope of save view node group.
     *
     * @param key1 First aggregation key.
     * @param key2 Second aggregation key.
     * @returns Sorter result.
     */
    getViewNodeSorter(key1, key2) {
        const isViewNode1 = this.aggregations[key1].isViewNode;
        const isViewNode2 = this.aggregations[key2].isViewNode;
        if (isViewNode1 === isViewNode2 && !isViewNode1) {
            // If view node is same, then sort by key
            if (key1 === key2) {
                return 0;
            }
            else if (key1 > key2) {
                return 1;
            }
            else {
                return -1;
            }
        }
        // sort by view node
        if (this.aggregations[key1].isViewNode === this.aggregations[key2].isViewNode) {
            return 0;
        }
        else if (this.aggregations[key1].isViewNode) {
            return 1;
        }
        else {
            return -1;
        }
    }
    /**
     * Method updates path recursively.
     *
     * @param aggregation Aggregation to update.
     * @param path Current path.
     */
    updatePath(aggregation, path) {
        aggregation.setPath(path);
        if (aggregation.aggregations) {
            for (const key in aggregation.aggregations) {
                this.updatePath(aggregation.aggregations[key], path.concat([key]));
            }
        }
    }
    /**
     * Set method to store path of aggregation.
     *
     * @param path Path array.
     */
    setPath(path) {
        this.path = path;
    }
    /**
     * Method returns maximal order by looping through all properties.
     *
     * @returns Maximal property order index.
     */
    getMaxOrder() {
        let maxOrder = 0;
        for (const key in this.aggregations) {
            const order = this.aggregations[key].order || 0;
            if (maxOrder < order) {
                maxOrder = order;
            }
        }
        return maxOrder;
    }
    /**
     * Method enables union handling by adding setting union name and passing original name of aggregation.
     *
     * @param name Union name for aggregation.
     * @param originalName Original name of aggregation.
     */
    addUnionName(name, originalName) {
        const originalNames = this.union?.originalNames || [];
        if (!originalNames.includes(originalName)) {
            originalNames.push(originalName);
        }
        this.union = {
            name,
            originalNames
        };
    }
    /**
     * Protected method which returns name with additional formatting if it is unnecessary.
     * Default logic does not apply any additional formatting, but it allows to overwrite such method and provide additional logic specific to each aggregation.
     *
     * @returns Name of aggregation.
     */
    getFormattedName() {
        return this.name;
    }
    /**
     * Method returns associated annotation UI Node for aggregation.
     *
     * @param annotations Annotations data.
     * @returns Associated annotation UI Node.
     */
    getCurrentUINode(annotations) {
        if (this.name && annotations) {
            const annotationNodeId = this.annotationNodeId || this.getParentAnnotationNodeId();
            if (annotationNodeId) {
                const currentUINode = (0, utils_1.getAnnotationNodeById)(annotations, annotationNodeId);
                if (currentUINode) {
                    return {
                        node: currentUINode,
                        // If it resolved directly or by first non-virtual parent
                        direct: !!this.annotationNodeId
                    };
                }
            }
        }
    }
    /**
     * Method handles readonly annotation node by disabling actions and DnD.
     *
     * @param readonlyTooltip Tooltip text for readonly mode.
     */
    applyReadonlyAnnotationNode(readonlyTooltip) {
        // Method to disable actions
        const disableActions = (actions) => {
            for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                if (typeof action === 'string') {
                    // Simple string - make object which allow to disable action
                    actions[i] = action = {
                        type: action
                    };
                }
                action.disabled = true;
                action.title = readonlyTooltip;
            }
        };
        // Method to disable reordering
        const disableReordering = (aggregation) => {
            aggregation.sortableItem = types_1.SortingOptions.Readonly;
            if (readonlyTooltip) {
                aggregation.sortableReadonlyTooltip = readonlyTooltip;
            }
        };
        for (const key in this.aggregations) {
            const aggregation = this.aggregations[key];
            if (aggregation.actions && !aggregation.custom) {
                disableActions(aggregation.actions);
            }
            if (aggregation.sortableItem === types_1.SortingOptions.Enabled) {
                disableReordering(aggregation);
            }
        }
        if (this.actions) {
            disableActions(this.actions);
        }
        if (this.sortableItem === types_1.SortingOptions.Enabled) {
            disableReordering(this);
        }
    }
    /**
     * Method removes passed action from visible actions.
     *
     * @param action Action to remove.
     */
    removeAction(action) {
        if (this.actions) {
            const actionIndex = this.actions.indexOf(action);
            if (actionIndex !== -1) {
                this.actions.splice(actionIndex, 1);
            }
        }
    }
    /**
     * Method returns allowed drop ranges for passed source aggregation.
     *
     * @param source Source aggregation.
     * @returns Allowed drop ranges for passed source aggregation.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAllowedDropRange(source) {
        return undefined;
    }
    /**
     * Method returns whether aggregation node has macros metadata.
     *
     * @returns Whether aggregation node is macros node.
     */
    isMacrosNode() {
        return !!this.schema?.metadata;
    }
    /**
     * Method converts property to aggregation.
     *
     * @param key Property key/index in object.
     * @param path Aggregation path.
     */
    convertAtomicPropertyToAggregation(key, path) {
        const aggregation = new ObjectAggregation();
        const property = key.toString();
        if (this.properties[key]) {
            aggregation.properties[property] = this.properties[key];
            aggregation.properties[property].isAtomic = true;
        }
        this.addAggregation(key.toString(), aggregation, path.concat(key));
    }
    /**
     * Method handles atomic aggregation by converting properties to aggregation.
     *
     * @param data Aggregation source data.
     * @param path Aggregation path.
     */
    handleAtomicObject(data, path) {
        if (typeof data !== 'object') {
            return;
        }
        // Special handling for atomic arrays and objects - swap properties with aggregation
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                this.convertAtomicPropertyToAggregation(i, path);
            }
        }
        else {
            for (const property in data) {
                this.convertAtomicPropertyToAggregation(property, path);
            }
        }
        this.properties = {};
    }
}
exports.ObjectAggregation = ObjectAggregation;
//# sourceMappingURL=ObjectAggregation.js.map