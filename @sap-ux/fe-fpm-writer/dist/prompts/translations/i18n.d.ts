declare const ns1: {
    prompts: {
        super: {
            buildingBlockType: {
                message: string;
                choices: {
                    chart: string;
                    filterBar: string;
                    table: string;
                };
            };
            manifestGroup: {
                manifestLibrariesTitle: string;
                manifestLibrariesDescription: string[];
            };
        };
        common: {
            id: {
                existingIdValidation: string;
                defaultPlaceholder: string;
            };
            service: {
                defaultPlaceholder: string;
            };
            entity: {
                defaultPlaceholder: string;
            };
            aggregationPath: {
                defaultPlaceholder: string;
            };
            filterBar: {
                defaultPlaceholder: string;
            };
            viewOrFragmentPath: {
                defaultPlaceholder: string;
            };
            bindingContextType: {
                option: {
                    relative: string;
                    absolute: string;
                };
            };
            validation: {
                errorMessage: {
                    input: string;
                    select: string;
                };
            };
            targetProperty: {
                defaultPlaceholder: string;
            };
        };
        chart: {
            chartBuildingBlockPropertiesTitle: string;
            chartBuildingBlockPropertiesDescription: string[];
            chartVisualizationPropertiesTitle: string;
            chartVisualizationPropertiesDescription: string[];
            chartConfigureEventsTitle: string;
            chartConfigureEventsDescription: string[];
            id: {
                message: string;
                validation: string;
            };
            aggregation: string;
            entity: string;
            service: string;
            viewOrFragmentPath: {
                message: string;
                validation: string;
            };
            contextPath: string;
            metaPath: string;
            filterBar: {
                message: string;
                validation: string;
                placeholder: string;
                inputPlaceholder: string;
            };
            bindingContextType: string;
            personalization: {
                message: string;
                choices: {
                    type: string;
                    item: string;
                    sort: string;
                };
                placeholder: string;
            };
            selectionMode: {
                message: string;
                choices: {
                    single: string;
                    multiple: string;
                };
            };
            selectionChange: string;
            selectionChangePlaceholder: string;
            qualifier: string;
            qualifierPlaceholder: string;
            valuesDependentOnEntityTypeInfo: string;
        };
        filterBar: {
            filterBarBuildingBlockPropertiesTitle: string;
            filterBarBuildingBlockPropertiesDescription: string[];
            filterBarConfigureEventsTitle: string;
            filterBarConfigureEventsDescription: string[];
            id: {
                message: string;
                validation: string;
            };
            viewOrFragmentPath: {
                message: string;
                validation: string;
            };
            entity: string;
            service: string;
            metaPath: string;
            filterChanged: string;
            filterChangedPlaceholder: string;
            search: string;
            searchPlaceholder: string;
            qualifier: string;
            qualifierPlaceholder: string;
            aggregation: string;
            valuesDependentOnEntityTypeInfo: string;
            bindingContextType: string;
        };
        form: {
            aggregation: string;
            bindingContextType: string;
            entity: string;
            formBuildingBlockPropertiesTitle: string;
            formBuildingBlockPropertiesDescription: string[];
            formVisualizationPropertiesTitle: string;
            formVisualizationPropertiesDescription: string[];
            id: {
                message: string;
                validation: string;
            };
            qualifier: string;
            qualifierPlaceholder: string;
            viewOrFragmentPath: {
                message: string;
                validate: string;
            };
            service: string;
            title: {
                message: string;
                validation: string;
                translationAnnotation: string;
            };
            valuesDependentOnEntityTypeInfo: string;
        };
        table: {
            tableBuildingBlockPropertiesTitle: string;
            tableBuildingBlockPropertiesDescription: string[];
            tableVisualizationPropertiesTitle: string;
            tableVisualizationPropertiesDescription: string[];
            viewOrFragmentPath: {
                message: string;
                validation: string;
            };
            id: {
                message: string;
                validation: string;
            };
            bindingContextType: string;
            entity: string;
            service: string;
            qualifier: string;
            qualifierPlaceholder: string;
            aggregation: string;
            filterBar: {
                message: string;
                validation: string;
                placeholder: string;
                inputPlaceholder: string;
            };
            tableType: {
                message: string;
            };
            selectionMode: {
                message: string;
                choices: {
                    multiple: string;
                    single: string;
                    auto: string;
                    none: string;
                };
            };
            headerVisible: string;
            header: {
                message: string;
                validation: string;
                translationAnnotation: string;
            };
            personalization: {
                message: string;
                choices: {
                    Sort: string;
                    Column: string;
                    Filter: string;
                };
            };
            tableVariantManagement: string;
            readOnlyMode: string;
            autoColumnWidth: string;
            dataExport: string;
            fullScreenMode: string;
            pasteFromClipboard: string;
            tableSearchableToggle: string;
            valuesDependentOnEntityTypeInfo: string;
        };
        richTextEditor: {
            id: {
                message: string;
                validation: string;
            };
            viewOrFragmentPath: {
                message: string;
                validation: string;
            };
            bindingContextType: string;
            relativeBindingDisabledTooltip: string;
            valueSource: string;
            entitySet: string;
            targetProperty: string;
            aggregation: string;
        };
        richTextEditorButtonGroups: {
            message: string;
            choices: {
                'font-style': string;
                font: string;
                clipboard: string;
                structure: string;
                undo: string;
                insert: string;
                link: string;
                'text-align': string;
                table: string;
                styleselect: string;
            };
            viewOrFragmentPath: {
                message: string;
                validation: string;
            };
            aggregation: string;
            replaceDefaultButtonGroupsHint: string;
        };
        page: {
            id: {
                message: string;
                validation: string;
            };
            viewOrFragmentPath: {
                message: string;
                validation: string;
            };
            aggregation: string;
            title: {
                message: string;
                validation: string;
                translationAnnotation: string;
            };
            description: {
                message: string;
                validation: string;
                translationAnnotation: string;
            };
        };
    };
    pageBuildingBlock: {
        minUi5VersionRequirement: string;
    };
    richTextEditorBuildingBlock: {
        minUi5VersionRequirement: string;
    };
};
export default ns1;
//# sourceMappingURL=i18n.d.ts.map