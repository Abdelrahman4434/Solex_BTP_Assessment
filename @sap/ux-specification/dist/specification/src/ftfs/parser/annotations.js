"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTooComplex = isTooComplex;
/**
 * Type guard to check whether a given value is of type `TooComplexData`.
 *
 * @param value The value to check.
 * @returns true if the value is a TooComplexData object.
 */
function isTooComplex(value) {
    return value?.tooComplex === true;
}
//# sourceMappingURL=annotations.js.map