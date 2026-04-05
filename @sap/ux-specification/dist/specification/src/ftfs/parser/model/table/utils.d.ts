import type { ObjectAggregation } from '../ObjectAggregation';
/**
 * Method updates table and table's child nodes annotation "locations" properties.
 * It is used to handle different schema variations:
 * 1. "AnnotationPath" can be placed in "Table" node;
 * 2. "AnnotationPath" can be missed in "Table" node, but placed in child node;
 * In case of 2nd scenario - we need to copy "locations" from child and apply to "Table" node.
 *
 * @param child Table's child aggregation/node.
 */
export declare const updateTableChildNodeLocations: (child: ObjectAggregation) => void;
//# sourceMappingURL=utils.d.ts.map