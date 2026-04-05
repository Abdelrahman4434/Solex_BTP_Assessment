import type { JSONSchema4 } from 'json-schema';
import type { Location, SettingOption, PropertyMessage } from './types';
import { ValidationState } from './types';
import type { ArtifactType } from '@sap/ux-specification-types';
export interface PageProperties {
    [key: string]: NodeProperty;
}
/**
 * Represents a configurable aggregation property in the page editing model.
 * `NodeProperty` wraps schema-based metadata for a property and stores
 * runtime values, validation state, messages, and UI-related options.
 */
export declare class NodeProperty implements SettingOption {
    schema: JSONSchema4;
    value?: unknown;
    pattern?: string;
    freeText?: boolean;
    disabled?: boolean;
    state?: ValidationState;
    description?: string;
    required?: boolean;
    isAtomic?: boolean;
    i18nClassification?: string;
    name: string;
    displayName?: string;
    artifactType?: ArtifactType;
    minimum?: number;
    messages?: PropertyMessage[];
    locations?: Location[];
    /**
     * Creates an instance of `NodeProperty`.
     *
     * @param schema JSON Schema fragment associated with this property.
     * @param displayName Display name of the property.
     */
    constructor(schema: JSONSchema4, displayName: string);
}
//# sourceMappingURL=NodeProperty.d.ts.map