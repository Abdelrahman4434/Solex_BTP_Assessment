import type { NavigationProperty, Property, EntitySet } from '@sap-ux/vocabularies-types';
import type { PromptContext } from '../../../prompts/types';
import type { Answers } from 'inquirer';
/**
 * Loads entity sets from cache or fetches them for the given context.
 */
export declare const entitySetCache: Record<string, EntitySet[]>;
/**
 * Loads and caches entity sets for the given prompt context.
 *
 * @param context - The prompt context containing project and appId information.
 * @returns A promise that resolves to an array of EntitySet objects.
 * @throws If the project is undefined or empty.
 */
export declare function loadEntitySets(context: PromptContext): Promise<EntitySet[]>;
/**
 * Resolves entity sets or navigation properties based on binding context.
 *
 * @param entitySets - All entity sets in the project
 * @param pageContextEntitySet - The entity set representing the page context (e.g., for an object page).
 * @param bindingContextType - absolute or relative
 * @returns EntitySet or NavigationProperty objects
 */
export declare function getEntitySetOptions(entitySets: EntitySet[], pageContextEntitySet?: string, bindingContextType?: string): (EntitySet | NavigationProperty)[];
/**
 * Resolves entity properties for a selected entity set or via a relative navigation property.
 *
 * @param entitySets - All entity sets in the project
 * @param pageContextEntitySet - The entity set representing the page context (e.g., for an object page).
 * @param bindingContextType - absolute or relative
 * @param selectedContext - Currently selected navigation property (for relative) or Currently selected entity set (for absolute)
 * @returns Array of Properties
 */
export declare function resolveEntitySetTargets(entitySets: EntitySet[], pageContextEntitySet?: string, bindingContextType?: string, selectedContext?: string): Property[];
/**
 * Returns binding context type choices based on project and available entity sets.
 *
 * @param context - prompt context
 * @returns Array of choices or a Promise resolving to choices
 */
export declare function resolveBindingContextTypeChoices(context: PromptContext): {
    disabled?: boolean | undefined;
    title?: string | string[] | undefined;
    name: string;
    value: import("../../types").BindingContextType;
}[] | (() => Promise<{
    disabled?: boolean | undefined;
    title?: string | string[] | undefined;
    name: string;
    value: import("../../types").BindingContextType;
}[]>);
/**
 * Get button groups choices based on existing XML content.
 * If no existing button groups, only defaults are checked.
 *
 * @param context - Prompt context
 * @param answers - Current answers
 * @returns Array of button group choices with checked state based on XML
 */
export declare function getButtonGroupsChoices(context: PromptContext, answers: Answers): Promise<{
    name: string;
    value: string;
    hidden: boolean;
    checked: boolean;
    title: string;
}[]>;
//# sourceMappingURL=prompt-helpers.d.ts.map