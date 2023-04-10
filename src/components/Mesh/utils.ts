import * as R from 'ramda';
import * as THREE from 'three';
import { Face, Mesh, Vertex } from './types';

// Need to flip y and z axes since ThreeJs has vertical axis as Y
// while Rhino holds it as Z
const convertVertexToNumericalArray = (vertex: Vertex): number[] => [
  vertex.x,
  vertex.y,
  vertex.z,
];

const convertFaceToNumericalArray =
  (vertices: Vertex[]) =>
  (face: Face): number[] =>
    R.flatten([
      convertVertexToNumericalArray(vertices[face.idx1]),
      convertVertexToNumericalArray(vertices[face.idx2]),
      convertVertexToNumericalArray(vertices[face.idx3]),
    ]);

export const convertMeshToInputArray = (mesh: Mesh): number[] => {
  const { faces, vertices } = mesh;

  return R.flatten(faces.map(convertFaceToNumericalArray(vertices)));
};

export const convertToThreeMesh = (mesh: Mesh): THREE.Mesh => {
  const numericalArray = convertMeshToInputArray(mesh);

  const vertices = new Float32Array(numericalArray);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  const threeMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshLambertMaterial({ color: 'grey', side: THREE.DoubleSide }),
  );

  threeMesh.position.set(0, 0, 0);

  return threeMesh;
};
