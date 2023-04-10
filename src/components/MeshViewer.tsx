import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MeshViewerProps {
  filePath: string;
}

const MeshViewer = ({ filePath }: MeshViewerProps) => {
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
      1,
      1000,
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

    // Load the mesh from the JSON file
    const loader = new THREE.JSONLoader();
    loader.load(filePath, function (geometry, materials) {
      const mesh = new THREE.Mesh(geometry, materials);
      scene.add(mesh);
    });

    // Create a render loop to update the scene
    const render = function () {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    // Clean up when the component unmounts
    return function cleanup() {
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [filePath]);

  return <div ref={containerRef} />;
};

export default MeshViewer;
