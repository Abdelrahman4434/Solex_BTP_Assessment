"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedFieldsAggregation = void 0;
const FieldAggregation_1 = require("./FieldAggregation");
/**
 * Represents an aggregation for connected fields objects.
 */
class ConnectedFieldsAggregation extends FieldAggregation_1.FieldAggregation {
    constructor() {
        super(...arguments);
        this.sortableList = true;
        this.childClass = FieldAggregation_1.FieldAggregation;
    }
}
exports.ConnectedFieldsAggregation = ConnectedFieldsAggregation;
//# sourceMappingURL=ConnectedFieldsAggregation.js.map