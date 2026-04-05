"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSchema = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
/**
 * Central manager for application schema lifecycle and operations.
 * Encapsulates all schema structure knowledge and provides clean APIs for schema manipulation.
 */
class AppSchema {
    /**
     * Constructor for AppSchema.
     *
     * @param genericSchema - The initial generic schema object
     */
    constructor(genericSchema) {
        this.schema = JSON.parse(JSON.stringify(genericSchema));
    }
    /**
     * Validates a property path array.
     *
     * @param propertyPath - The path to validate
     * @returns true if valid, false otherwise
     */
    isValidPropertyPath(propertyPath) {
        return (Array.isArray(propertyPath) &&
            propertyPath.length > 0 &&
            propertyPath.every((key) => typeof key === 'string' && key.length > 0));
    }
    /**
     * Resolves a $ref to its actual definition.
     *
     * @param ref - The $ref string (e.g., "#/definitions/MyDefinition")
     * @returns The resolved definition or undefined
     */
    resolveRef(ref) {
        if (typeof ref !== 'string' || !ref.startsWith(common_1.DEFINITION_LINK_PREFIX)) {
            return undefined;
        }
        const definitionName = ref.substring(common_1.DEFINITION_LINK_PREFIX.length);
        return this.getDefinition(definitionName);
    }
    /**
     * Navigates through an object using a property path and returns the value at that path.
     * Automatically resolves $ref references when encountered.
     *
     * @param root - The root object to navigate from
     * @param propertyPath - Array of keys forming the path
     * @param createIntermediates - Whether to create intermediate objects if they don't exist
     * @param resolveRefs - Whether to resolve $ref references during navigation (default: true)
     * @returns The value at the path, or undefined if not found
     */
    navigatePropertyPath(root, propertyPath, createIntermediates = false, resolveRefs = true) {
        if (!root || !this.isValidPropertyPath(propertyPath)) {
            return undefined;
        }
        let current = root;
        for (let i = 0; i < propertyPath.length; i++) {
            const key = propertyPath[i];
            const isLastKey = i === propertyPath.length - 1;
            if (current[key] === undefined || current[key] === null) {
                if (createIntermediates) {
                    current[key] = {};
                }
                else {
                    return undefined;
                }
            }
            // Check if the current value has a $ref and resolve it
            // When we resolve a $ref, we navigate into the resolved definition
            // without modifying the original object
            // Don't resolve on the last key to allow reading properties that contain $ref
            // Only resolve if $ref is the ONLY property (pure reference)
            if (!createIntermediates && resolveRefs && !isLastKey && current[key]?.$ref) {
                const keys = Object.keys(current[key]);
                const isPureRef = keys.length === 1 && keys[0] === '$ref';
                if (isPureRef) {
                    const resolved = this.resolveRef(current[key].$ref);
                    if (resolved) {
                        // Navigate into the resolved definition without mutating original
                        current = resolved;
                        continue;
                    }
                }
            }
            if (typeof current[key] !== 'object') {
                return createIntermediates ? undefined : current[key];
            }
            current = current[key];
        }
        return current;
    }
    /**
     * Sets a value at a property path within an object, creating intermediate objects as needed.
     *
     * @param root - The root object to navigate from
     * @param propertyPath - Array of keys forming the path
     * @param value - The value to set
     * @returns true if successful, false otherwise
     */
    setPropertyPath(root, propertyPath, value) {
        if (!root || !this.isValidPropertyPath(propertyPath)) {
            return false;
        }
        let current = root;
        for (let i = 0; i < propertyPath.length - 1; i++) {
            const key = propertyPath[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        const finalKey = propertyPath[propertyPath.length - 1];
        current[finalKey] = value;
        return true;
    }
    /**
     * Gets the current schema definition.
     *
     * @returns The schema definition
     */
    get() {
        return this.schema;
    }
    /**
     * Gets a specific definition from the schema by name.
     *
     * @param name - The name of the definition
     * @returns The definition or undefined if not found
     */
    getDefinition(name) {
        if (typeof name !== 'string') {
            return name;
        }
        return this.schema.definitions?.[name];
    }
    /**
     * Sets a definition in the schema.
     *
     * @param name - The name of the definition
     * @param definition - The definition to set
     */
    setDefinition(name, definition) {
        if (!this.schema.definitions) {
            this.schema.definitions = {};
        }
        this.schema.definitions[name] = definition;
    }
    /**
     * Deletes a definition from the schema.
     *
     * @param name - The name of the definition to delete
     */
    deleteDefinition(name) {
        if (this.schema.definitions?.[name]) {
            delete this.schema.definitions[name];
        }
    }
    /**
     * Gets a root level property by path.
     *
     * @param propertyPath - Array of property names forming the path
     * @returns The property definition or undefined
     */
    getRootProperty(propertyPath) {
        if (!this.schema.properties || !this.isValidPropertyPath(propertyPath)) {
            return undefined;
        }
        return this.navigatePropertyPath(this.schema.properties, propertyPath);
    }
    /**
     * Gets a property in a definition by path.
     *
     * @param definition - The definition object
     * @param propertyPath - Array of property names forming the path
     * @returns The property definition or undefined
     */
    getProperty(definition, propertyPath) {
        // If no property path is provided, return the entire definition
        if (!propertyPath) {
            return definition;
        }
        // If property path is invalid, return undefined
        if (!this.isValidPropertyPath(propertyPath)) {
            return undefined;
        }
        return this.navigatePropertyPath(definition, propertyPath);
    }
    /**
     * Sets a property in a definition using a path.
     *
     * @param definition - The definition name (string) or definition object
     * @param propertyPath - The path to the property (optional)
     * @param value - The value to set
     */
    setProperty(definition, propertyPath, value) {
        if (typeof definition === 'string') {
            definition = this.getDefinition(definition);
        }
        this.setPropertyPath(definition, propertyPath, value);
    }
    /**
     * Removes a property in a definition using a path.
     *
     * @param definition - The definition object
     * @param value - The value to set
     */
    removeProperty(definition, value) {
        if (!definition) {
            return;
        }
        delete definition[value];
    }
    /**
     * Sets a schema tag on a definition.
     *
     * @param definitionName - The name of the definition
     * @param tag - The schema tag to set
     * @param value - The value for the tag
     */
    setDefinitionTag(definitionName, tag, value) {
        const definition = this.getDefinition(definitionName);
        if (definition) {
            definition[tag] = value;
        }
    }
    /**
     * Sets a schema tag on a property using a path.
     *
     * @param definitionOrString - The definition or name of the definition that should contain the property
     * @param tagOrProperty - The tag info or property path
     * @param tag - The tag info (if property path is provided)
     */
    setPropertyTag(definitionOrString, tagOrProperty, tag) {
        const definition = this.getDefinition(definitionOrString);
        let property = definition;
        if (tag && tagOrProperty instanceof Array) {
            // called with propertyPath
            property = this.getProperty(definition, tagOrProperty);
        }
        const tagInfo = tag ? tag : tagOrProperty;
        if (property && typeof property === 'object') {
            property[tagInfo.name] = tagInfo.value;
        }
    }
    /**
     * Hides a property or definition by setting the hidden tag.
     *
     * @param definition - The definition or name of the definition that should contain the property
     * @param propertyPath - The path to the property (optional)
     */
    hide(definition, propertyPath) {
        this.setPropertyTag(definition, propertyPath, { name: ux_specification_types_1.SchemaTag.hidden, value: true });
    }
    /**
     * Creates a reference to a definition.
     *
     * @param definitionName - The name of the definition to reference
     * @returns The $ref string
     */
    createDefinitionRef(definitionName) {
        return `${common_1.DEFINITION_LINK_PREFIX}${definitionName}`;
    }
    /**
     * Sets a property to reference a definition using a path.
     *
     * @param definitionOrString - The definition or name of the definition that should contain the property
     * @param propertyPath - The path to the property
     * @param targetDefinitionName - The name of the definition to reference
     */
    setPropertyRef(definitionOrString, propertyPath, targetDefinitionName) {
        this.setPropertyTag(definitionOrString, propertyPath, {
            name: '$ref',
            value: this.createDefinitionRef(targetDefinitionName)
        });
    }
    /**
     * Sets a reference for a definition without a path.
     *
     * @param definitionOrString - The definition or name of the definition that should contain the property
     * @param targetDefinitionName - The name of the definition to reference
     */
    setDefinitionRef(definitionOrString, targetDefinitionName) {
        this.setPropertyTag(definitionOrString, {
            name: '$ref',
            value: this.createDefinitionRef(targetDefinitionName)
        });
    }
    /**
     * Adds an enum to a definition property using a path.
     * If there is only one enum value, adds a 'const' property instead of 'enum'.
     *
     * @param definitionName - The name of the definition
     * @param propertyPath - Array of property names forming the path
     * @param enumValues - Array of enum values to add
     */
    addEnumToSchema(definitionName, propertyPath, enumValues) {
        const definition = this.getDefinition(definitionName);
        if (!definition || !this.isValidPropertyPath(propertyPath) || enumValues.length === 0) {
            return;
        }
        // Determine whether to use 'const' (single value) or 'enum' (multiple values)
        const propertyName = enumValues.length === 1 ? 'const' : 'enum';
        const propertyValue = enumValues.length === 1 ? enumValues[0] : enumValues;
        // If the path ends with 'enum', set the value directly at that path
        // Otherwise, navigate to the property and add enum/const to it
        if (propertyPath[propertyPath.length - 1] === 'enum') {
            // Path ends with 'enum', set it directly
            let current = definition;
            for (let i = 0; i < propertyPath.length - 1; i++) {
                const key = propertyPath[i];
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
            current[propertyName] = propertyValue;
        }
        else {
            // Path doesn't end with 'enum', navigate to the property and add enum/const to it
            let current = definition;
            for (const key of propertyPath) {
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
            current[propertyName] = propertyValue;
        }
    }
    /**
     * Clones a definition with a new name.
     *
     * @param sourceName - The name of the source definition to clone
     * @param targetName - The name for the cloned definition
     * @returns The cloned definition or undefined if source doesn't exist
     */
    cloneDefinition(sourceName, targetName) {
        const source = this.getDefinition(sourceName);
        if (source) {
            const clone = structuredClone(source);
            this.setDefinition(targetName, clone);
            return clone;
        }
        return undefined;
    }
    /**
     * Updates property indices for ordering.
     *
     * @param order - Array of property names in the desired order
     * @param definitionName - Optional definition name (if not provided, updates root schema properties)
     */
    updatePropertyIndices(order, definitionName) {
        const definition = definitionName ? this.getDefinition(definitionName) : this.get();
        if (!definition?.properties) {
            return;
        }
        order.forEach((propertyName, index) => {
            const property = definition.properties[propertyName];
            if (property && typeof property === 'object') {
                property[ux_specification_types_1.SchemaTag.propertyIndex] = index;
            }
        });
    }
    /**
     * Performs cleanup operations on the schema.
     *
     * @param definitionsToDelete - Array of definition names to delete
     */
    cleanup(definitionsToDelete) {
        definitionsToDelete.forEach((name) => this.deleteDefinition(name));
    }
}
exports.AppSchema = AppSchema;
//# sourceMappingURL=AppSchema.js.map