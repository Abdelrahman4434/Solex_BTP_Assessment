"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACTORY_FOR_LIST_REPORT_NEW = void 0;
exports.setStaticMetadataInstanceInterface = setStaticMetadataInstanceInterface;
exports.convertInterfaces = convertInterfaces;
exports.toJsonSchema = toJsonSchema;
const path_1 = require("path");
const fs = __importStar(require("fs"));
const typescript_json_schema_1 = require("typescript-json-schema");
const utils_1 = require("../../src/sync/v2/generate/utils");
const factory_1 = require("../../src/sync/v2/export/factory");
const factory_2 = require("../../src/sync/v4/export/factory");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const ListReportNew_1 = require("../../src/sync/v2/genericSchemaHandling/pages/ListReportNew");
const v2Controls = __importStar(require("../../src/sync/v2/genericSchemaHandling/controls"));
const decoration_1 = require("../../src/sync/common/decoration");
const utils_2 = require("../../src/sync/common/utils");
const application_1 = require("../../src/sync/v4/application");
const application_2 = require("../../src/sync/v2/application");
//TS compiler options, compare with tsconfig
const compilerOptions = {
    skipLibCheck: true,
    types: ['node', '@sapui5/types', 'jest'],
    esModuleInterop: true,
    resolveJsonModule: true,
    downlevelIteration: true
};
const generatorSettings = {
    noExtraProps: true, // Disable additional properties in objects by default.
    required: true, // Create required array for non-optional properties.
    validationKeywords: [
        'i18nClassification',
        'isViewNode',
        'displayName',
        'defaultControlProperty',
        'controlProperty',
        'hidden',
        'minimum',
        'artifactType',
        'descriptionSrcURL',
        'actionType',
        'internal'
    ]
};
let staticFactory;
/**
 * This function is used by unit tests. It allows to inject a MetadataInstanceInterface which will be used by function convertInterfaces.
 *
 * @param factory - the instance of MetadataInstanceInterface that overrules the instance that would normally be used by convertInterfaces.
 * Use value undefined to reset the injection.
 */
function setStaticMetadataInstanceInterface(factory) {
    staticFactory = factory;
}
/**
 * Convert interfaces to json schema.
 *
 * @param path - Path to interfaces.
 * @param files - File names, filename must match the main symbol (interface) in the content of the file.
 * @param version - The version of the schema to generate.
 * @returns Array of generated JSON schemas.
 */
function convertInterfaces(path, files, version) {
    const schemas = [];
    files.forEach((file) => {
        const program = (0, typescript_json_schema_1.getProgramFromFiles)([(0, path_1.join)(path, file)], compilerOptions, path);
        const currentType = file.replace('.ts', '');
        const generator = (0, typescript_json_schema_1.buildGenerator)(program, generatorSettings);
        if (generator) {
            const filename = file.replace('.ts', '.json');
            schemas[filename] = generator.getSchemaForSymbol(currentType);
            if (file.search('Config') > -1) {
                //it is a page template ==> enhance schema by further information from reflect-metadata
                let pageType;
                let factory;
                if (version === ux_specification_types_1.FioriElementsVersion.v2) {
                    factory = staticFactory ?? new factory_1.MetadataInstanceFactoryV2();
                    pageType = file.split('Config')[0];
                }
                else {
                    factory = staticFactory ?? new factory_2.MetadataInstanceFactoryV4();
                    pageType = file.split('Config')[0];
                }
                const page = factory.createPageInstance(pageType, {});
                (0, utils_1.processMetadata)(schemas[filename], schemas[filename], page, pageType, factory, []);
            }
        }
    });
    return schemas;
}
/**
 * Writes the generated schemas to files.
 *
 * @param path - The base path to write the schemas to.
 * @param schemas - The schemas to write.
 * @param version - The version of the schemas.
 * @param eliminateVersion - Whether to remove version from filenames.
 */
function writeSchemasToFile(path, schemas, version, eliminateVersion = false) {
    const dirToWrite = (0, path_1.join)(path, version);
    if (!fs.existsSync(dirToWrite)) {
        fs.mkdirSync(dirToWrite);
    }
    for (const name in schemas) {
        const fileName = eliminateVersion ? name.replace('V2', '').replace('V4', '') : name;
        const file = (0, path_1.join)(dirToWrite, fileName);
        fs.writeFile(file, JSON.stringify(schemas[name], null, 2), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("File: '" + file + "' saved.");
        });
    }
}
/**
 * Converts pages for a specific Fiori Elements version.
 *
 * @param paths - Array of paths to process.
 * @param version - The Fiori Elements version to process.
 * @param outputPath - The path to write the output to.
 * @param factory - If provided this metadata factory will be used for the schema generation instead of the default one.
 */
function convertPagesOfFEVersion(paths, version, outputPath, factory) {
    let fileNames = [];
    for (let index = 0; index < paths.length; index++) {
        fs.readdir(paths[index], function (err, files) {
            if (err) {
                return console.error(err);
            }
            files.forEach(function (pathName) {
                const fileName = (0, path_1.basename)(pathName);
                if (fileName !== 'index.ts') {
                    if (!paths[index]) {
                        paths[index] = pathName.replace(fileName, '');
                    }
                    fileNames.push(fileName);
                }
            });
            const currentStaticFactory = staticFactory;
            staticFactory = factory;
            const schemas = convertInterfaces(paths[index], fileNames, version);
            staticFactory = currentStaticFactory;
            fileNames = [];
            writeSchemasToFile(outputPath, schemas, version, true);
        });
    }
}
/**
 * Gets the position of a substring in a string at a specific occurrence.
 *
 * @param string - The string to search in.
 * @param subString - The substring to search for.
 * @param index - The occurrence index to find.
 * @returns The position of the substring at the specified occurrence.
 */
function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}
/**
 * Performs post-processing on the provided array of schemas for V2 and V4 applications.
 *
 * @param schemas - An array of `Schema` objects to be post-processed.
 */
function postProcessingApps(schemas) {
    postProcessingV4App(schemas);
    // Add manifest paths to V4 and V2
    addManifestPathsToApplication(schemas['ApplicationV4.json'], application_1.AppSettings.prototype);
    addManifestPathsToApplication(schemas['ApplicationV2.json'], application_2.AppSettings.prototype);
}
/**
 * Performs post-processing on the provided array of schemas for V4 applications.
 *
 * @param schemas - An array of `Schema` objects to be post-processed.
 */
function postProcessingV4App(schemas) {
    // Remove the values that were required to generate the 'defaultCreationMode' dropdown in the UI5 application, but are no longer needed in the schema.
    const schema = schemas['ApplicationV4.json'];
    schema.definitions.AppSettings.properties['defaultCreationMode'].enum = schema.definitions.AppSettings.properties['defaultCreationMode'].enum.filter((option) => !!option);
}
/**
 * Adds `manifestPath` to the `AppSettings` properties inside a JSON schema.
 *
 * @param {JSONSchema4} schema - The JSON schema object to be updated.
 * @param {object} classPrototype - The prototype object whose metadata is used to determine manifest path information for each property.
 */
function addManifestPathsToApplication(schema, classPrototype) {
    // Update schema with manifest path for properties in settings
    for (const property in schema.definitions.AppSettings.properties) {
        const propertySchema = schema.definitions.AppSettings.properties[property];
        const rule = (0, decoration_1.getReflectMetadata)(classPrototype, property);
        if (!rule?.manifest?.path) {
            return;
        }
        const exportPropertyKey = rule?.manifest?.key ?? property;
        const manifestPath = `${rule.manifest.path()}/${exportPropertyKey}`;
        propertySchema.manifestPath = (0, utils_2.convertSyncRulePathToJsonPath)(manifestPath);
        // Continue parsing of inner properties
        // Handle anyOf with inner properties
        if (propertySchema.anyOf) {
            for (const innerSchema of propertySchema.anyOf) {
                if (!innerSchema.properties) {
                    continue;
                }
                for (const property in innerSchema.properties) {
                    innerSchema.properties[property].manifestPath = (0, utils_2.appendJsonPathSegment)(propertySchema.manifestPath, property);
                }
            }
        }
        // Handle $ref with inner properties
        if (propertySchema.manifestPath && propertySchema.$ref) {
            const innerDefinitions = (0, utils_2.getDefinitionKey)(propertySchema.$ref);
            const innerProperties = schema.definitions[innerDefinitions]?.properties ?? {};
            for (const innerProperty in innerProperties) {
                innerProperties[innerProperty].manifestPath = (0, utils_2.appendJsonPathSegment)(propertySchema.manifestPath, innerProperty);
            }
        }
    }
}
/**
 * Factory giving access to the metadata of the new v2 ListReport page.
 */
exports.FACTORY_FOR_LIST_REPORT_NEW = {
    createInstance(pageType, schemaPropertyName) {
        const metadataClass = v2Controls[schemaPropertyName];
        // Naming convention: Types that are only introduced as host for enums have a name ending with 'Enum'.
        // They cannot be instantiated.
        // In addition to that some enums (ButtonType,...) are imported from sapui5.
        if (schemaPropertyName.endsWith('Enum') ||
            ['ButtonType', 'smarttable.ExportType'].includes(schemaPropertyName)) {
            return metadataClass;
        }
        let instance;
        try {
            instance = new metadataClass();
        }
        catch (error) {
            console.error(`Error creating instance of ${schemaPropertyName}`);
            throw error;
        }
        return instance;
    },
    createPageInstance(pageType) {
        return new ListReportNew_1.ListReportNew();
    }
}; // factory that gives access to the metadata of the ListReportNew page
/**
 * Converts all application and page definitions to JSON schema.
 *
 * @param outputPath - The path to write the generated schemas to.
 */
function toJsonSchema(outputPath) {
    const rootName = __dirname.slice(0, getPosition(__dirname, 'specification', 2));
    const typesPath = (0, path_1.join)(rootName, 'types', 'src');
    //Pages V2
    let paths = [];
    paths.push((0, path_1.join)(typesPath, 'v2', 'pages'));
    convertPagesOfFEVersion(paths, ux_specification_types_1.FioriElementsVersion.v2, outputPath);
    // Temporarily we also create the ListReportNew schema so that it can be used for manual testing after switching the value of
    // constant useGenericSchemaHandling in packages/specification/src/sync/v2/genericSchemaHandling/pages/pageAccess.ts from false to true.
    paths = [];
    paths.push((0, path_1.join)(typesPath, 'v2', 'genericSchemaHandling', 'pages'));
    convertPagesOfFEVersion(paths, ux_specification_types_1.FioriElementsVersion.v2, outputPath, exports.FACTORY_FOR_LIST_REPORT_NEW);
    // End of temporary injection
    //Pages V4
    paths = [];
    paths.push((0, path_1.join)(typesPath, 'v4', 'pages'));
    convertPagesOfFEVersion(paths, ux_specification_types_1.FioriElementsVersion.v4, outputPath);
    //App V2
    const v2AppSchemas = convertInterfaces((0, path_1.join)(typesPath, 'v2'), ['ApplicationV2.ts'], ux_specification_types_1.FioriElementsVersion.v2);
    //App V4
    const v4AppSchemas = convertInterfaces((0, path_1.join)(typesPath, 'v4'), ['ApplicationV4.ts'], ux_specification_types_1.FioriElementsVersion.v4);
    //App postprocessing of schema
    postProcessingApps({ ...v2AppSchemas, ...v4AppSchemas });
    //Write App schemas
    writeSchemasToFile(outputPath, v2AppSchemas, 'v2');
    writeSchemasToFile(outputPath, v4AppSchemas, 'v4');
}
//# sourceMappingURL=to-json-schema.js.map