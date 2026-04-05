import type { Editor } from 'mem-fs-editor';
import type { EventHandlerConfiguration, InternalCustomElement } from '../common/types';
/**
 * Interface to describe event handler configuration options used during creation.
 */
interface EventHandlerConfigurationOptions {
    controllerSuffix?: boolean;
    typescript?: boolean;
    templatePath?: string;
    eventHandlerFnName?: string;
}
type EventHandlerTypescriptParameters = EventHandlerTypescriptParameter[];
/**
 * Interface to describe the input parameters for the generated event handler function.
 */
export interface EventHandlerTypescriptParameter {
    /** Variable name in TypeScript style */
    name: string;
    /** Variable name in JavaScript style (Hungarian notation) */
    jsName: string;
    description: string;
    importType: string;
    /**
     * Optional. If not defined, the parameter type will be taken from `importType`.
     */
    paramType?: string;
    importSource: string;
}
/**
 * Default values for the input parameters of newly created event handlers.
 */
export declare const defaultParameter: EventHandlerTypescriptParameter;
/**
 * Values for the input parameters of newly created event handlers that are added as manifest actions.
 */
export declare const contextParameter: EventHandlerTypescriptParameter;
export declare const selectedContextsParameter: EventHandlerTypescriptParameter;
/**
 * Method creates or updates handler js file and update 'settings.eventHandler' entry with namespace path entry to method.
 *
 * @param fs - the memfs editor instance
 * @param config - configuration
 * @param eventHandler - eventHandler for creation
 * @param eventHandlerOptions - eventHandler options
 * @param parameters - parameters and its configurations for the event handler
 * @returns {string} full namespace path to method
 */
export declare function applyEventHandlerConfiguration(fs: Editor, config: Partial<InternalCustomElement>, eventHandler: EventHandlerConfiguration | true | string, eventHandlerOptions: EventHandlerConfigurationOptions, parameters?: EventHandlerTypescriptParameters): string;
export {};
//# sourceMappingURL=event-handler.d.ts.map