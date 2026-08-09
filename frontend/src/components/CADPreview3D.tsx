import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product } from '../types/product';
import { RotateCw, Box, Sparkles } from 'lucide-react';

interface CADPreview3DProps {
  product: Product;
  isDark?: boolean;
}

function parseFlt(s: string | null | undefined, fallback: number): number {
  if (!s) return fallback;
  const m = s.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : fallback;
}
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// ── Electric Motor ──
function buildElectricMotor(product: Product, isDark: boolean): THREE.Group {
  const g = new THREE.Group();
  const power = parseFlt(product.specs.power, 2.5);
  const bodyR = clamp(0.8 + power * 0.05, 0.9, 1.4);
  const bodyL = clamp(1.8 + power * 0.08, 2.0, 3.2);
  const houseMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x1e293b : 0x334155, metalness: 0.6, roughness: 0.3 });
  const house = new THREE.Mesh(new THREE.CylinderGeometry(bodyR, bodyR, bodyL, 32), houseMat);
  house.rotation.z = Math.PI / 2;
  house.userData = { name: 'Main Housing', spec: product.specs.power || '2.5 kW' };
  g.add(house);
  for (let i = -5; i <= 5; i++) {
    const fin = new THREE.Mesh(new THREE.TorusGeometry(bodyR + 0.07, 0.025, 16, 32), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 }));
    fin.position.x = i * (bodyL / 12);
    fin.rotation.y = Math.PI / 2;
    g.add(fin);
  }
  const shaftR = clamp(0.25 + power * 0.01, 0.25, 0.45);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(shaftR, shaftR, bodyL * 0.5, 32), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1, emissive: 0x0284c7, emissiveIntensity: 0.25 }));
  shaft.position.x = bodyL / 2 + bodyL * 0.25;
  shaft.rotation.z = Math.PI / 2;
  shaft.userData = { name: 'Drive Shaft', spec: product.specs.shaft || product.specs.dimensions || '28mm Ø' };
  g.add(shaft);
  const flange = new THREE.Mesh(new THREE.CylinderGeometry(bodyR + 0.2, bodyR + 0.2, 0.18, 32), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 }));
  flange.position.x = bodyL / 2;
  flange.rotation.z = Math.PI / 2;
  g.add(flange);
  const jbox = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.75), new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.5 }));
  jbox.position.set(0, bodyR + 0.37, 0);
  jbox.userData = { name: 'Terminal Box', spec: product.specs.voltage || '400V AC' };
  g.add(jbox);
  for (const z of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(bodyL * 0.85, 0.18, 0.38), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 }));
    foot.position.set(0, -bodyR - 0.09, z * (bodyR + 0.2));
    foot.userData = { name: 'Mounting Foot', spec: 'B3 Foot Mount' };
    g.add(foot);
  }
  return g;
}

// ── Hydraulic Valve ──
function buildHydraulicValve(product: Product, isDark: boolean): THREE.Group {
  const g = new THREE.Group();
  const pressure = parseFlt(product.specs.pressure, 250);
  const blockW = clamp(1.4 + pressure * 0.002, 1.5, 2.2);
  const blockH = clamp(0.9 + pressure * 0.001, 1.0, 1.6);
  const blockMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x1e3a5f : 0x1d4ed8, metalness: 0.75, roughness: 0.25 });
  const block = new THREE.Mesh(new THREE.BoxGeometry(blockW, blockH, 1.1), blockMat);
  block.userData = { name: 'Valve Manifold', spec: `${pressure} bar` };
  g.add(block);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.55, 24), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5 }));
  cap.position.set(0, blockH / 2 + 0.275, 0);
  cap.userData = { name: 'Solenoid Actuator', spec: product.specs.voltage || '24V DC' };
  g.add(cap);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 24), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.6 }));
  collar.position.set(0, blockH / 2 + 0.06, 0);
  g.add(collar);
  const portMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
  const ports: [number,number,number,number,number,number][] = [
    [blockW/2+0.2,0,0,0,0,Math.PI/2],[-(blockW/2+0.2),0,0,0,0,-Math.PI/2],
    [0,0,0.75,Math.PI/2,0,0],[0,0,-0.75,-Math.PI/2,0,0],
  ];
  ports.forEach(([px,py,pz,rx,ry,rz]) => {
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.38,16), portMat);
    port.position.set(px,py,pz); port.rotation.set(rx,ry,rz);
    port.userData = { name: 'Hydraulic Port', spec: product.specs.portSize || 'G1/4"' };
    g.add(port);
  });
  return g;
}

// ── CNC Tooling ──
function buildCNCTool(product: Product, isDark: boolean): THREE.Group {
  const g = new THREE.Group();
  const diameter = parseFlt(product.specs.diameter || product.specs.dimensions, 16);
  const r = clamp(diameter * 0.02, 0.12, 0.45);
  const flutes = parseInt(product.specs.flutes || '4', 10) || 4;
  const shankMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x334155 : 0x475569, metalness: 0.85, roughness: 0.2 });
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.5, 32), shankMat);
  shank.position.y = 1.5;
  shank.userData = { name: 'Tool Shank', spec: `${diameter}mm Ø` };
  g.add(shank);
  const cuttingMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.15 });
  const cutting = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.85, 1.8, 32), cuttingMat);
  cutting.position.y = -0.1;
  cutting.userData = { name: 'Cutting Section', spec: `${flutes} Flutes` };
  g.add(cutting);
  for (let f = 0; f < flutes; f++) {
    const angle = (f / flutes) * Math.PI * 2;
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.7, 0.06), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    groove.position.set(Math.cos(angle) * r, -0.1, Math.sin(angle) * r);
    groove.rotation.y = angle + Math.PI / 2;
    g.add(groove);
  }
  const tip = new THREE.Mesh(new THREE.ConeGeometry(r * 0.85, 0.55, 32), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.95, emissive: 0xfbbf24, emissiveIntensity: 0.08 }));
  tip.position.y = -1.27;
  tip.userData = { name: 'Cutting Tip', spec: product.specs.material || 'Carbide' };
  g.add(tip);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.6, r * 0.6, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 }));
  knob.position.y = 2.92;
  g.add(knob);
  return g;
}

// ── Pneumatic Cylinder ──
function buildPneumaticCylinder(product: Product, isDark: boolean): THREE.Group {
  const g = new THREE.Group();
  const bore = parseFlt(product.specs.bore || product.specs.dimensions, 50);
  const stroke = parseFlt(product.specs.stroke, 100);
  const r = clamp(bore * 0.012, 0.35, 0.9);
  const bodyLen = clamp(stroke * 0.015, 1.5, 3.5);
  const barrelMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x94a3b8 : 0xcbd5e1, metalness: 0.5, roughness: 0.4 });
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(r, r, bodyLen, 32), barrelMat);
  barrel.rotation.z = Math.PI / 2;
  barrel.userData = { name: 'Cylinder Barrel', spec: `${bore}mm bore` };
  g.add(barrel);
  const capMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x475569 : 0x64748b, metalness: 0.7 });
  for (const side of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r+0.12,r+0.12,0.18,32), capMat);
    cap.position.x = side * (bodyLen/2+0.09); cap.rotation.z = Math.PI/2;
    cap.userData = { name: 'End Cap', spec: product.specs.pressure || '10 bar' };
    g.add(cap);
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.25,16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9 }));
    port.position.set(side*(bodyLen/2+0.25), r*0.4, 0); port.rotation.z = Math.PI/2;
    port.userData = { name: 'Air Port', spec: 'G1/8"' };
    g.add(port);
  }
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(r*0.25,r*0.25,bodyLen*0.8,24), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, emissive: 0x0284c7, emissiveIntensity: 0.15 }));
  rod.position.x = bodyLen * 0.9; rod.rotation.z = Math.PI/2;
  rod.userData = { name: 'Piston Rod', spec: `${stroke}mm stroke` };
  g.add(rod);
  const clevis = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.5,0.18), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 }));
  clevis.position.x = bodyLen * 0.9 + bodyLen * 0.4 + 0.15;
  clevis.userData = { name: 'Clevis Mount', spec: 'Pin Ø 12mm' };
  g.add(clevis);
  return g;
}

// ── Sensor ──
function buildSensor(product: Product, isDark: boolean): THREE.Group {
  const g = new THREE.Group();
  const housingR = 0.3;
  const house = new THREE.Mesh(new THREE.CylinderGeometry(housingR,housingR,2.0,24), new THREE.MeshStandardMaterial({ color: isDark ? 0x1e293b : 0x334155, metalness: 0.6, roughness: 0.3 }));
  house.position.y = 0.4;
  house.userData = { name: 'Sensor Housing', spec: product.specs.ipRating || 'IP67' };
  g.add(house);
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.2,6), new THREE.MeshStandardMaterial({ color: isDark ? 0x475569 : 0x64748b, metalness: 0.7 }));
  nut.position.y = -0.5;
  nut.userData = { name: 'Mounting Nut', spec: product.specs.threadSize || 'M30×1.5' };
  g.add(nut);
  const sense = new THREE.Mesh(new THREE.CylinderGeometry(housingR*0.8,housingR*0.8,0.12,24), new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.6, transparent: true, opacity: 0.85, roughness: 0.1 }));
  sense.position.y = -0.65;
  sense.userData = { name: 'Sensing Face', spec: product.specs.range || '4–20mA' };
  g.add(sense);
  const probe = new THREE.Mesh(new THREE.ConeGeometry(housingR*0.35,0.45,16), new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.9 }));
  probe.position.y = -0.95; probe.rotation.x = Math.PI;
  probe.userData = { name: 'Probe Tip', spec: 'Ø8mm detect' };
  g.add(probe);
  const conn = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.38,8), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.4 }));
  conn.position.y = 1.58;
  conn.userData = { name: 'M12 Connector', spec: product.specs.connector || '4-pin M12' };
  g.add(conn);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.8,8), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }));
  cable.position.y = 2.17;
  g.add(cable);
  const led = new THREE.Mesh(new THREE.TorusGeometry(housingR+0.05,0.04,8,24), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.8 }));
  led.position.y = 0.9;
  g.add(led);
  return g;
}

// ── Power Transmission (Gear) ──
function buildPowerTransmission(product: Product, isDark: boolean): THREE.Group {
  const g = new THREE.Group();
  const teeth = parseInt(product.specs.teeth || '24', 10) || 24;
  const ratio = parseFlt(product.specs.ratio, 5);
  const gearR = clamp(0.6 + teeth * 0.02, 0.8, 1.4);
  const gearMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x1e3a5f : 0x1d4ed8, metalness: 0.75, roughness: 0.25 });
  const gearBody = new THREE.Mesh(new THREE.CylinderGeometry(gearR,gearR,0.38,teeth), gearMat);
  gearBody.rotation.x = Math.PI/2; gearBody.position.set(-0.5,0,0);
  gearBody.userData = { name: 'Driven Gear', spec: `${teeth}T, Ratio ${ratio}:1` };
  g.add(gearBody);
  for (let t = 0; t < teeth; t++) {
    const angle = (t/teeth)*Math.PI*2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.38,0.13), gearMat);
    tooth.position.set(-0.5+Math.cos(angle)*(gearR+0.06),0,Math.sin(angle)*(gearR+0.06));
    tooth.rotation.y = -angle;
    g.add(tooth);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.45,24), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 }));
  hub.rotation.x = Math.PI/2; hub.position.set(-0.5,0,0);
  hub.userData = { name: 'Gear Hub', spec: product.specs.bore || '25mm Bore' };
  g.add(hub);
  const driverR = gearR / ratio;
  const driverTeeth = Math.max(6, Math.round(teeth/ratio));
  const driverMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
  const driver = new THREE.Mesh(new THREE.CylinderGeometry(driverR,driverR,0.35,driverTeeth), driverMat);
  driver.rotation.x = Math.PI/2; driver.position.set(gearR+driverR+0.02,0,0);
  driver.userData = { name: 'Driver Pinion', spec: `${driverTeeth}T` };
  g.add(driver);
  for (let t = 0; t < driverTeeth; t++) {
    const angle = (t/driverTeeth)*Math.PI*2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.35,0.09), driverMat);
    tooth.position.set(gearR+driverR+0.02+Math.cos(angle)*(driverR+0.04),0,Math.sin(angle)*(driverR+0.04));
    tooth.rotation.y = -angle;
    g.add(tooth);
  }
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,gearR*2+driverR*2+0.5,16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, emissive: 0x0284c7, emissiveIntensity: 0.15 }));
  shaft.rotation.z = Math.PI/2; shaft.position.set((gearR+driverR)/2,-gearR-0.6,0);
  shaft.userData = { name: 'Output Shaft', spec: product.specs.dimensions || '30mm Ø' };
  g.add(shaft);
  return g;
}

// ── Factory ──
function buildModel(product: Product, isDark: boolean): { group: THREE.Group; cam: [number,number,number] } {
  const cat = (product.category || '').toLowerCase();
  if (cat.includes('hydraulic')) return { group: buildHydraulicValve(product, isDark), cam: [4,3,4] };
  if (cat.includes('cnc') || cat.includes('tool')) return { group: buildCNCTool(product, isDark), cam: [2.5,1,3] };
  if (cat.includes('pneumatic')) return { group: buildPneumaticCylinder(product, isDark), cam: [5,3,4] };
  if (cat.includes('sensor') || cat.includes('instrument')) return { group: buildSensor(product, isDark), cam: [2,2,3] };
  if (cat.includes('power') || cat.includes('transmission') || cat.includes('gear')) return { group: buildPowerTransmission(product, isDark), cam: [5,4,5] };
  return { group: buildElectricMotor(product, isDark), cam: [5,3.5,6] };
}

// ── Component ──
const CADPreview3D: React.FC<CADPreview3DProps> = ({ product, isDark = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    setSelectedPart(null);
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0f172a : 0xf8fafc);
    const { group: modelGroup, cam } = buildModel(product, isDark);
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.set(...cam); camera.lookAt(0,0,0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const d1 = new THREE.DirectionalLight(0x38bdf8, 1.2); d1.position.set(5,8,5); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x818cf8, 0.8); d2.position.set(-5,-3,-5); scene.add(d2);
    scene.add(modelGroup);
    const grid = new THREE.GridHelper(10,20,isDark?0x334155:0xcbd5e1,isDark?0x1e293b:0xe2e8f0);
    grid.position.y = -1.6; scene.add(grid);
    let isDragging = false, prevMouse = {x:0,y:0};
    const onMouseDown = (e:MouseEvent) => { isDragging=true; prevMouse={x:e.clientX,y:e.clientY}; };
    const onMouseMove = (e:MouseEvent) => { if(!isDragging)return; modelGroup.rotation.y+=(e.clientX-prevMouse.x)*0.01; modelGroup.rotation.x+=(e.clientY-prevMouse.y)*0.01; prevMouse={x:e.clientX,y:e.clientY}; };
    const onMouseUp = () => { isDragging=false; };
    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (e:MouseEvent) => {
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse,camera);
      const hits = raycaster.intersectObjects(modelGroup.children,true);
      if(hits.length>0&&hits[0].object.userData?.name) setSelectedPart(`${hits[0].object.userData.name}: ${hits[0].object.userData.spec}`);
    };
    domElement.addEventListener('click', onClick);
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if(autoRotate&&!isDragging) modelGroup.rotation.y+=0.008;
      renderer.render(scene,camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(rafId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onClick);
      if(container.contains(domElement)) container.removeChild(domElement);
      renderer.dispose();
    };
  }, [product.id, product.category, isDark, autoRotate]);

  const cardBg = '#1B2433';
  const cardBorder = 'rgba(56, 189, 248, 0.35)';

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.35)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Box size={20} color="#60A5FA" />
          <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
            3D Product Model Preview
          </h4>
          <span style={{ fontSize: 12, fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 10px', borderRadius: 8 }}>
            Scaled from Extracted Specs
          </span>
        </div>
        <button onClick={() => setAutoRotate(!autoRotate)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 8, background: autoRotate ? 'rgba(56, 189, 248, 0.2)' : '#0B0F17', color: autoRotate ? '#FFFFFF' : '#94A3B8', cursor: 'pointer', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
          <RotateCw size={14} />{autoRotate ? 'Auto-Rotate ON' : 'Rotate Paused'}
        </button>
      </div>
      <div ref={mountRef} style={{ width: '100%', height: 320, borderRadius: 14, overflow: 'hidden', cursor: 'grab' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13, color: '#CBD5E1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="#60A5FA" />
          <span style={{ fontWeight: 600 }}>Click any 3D part to inspect extracted CAD parameters</span>
        </div>
        {selectedPart && (
          <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.4)' }}>
            {selectedPart}
          </div>
        )}
      </div>
    </div>
  );
};

export default CADPreview3D;
