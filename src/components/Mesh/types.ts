import * as Z from '@iconbuild/izzy';

export type Vertex = Z.XYZ;

export interface Face {
  idx1: number;
  idx2: number;
  idx3: number;
}

export interface Mesh {
  vertices: Vertex[];
  faces: Face[];
}

export interface ThreeDimensionalBoundingBox {
  min: Z.XYZ;
  max: Z.XYZ;
}

export interface ThreeDimensionalSegment {
  p1: Z.XYZ;
  p2: Z.XYZ;
}

export interface ThreeDimensionalPlane {
  point: Z.XYZ;
  normal: Z.Vector3D;
}
