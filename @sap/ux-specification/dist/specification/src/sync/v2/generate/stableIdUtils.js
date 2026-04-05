"use strict";
/**
 * @file This file contains helper functions to replicate the logic for stable id generation from Fiori Elements v2.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewId = getViewId;
exports.replaceSpecialCharsInId = replaceSpecialCharsInId;
exports.getStableIdPartFromDataField = getStableIdPartFromDataField;
exports.getSuffixFromIconTabFilterKey = getSuffixFromIconTabFilterKey;
exports.getStableIdForDatafieldActionButton = getStableIdForDatafieldActionButton;
const extensionLogger_1 = require("../../../extensionLogger");
/**
 * This function replicates the logic of function fnDetermineViewId in sap.suite.ui.generic.template.lib.TemplateComponent.js of FE coding.
 * It determines the id of the view that contains one page of an FE app.
 *
 * @param appId - id of the app
 * @param componentName - name of the template component (that identifies the floor plan)
 * @param entitySet - name of the entity set of a page
 * @returns the fully qualified view id
 */
function getViewId(appId, componentName, entitySet) {
    const componentPath = componentName.split('.');
    const templateShortName = componentPath[componentPath.length - 1];
    // Replicate logic how oComponentData.templateName has been defined in FE coding. All follow the same pattern with exception of OP.
    const templateName = componentName + '.view.' + (templateShortName === 'ObjectPage' ? 'Details' : templateShortName);
    return `${appId}::${templateName}::${entitySet}`;
}
/**
 * This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding.
 *
 * @param id - the id to be modified
 * @param generateParameters - provides access to the logger
 * @returns the modified id
 */
function replaceSpecialCharsInId(id, generateParameters) {
    if (id.indexOf(' ') >= 0) {
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: 'Spaces are not allowed in ID parts. Please check the annotations, probably something is wrong there.'
        });
    }
    return id.replace(/@/g, '').replace(/\//g, '::').replace(/#/g, '::');
}
/**
 * Determine the string which is used to identify an action in an action data field (DataFieldForAction or DataFieldWithIntentBasedNavigation) for the stable id generation.
 *
 * @param dataField - the action
 * @returns the identifying string
 */
function getActionStringFromDataField(dataField) {
    if (typeof dataField.Action === 'string') {
        return dataField.Action;
    }
    if (typeof dataField.Action === 'object') {
        return dataField.Action['path'];
    }
    return '';
}
/**
 * Determine the string which is used to identify a semantic object in a navigation data field (DataFieldFor/WithIntentBasedNavigation) for the stable id generation.
 *
 * @param dataField - the navigation
 * @returns the identifying string
 */
function getSemanticObjectStringFromDataField(dataField) {
    if (typeof dataField.SemanticObject === 'string') {
        return dataField.SemanticObject;
    }
    if (typeof dataField.SemanticObject === 'object') {
        return dataField.SemanticObject['path'];
    }
    return '';
}
/**
 * This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding.
 *
 * @param dataField - the data field for which a stable id part should be created
 * @param generateParameters - provides access to the logger
 * @returns the stable id part created from the given data field
 */
function getStableIdPartFromDataField(dataField, generateParameters) {
    let pathConcat = '', idPart = '';
    if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
        return replaceSpecialCharsInId(getActionStringFromDataField(dataField), generateParameters);
    }
    else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */ ||
        dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" /* UIAnnotationTypes.DataFieldWithIntentBasedNavigation */) {
        idPart = replaceSpecialCharsInId(getSemanticObjectStringFromDataField(dataField), generateParameters);
        idPart = idPart + '::' + replaceSpecialCharsInId(getActionStringFromDataField(dataField), generateParameters);
        return idPart;
    }
    else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */ && typeof dataField.Target === 'object') {
        return replaceSpecialCharsInId(dataField.Target['value'], generateParameters);
    }
    else if (dataField.IconUrl /* && (dataField.IconUrl.Path || dataField.IconUrl.String) */) {
        /*        if (dataField.IconUrl.Path) {
            idPart = replaceSpecialCharsInId(dataField.IconUrl.Path, generateParameters);
        } else if (dataField.IconUrl.String) {
            dataFieldString = dataField.IconUrl.String.replace('://', '-');
            idPart = replaceSpecialCharsInId(dataFieldString, generateParameters);
        } */
        idPart = replaceSpecialCharsInId(dataField.IconUrl.toString(), generateParameters); // todo: recheck Path and String scenario
        return idPart;
    }
    else if (dataField['Value'] && dataField['Value']['type'] === 'Path') {
        return replaceSpecialCharsInId(dataField['Value']['path'], generateParameters);
    }
    else if (dataField['Value'] &&
        dataField['Value']['Apply'] &&
        dataField['Value']['Apply']['Name'] === 'odata.concat') {
        // todo: recheck
        for (let i = 0; i < dataField['Value']['Apply']['Parameters'].length; i++) {
            if (dataField['Value']['Apply']['Parameters'][i].Type === 'Path') {
                if (pathConcat) {
                    pathConcat = pathConcat + '::';
                }
                pathConcat =
                    pathConcat +
                        replaceSpecialCharsInId(dataField['Value']['Apply']['Parameters'][i].Value, generateParameters);
            }
        }
        return pathConcat;
    }
    else {
        // Todo: FE logs an error in this case. Check whether tools should do the same.
        // If yes, some unit test will have to be adapted.
        // In case of a string or unknown property
        /*        log(generateParameters.logger, {
            severity: LogSeverity.Error,
            message: 'Unable to create a stable ID. Please check the annotations.'
        }); */
    }
}
/**
 *  This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding.
 *
 * @param iconTabFilterKey - in multi view case the key identifying the view. Note that we assume that replaceSpecialCharsInId has already been executed on this value (and therefore must not be called again).
 * @returns the suffix for the stable ID part created from the given iconTabFilterKey
 */
function getSuffixFromIconTabFilterKey(iconTabFilterKey) {
    if (iconTabFilterKey) {
        return '-'.concat(iconTabFilterKey);
    }
    else {
        return '';
    }
}
/**
 * This function replicates the logic from corresponding function in sap.suite.ui.generic.template.js.AnnotationHelper.js of FE coding and adds logic which is implemented
 * in the FE fragments to build the id of an action button.
 *
 * @param actionInfo - the information about the action for which a stable id should be created
 * @returns the stable id for the action button
 */
function getStableIdForDatafieldActionButton(actionInfo) {
    let stableId = '';
    let datafieldStableId = '';
    const facetStableId = '';
    /* To be activated when this logic is applied to OP as well:
    if (actionInfo.facet) {
        facetStableId = actionInfo.facet.stableIdPart;
    } */
    if (actionInfo.dataField) {
        datafieldStableId = actionInfo.dataField.stableIdPart;
    }
    stableId = (facetStableId === '' ? '' : facetStableId + '::') + 'action::' + datafieldStableId;
    const suffix = getSuffixFromIconTabFilterKey(actionInfo.iconTabFilterKey);
    if (suffix) {
        stableId = stableId.concat(suffix);
    }
    if (actionInfo.isChart) {
        stableId = stableId + '::chart';
    }
    // Note: Special handling of determining buttons is not part of the Fiori Elements AnnotationHelper function. This is handled in the corresponding xml fragments.
    if (actionInfo.isDetermining) {
        stableId = stableId + '::Determining';
    }
    return stableId;
}
//# sourceMappingURL=stableIdUtils.js.map