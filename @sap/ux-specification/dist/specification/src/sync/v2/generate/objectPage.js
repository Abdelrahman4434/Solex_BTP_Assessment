"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectPageSchemaV2 = generateObjectPageSchemaV2;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
const utils_1 = require("./utils");
const import_1 = require("../import");
const extensionLogger_1 = require("../../../extensionLogger");
const i18next_1 = __importDefault(require("i18next"));
const i18n_1 = require("../../../i18n/i18n");
const types_1 = require("../types");
const StableIdHelper_1 = require("../../v4/utils/StableIdHelper");
const utils_2 = require("../utils");
const factory_1 = require("../export/factory");
const v2_1 = require("@sap/ux-specification-types/src/v2");
const application_1 = require("../application");
const ROOT_PROPERTIES_ORDER = ['header', 'sections', 'footer'];
/**
 * Adds flexChange properties for sub(sections).
 *
 * @param appSchema - app schema in general
 * @param schemaSection - current section
 * @param property - property that will be enhanced
 * @param sectionType - type of section
 */
function addFlexChangeForSection(appSchema, schemaSection, property, sectionType) {
    schemaSection.properties[property][ux_specification_types_1.SchemaTag.artifactType] = ux_specification_types_1.ArtifactType.FlexChange;
    let controlType;
    switch (sectionType) {
        case types_1.SectionTypeV2.Section:
        case types_1.SectionTypeV2.SectionForm:
        case types_1.SectionTypeV2.SectionChart:
        case types_1.SectionTypeV2.SectionTable:
            controlType = ux_specification_types_1.ControlType.Section;
            break;
        case types_1.SectionTypeV2.SubSection:
            controlType = ux_specification_types_1.ControlType.SubSection;
            break;
        case types_1.SectionTypeV2.SubSectionForm:
            controlType = ux_specification_types_1.ControlType.Group;
            break;
        case types_1.SectionTypeV2.SubSectionChart:
            controlType = ux_specification_types_1.ControlType.SmartChart;
            break;
        case types_1.SectionTypeV2.SubSectionTable:
            controlType = ux_specification_types_1.ControlType.SmartTable;
            break;
        case types_1.SectionTypeV2.HeaderSection:
        case types_1.SectionTypeV2.HeaderSectionAddress:
        case types_1.SectionTypeV2.HeaderSectionChart:
        case types_1.SectionTypeV2.HeaderSectionDataPoint:
        case types_1.SectionTypeV2.HeaderSectionForm:
            controlType = ux_specification_types_1.ControlType.ObjectPageHeaderSection;
            break;
    }
    if (!controlType) {
        return;
    }
    (0, common_1.addPatternForBindingChangeOfEnumOP)(appSchema, schemaSection, property);
    schemaSection.properties[property][ux_specification_types_1.SchemaTag.controlType] = controlType;
}
/**
 * Callback for adding a single action to headerActions of V2.
 *
 * @param {EntityType} entityType - current entity type
 * @param {object} appSchema Schema of the app
 * @param identification - UI.Identification annotation as present in AVT ConvertedMetadata
 * @param headerActions - list of header actions, to be enhanced
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 */
function addHeaderActionCallBackV2(entityType, appSchema, identification, headerActions, generateParameters) {
    identification?.forEach((item) => {
        if (!item['Determining'] && item.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
            const { actionName, actionId, namespace } = (0, common_1.getActionNameAndId)(item, generateParameters.serviceAVT);
            //actionId is used as key in V2, as this is the right part for building the full stable ID
            if (!actionId) {
                return;
            }
            const description = (item.Label || actionName);
            const actionDefinitionKey = `ObjectPageHeaderAction<${(0, common_1.prepareRef)(actionId)}>`;
            appSchema.definitions[actionDefinitionKey] = JSON.parse(JSON.stringify(appSchema.definitions['ObjectPageHeaderAction']));
            const convertedIdentification = item.fullyQualifiedName.replace(`@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`, `/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`);
            appSchema.definitions[actionDefinitionKey][ux_specification_types_1.SchemaTag.annotationPath] = `/${convertedIdentification}`;
            appSchema.definitions[actionDefinitionKey][ux_specification_types_1.SchemaTag.actionType] = ux_specification_types_1.ActionType.Annotation;
            appSchema.definitions[actionDefinitionKey].description = description;
            appSchema.definitions[actionDefinitionKey][ux_specification_types_1.SchemaTag.keys] = [
                { name: ux_specification_types_1.SchemaKeyName.action, value: actionName }
            ];
            if (namespace) {
                appSchema.definitions[actionDefinitionKey][ux_specification_types_1.SchemaTag.target] = namespace;
            }
            headerActions.properties[actionId] = {
                $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionDefinitionKey}`
            };
        }
    });
}
/**
 * Callback for adding a single action to footerActions of V2.
 *
 * @param {EntityType} entityType - current entity type
 * @param {Definition} appSchema Schema of the app
 * @param {Definition} footerActions - list of footer actions, to be enhanced
 * @param footerActions.type - The type of the footer actions
 * @param footerActions.properties - The properties of the footer actions.
 * @param footerActions.description - A description of the footer actions.
 * @param footerActions.additionalProperties - Indicates whether additional properties are allowed.
 * @param footerActions.isViewNode - Specifies if the footer actions are part of the view node.
 * @param identification - converted UI.Identification term
 */
function addFooterActionCallBackV2(entityType, appSchema, footerActions, identification) {
    identification.forEach((item) => {
        if (item['Determining'] && item.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
            const actionId = (0, StableIdHelper_1.getStableIdPartFromDataField)(item).split('::').splice(1).join('::');
            const description = (0, common_1.getDataFieldDescription)(item, entityType);
            const actionDefinitionKey = (0, common_1.prepareRef)(`${ux_specification_types_1.DefinitionName.ObjectPageFooterAction}<${actionId}>`);
            const convertedIdentification = item.fullyQualifiedName.replace(`@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`, `/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`);
            try {
                appSchema.definitions[actionDefinitionKey] = {
                    ...JSON.parse(JSON.stringify(appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageFooterAction])),
                    description,
                    annotationPath: `/${convertedIdentification}`
                };
            }
            catch {
                throw new Error(i18next_1.default.t('INCONSISTENTSCHEMA', {
                    function: 'addFooterActionCallBackV2',
                    definition: 'ObjectPageFooterAction'
                }));
            }
            footerActions.properties[actionId] = {
                $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionDefinitionKey}`
            };
        }
    });
}
/**
 * Method ensures that definitions for custom columns are created for passed entitySet.
 *
 * @param {object} appSchema App schema in general
 * @param {object} manifest manifest.json of the app
 * @param {string} entitySetName Entity set name.
 * @param {string} entityTypeName Entity type name.
 * @param {ConvertedMetadata} oDataServiceAVT Complete service information, as returned by annotation vocabularies tool
 * @param {FacetConfig} facet information
 * @param {string} facetKey - key of the facet, as listed in FacetConfigs
 * @param {FileData[]} [fragments] Array with XML fragments.
 * @returns {string} Name of custom columns definition.
 */
function ensureCustomColumnDefinitionExists(appSchema, manifest, entitySetName, entityTypeName, oDataServiceAVT, facet, facetKey, fragments) {
    let suffix, customColumnsDefinitionName;
    if (facet.ID && facet.Label) {
        suffix = facet.ID + facet.Label.replace(/\s+/g, '');
    }
    else if (facet.ID) {
        suffix = facet.ID;
    }
    else if (facet.Label) {
        suffix = facet.Label.replace(/\s+/g, '');
    }
    if (suffix) {
        customColumnsDefinitionName = `${ux_specification_types_1.DefinitionName.CustomColumns}<${entitySetName}><${facetKey}><${suffix}>`;
    }
    else {
        customColumnsDefinitionName = `${ux_specification_types_1.DefinitionName.CustomColumns}<${entitySetName}><${facetKey}>`;
    }
    if (appSchema.definitions[customColumnsDefinitionName]) {
        // Definition is already created - we do not need to create it again
        return customColumnsDefinitionName;
    }
    // Create type specific 'TableCustomColumn' definition - use entity set as type.
    const customColumnDefinitionName = `${ux_specification_types_1.DefinitionName.CustomColumn}<${entitySetName}>`;
    try {
        appSchema.definitions[customColumnDefinitionName] = JSON.parse(JSON.stringify(appSchema.definitions['TableCustomColumn']));
    }
    catch {
        throw new Error(i18next_1.default.t('INCONSISTENTSCHEMA', {
            function: 'ensureCustomColumnDefinitionExists',
            definition: 'TableCustomColumn'
        }));
    }
    // Update definitions for type specific custom columns
    const pageKeys = [];
    const entityType = oDataServiceAVT?.entityTypes.find((et) => et.name === entityTypeName);
    const v2Page = (0, import_1.findObjectPageV2)(manifest[ux_specification_types_1.ManifestSection.generic].pages, entitySetName, pageKeys);
    (0, utils_1.addTableColumnExtensions)(appSchema, entityType, v2Page, manifest, fragments, customColumnsDefinitionName, customColumnDefinitionName, facet.ID);
    return customColumnsDefinitionName;
}
/**
 * Method fills new app schema section with properties.
 *
 * @param {Definition} appSchema App schema in general
 * @param {object} appSchemaSection app schema section to be filled
 * @param {SectionTypeV2} sectionType (sub)section type
 * @param {SectionTypeV2} mainSectionType main section type, used to fill app schema section
 */
function addAppSchemaDefinition(appSchema, appSchemaSection, sectionType, mainSectionType) {
    appSchemaSection.properties = JSON.parse(JSON.stringify(appSchema.definitions[mainSectionType].properties));
    if (appSchemaSection.properties.visible) {
        addFlexChangeForSection(appSchema, appSchemaSection, 'visible', sectionType);
    }
}
/**
 * Method adds reference to section property key.
 *
 * @param {object} sections - schema of current sections definition
 * @param {string} key section key which will contain the reference
 * @param {string} definitionKey key which the section should point to
 */
function addSectionReference(sections, key, definitionKey) {
    sections.properties[key] = { $ref: `${common_1.DEFINITION_LINK_PREFIX}${definitionKey}` };
}
/**
 * Reuse function for all table types, copies and adapts the generic definition.
 *
 * @param tableType - Table type
 * @param facetId - facet ID, as derived for the given section
 * @param facet - facet or section information
 * @param appSchema - app-specific schema, to be updated
 * @param tablePropertiesAdapter - function that should be applied to the table definition
 */
function addTableDefinition(tableType, facetId, facet, appSchema, tablePropertiesAdapter) {
    const schemaId = (0, common_1.prepareRef)(`${tableType}<${facetId}>`);
    try {
        appSchema.definitions[schemaId] = JSON.parse(JSON.stringify(appSchema.definitions[tableType]));
    }
    catch {
        throw new Error(i18next_1.default.t('INCONSISTENTSCHEMA', { function: 'addTableDefinition', definition: `${tableType}` }));
    }
    tablePropertiesAdapter(appSchema.definitions[schemaId]);
    appSchema.definitions[schemaId]['properties']['columns']['$ref'] = common_1.DEFINITION_LINK_PREFIX + facetId;
    appSchema.definitions[schemaId].properties.toolBar['$ref'] =
        `${common_1.DEFINITION_LINK_PREFIX}ObjectPageToolBar<${facetId}>`;
    appSchema.definitions[schemaId][ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    if (facet.ID !== undefined) {
        appSchema.definitions[schemaId].title = ux_specification_types_1.FACETTITLEPREFIX + facet.ID;
        appSchema.definitions[schemaId][ux_specification_types_1.SchemaTag.keys] = [{ name: `ID`, value: facet.ID }];
    }
    appSchema.definitions[schemaId].description = ux_specification_types_1.DefinitionName.Table;
    //adjust quickVariantSelection
    appSchema.definitions[schemaId].properties['quickVariantSelection']['$ref'] =
        `${common_1.DEFINITION_LINK_PREFIX}QuickVariantSelectionOP<${facetId}>`;
    appSchema.definitions[`QuickVariantSelectionOP<${facetId}>`] = JSON.parse(JSON.stringify(appSchema.definitions['QuickVariantSelectionOP']));
    appSchema.definitions[`QuickVariant<${facetId}>`] = JSON.parse(JSON.stringify(appSchema.definitions['QuickVariant']));
    appSchema.definitions[`QuickVariantSelectionOP<${facetId}>`].properties.variants.patternProperties['^[0-9]+$']['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}QuickVariant<${facetId}>`;
    (0, common_1.addEnumForSingleTabVariant)(facet.entityType, appSchema, `QuickVariant<${facetId}>`);
}
/**
 * Adds definitions for line items in object page sections to the app schema.
 *
 * @param pageKeys Array path to target page (e.g., ['parentPage', 'currentPage'])
 * @param generateParameters - list of API input parameters
 * @param facetKey - key of the facet, as listed in FacetConfigs
 * @param appSchema - app schema in general
 * @param facet - the given facet from the UI annotations
 * @param facets - list of all facets
 * @param sectionType (sub)section type
 */
function handleLineItem(pageKeys, generateParameters, facetKey, appSchema, facet, facets, sectionType) {
    if (facet.base !== ux_specification_types_1.FacetBase.LineItem || !facetKey) {
        //no properties
        return;
    }
    const navigationProperty = facetKey.split('::')[0];
    const schemaIdForOpSection = `${sectionType}<${facetKey}>`;
    appSchema.definitions[schemaIdForOpSection] = (0, common_1.createDefaultSection)(appSchema, facet, facetKey);
    const appSchemaSection = appSchema.definitions[schemaIdForOpSection];
    addAppSchemaDefinition(appSchema, appSchemaSection, sectionType, types_1.SectionTypeV2.SectionTable);
    const tableDefinition = JSON.parse(JSON.stringify(appSchema.definitions[types_1.SectionTypeV2.SectionTable]['properties'][ux_specification_types_1.PropertyName.table]));
    tableDefinition.anyOf = [
        {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}ObjectPageResponsiveTableWithMultiSelect<${facetKey}>`
        },
        {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}ObjectPageResponsiveTableWithInlineDelete<${facetKey}>`
        },
        {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}ObjectPageAnalyticalTable<${facetKey}>`
        },
        {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}ObjectPageGridTable<${facetKey}>`
        },
        {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}ObjectPageTreeTable<${facetKey}>`
        }
    ];
    appSchemaSection.properties.table = tableDefinition;
    appSchemaSection[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    (0, common_1.addSectionTitle)(facet, appSchemaSection, facetKey);
    (0, common_1.addSectionDescription)(facet, appSchemaSection, facetKey);
    // Note that facetKey already has replaced all '/' by '::'.However, the @-symbols resulting from
    // the annotation terms are still contained in facetKey. Therefore, we remove these symbols.
    // Suffix '::Table' is added to get the controlId of the SmartTable
    const smartTableControlId = `${facetKey.replaceAll('@', '')}::Table`;
    // Retrieve a function that will adjust the table definition so that it handles properties exportToExcel and enableExport correctly.
    const exportTablePropertiesAdapter = (0, utils_1.getExportTablesPropertiesAdapter)(generateParameters.flex ?? [], smartTableControlId);
    addTableDefinition('ObjectPageResponsiveTableWithMultiSelect', facetKey, facet, appSchema, exportTablePropertiesAdapter);
    addTableDefinition('ObjectPageResponsiveTableWithInlineDelete', facetKey, facet, appSchema, exportTablePropertiesAdapter);
    addTableDefinition('ObjectPageGridTable', facetKey, facet, appSchema, exportTablePropertiesAdapter);
    addTableDefinition('ObjectPageTreeTable', facetKey, facet, appSchema, exportTablePropertiesAdapter);
    addTableDefinition('ObjectPageAnalyticalTable', facetKey, facet, appSchema, exportTablePropertiesAdapter);
    let customColumnDefinitionKey;
    // Find target entity
    const targetEntitySet = (0, common_1.determineEntitySetOfEntityType)(facet.entityType, generateParameters.serviceAVT);
    if (targetEntitySet) {
        // Make sure that custom columns definitions are created for passed entity
        customColumnDefinitionKey = ensureCustomColumnDefinitionExists(appSchema, generateParameters.manifest, targetEntitySet.name, facet.entityType.name, generateParameters.serviceAVT, facet, facetKey, generateParameters.fragments);
    }
    for (const facetItem in facets) {
        const facet = facets[facetItem];
        if (facet.base === ux_specification_types_1.FacetBase.LineItem &&
            (facet.ID === navigationProperty || facetItem.includes(navigationProperty))) {
            (0, utils_1.addLineItemsType)(true, appSchema, facet.target, facet.entityType, facet.ID || facetItem, customColumnDefinitionKey);
        }
    }
    // Add manifestPath to table
    addManifestPathsToPropertiesOP(appSchema, undefined, tableDefinition, {
        manifest: generateParameters.manifest,
        pageName: pageKeys,
        sectionId: facetKey
    });
}
/**
 * Adds definitions for subsections in object page sections to the app schema.
 *
 * @param {Definition} appSchema - app schema in general
 * @param {string} definitionKey - key of app schema definition to be filled
 * @param {FacetConfig} facet facet or section information
 * @param {string} facetId - key of the facet, as listed in FacetConfigs
 * @param {SectionTypeV2} sectionType (sub)section type
 * @param isHeaderFacet - Indicates whether the facet is located in the header section
 */
function handleSubSection(appSchema, definitionKey, facet, facetId, sectionType, isHeaderFacet = false) {
    appSchema.definitions[definitionKey] = (0, common_1.createDefaultSection)(appSchema, facet, facetId);
    const appSchemaSection = appSchema.definitions[definitionKey];
    const sectionDefinition = isHeaderFacet ? types_1.SectionTypeV2.HeaderSection : types_1.SectionTypeV2.SubSection;
    addAppSchemaDefinition(appSchema, appSchemaSection, sectionType, sectionDefinition);
    appSchemaSection.properties.subsections = {
        type: 'object',
        description: 'Subsections',
        properties: {},
        additionalProperties: false
    };
    appSchemaSection.properties.subsections[ux_specification_types_1.SchemaTag.isViewNode] = true;
}
/**
 * Method fills new chart section with properties.
 *
 * @param {Definition} appSchema App schema in general
 * @param {string} definitionKey - key of app schema definition to be filled
 * @param {FacetConfig} facet facet or section information
 * @param {string} facetKey - facet key.
 * @param {SectionTypeV2} sectionType (sub)section type
 */
function handleSectionChart(appSchema, definitionKey, facet, facetKey, sectionType) {
    appSchema.definitions[definitionKey] = (0, common_1.createDefaultSection)(appSchema, facet, facetKey);
    const appSchemaSection = appSchema.definitions[definitionKey];
    addAppSchemaDefinition(appSchema, appSchemaSection, sectionType, types_1.SectionTypeV2.SectionChart);
}
/**
 * Method fills new header section with properties.
 *
 * @param {Definition} appSchema App schema in general
 * @param {string} definitionKey - key of app schema definition to be filled
 * @param {FacetConfig} facet facet or section information
 * @param {string} facetKey - facet key.
 * @param {SectionTypeV2} sectionType (sub)section type
 * @param facetDefinition - The type of the facet definition to be used for the header facet
 */
function handleHeaderFacet(appSchema, definitionKey, facet, facetKey, sectionType, facetDefinition) {
    appSchema.definitions[definitionKey] = (0, common_1.createDefaultSection)(appSchema, facet, facetKey);
    const appSchemaSection = appSchema.definitions[definitionKey];
    addAppSchemaDefinition(appSchema, appSchemaSection, sectionType, facetDefinition || types_1.SectionTypeV2.CommonHeaderFacetSettings);
    appSchemaSection[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    appSchemaSection[ux_specification_types_1.SchemaTag.isViewNode] = true;
    appSchemaSection[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataTypeOfTarget)(facet?.target);
}
/**
 * Method fills new header section with properties.
 *
 * @param appSchema - The application schema to be updated
 * @param definitionKey - The key of the definition to be filled
 * @param facet - The facet or section information
 */
function addDataPointHeaderFacetDataType(appSchema, definitionKey, facet) {
    const appSchemaSection = appSchema.definitions[definitionKey];
    const dataType = (appSchemaSection[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataTypeOfTarget)(facet?.target));
    if (dataType === common_1.DataType.Rating) {
        appSchemaSection.title = `${appSchemaSection.title}::RatingIndicatorVBox`;
    }
    else if (dataType === common_1.DataType.Progress) {
        appSchemaSection.title = `${appSchemaSection.title}::ProgressIndicatorVBox`;
    }
    else {
        appSchemaSection.title = `${appSchemaSection.title}::DataPoint`;
    }
}
/**
 * Method fills new form section in app schema with properties.
 *
 * @param {Definition} appSchema App schema in general
 * @param {string} definitionKey - key of app schema definition to be filled
 * @param {FacetConfig} facet facet or section information
 * @param {string} facetKey - facet key.
 * @param {SectionTypeV2} sectionType (sub)section type
 * @returns {object} returns filled form section in app schema.
 */
function handleFormSection(appSchema, definitionKey, facet, facetKey, sectionType) {
    appSchema.definitions[definitionKey] = (0, common_1.createDefaultSection)(appSchema, facet, facetKey);
    const appSchemaSection = appSchema.definitions[definitionKey];
    addAppSchemaDefinition(appSchema, appSchemaSection, sectionType, types_1.SectionTypeV2.SectionForm);
    appSchemaSection[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    appSchemaSection[ux_specification_types_1.SchemaTag.isViewNode] = true;
    return appSchemaSection;
}
/**
 * Mapping of facet type to (sub)section type to enable correct further handling.
 *
 * @param facetType - facet type to be mapped
 * @param isSubSection - if section is subsection of section
 * @param isHeaderFacet - Indicates whether the facet is located in the header section
 * @returns {SectionTypeV2} sectionType (sub)section type
 */
function getSectionType(facetType, isSubSection, isHeaderFacet) {
    const headerSectionMap = new Map([
        [ux_specification_types_1.FacetBase.CollectionFacet, types_1.SectionTypeV2.HeaderSection],
        [ux_specification_types_1.FacetBase.Address, types_1.SectionTypeV2.HeaderSectionAddress],
        [ux_specification_types_1.FacetBase.Chart, types_1.SectionTypeV2.HeaderSectionChart],
        [ux_specification_types_1.FacetBase.DataPoint, types_1.SectionTypeV2.HeaderSectionDataPoint],
        [ux_specification_types_1.FacetBase.Form, types_1.SectionTypeV2.HeaderSectionForm],
        [ux_specification_types_1.FacetBase.Identification, types_1.SectionTypeV2.HeaderSectionForm]
    ]);
    const sectionTypeMapping = new Map([
        [ux_specification_types_1.FacetBase.CollectionFacet, types_1.SectionTypeV2.Section],
        [ux_specification_types_1.FacetBase.LineItem, types_1.SectionTypeV2.SectionTable],
        [ux_specification_types_1.FacetBase.Chart, types_1.SectionTypeV2.SectionChart],
        [ux_specification_types_1.FacetBase.Address, types_1.SectionTypeV2.SectionAddress],
        [ux_specification_types_1.FacetBase.Contact, types_1.SectionTypeV2.SectionContact],
        [ux_specification_types_1.FacetBase.Form, types_1.SectionTypeV2.SectionForm],
        [ux_specification_types_1.FacetBase.Identification, types_1.SectionTypeV2.SectionForm]
    ]);
    const subSectionTypeMapping = new Map([
        [ux_specification_types_1.FacetBase.CollectionFacet, types_1.SectionTypeV2.SubSection],
        [ux_specification_types_1.FacetBase.LineItem, types_1.SectionTypeV2.SubSectionTable],
        [ux_specification_types_1.FacetBase.Chart, types_1.SectionTypeV2.SubSectionChart],
        [ux_specification_types_1.FacetBase.Address, types_1.SectionTypeV2.SubSectionAddress],
        [ux_specification_types_1.FacetBase.Contact, types_1.SectionTypeV2.SubSectionContact],
        [ux_specification_types_1.FacetBase.Form, types_1.SectionTypeV2.SubSectionForm],
        [ux_specification_types_1.FacetBase.Identification, types_1.SectionTypeV2.SubSectionForm]
    ]);
    if (isHeaderFacet) {
        return headerSectionMap.get(facetType);
    }
    else if (isSubSection) {
        return subSectionTypeMapping.get(facetType);
    }
    else {
        return sectionTypeMapping.get(facetType);
    }
}
/**
 * Method returns reference key, special handling of (sub)sections.
 *
 * @param {FacetConfig} facet facet or section information
 * @param {string} facetKey - facet key.
 * @param {SectionTypeV2} sectionType (sub)section type
 * @returns {string} reference key
 */
function getReferenceKey(facet, facetKey, sectionType) {
    let referenceKey = facet.ID || facetKey;
    if (sectionType === (types_1.SectionTypeV2.Section || types_1.SectionTypeV2.SubSection)) {
        referenceKey = referenceKey.replace(`@${"com.sap.vocabularies.UI.v1.Facets" /* UIAnnotationTerms.Facets */}`, facet.base);
    }
    return `${referenceKey}`;
}
/**
 * Creates a section definition in app schema.
 *
 * @param pageKeys Array path to target page (e.g., ['parentPage', 'currentPage'])
 * @param generateParameters - list of API input parameters
 * @param facets - list of all facets.
 * @param facetKey - facet key.
 * @param sections - schema of current sections definition.
 * @param appSchema - app specific schema that potentially gets enhanced.
 * @param isSubSection - if section is subsection of section
 * @param isHeaderFacet - Indicates whether the facet is located in the header section
 */
function addSection(pageKeys, generateParameters, facets, facetKey, sections, appSchema, isSubSection = false, isHeaderFacet = false) {
    const facet = facets[facetKey];
    const sectionType = getSectionType(facet.base, isSubSection, isHeaderFacet);
    const referenceKey = getReferenceKey(facet, facetKey, sectionType);
    const definitionKey = `${sectionType}<${referenceKey}>`;
    addSectionReference(sections, referenceKey, definitionKey);
    switch (sectionType) {
        case types_1.SectionTypeV2.Section:
        case types_1.SectionTypeV2.SubSection:
        case types_1.SectionTypeV2.HeaderSection: {
            //handle collection facets
            isSubSection = isHeaderFacet ? false : true;
            handleSubSection(appSchema, definitionKey, facet, facetKey, sectionType, isHeaderFacet);
            const subSections = appSchema.definitions[definitionKey].properties
                .subsections;
            for (const key in facet.facets) {
                addSection(pageKeys, generateParameters, facet.facets, key, subSections, appSchema, isSubSection, isHeaderFacet);
            }
            break;
        }
        case types_1.SectionTypeV2.SectionTable:
        case types_1.SectionTypeV2.SubSectionTable: {
            handleLineItem(pageKeys, generateParameters, referenceKey, appSchema, facet, facets, sectionType);
            //add fields for createWithParameterDialog
            const floorplanSuffix = 'OP';
            (0, common_1.addFieldsType)(appSchema, facet.entityType, floorplanSuffix);
            break;
        }
        case types_1.SectionTypeV2.SectionChart:
        case types_1.SectionTypeV2.SubSectionChart: {
            //handle reference facet (if comprising chart)
            handleSectionChart(appSchema, definitionKey, facet, referenceKey, sectionType);
            addManifestPathsToDefinitionPropertiesOP(appSchema, pageKeys, definitionKey, generateParameters, referenceKey);
            break;
        }
        case types_1.SectionTypeV2.SectionForm:
        case types_1.SectionTypeV2.SubSectionForm: {
            const appSchemaSection = handleFormSection(appSchema, definitionKey, facet, referenceKey, sectionType);
            (0, common_1.handleForm)(ux_specification_types_1.SectionType.Section, facet, appSchemaSection, appSchema, ux_specification_types_1.FioriElementsVersion.v2, facetKey);
            break;
        }
        case types_1.SectionTypeV2.SectionAddress:
        case types_1.SectionTypeV2.SectionContact: {
            (0, common_1.handleAddressContact)(facet, referenceKey, sections, appSchema, ux_specification_types_1.SectionType.Section, undefined, 'V2');
            break;
        }
        case types_1.SectionTypeV2.SubSectionAddress:
        case types_1.SectionTypeV2.SubSectionContact: {
            (0, common_1.handleAddressContact)(facet, referenceKey, sections, appSchema, ux_specification_types_1.SectionType.Section, ux_specification_types_1.SectionType.SubSection, 'V2');
            break;
        }
        case types_1.SectionTypeV2.HeaderSectionForm:
        case types_1.SectionTypeV2.HeaderSectionChart:
        case types_1.SectionTypeV2.HeaderSectionAddress: {
            handleHeaderFacet(appSchema, definitionKey, facet, referenceKey, sectionType);
            break;
        }
        case types_1.SectionTypeV2.HeaderSectionDataPoint: {
            handleHeaderFacet(appSchema, definitionKey, facet, referenceKey, sectionType);
            addDataPointHeaderFacetDataType(appSchema, definitionKey, facet);
            break;
        }
        default: {
            // Other facets -> only default properties of ObjectPageSection
            sections.properties[facetKey] = (0, common_1.createDefaultSection)(appSchema, facet, referenceKey);
        }
    }
}
/**
 * Helper function to add facets to the app schema.
 *
 * @param pageKeys Array path to target page (e.g., ['parentPage', 'currentPage'])
 * @param facetsExists flag if facets exists and should be added
 * @param facets collection of facets
 * @param sections sections in config to be extended
 * @param generateParameters list of API input parameters
 * @param appSchema app specific schema that potentially gets enhanced
 * @param isHeaderFacet flag if facet is located in header section
 */
function addSectionsFromFacets(pageKeys, facetsExists, facets, sections, generateParameters, appSchema, isHeaderFacet = false) {
    if (!facetsExists) {
        return;
    }
    for (const facetKey in facets) {
        addSection(pageKeys, generateParameters, facets, facetKey, sections, appSchema, false, isHeaderFacet);
    }
}
/**
 * Adds the sections to the app schema.
 *
 * @param pageKeys Array path to target page (e.g., ['parentPage', 'currentPage'])
 * @param generateParameters - list of API input parameters
 * @param appSchema - app specific schema that potentially gets enhanced
 * @param pages - list of (manifest) pages
 */
function addSections(pageKeys, generateParameters, appSchema, pages) {
    const sections = appSchema.definitions[ux_specification_types_1.DefinitionName.Sections];
    sections[ux_specification_types_1.SchemaTag.isViewNode] = true;
    if (generateParameters.entitySet?.entityType) {
        sections[ux_specification_types_1.SchemaTag.annotationPath] =
            `/${generateParameters.entitySet.entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.Facets" /* UIAnnotationTerms.Facets */}`;
    }
    const headerSections = appSchema.definitions[ux_specification_types_1.DefinitionName.HeaderSections];
    headerSections[ux_specification_types_1.SchemaTag.isViewNode] = true;
    if (!headerSections.properties) {
        headerSections.properties = {};
    }
    headerSections.additionalProperties = false;
    if (generateParameters.entitySet?.entityType) {
        headerSections[ux_specification_types_1.SchemaTag.annotationPath] =
            `/${generateParameters.entitySet.entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.HeaderFacets" /* UIAnnotationTerms.HeaderFacets */}`;
    }
    if (!pages) {
        return;
    }
    // Get facet annotations
    const facets = (0, common_1.getObjectPageFacets)(generateParameters.entitySet?.entityType, generateParameters.serviceAVT, ux_specification_types_1.FioriElementsVersion.v2, generateParameters.logger);
    const headerFacets = (0, common_1.getObjectPageHeaderFacets)(generateParameters.entitySet?.entityType, generateParameters.serviceAVT, ux_specification_types_1.FioriElementsVersion.v2, generateParameters.logger);
    const generateFacets = facets && !!Object.keys(facets).length;
    const generateHeaderFacets = headerFacets && !!Object.keys(headerFacets).length;
    if (!generateFacets && !generateHeaderFacets) {
        return;
    }
    // Loop on all pages, look for the right entity set
    for (const key in pages) {
        const element = pages[key];
        if (generateParameters.entitySet?.name?.includes(element.entitySet)) {
            // Loop on all facets (of the given entitySet)
            addSectionsFromFacets(pageKeys, generateFacets, facets, sections, generateParameters, appSchema);
            addSectionsFromFacets(pageKeys, generateHeaderFacets, headerFacets, headerSections, generateParameters, appSchema, true);
        }
        else {
            addSections(pageKeys, generateParameters, appSchema, element.pages);
        }
    }
    // Add custom sections
    const customSections = appSchema.definitions['CustomSections'];
    for (const name in customSections.properties) {
        sections.properties[name] = customSections.properties[name];
    }
}
/**
 * Add Object Page Header to app-specific schema.
 *
 * @param appSchema Schema of the app
 * @param generateParameters - list of API input parameters
 * @param entityType - current entity type
 */
function addHeader(appSchema, generateParameters, entityType) {
    (0, common_1.addCommonHeaderSchema)(appSchema, entityType);
    //Add header actions
    (0, common_1.addHeaderActions)(appSchema, entityType, generateParameters, addHeaderActionCallBackV2, undefined, true);
}
/**
 * Adds the related facets keys 'enum' to the app schema.
 *
 * @param schema - app specific schema that potentially gets enhanced
 * @param {EntityType} entityType - current entity type
 * @param {ConvertedMetadata} oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param {ExtensionLogger} logger - Logger class for logging messages
 */
function addRelatedFacetKeysType(schema, entityType, oDataServiceAVT, logger) {
    // Find sections from annotation
    // And create new definition in schema as enum with description
    const facetSections = (0, common_1.getObjectPageFacetSection)(entityType, oDataServiceAVT, logger, undefined, true);
    if (facetSections) {
        (0, common_1.addDefinitionForRelatedFacetKeys)(schema, ['ObjectPageCustomSectionFragment', 'ObjectPageCustomSectionView'], facetSections, ['ID', 'key']);
    }
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 * @param parentProperty - Information about the parent property used when resolving.
 *   nested or inherited manifest paths (e.g. parent property name and resolved rule path).
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
function addManifestPathsToPropertiesOP(appSchema, definitionName, definition, pathParams, parentProperty, handleRelative = false) {
    (0, utils_2.addManifestPathsToProperties)(appSchema, definitionName, definition, {
        ...pathParams,
        targetAnnotation: pathParams.sectionId?.replace('::', '/'),
        targetAnnotationEncoded: pathParams.sectionId,
        pathsParts: [pathParams.sectionId]
    }, factory_1.pageTypes.ObjectPage, parentProperty, handleRelative);
}
/**
 * Adds 'manifestPath' to static nodes in schema.
 *
 * @param appSchema - Full schema.
 * @param pathParams - Additional context required to compute manifest paths.
 */
function addManifestPathsToStaticNodes(appSchema, pathParams) {
    // Add "manifestPath" for current page
    appSchema['manifestPath'] = (0, utils_2.getPageManifestPath)(pathParams);
    // Add manifestPath to root level
    addManifestPathsToPropertiesOP(appSchema, 'ObjectPage', appSchema, pathParams);
    // Add manifestPath to table
    addManifestPathsToPropertiesOP(appSchema, undefined, appSchema.properties.header, pathParams);
    // Add "manifestPath" to custom sections
    const sections = appSchema.definitions[ux_specification_types_1.DefinitionName.Sections]['properties'] ?? {};
    for (const sectionDefinitionKey in sections) {
        if (sectionDefinitionKey === 'custom') {
            const sectionDefinition = sections[sectionDefinitionKey];
            const anyOfDefinitions = sectionDefinition.items['anyOf'];
            anyOfDefinitions.forEach((anyOfDefinition) => {
                const manifestPathForSections = (0, common_1.convertSyncRulePathToJsonPath)((0, application_1.getViewExtensionsPath)());
                anyOfDefinition['manifestPath'] = (0, common_1.appendJsonPathSegment)(manifestPathForSections, `||`);
                sectionDefinition['manifestPath'] = manifestPathForSections;
                const definitionKey = anyOfDefinition.$ref ? (0, common_1.getDefinitionKey)(anyOfDefinition.$ref) : undefined;
                addManifestPathsToPropertiesOP(appSchema, definitionKey, // we need to pass definitionName to specifically resolve className and sync rules
                anyOfDefinition, { pageName: [''], sectionId: '' }, // we can't use undefined because these params are expected to be defined in sync rule resolution (check 'getObjectPageCustomSectionPath')
                {
                    name: ux_specification_types_1.v2.SAPUI5_VIEW_EXTENSION_OBJECT_PAGE,
                    relativeManifestPath: ux_specification_types_1.v2.SAPUI5_VIEW_EXTENSION_OBJECT_PAGE,
                    absoluteManifestPath: manifestPathForSections
                }, true);
                // remove manifestPath from anyOf definition because it was only required in resolving specific property paths (e.g. title)
                delete anyOfDefinition['manifestPath'];
            });
        }
    }
}
/**
 * Enhances the Object Page schema with manifest paths for definition and properties.
 *
 * This function extends the app schema (`appSchema`) by adding manifestPath to definition and properties on the Object Page.
 *
 * @param {Definition} appSchema - The application schema object representing the Object Page structure.
 * @param {string} pageKeys Array path to target page (e.g., ['parentPage', 'currentPage'])
 * @param {string} definitionName - Identifier of the corresponding definition.
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters.
 * @param {string} facetKey - Identifier of the section (facet key).
 */
function addManifestPathsToDefinitionPropertiesOP(appSchema, pageKeys, definitionName, generateParameters, facetKey) {
    const matchingDefinition = appSchema.definitions[definitionName];
    const properties = matchingDefinition?.properties ?? {};
    for (const key in properties) {
        const pathParams = {
            pageName: pageKeys,
            manifest: generateParameters.manifest,
            sectionId: facetKey,
            columnKey: undefined,
            originalIds: undefined
        };
        const property = matchingDefinition.properties[key];
        addManifestPathsToPropertiesOP(appSchema, undefined, property, pathParams, undefined, true);
    }
}
/**
 * Generates an app specific schema out of the generic schema.
 *
 * @param generateParameters - list of API input parameters
 * @param genericSchema - generic JSON schema of an object page
 * @returns the app specific JSON schema
 */
function generateObjectPageSchemaV2(generateParameters, genericSchema) {
    // Initialize i18next
    (0, i18n_1.initI18n)();
    const appSchema = JSON.parse(JSON.stringify(genericSchema));
    // Custom sections as part of sections
    const additionalSections = {};
    for (const name in appSchema.definitions['CustomSections']['properties']) {
        additionalSections[name] = appSchema.definitions['CustomSections'].properties[name];
    }
    // Change reference to generated sections
    appSchema.properties[ux_specification_types_1.PropertyName.sections] = {
        $ref: common_1.DEFINITION_LINK_PREFIX + 'Sections'
    };
    const entityType = generateParameters.entitySet?.entityType;
    const entitySetName = generateParameters.entitySet?.name;
    // Ensure that only those flex changes are used that refer to the current OP
    generateParameters.flex =
        generateParameters.entitySet && generateParameters.flex
            ? (0, import_1.filterFlexChanges)(generateParameters.flex, v2_1.SAPUI5_VIEW_EXTENSION_OBJECT_PAGE, generateParameters.entitySet.name)
            : [];
    generateParameters.entityType = entityType;
    const pages = generateParameters.manifest[ux_specification_types_1.ManifestSection.generic].pages;
    if (!pages) {
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOPAGES', { appId: generateParameters.manifest['sap.app']['id'] }),
            location: {
                path: ux_specification_types_1.MANIFESTPATH,
                range: [ux_specification_types_1.ManifestSection.generic]
            }
        });
        return appSchema;
    }
    // Calculate page keys -> full path to current page (e.g., ['parentPage', 'currentPage'])
    const pageKeys = [];
    (0, import_1.findObjectPageV2)(generateParameters.manifest?.[ux_specification_types_1.ManifestSection.generic]?.pages, entitySetName, pageKeys);
    // Add header
    addHeader(appSchema, generateParameters, entityType);
    // Add sections
    appSchema.definitions[ux_specification_types_1.DefinitionName.Sections] = {
        type: 'object',
        properties: {},
        description: 'Sections',
        additionalProperties: false
    };
    addSections(pageKeys, generateParameters, appSchema, pages);
    // Custom section facets
    addRelatedFacetKeysType(appSchema, entityType, generateParameters.serviceAVT, generateParameters.logger);
    if (!appSchema.definitions.Sections) {
        if (appSchema.definitions.RelatedFacetKeys && appSchema.definitions.RelatedFacetKeys['oneOf'].length) {
            // If related facets exists - then we need sections definition
            appSchema.definitions.Sections = {
                type: 'object',
                properties: additionalSections,
                additionalProperties: false
            };
            appSchema.definitions.Sections[ux_specification_types_1.SchemaTag.isViewNode] = true;
        }
        else {
            delete appSchema.properties[ux_specification_types_1.PropertyName.sections];
        }
    }
    (0, common_1.addFooterActions)(appSchema, generateParameters, ux_specification_types_1.FioriElementsVersion.v2, addFooterActionCallBackV2, pages);
    // Add manifestPath to table
    addManifestPathsToStaticNodes(appSchema, {
        manifest: generateParameters.manifest,
        pageName: pageKeys
    });
    // Eliminate generic definitions
    delete appSchema.definitions['GenericSections'];
    delete appSchema.definitions['GenericSubSections'];
    delete appSchema.definitions['ObjectPageSectionTableV2'];
    delete appSchema.definitions['GenericColumns'];
    delete appSchema.definitions['TableColumnAction'];
    delete appSchema.definitions['CommonHeaderFacetSettings'];
    delete appSchema.definitions['ObjectPageHeaderSection'];
    // Currently not used
    delete appSchema.definitions['ObjectPageCustomHeaderSectionFragment'];
    delete appSchema.definitions['ObjectPageSectionFormV2'];
    delete appSchema.definitions['ObjectPageSectionTableV2'];
    delete appSchema.definitions['ObjectPageSubSectionV2'];
    delete appSchema.definitions['ObjectPageResponsiveTableWithMultiSelect'];
    delete appSchema.definitions['ObjectPageResponsiveTableWithInlineDelete'];
    delete appSchema.definitions['ObjectPageAnalyticalTable'];
    delete appSchema.definitions['ObjectPageTreeTable'];
    delete appSchema.definitions['ObjectPageGridTable'];
    delete appSchema.definitions['ObjectPageToolBar'];
    delete appSchema.definitions['ObjectPageToolBarActions'];
    delete appSchema.definitions['ObjectPageForm'];
    delete appSchema.definitions['ObjectPageFormFields'];
    delete appSchema.definitions['ObjectPageFormActions'];
    delete appSchema.definitions['FieldPathOP'];
    (0, common_1.updatePropertyIndices)(appSchema, ROOT_PROPERTIES_ORDER);
    return appSchema;
}
//# sourceMappingURL=objectPage.js.map