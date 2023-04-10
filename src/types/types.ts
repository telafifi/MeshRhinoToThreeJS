export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export interface Vertex {
  p1: XYZ;
  p2: XYZ;
  p3: XYZ;
}

export interface Face {
  vertexIdx1: number;
  vertexIdx2: number;
  vertexIdx3: number;
}

export interface Mesh {
  vertices: Vertex[];
  faces: Face[];
}
