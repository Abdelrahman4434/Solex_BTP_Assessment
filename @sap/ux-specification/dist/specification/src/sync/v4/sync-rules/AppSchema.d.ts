import type { Definition, DefinitionOrBoolean } from 'typescript-json-schema';
import { SchemaTag } from '@sap/ux-specification-types';
type TagInfo = {
    name: SchemaTag | '$ref';
    value: unknown;
};
/**
 * Central manager for application schema lifecycle and operations.
 * Encapsulates all schema structure knowledge and provides clean APIs for schema manipulation.
 */
export declare class AppSchema {
    private readonly schema;
    /**
     * Constructor for AppSchema.
     *
     * @param genericSchema - The initial generic schema object
     */
    constructor(genericSchema: object);
    /**
     * Validates a property path array.
     *
     * @param propertyPath - The path to validate
     * @returns true if valid, false otherwise
     */
    private isValidPropertyPath;
    /**
     * Resolves a $ref to its actual definition.
     *
     * @param ref - The $ref string (e.g., "#/definitions/MyDefinition")
     * @returns The resolved definition or undefined
     */
    private resolveRef;
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
    private navigatePropertyPath;
    /**
     * Sets a value at a property path within an object, creating intermediate objects as needed.
     *
     * @param root - The root object to navigate from
     * @param propertyPath - Array of keys forming the path
     * @param value - The value to set
     * @returns true if successful, false otherwise
     */
    private setPropertyPath;
    /**
     * Gets the current schema definition.
     *
     * @returns The schema definition
     */
    get(): Definition;
    /**
     * Gets a specific definition from the schema by name.
     *
     * @param name - The name of the definition
     * @returns The definition or undefined if not found
     */
    getDefinition(name: Definition | string): Definition | undefined;
    /**
     * Sets a definition in the schema.
     *
     * @param name - The name of the definition
     * @param definition - The definition to set
     */
    setDefinition(name: string, definition: Definition): void;
    /**
     * Deletes a definition from the schema.
     *
     * @param name - The name of the definition to delete
     */
    deleteDefinition(name: string): void;
    /**
     * Gets a root level property by path.
     *
     * @param propertyPath - Array of property names forming the path
     * @returns The property definition or undefined
     */
    getRootProperty(propertyPath: string[]): Definition | undefined;
    /**
     * Gets a property in a definition by path.
     *
     * @param definition - The definition object
     * @param propertyPath - Array of property names forming the path
     * @returns The property definition or undefined
     */
    getProperty(definition: Definition, propertyPath?: string[]): Definition | undefined;
    /**
     * Sets a property in a definition using a path.
     *
     * @param definition - The definition name (string) or definition object
     * @param propertyPath - The path to the property (optional)
     * @param value - The value to set
     */
    setProperty(definition: string | Definition, propertyPath: string[] | undefined, value: DefinitionOrBoolean | string): void;
    /**
     * Removes a property in a definition using a path.
     *
     * @param definition - The definition object
     * @param value - The value to set
     */
    removeProperty(definition: Definition, value: string): void;
    /**
     * Sets a schema tag on a definition.
     *
     * @param definitionName - The name of the definition
     * @param tag - The schema tag to set
     * @param value - The value for the tag
     */
    setDefinitionTag(definitionName: string, tag: SchemaTag, value: Definition): void;
    /**
     * Sets a schema tag on a property using a path.
     *
     * @param definitionOrString - The definition or name of the definition that should contain the property
     * @param tagOrProperty - The tag info or property path
     * @param tag - The tag info (if property path is provided)
     */
    setPropertyTag(definitionOrString: Definition | string, tagOrProperty: TagInfo | string[], tag?: TagInfo): void;
    /**
     * Hides a property or definition by setting the hidden tag.
     *
     * @param definition - The definition or name of the definition that should contain the property
     * @param propertyPath - The path to the property (optional)
     */
    hide(definition: string | Definition, propertyPath?: string[]): void;
    /**
     * Creates a reference to a definition.
     *
     * @param definitionName - The name of the definition to reference
     * @returns The $ref string
     */
    private createDefinitionRef;
    /**
     * Sets a property to reference a definition using a path.
     *
     * @param definitionOrString - The definition or name of the definition that should contain the property
     * @param propertyPath - The path to the property
     * @param targetDefinitionName - The name of the definition to reference
     */
    setPropertyRef(definitionOrString: Definition | string, propertyPath: string[], targetDefinitionName: string): void;
    /**
     * Sets a reference for a definition without a path.
     *
     * @param definitionOrString - The definition or name of the definition that should contain the property
     * @param targetDefinitionName - The name of the definition to reference
     */
    setDefinitionRef(definitionOrString: Definition | string, targetDefinitionName: string): void;
    /**
     * Adds an enum to a definition property using a path.
     * If there is only one enum value, adds a 'const' property instead of 'enum'.
     *
     * @param definitionName - The name of the definition
     * @param propertyPath - Array of property names forming the path
     * @param enumValues - Array of enum values to add
     */
    addEnumToSchema(definitionName: string, propertyPath: string[], enumValues: string[]): void;
    /**
     * Clones a definition with a new name.
     *
     * @param sourceName - The name of the source definition to clone
     * @param targetName - The name for the cloned definition
     * @returns The cloned definition or undefined if source doesn't exist
     */
    cloneDefinition(sourceName: string, targetName: string): Definition | undefined;
    /**
     * Updates property indices for ordering.
     *
     * @param order - Array of property names in the desired order
     * @param definitionName - Optional definition name (if not provided, updates root schema properties)
     */
    updatePropertyIndices(order: string[], definitionName?: string): void;
    /**
     * Performs cleanup operations on the schema.
     *
     * @param definitionsToDelete - Array of definition names to delete
     */
    cleanup(definitionsToDelete: string[]): void;
}
export {};
//# sourceMappingURL=AppSchema.d.ts.map