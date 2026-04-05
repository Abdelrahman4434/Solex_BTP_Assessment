"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
exports.transformRoutingV4 = transformRoutingV4;
const ux_specification_types_1 = require("@sap/ux-specification-types");
var Constants;
(function (Constants) {
    Constants["OptionalQuery"] = ":?query:";
    Constants["Component"] = "sap/fe/AppComponent";
    Constants["Namespace"] = "sap.fe.templates";
})(Constants || (exports.Constants = Constants = {}));
/**
 * Transform Pages(from app.json) to UI5 routing configuration(manifest.json).
 *
 * @param pattern - The route pattern string
 * @param name - The name of the route
 * @param target - The target of the route
 * @returns SapUi5RoutingRoute
 */
const createRoute = (pattern, name, target) => {
    return {
        pattern,
        name,
        target
    };
};
/**
 * Method returns SapUi5RoutingTargetBase.options object.
 *
 * @param {object} [property] - Entity set or any other property in object form {'entitySet': 'value'}.
 * @param {string} [variantManagement] - Variant management string.
 * @returns {{settings: SapUi5RoutingTargetSettings}} Returns object for SapUi5RoutingTargetBase.options.
 */
const createTargetOption = (property, variantManagement) => {
    return {
        settings: {
            ...property,
            ...(variantManagement && { variantManagement }),
            navigation: {}
        }
    };
};
/**
 * Initializes the routing configuration in the manifest.
 *
 * @param manifestRouting - The existing routing configuration from the manifest.
 * @returns The initialized routing configuration.
 */
function initializeRouting(manifestRouting) {
    let routing = manifestRouting;
    if (!routing) {
        routing = {
            routes: [],
            targets: {}
        };
    }
    else {
        if (!routing.routes) {
            routing.routes = [];
        }
        if (!routing.targets) {
            routing.targets = {};
        }
    }
    return routing;
}
/**
 * Sets the navigation entry in the target options.
 *
 * @param target - The routing target options to be updated
 * @param keyInManifest - The key in the manifest representing the navigation entry
 * @param navigationEntry - The navigation entry object containing route details
 */
function setTargetOptions(target, keyInManifest, navigationEntry) {
    if (!target.options.settings.navigation) {
        target.options.settings.navigation = {};
    }
    target.options.settings.navigation[keyInManifest] = {
        detail: navigationEntry
    };
}
/**
 * Calculates the query pattern for a new page's route at the manifest.
 * If the route pattern components of a parent page (parentKeys) are known, the key names are taken over from the parent.
 * Otherwise, the calculation starts from scratch, following the pattern 'key' + navigation level index.
 *
 * @param parts - array of strings, each entry represents one navigation
 * @param targetPage - the new page that is being navigated to
 * @param parentKeys - object comprising key = entity and value = key name for each part of the parent page's route pattern
 * @returns the query pattern for the new page
 */
function calculateQueryPattern(parts, targetPage, parentKeys) {
    let pattern = '';
    parts.forEach((part, index) => {
        let key = '';
        if (targetPage && targetPage.pageType !== ux_specification_types_1.PageTypeV4.ListReport) {
            // consider existing keys of parent pages
            if (parentKeys[part]) {
                key = `({${parentKeys[part]}})`;
            }
            else {
                // keys should be like - 'key', 'key2', 'key3'
                key = `({key${index ? index + 1 : ''}})`;
            }
        }
        pattern += `${pattern ? '/' : ''}${part}${key}`;
    });
    return `${pattern}${Constants.OptionalQuery}`;
}
/**
 * Recursive function to determine all parts to combine the query pattern, by traversing the routing navigation links.
 *
 * @param parts - list of query parts, to be enhanced per call
 * @param navKey - the key of the given routing navigation entry
 * @param pages - list of all pages
 * @param pageId - key of the current page
 * @param contextPath - contextPath of the page
 */
function fillNavigationParts(parts, navKey, pages, pageId, contextPath) {
    if (contextPath) {
        parts.push(...contextPath.split('/'));
        parts.shift();
        return;
    }
    parts.unshift(navKey);
    let referringPage;
    for (const key in pages) {
        if (typeof pages[key].navigation === 'object') {
            const pageKey = Object.keys(pages[key].navigation).find((index) => pages[key].navigation[index]['route'] === pageId);
            if (pageKey) {
                navKey = pageKey;
                referringPage = pages[key];
            }
        }
        if (referringPage) {
            fillNavigationParts(parts, navKey, pages, key);
            return;
        }
    }
}
/**
 * Determines the key names of a parent routing pattern.
 *
 * @param parentPattern - parent routing pattern
 * @returns an object with entries having key = entity and value = the key name in the pattern
 */
function fillParentKeys(parentPattern) {
    const result = {};
    const patternParts = parentPattern?.split('/');
    if (patternParts && patternParts.length > 0) {
        patternParts.forEach((part) => {
            const entity = part.substring(0, part.indexOf('({'));
            const keyName = part.substring(part.indexOf('({') + 2, part.indexOf('})'));
            result[entity] = keyName;
        });
    }
    return result;
}
/**
 * Updates the route navigation entries of a page.
 *
 * @param page - the current page
 * @param pages - all pages in manifest
 * @param target - the given routing target
 * @param routing - the current routing
 * @param pageId - key of the page in manifest
 */
function handlePageNavigation(page, pages, target, routing, pageId) {
    for (const keyInManifest in page.navigation) {
        const navigationEntry = page.navigation[keyInManifest];
        const navPage = pages[navigationEntry['route']];
        setTargetOptions(target, keyInManifest, navigationEntry);
        if (navigationEntry?.['route'] &&
            !routing.routes.some((routingRoute) => routingRoute.name === navigationEntry['route'])) {
            // Use pattern from page definition
            let pattern = navPage?.routePattern;
            if (!pattern) {
                // Calculate pattern string if 'routePattern' is not in app.json
                const parts = [];
                fillNavigationParts(parts, keyInManifest, pages, pageId, navPage?.contextPath);
                const parentKeys = fillParentKeys(page.routePattern);
                pattern = calculateQueryPattern(parts, navPage, parentKeys);
            }
            // Make sure there no route duplication
            routing.routes.push(createRoute(pattern, navigationEntry['route'], navigationEntry['route']));
        }
    }
}
/**
 * Deletes obsolete pages from manifest.
 *
 * @param {v4.SapUi5RoutingV4} routing - the routing section in manifest
 * @param pages - given pages' definition in the config
 */
function removeDeletedPages(routing, pages) {
    for (const id in routing.targets) {
        if (!pages || !pages[id]) {
            // Remove target
            delete routing.targets[id];
            // Remove routes
            const index = routing.routes.findIndex((route) => route.name === id);
            if (index !== -1) {
                routing.routes.splice(index, 1);
            }
        }
    }
}
/**
 * Exports contextPath to manifest if defined, else the entitySet.
 *
 * @param {v4.Page} page - the given page definition in config
 * @param {v4.RoutingTargetOptions} target - the corresponding routing target section in manifest
 */
function transferEntitySetandContextPath(page, target) {
    if (page.contextPath) {
        if (!target.options) {
            target.options = createTargetOption({ contextPath: page.contextPath }, page.variantManagement);
        }
        target.options.settings.contextPath = page.contextPath;
    }
    else {
        delete target.options?.settings?.contextPath;
    }
    if (page.entitySet) {
        if (!target.options) {
            target.options = createTargetOption({ entitySet: page.entitySet }, page.variantManagement);
        }
        if (!page.contextPath || target.options.settings.entitySet) {
            target.options.settings.entitySet = page.entitySet;
        }
    }
    else {
        delete target.options?.settings?.entitySet;
    }
}
/**
 * Updates the layout of a routing route in manifest, based on config definition.
 *
 * @param {v4.SapUi5RoutingV4} routing - the routing section in manifest
 * @param {string} id - name of the routing route
 * @param {v4.Page} page - the given page definition in config
 */
function updateRouteLayout(routing, id, page) {
    const route = routing.routes.find((routingRoute) => routingRoute.target && routingRoute.target.indexOf(id) > -1);
    if (route) {
        if (page.defaultLayoutType) {
            route.layout = page.defaultLayoutType;
        }
        else {
            delete route.layout;
        }
    }
}
/**
 * Fills target with page information.
 *
 * @param page current page
 * @param target routing target to be filled
 * @param id page id
 * @returns filled target
 */
function fillTarget(page, target, id) {
    if (page.pageType && ![ux_specification_types_1.PageTypeV4.CustomPage, ux_specification_types_1.PageTypeV4.FPMCustomPage].includes(page.pageType)) {
        target = {
            ...target,
            ...{
                type: 'Component',
                id: target?.['id'] || id,
                name: page.template ?? `${Constants.Namespace}.${page.pageType}`
            }
        };
    }
    else if (page.view &&
        !!target &&
        (target.viewName ||
            target.viewId)) {
        // Existing old syntax for Custom Page
        target = {
            ...target,
            ...{
                viewId: page.view.id,
                viewName: page.view.name,
                path: page.view.path,
                viewType: page.view.viewType
            }
        };
    }
    else if (page.view && (page.pageType !== ux_specification_types_1.PageTypeV4.CustomPage || !target || page.view.template)) {
        target = {
            ...target,
            ...{
                type: 'Component',
                id: page.view.id,
                name: page.view.template || ux_specification_types_1.v4.FE_TEMPLATE_V4_CUSTOM_PAGE,
                viewType: page.view.viewType,
                options: {
                    ...target?.options,
                    settings: {
                        ...target?.options?.settings,
                        viewName: page.view.name
                    }
                }
            }
        };
    }
    return target;
}
/**
 * Transform Pages(from app.json) to UI5 routing configuration (manifest.json).
 *
 * @param homePage - The ID of the home page
 * @param pages - The pages configuration from app.json
 * @param manifest - The manifest.json object
 * @returns UI5 routing configuration
 */
function transformRoutingV4(homePage, pages, manifest) {
    const routing = initializeRouting(manifest[ux_specification_types_1.ManifestSection.ui5].routing);
    // add default route
    if (homePage && !routing.routes.some((route) => route.target && route.target.indexOf(homePage) > -1)) {
        // Make sure there no route duplication
        routing.routes.push(createRoute(Constants.OptionalQuery, homePage, homePage));
    }
    for (const id in pages) {
        let target;
        const page = pages[id];
        if (routing.targets[id]) {
            target = routing.targets[id];
        }
        target = fillTarget(page, target, id);
        transferEntitySetandContextPath(page, target);
        if (target && !page.controlAggregation && target.controlAggregation !== undefined) {
            delete target.contextPattern;
            delete target.controlAggregation;
        }
        if (target?.options?.settings?.navigation) {
            // We handle page 'navigation' from scratch - clear 'navigation' before handling
            target.options.settings.navigation = {};
        }
        // Handle page 'navigation'
        handlePageNavigation(page, pages, target, routing, id);
        // Update associated route with layout information
        updateRouteLayout(routing, id, page);
        routing.targets[id] = target;
    }
    // Remove deleted pages
    removeDeletedPages(routing, pages);
    return routing;
}
//# sourceMappingURL=manifest.js.map