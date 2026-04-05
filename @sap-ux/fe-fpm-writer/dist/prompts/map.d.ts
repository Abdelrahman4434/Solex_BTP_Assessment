import type { PromptContext, Prompts, Subset } from './types';
import { PromptsType } from './types';
import type { ChartPromptsAnswer, TablePromptsAnswer, PagePromptsAnswer, FilterBarPromptsAnswer, FormPromptsAnswer, BuildingBlockTypePromptsAnswer, RichTextEditorPromptsAnswer, RichTextEditorButtonGroupsPromptsAnswer } from '../building-block/prompts/questions';
import { generateBuildingBlock, getSerializedFileContent } from '../building-block';
type AnswerMapping = {
    [PromptsType.Chart]: ChartPromptsAnswer;
    [PromptsType.Table]: TablePromptsAnswer;
    [PromptsType.Page]: PagePromptsAnswer;
    [PromptsType.FilterBar]: FilterBarPromptsAnswer;
    [PromptsType.Form]: FormPromptsAnswer;
    [PromptsType.RichTextEditor]: RichTextEditorPromptsAnswer;
    [PromptsType.RichTextEditorButtonGroups]: RichTextEditorButtonGroupsPromptsAnswer;
    [PromptsType.BuildingBlocks]: BuildingBlockTypePromptsAnswer;
};
type BasePrompt<T extends keyof AnswerMapping> = {
    type: T;
    answers: AnswerMapping[T];
    initialAnswers?: Subset<AnswerMapping[T]>;
};
export type SupportedPrompts = BasePrompt<PromptsType.Chart> | BasePrompt<PromptsType.Table> | BasePrompt<PromptsType.FilterBar> | BasePrompt<PromptsType.Form> | BasePrompt<PromptsType.Page> | BasePrompt<PromptsType.BuildingBlocks> | BasePrompt<PromptsType.RichTextEditor> | BasePrompt<PromptsType.RichTextEditorButtonGroups>;
export type SupportedGeneratorPrompts = BasePrompt<PromptsType.Chart> | BasePrompt<PromptsType.Table> | BasePrompt<PromptsType.Page> | BasePrompt<PromptsType.FilterBar> | BasePrompt<PromptsType.Form> | BasePrompt<PromptsType.RichTextEditor>;
export type NarrowPrompt<T, N = SupportedPrompts> = N extends {
    type: T;
} ? N : never;
export type SupportedPromptsMap = {
    [N in SupportedPrompts as N['type']]: (context: PromptContext) => Promise<Prompts<N['answers']>> | Prompts<N['answers']>;
};
export declare const PromptsQuestionsMap: SupportedPromptsMap;
export declare const PromptsGeneratorsMap: {
    chart: typeof generateBuildingBlock;
    table: typeof generateBuildingBlock;
    "filter-bar": typeof generateBuildingBlock;
    form: typeof generateBuildingBlock;
    "rich-text-editor": typeof generateBuildingBlock;
    "rich-text-editor-button-groups": typeof generateBuildingBlock;
    page: typeof generateBuildingBlock;
};
export declare const PromptsCodePreviewMap: {
    chart: typeof getSerializedFileContent;
    table: typeof getSerializedFileContent;
    "filter-bar": typeof getSerializedFileContent;
    form: typeof getSerializedFileContent;
    "rich-text-editor": typeof getSerializedFileContent;
    "rich-text-editor-button-groups": typeof getSerializedFileContent;
    page: typeof getSerializedFileContent;
};
export type SupportedGeneratorAnswers = TablePromptsAnswer | ChartPromptsAnswer | FilterBarPromptsAnswer | FormPromptsAnswer | PagePromptsAnswer | RichTextEditorPromptsAnswer | RichTextEditorButtonGroupsPromptsAnswer;
export {};
//# sourceMappingURL=map.d.ts.map