import { type PageAnnotations, type UINode, type Location } from '../types';
/**
 * Retrieves a `UINode` from the given annotations by its hierarchical node ID.
 *
 * @param annotations The annotations object containing nodes.
 * @param id The hierarchical node ID to search for.
 * @returns The matching `UINode` if found, otherwise `undefined`.
 */
export declare function getAnnotationNodeById(annotations: PageAnnotations, id: number[]): UINode | undefined;
/**
 * Returns all locations for the given node.
 *
 * @param node Annotation node.
 * @returns All locations for the given node.
 */
export declare function getNodeLocations(node: UINode): Location[];
/**
 * Finds a `UINode` within a tree of nodes that matches the given annotation path.
 *
 * @param annotationPath - The annotation path to match.
 * @param nodes - The list of nodes to search within.
 * @param shallow - If true, only searches the top-level nodes.
 * @param lookUpIndex - Optional index hint to optimize search order.
 * @returns The matching node if found, otherwise `undefined`.
 */
export declare function nodeMatcher(annotationPath: string, nodes: UINode[], shallow?: boolean, lookUpIndex?: number): UINode | undefined;
/**
 * Method finds matching node using passed schema annotation path and tree object nested nodes and full nodes.
 *
 * @param schemaAnnotationPath Annotation path from schema to look up in annotation nodes.
 * @param annotationNodes Full annotation nodes tree.
 * @param childAnnotationNodes Current level's annotation nodes - mainly nested nodes are used to look up, but there is special cases when nodes are not on same level as schema.
 * @param nodeAnnotationPath Current annotation node path.
 * @param index Node index to look.
 * @returns Matching annotation node.
 */
export declare function getMatchingNode(schemaAnnotationPath: string, annotationNodes: UINode[], childAnnotationNodes: UINode[], nodeAnnotationPath?: string, index?: number): UINode | undefined;
//# sourceMappingURL=annotations.d.ts.map