"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortingApproach = exports.SortReferencePosition = void 0;
var SortReferencePosition;
(function (SortReferencePosition) {
    SortReferencePosition["After"] = "After";
    SortReferencePosition["Before"] = "Before";
    SortReferencePosition["Replace"] = "Replace";
})(SortReferencePosition || (exports.SortReferencePosition = SortReferencePosition = {}));
// In V2 we can not reffer custom extenstion to another custom extension
// In result we have two sorting approaches
var SortingApproach;
(function (SortingApproach) {
    SortingApproach["Normal"] = "Normal";
    SortingApproach["WithIds"] = "WithIds";
    SortingApproach["WithIndices"] = "WithIndices";
})(SortingApproach || (exports.SortingApproach = SortingApproach = {}));
//# sourceMappingURL=sort.js.map