import * as R from 'ramda';
import * as Z from '@iconbuild/izzy';
import {
  Face,
  Mesh,
  ThreeDimensionalBoundingBox,
  ThreeDimensionalPlane,
  ThreeDimensionalSegment,
  Vertex,
} from './types';

export const generateSitePlanFromMeshImport = (
  meshes: Mesh[],
  beadHeightInches: number,
): Z.SitePlan => {
  const items: Z.SiteItem[] = meshes.map((mesh) => {
    const buildPlan = generateBuildPlanFromMesh(mesh, beadHeightInches);

    return {
      label: 'mesh',
      xInches: 0,
      yInches: 0,
      zInches: 0,
      angleRadians: 0,
      hFlip: false,
      vFlip: false,
      buildPlan,
    };
  });

  return {
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    orientationDegrees: 0,
    foundationWidthInches: 1000,
    foundationLengthInches: 1000,
    items,
  };
};

const generateBuildPlanFromMesh = (
  mesh: Mesh,
  beadHeightInches: number,
): Z.BuildPlan => {
  const maxHeightInches = 120;

  const buildActions: Z.BuildAction[] = [];

  let height = 0;
  while (height < maxHeightInches) {
    const strokes = sliceMeshAtHeight(height)(mesh);

    buildActions.push({
      type: 'print',
      beadWidthInches: 2.5,
      infillOverlapPercent: 0.25,
      startHeightInches: height,
      endHeightInches: height + beadHeightInches,
      toolPath: Z.printToolPathFromUnindexed(strokes),
    });
    height += beadHeightInches;
  }

  return { actions: buildActions };
};

export const sliceMeshAtHeight =
  (heightInches: number) =>
  (mesh: Mesh): Z.Stroke[][] => {
    const { faces, vertices } = mesh;

    const filteredFaces = faces.filter(filterFace(vertices, heightInches));

    const plane: ThreeDimensionalPlane = {
      point: { x: 0, y: 0, z: heightInches },
      normal: { i: 0, j: 0, k: 1 },
    };

    const intersects = filteredFaces
      .map(planeFaceIntersect(plane, vertices))
      .filter(Z.nonNullable) as Z.Stroke[];

    return Z.pathFromScrambled(intersects);
  };

const filterFace =
  (vertices: Vertex[], heightInches: number) =>
  (face: Face): boolean => {
    const { min, max } = faceBoundingBox(vertices)(face);

    if (min.z > heightInches || max.z < heightInches) return false;

    return true;
  };

const faceBoundingBox =
  (vertices: Vertex[]) =>
  (face: Face): ThreeDimensionalBoundingBox => {
    const min: Z.XYZ = {
      x: Math.min(
        vertices[face.idx1].x,
        vertices[face.idx2].x,
        vertices[face.idx3].x,
      ),
      y: Math.min(
        vertices[face.idx1].y,
        vertices[face.idx2].y,
        vertices[face.idx3].y,
      ),
      z: Math.min(
        vertices[face.idx1].z,
        vertices[face.idx2].z,
        vertices[face.idx3].z,
      ),
    };
    const max: Z.XYZ = {
      x: Math.max(
        vertices[face.idx1].x,
        vertices[face.idx2].x,
        vertices[face.idx3].x,
      ),
      y: Math.max(
        vertices[face.idx1].y,
        vertices[face.idx2].y,
        vertices[face.idx3].y,
      ),
      z: Math.max(
        vertices[face.idx1].z,
        vertices[face.idx2].z,
        vertices[face.idx3].z,
      ),
    };

    return { min, max };
  };

const threeDimensionalDotProduct = (
  vector1: Z.Vector3D,
  vector2: Z.Vector3D,
): number =>
  vector1.i * vector2.i + vector1.j * vector2.j + vector1.k * vector2.k;

const threeDimensionalVectorFromPoints = (
  p1: Z.XYZ,
  p2: Z.XYZ,
): Z.Vector3D => ({
  i: p2.x - p1.x,
  j: p2.y - p1.y,
  k: p2.z - p1.z,
});

const planeSegmentIntersect =
  (plane: ThreeDimensionalPlane) =>
  (segment: ThreeDimensionalSegment): Z.XYZ | null => {
    const segmentDirection = threeDimensionalVectorFromPoints(
      segment.p1,
      segment.p2,
    );

    const dotToSegmentDirection = threeDimensionalDotProduct(
      plane.normal,
      segmentDirection,
    );

    // Condition if the segment is parallel to the plane.
    if (Z.closeEqual(0, dotToSegmentDirection)) return null;

    const directionFromSegmentToPlanePoint = threeDimensionalVectorFromPoints(
      segment.p1,
      plane.point,
    );

    const dotToPlaneDirection = threeDimensionalDotProduct(
      plane.normal,
      directionFromSegmentToPlanePoint,
    );

    const t = dotToPlaneDirection / dotToSegmentDirection;

    // If t is not between 0 and 1, then the intersection point does not lie within the segment
    if (t < 0 || t > 1) return null;

    return {
      x: segment.p1.x + t * segmentDirection.i,
      y: segment.p1.y + t * segmentDirection.j,
      z: segment.p1.z + t * segmentDirection.k,
    };
  };

const faceEdges =
  (vertices: Vertex[]) =>
  (face: Face): ThreeDimensionalSegment[] => {
    const p1 = vertices[face.idx1];
    const p2 = vertices[face.idx2];
    const p3 = vertices[face.idx3];

    return [
      {
        p1,
        p2,
      },
      { p1: p2, p2: p3 },
      { p1: p3, p2: p1 },
    ];
  };

const planeFaceIntersect =
  (plane: ThreeDimensionalPlane, vertices: Vertex[]) =>
  (face: Face): Z.Stroke | null => {
    const edges = faceEdges(vertices)(face);

    const intersects = edges
      .map(planeSegmentIntersect(plane))
      .filter(Z.nonNullable);

    if (R.length(intersects) === 2)
      return { type: 'segment', p1: intersects[0], p2: intersects[1] };

    return null;
  };
