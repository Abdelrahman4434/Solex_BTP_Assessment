"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeProperty = void 0;
const types_1 = require("./types");
/**
 * Represents a configurable aggregation property in the page editing model.
 * `NodeProperty` wraps schema-based metadata for a property and stores
 * runtime values, validation state, messages, and UI-related options.
 */
class NodeProperty {
    /**
     * Creates an instance of `NodeProperty`.
     *
     * @param schema JSON Schema fragment associated with this property.
     * @param displayName Display name of the property.
     */
    constructor(schema, displayName) {
        this.state = types_1.ValidationState.Valid;
        // Use copy - it allows to make changes in schema if we need.
        this.schema = structuredClone(schema);
        this.name = displayName;
    }
}
exports.NodeProperty = NodeProperty;
//# sourceMappingURL=NodeProperty.js.map