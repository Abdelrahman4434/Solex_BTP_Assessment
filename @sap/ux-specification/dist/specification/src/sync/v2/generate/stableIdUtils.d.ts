/**
 * @file This file contains helper functions to replicate the logic for stable id generation from Fiori Elements v2.
 */
import type { GenerateAppSchemaParameters } from '@sap/ux-specification-types';
import type { DataFieldAbstractTypes } from '@sap-ux/vocabularies-types/vocabularies/UI';
import type { ActionInfo } from '../genericSchemaHandling/controls';
/**
 * This function replicates the logic of function fnDetermineViewId in sap.suite.ui.generic.template.lib.TemplateComponent.js of FE coding.
 * It determines the id of the view that contains one page of an FE app.
 *
 * @param appId - id of the app
 * @param componentName - name of the template component (that identifies the floor plan)
 * @param entitySet - name of the entity set of a page
 * @returns the fully qualified view id
 */
export declare function getViewId(appId: string, componentName: string, entitySet: string): string;
/**
 * This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding.
 *
 * @param id - the id to be modified
 * @param generateParameters - provides access to the logger
 * @returns the modified id
 */
export declare function replaceSpecialCharsInId(id: string, generateParameters: GenerateAppSchemaParameters): string;
/**
 * This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding.
 *
 * @param dataField - the data field for which a stable id part should be created
 * @param generateParameters - provides access to the logger
 * @returns the stable id part created from the given data field
 */
export declare function getStableIdPartFromDataField(dataField: DataFieldAbstractTypes, generateParameters: GenerateAppSchemaParameters): string;
/**
 *  This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding.
 *
 * @param iconTabFilterKey - in multi view case the key identifying the view. Note that we assume that replaceSpecialCharsInId has already been executed on this value (and therefore must not be called again).
 * @returns the suffix for the stable ID part created from the given iconTabFilterKey
 */
export declare function getSuffixFromIconTabFilterKey(iconTabFilterKey: string): string;
/**
 * This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding and adds logic which is implemented
 * in the FE fragments to build the id of an action button.
 *
 * @param actionInfo - the information about the action for which a stable id should be created
 * @returns the stable id for the action button
 */
export declare function getStableIdForDatafieldActionButton(actionInfo: ActionInfo): string;
//# sourceMappingURL=stableIdUtils.d.ts.map