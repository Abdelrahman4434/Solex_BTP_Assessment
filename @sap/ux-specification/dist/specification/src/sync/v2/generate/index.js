"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnalyticalListReportSchemaV2 = exports.generateListReportSchemaV2 = exports.generateObjectPageSchemaV2 = exports.generateOVPInterfaceV2 = exports.generateObjectPageInterfaceV2 = exports.generateListReportInterfaceV2 = exports.generateAnalyticalListPageInterfaceV2 = void 0;
var generate_1 = require("./generate");
Object.defineProperty(exports, "generateAnalyticalListPageInterfaceV2", { enumerable: true, get: function () { return generate_1.generateAnalyticalListPageInterfaceV2; } });
Object.defineProperty(exports, "generateListReportInterfaceV2", { enumerable: true, get: function () { return generate_1.generateListReportInterfaceV2; } });
Object.defineProperty(exports, "generateObjectPageInterfaceV2", { enumerable: true, get: function () { return generate_1.generateObjectPageInterfaceV2; } });
Object.defineProperty(exports, "generateOVPInterfaceV2", { enumerable: true, get: function () { return generate_1.generateOVPInterfaceV2; } });
var objectPage_1 = require("./objectPage");
Object.defineProperty(exports, "generateObjectPageSchemaV2", { enumerable: true, get: function () { return objectPage_1.generateObjectPageSchemaV2; } });
// Normally generateListReportSchemaV2 will be routed by pageAccess to the sibling file listReport.ts of this file.
// For manual tests this can be changed by switching useGenericSchemaHandling in pageAccess.ts to true.
// In this case generic schema handling and the schema for ListReportNew will be used.
var pageAccess_1 = require("../genericSchemaHandling/pages/pageAccess");
Object.defineProperty(exports, "generateListReportSchemaV2", { enumerable: true, get: function () { return pageAccess_1.generateListReportSchemaV2; } });
var analyticalListReport_1 = require("./analyticalListReport");
Object.defineProperty(exports, "generateAnalyticalListReportSchemaV2", { enumerable: true, get: function () { return analyticalListReport_1.generateAnalyticalListReportSchemaV2; } });
//# sourceMappingURL=index.js.map