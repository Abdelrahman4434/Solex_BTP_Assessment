import type { Answers } from 'inquirer';
import type { PromptContext, Prompts } from '../../../prompts/types';
import type { BuildingBlockConfig, Form } from '../../types';
export type FormPromptsAnswer = BuildingBlockConfig<Form> & Answers;
/**
 * Returns a list of prompts required to generate a form building block.
 *
 * @param context - prompt context including data about project
 * @returns Prompt with questions for form.
 */
export declare function getFormBuildingBlockPrompts(context: PromptContext): Promise<Prompts<FormPromptsAnswer>>;
//# sourceMappingURL=form.d.ts.map