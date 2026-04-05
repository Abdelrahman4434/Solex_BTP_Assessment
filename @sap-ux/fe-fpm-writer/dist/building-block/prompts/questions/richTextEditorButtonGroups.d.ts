import type { Answers } from 'inquirer';
import type { Prompts, PromptContext } from '../../../prompts/types';
import type { BuildingBlockConfig, RichTextEditorButtonGroups } from '../../types';
export type RichTextEditorButtonGroupsPromptsAnswer = BuildingBlockConfig<RichTextEditorButtonGroups> & Answers;
/**
 * Returns a list of prompts required to generate a rich text editor building block.
 *
 * @param context
 * @returns Prompt with questions for rich text editor.
 */
export declare function getRichTextEditorButtonGroupsBuildingBlockPrompts(context: PromptContext): Promise<Prompts<RichTextEditorButtonGroupsPromptsAnswer>>;
//# sourceMappingURL=richTextEditorButtonGroups.d.ts.map