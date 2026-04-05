import type { Editor } from 'mem-fs-editor';
import { BuildingBlockType, type BuildingBlock, type EmbededFragment, type EmbeddedAction } from './types';
import type { Manifest, InternalCustomElement } from '../common/types';
/**
 * Type for embedded fragment data used in building block processing.
 */
type EmbeddedFragmentData = InternalCustomElement & EmbededFragment;
/**
 * Type for embedded action data used in building block processing for custom actions.
 */
type EmbeddedActionData = InternalCustomElement & EmbeddedAction;
/**
 * Namespace for XML elements.
 */
interface NamespaceConfig {
    uri: string;
    prefix: string;
}
/**
 * Context for processing building blocks.
 */
interface ProcessingContext {
    fs: Editor;
    xmlDocument?: Document;
    viewPath?: string;
    embeddedFragment?: EmbeddedFragmentData;
    updatedAggregationPath?: string;
    hasAggregation?: boolean;
    embeddedAction?: EmbeddedActionData;
}
/**
 * Configuration for building block templates.
 */
interface BuildingBlockTemplateConfig {
    aggregationConfig: {
        aggregationName: string;
        elementName: string;
    };
    templateFile?: string;
    namespace: NamespaceConfig;
    processor: (buildingBlockData: BuildingBlock, context: ProcessingContext) => void;
}
/**
 * Button group configurations used for validation and providing available button groups.
 */
export declare const BUTTON_GROUP_CONFIGS: {
    name: string;
    buttons: string;
}[];
/**
 * Configuration map for building block types.
 */
export declare const BUILDING_BLOCK_CONFIG: Partial<Record<BuildingBlockType, BuildingBlockTemplateConfig>>;
/**
 * Processes building block configuration.
 *
 * @param {BuildingBlock} buildingBlockData - The building block data
 * @param {Document} xmlDocument - The XML document
 * @param {string} manifestPath - The manifest file path
 * @param {Manifest} manifest - The manifest object
 * @param {string} aggregationPath - The aggregation path
 * @param {Editor} fs - The memfs editor instance
 * @returns {object} Object containing updated aggregation path and processed building block data
 */
export declare function processBuildingBlock<T extends BuildingBlock>(buildingBlockData: T, xmlDocument: Document, manifestPath: string, manifest: Manifest, aggregationPath: string, fs: Editor): {
    updatedAggregationPath: string;
    processedBuildingBlockData: T;
    hasAggregation: boolean;
    aggregationNamespace: string;
};
export {};
//# sourceMappingURL=processor.d.ts.map