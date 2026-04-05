"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptsCodePreviewMap = exports.PromptsGeneratorsMap = exports.PromptsQuestionsMap = void 0;
const types_1 = require("./types");
const questions_1 = require("../building-block/prompts/questions");
const building_block_1 = require("../building-block");
exports.PromptsQuestionsMap = {
    [types_1.PromptsType.Chart]: questions_1.getChartBuildingBlockPrompts,
    [types_1.PromptsType.Table]: questions_1.getTableBuildingBlockPrompts,
    [types_1.PromptsType.FilterBar]: questions_1.getFilterBarBuildingBlockPrompts,
    [types_1.PromptsType.Form]: questions_1.getFormBuildingBlockPrompts,
    [types_1.PromptsType.BuildingBlocks]: questions_1.getBuildingBlockTypePrompts,
    [types_1.PromptsType.Page]: questions_1.getPageBuildingBlockPrompts,
    [types_1.PromptsType.RichTextEditor]: questions_1.getRichTextEditorBuildingBlockPrompts,
    [types_1.PromptsType.RichTextEditorButtonGroups]: questions_1.getRichTextEditorButtonGroupsBuildingBlockPrompts
};
exports.PromptsGeneratorsMap = {
    [types_1.PromptsType.Chart]: building_block_1.generateBuildingBlock,
    [types_1.PromptsType.Table]: building_block_1.generateBuildingBlock,
    [types_1.PromptsType.FilterBar]: building_block_1.generateBuildingBlock,
    [types_1.PromptsType.Form]: building_block_1.generateBuildingBlock,
    [types_1.PromptsType.RichTextEditor]: building_block_1.generateBuildingBlock,
    [types_1.PromptsType.RichTextEditorButtonGroups]: building_block_1.generateBuildingBlock,
    [types_1.PromptsType.Page]: building_block_1.generateBuildingBlock
};
exports.PromptsCodePreviewMap = {
    [types_1.PromptsType.Chart]: building_block_1.getSerializedFileContent,
    [types_1.PromptsType.Table]: building_block_1.getSerializedFileContent,
    [types_1.PromptsType.FilterBar]: building_block_1.getSerializedFileContent,
    [types_1.PromptsType.Form]: building_block_1.getSerializedFileContent,
    [types_1.PromptsType.RichTextEditor]: building_block_1.getSerializedFileContent,
    [types_1.PromptsType.RichTextEditorButtonGroups]: building_block_1.getSerializedFileContent,
    [types_1.PromptsType.Page]: building_block_1.getSerializedFileContent
};
//# sourceMappingURL=map.js.map