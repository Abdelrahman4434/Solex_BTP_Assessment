import type { Location } from './common';
export declare const UI_NODE_TYPE_HEADER_INFO = "headerInfo";
export declare const UI_NODE_TYPE_PAGE_ACTIONS = "pageActions";
export declare const UI_NODE_TYPE_FORM = "form";
export declare const UI_NODE_TYPE_HEADER_SECTIONS = "headerSections";
export declare const UI_NODE_TYPE_SECTION = "section";
export declare const UI_NODE_TYPE_FORM_FIELD = "formField";
export declare const UI_NODE_TYPE_CONNECTED_FIELDS = "connectedFields";
export declare const UI_NODE_TYPE_ACTION = "action";
export declare const UI_NODE_TYPE_ACTION_GROUP = "actionGroup";
export declare const UI_NODE_TYPE_GENERIC_ACTIONS = "genericActions";
export declare const UI_NODE_TYPE_GENERIC_ACTION = "genericAction";
export declare const UI_NODE_TYPE_CHART = "chart";
export declare const UI_NODE_TYPE_CONTACT = "contact";
export declare const UI_NODE_TYPE_DATA_POINT = "dataPoint";
export declare const UI_NODE_TYPE_ANALYTICAL_CHART = "analyticalChart";
export declare const UI_NODE_TYPE_NAVIGATION = "navigation";
export declare const UI_NODE_TYPE_VIEWS = "views";
export declare const UI_NODE_TYPE_LIST = "list";
export declare const UI_NODE_TYPE_COLUMN = "column";
export declare const UI_NODE_TYPE_FILTER_FIELDS = "filterFields";
export declare const UI_NODE_TYPE_FILTER_FIELD = "filterField";
export declare const UI_NODE_TYPE_VISUAL_FILTERS = "visualFilters";
export declare const UI_NODE_TYPE_VISUAL_FILTER = "visualFilter";
export interface TooComplexData extends UINodeCore {
    tooComplex?: boolean;
    tooComplexLocations?: Location[];
}
export type UINodeId = number[];
export interface UINodeCore {
    nodeType: string;
    nodeId: UINodeId;
    annotationPath: string;
    macroNodeId?: string;
    allowedParentNodes?: Record<string, boolean>;
    allowedSubnodeTypes?: string[];
    suppressedSubnodeTypes?: {
        subNodeType: string;
        tooltip: string;
    }[];
}
export interface UINodeValue extends UINodeCore {
    nodeType: string;
    readonly?: boolean;
    readonlyTooltip?: string;
    location: Location;
    subnodes: UINode[];
    info?: string;
    sectionType?: string;
}
export type UINode = UINodeValue | TooComplexData;
export interface UIDialogsContext {
    analyticalChartSupport?: {
        creationEnabled: boolean;
        creationTooltip: string;
        deletionEnabled?: boolean;
        deletionTooltip?: string;
        addToMultiViewEnabled?: boolean;
        addToMultiViewTooltip?: string;
    };
    suppressTableViewDeletionNodeId?: UINodeId;
}
//# sourceMappingURL=annotations.d.ts.map