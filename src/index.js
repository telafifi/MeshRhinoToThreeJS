import "./styles.css";
import {
  Scene,
  WebGLRenderer,
  Color,
  Mesh,
  Geometry,
  Vector3,
  Face3,
  ObjectLoader,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute
} from "three";
import data from "./mesh.json";

let container;
let scene;
let mesh;
let renderer;
let camera;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const extractMeshFromData = (geometry) => {
  // create a new mesh data object from the loaded JSON data
  const meshData = {
    vertices: geometry.vertices.map((v) => [v.x * 12, v.y * 12, v.z * 12]),
    faces: geometry.faces.map((f) => [f.a, f.b, f.c])
  };
  if (geometry.colors.length > 0) {
    meshData.colors = geometry.colors.map((c) => [c.r, c.g, c.b]);
  }

  // create a new Three.js geometry from the mesh data
  const threeGeometry = new BufferGeometry();
  const positions = new Float32BufferAttribute(meshData.vertices.flat(), 3);
  threeGeometry.setAttribute("position", positions);

  const indicesBuffer = new Uint16BufferAttribute(meshData.faces.flat(), 1);
  threeGeometry.setIndex(indicesBuffer);
  // meshData.vertices.forEach((v) => {
  //   const vector = new Vector3(v[0], v[1], v[2]);
  //   console.log(vector);
  //   // threeGeometry.vertices.push(vector);
  // });
  // meshData.faces.forEach((f) => {
  //   const face = new Face3(f[0], f[1], f[2]);
  //   threeGeometry.faces.push(face);
  // });
  // if (meshData.colors) {
  //   threeGeometry.colors = meshData.colors.map((c) => new Color().fromArray(c));
  // }

  // create a new Three.js mesh from the geometry and materials
  const mesh = new Mesh(
    threeGeometry,
    new MeshBasicMaterial({ color: 0xff0000 })
  );

  return mesh;
};

function init() {
  container = document.querySelector("div#app");

  scene = new Scene();
  scene.background = new Color("skyblue");

  renderer = new WebGLRenderer();
  renderer.setSize(sizes.width, sizes.height);
  container.appendChild(renderer.domElement);

  // mesh = new Mesh(
  //   new BoxGeometry(1, 1, 1, 5, 5, 5),
  //   new MeshBasicMaterial({ color: 0xff0000 })
  // );

  const mesh = extractMeshFromData(data);
  scene.add(mesh);
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.lookAt(mesh.position);
  scene.add(camera);

  console.log(mesh);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

init();
