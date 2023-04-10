import * as THREE from 'three';
import { Mesh } from './types';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { convertToThreeMesh } from './utils';
import React, { useEffect, useRef } from 'react';

const Scene = ({ meshes }: { meshes: Mesh[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    // Create a new Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create a new Three.js camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
    );
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    // Create a new Three.js renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Add the renderer's canvas element to the DOM
    const container = containerRef.current;
    if (container) {
      container.appendChild(renderer.domElement);
    }

    const threeMeshes = meshes.map(convertToThreeMesh);

    scene.add(...threeMeshes);
    const boundingBox = new THREE.Box3().setFromObject(threeMeshes[0]);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const FOV = camera.fov * (Math.PI / 180);
    const distance = maxDim / (2 * Math.tan(FOV / 2));
    camera.position.copy(center);
    camera.position.z += distance * 2;
    camera.lookAt(center);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.copy(camera.position);
    scene.add(directionalLight);

    // Create OrbitControls instance
    // const controls = new OrbitControls(
    //   cameraRef.current,
    //   rendererRef.current.domElement,
    // );

    // // Configure controls
    // controls.enableDamping = true; // Adds inertia to panning and zooming
    // controls.dampingFactor = 0.1; // Inertia factor
    // controls.enableZoom = true; // Enable zooming
    // controls.zoomSpeed = 1.0; // Zoom speed
    // controls.enablePan = true; // Enable panning
    // controls.panSpeed = 2.0; // Pan speed

    if (rendererRef.current) {
      rendererRef.current.setClearColor('white', 1);
    }

    // Create a render loop to update the scene
    const render = function () {
      requestAnimationFrame(render);
      // threeMesh.rotation.x += 0.01;
      // threeMesh.rotation.y += 0.01;
      // controls.update();
      renderer.render(scene, camera);
    };
    render();

    // Clean up when the component unmounts
    return function cleanup() {
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [meshes]);

  return <div ref={containerRef} />;
};

export default Scene;
