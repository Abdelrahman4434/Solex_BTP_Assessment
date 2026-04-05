import type { Answers } from 'inquirer';
import type { PromptContext, Prompts } from '../../../prompts/types';
import type { BuildingBlockConfig, Page } from '../../types';
export type PagePromptsAnswer = BuildingBlockConfig<Page> & Answers;
/**
 * Returns a list of prompts required to generate a page building block.
 *
 * @param context - prompt context including data about project
 * @returns Prompt with questions for page.
 */
export declare function getPageBuildingBlockPrompts(context: PromptContext): Promise<Prompts<PagePromptsAnswer>>;
//# sourceMappingURL=page.d.ts.map