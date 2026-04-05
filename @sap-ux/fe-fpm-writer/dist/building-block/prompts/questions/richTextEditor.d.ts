import type { Answers } from 'inquirer';
import type { PromptContext, Prompts } from '../../../prompts/types';
import type { BuildingBlockConfig, RichTextEditor } from '../../types';
export type RichTextEditorPromptsAnswer = BuildingBlockConfig<RichTextEditor> & Answers;
/**
 * Returns a list of prompts required to generate a rich text editor building block.
 *
 * @param context - prompt context including data about project
 * @returns Prompt with questions for rich text editor.
 */
export declare function getRichTextEditorBuildingBlockPrompts(context: PromptContext): Promise<Prompts<RichTextEditorPromptsAnswer>>;
//# sourceMappingURL=richTextEditor.d.ts.map