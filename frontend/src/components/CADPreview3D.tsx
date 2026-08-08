import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product } from '../types/product';
import { RotateCw, Box, Sparkles } from 'lucide-react';

interface CADPreview3DProps {
  product: Product;
  isDark?: boolean;
}

const CADPreview3D: React.FC<CADPreview3DProps> = ({ product, isDark = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Extract specs for parametric scaling
  const shaftText = product.specs.shaft || product.specs.dimensions || '28mm Ø';
  const voltageText = product.specs.voltage || '400V';
  const powerText = product.specs.power || '2.5 kW';
  const ipText = product.specs.ipRating || 'IP65';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0f172a : 0xf8fafc);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.8);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // 5. Parametric CAD Model Group
    const modelGroup = new THREE.Group();

    // Body Housing (Main Cylinder with cooling fins)
    const bodyGeo = new THREE.CylinderGeometry(1.1, 1.1, 2.4, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0x334155,
      metalness: 0.6,
      roughness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.z = Math.PI / 2;
    bodyMesh.userData = { name: 'Main Housing Body', spec: `${powerText} Frame (${ipText})` };
    modelGroup.add(bodyMesh);

    // Cooling Fins (Fin rings)
    for (let i = -4; i <= 4; i++) {
      const finGeo = new THREE.TorusGeometry(1.15, 0.03, 16, 32);
      const finMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.position.x = i * 0.22;
      finMesh.rotation.y = Math.PI / 2;
      modelGroup.add(finMesh);
    }

    // Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 32);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.x = 1.8;
    shaftMesh.rotation.z = Math.PI / 2;
    shaftMesh.userData = { name: 'Rotary Drive Shaft', spec: shaftText };
    modelGroup.add(shaftMesh);

    // Front Bearing Flange
    const flangeGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 32);
    const flangeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
    const flangeMesh = new THREE.Mesh(flangeGeo, flangeMat);
    flangeMesh.position.x = 1.25;
    flangeMesh.rotation.z = Math.PI / 2;
    modelGroup.add(flangeMesh);

    // Terminal Junction Box (Top)
    const boxGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.5, roughness: 0.4 });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set(0, 1.35, 0);
    boxMesh.userData = { name: 'Terminal Junction Box', spec: `${voltageText} AC Connection` };
    modelGroup.add(boxMesh);

    // Mounting Feet
    for (const zSign of [-1, 1]) {
      const footGeo = new THREE.BoxGeometry(2.0, 0.2, 0.4);
      const footMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      const footMesh = new THREE.Mesh(footGeo, footMat);
      footMesh.position.set(0, -1.2, zSign * 1.1);
      footMesh.userData = { name: 'Mounting Feet Base', spec: 'Standard B3 Foot Mount (4x Holes)' };
      modelGroup.add(footMesh);
    }

    scene.add(modelGroup);

    // Grid Floor Helper
    const gridHelper = new THREE.GridHelper(10, 20, isDark ? 0x334155 : 0xcbd5e1, isDark ? 0x1e293b : 0xe2e8f0);
    gridHelper.position.y = -1.35;
    scene.add(gridHelper);

    // 6. Interactive Drag Control Setup
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      modelGroup.rotation.y += deltaMove.x * 0.01;
      modelGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Raycaster for part inspection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modelGroup.children);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.name) {
          setSelectedPart(`${hit.userData.name}: ${hit.userData.spec}`);
        }
      }
    };
    domElement.addEventListener('click', onClick);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        modelGroup.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onClick);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [isDark, autoRotate, shaftText, voltageText, powerText, ipText]);

  const cardBg = isDark ? 'rgba(15,23,42,0.8)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 16,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isDark ? 'none' : '0 2px 10px rgba(15,23,42,0.04)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box size={16} color="#0284c7" />
          <h4 style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#fff' : '#0f172a' }}>
            Interactive 3D CAD Preview (WebGL)
          </h4>
          <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(2,132,199,0.12)', color: '#0284c7', border: '1px solid rgba(2,132,199,0.3)', padding: '2px 8px', borderRadius: 9999 }}>
            Parametric Spec Render
          </span>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 8,
            background: autoRotate ? (isDark ? 'rgba(6,182,212,0.15)' : '#e0f2fe') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
            color: autoRotate ? '#0284c7' : (isDark ? '#94a3b8' : '#64748b'),
            cursor: 'pointer',
          }}
        >
          <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} />
          {autoRotate ? 'Auto-Rotate ON' : 'Rotate Paused'}
        </button>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: 280,
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'grab',
          position: 'relative',
        }}
      />

      {/* Controls / Info overlay */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 10, fontSize: 11, color: isDark ? '#94a3b8' : '#64748b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={13} color="#4f46e5" />
          <span>Click any 3D part to inspect extracted CAD parameters</span>
        </div>

        {selectedPart && (
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#0284c7',
            background: 'rgba(2,132,199,0.1)', padding: '3px 10px', borderRadius: 6,
            border: '1px solid rgba(2,132,199,0.25)',
          }}>
            {selectedPart}
          </div>
        )}
      </div>
    </div>
  );
};

export default CADPreview3D;
