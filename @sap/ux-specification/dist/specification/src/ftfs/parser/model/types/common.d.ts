import type { ArtifactType } from '@sap/ux-specification-types';
import type { Range } from '@sap-ux/text-document-utils';
export interface Location {
    fileUri: string;
    range: Range;
    relative?: boolean;
    type?: ArtifactType;
}
export interface AllowedMoveRange {
    from: number;
    to: number;
}
//# sourceMappingURL=common.d.ts.map