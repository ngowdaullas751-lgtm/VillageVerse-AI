import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Layers,
  Moon,
  Sun,
  Sunset,
  X,
} from 'lucide-react';
import { SimulationParams, VillageProfile } from '../types/village';

interface DigitalTwinPageProps {
  village: VillageProfile;
  simParams: SimulationParams;
}

type TwinLayerMode = 'standard' | 'water' | 'solar' | 'flood';
type TimeOfDay = 'day' | 'dusk' | 'night';
type CameraPresetKey = 'overview' | 'water' | 'solar' | 'health' | 'river';

interface TwinHotspot {
  id: string;
  name: string;
  category: string;
  ward: string;
  status: string;
  metricA: { label: string; value: string };
  metricB: { label: string; value: string };
  description: string;
  position: [number, number, number];
}

const CAMERA_PRESETS: Record<
  CameraPresetKey,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { label: 'Overview', pos: [42, 30, 44], target: [0, 1.5, 0] },
  water: { label: 'Water Tower', pos: [16, 15, 22], target: [0, 5, -4] },
  solar: { label: 'Solar Farm', pos: [-30, 14, 18], target: [-16, 1, 6] },
  health: { label: 'Health Center', pos: [26, 13, 18], target: [13, 1.5, 6] },
  river: { label: 'River & Farms', pos: [28, 16, -32], target: [4, 0, -16] },
};

const HOTSPOTS: TwinHotspot[] = [
  {
    id: 'water_tower',
    name: 'Central Overhead Water Tower (2.0L)',
    category: 'Water Infrastructure',
    ward: 'Ward 1 · Central Core',
    status: 'Optimal',
    metricA: { label: 'Storage Level', value: '76% (152 kL)' },
    metricB: { label: 'Outlet Pressure', value: '2.8 bar' },
    description:
      'Gravity-fed RCC overhead tank feeding Wards 1–3 with ultrasonic level telemetry and automated valve metering.',
    position: [0, 0, -4],
  },
  {
    id: 'solar_microgrid',
    name: '250 kW Community Solar Microgrid',
    category: 'Clean Energy',
    ward: 'Ward 1 · West Feeder',
    status: 'Optimal',
    metricA: { label: 'Live Output', value: '218 kW' },
    metricB: { label: 'Renewable Share', value: '44% local' },
    description:
      'Dual-row photovoltaic microgrid powering daytime agricultural pumps, high school labs, and battery storage.',
    position: [-16, 0, 6],
  },
  {
    id: 'health_center',
    name: 'Primary Health Sub-Center',
    category: 'Healthcare',
    ward: 'Ward 1 · Central Core',
    status: 'Active',
    metricA: { label: 'Daily OPD', value: '64 patients' },
    metricB: { label: 'Tele-Consults', value: '184 / mo' },
    description:
      'Solar-backed rural clinic with maternal care beds, cold-chain vaccine storage, and district specialist tele-link.',
    position: [13, 0, 6],
  },
  {
    id: 'village_school',
    name: 'Sundarpur Model High School',
    category: 'Education & Shelter',
    ward: 'Ward 2 · East Core',
    status: 'Optimal',
    metricA: { label: 'Attendance', value: '94.2%' },
    metricB: { label: 'Shelter Capacity', value: '420 citizens' },
    description:
      'Six smart digital classrooms with rooftop solar and designated flood/cyclone community emergency shelter.',
    position: [13, 0, -10],
  },
  {
    id: 'river_basin',
    name: 'Riverbend Canal & Check-Dam Basin',
    category: 'Hydrology & Flood Watch',
    ward: 'Ward 5 · Riverbend',
    status: 'Watch',
    metricA: { label: 'Flood Risk Index', value: '62 / 100' },
    metricB: { label: 'Gauge Margin', value: '1.1m below crest' },
    description:
      'Natural drainage corridor along the northern farms; monitored by ultrasonic river crest sensors.',
    position: [0, 0, -21],
  },
  {
    id: 'agri_terraces',
    name: 'Precision Drip Agricultural Plots',
    category: 'Agriculture & Soil',
    ward: 'Ward 6 · West Orchards',
    status: 'Optimal',
    metricA: { label: 'Yield Forecast', value: '4.68 t/ha' },
    metricB: { label: 'Soil Moisture', value: '68% nominal' },
    description:
      'Sensor-guided ragi, maize, and horticultural plots connected to the village canal and microgrid pumps.',
    position: [-16, 0, -10],
  },
];

// Deterministic gentle terrain height function: flat village plateau in center, rolling hills around outer perimeter
function groundHeightAt(x: number, z: number): number {
  // Winding river trench near z ~ -21
  const riverCenterZ = -21 + Math.sin(x * 0.08) * 3.0;
  const distToRiver = Math.abs(z - riverCenterZ);
  let y = 0;

  if (distToRiver < 5.2) {
    const t = 1 - distToRiver / 5.2;
    y -= Math.sin((t * Math.PI) / 2) * 1.45;
  }

  // Rolling outer perimeter hills beyond radius 32 so scene feels naturally bounded
  const dist = Math.hypot(x, z);
  if (dist > 30) {
    const rim = (dist - 30) / 36;
    const ridge =
      (Math.sin(x * 0.07) * 0.5 + 0.5) * 4.5 +
      (Math.cos(z * 0.065) * 0.5 + 0.5) * 3.8;
    y += rim * rim * (6.5 + ridge);
  }
  return y;
}

// Reusable math helpers outside render loop (zero GC)
const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();
const _mouse = new THREE.Vector2();

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  village,
  simParams,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [layerMode, setLayerMode] = useState<TwinLayerMode>('standard');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('dusk');
  const [activePreset, setActivePreset] = useState<CameraPresetKey>('overview');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [showSimulatedAssets, setShowSimulatedAssets] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<TwinHotspot | null>(
    HOTSPOTS[0]
  );
  const [webglError, setWebglError] = useState(false);

  // Mutable refs for live scene updates without tearing down WebGL
  const stateRef = useRef({
    layerMode,
    timeOfDay,
    showSimulatedAssets,
    simParams,
    cameraTransition: null as {
      pos: THREE.Vector3;
      target: THREE.Vector3;
    } | null,
  });

  stateRef.current.layerMode = layerMode;
  stateRef.current.timeOfDay = timeOfDay;
  stateRef.current.showSimulatedAssets = showSimulatedAssets;
  stateRef.current.simParams = simParams;

  const sceneCallbacksRef = useRef<{
    applyVisualState: () => void;
    triggerCameraPreset: (key: CameraPresetKey) => void;
  } | null>(null);

  // Sync React controls to live Three.js scene
  useEffect(() => {
    sceneCallbacksRef.current?.applyVisualState();
  }, [layerMode, timeOfDay, showSimulatedAssets, simParams]);

  // Mount Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL (SwiftShader / llvmpipe) to pace rendering cost safely
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 640;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    // Scene & Environment Map (RoomEnvironment on all devices)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09162b);
    scene.fog = new THREE.FogExp2(0x09162b, 0.0085);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    // Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.5, 260);
    camera.position.set(42, 30, 44);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 14;
    controls.maxDistance = 95;
    controls.target.set(0, 1.5, 0);
    controls.update();

    controls.addEventListener('start', () => {
      stateRef.current.cameraTransition = null;
    });

    // Balanced 3-Point Lighting Rig (Warm Key + Cool Hemisphere Fill + Subtle Rim)
    const hemiLight = new THREE.HemisphereLight(0x8ec5ff, 0x162b22, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffdfb0, 1.9);
    sunLight.position.set(36, 44, 24);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.025;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-34, 20, -28);
    scene.add(rimLight);

    // =========================================================================
    // PROCEDURAL TEXTURES (Zero external 404s)
    // =========================================================================
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const makeSolarTexture = () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#0c2348';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
      }
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let j = 0; j <= 256; j += 64) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(256, j);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      return tex;
    };

    const makeRoadTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#253142';
      ctx.fillRect(0, 0, 128, 256);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(61, 16, 6, 92);
      ctx.fillRect(61, 144, 6, 92);
      ctx.fillStyle = '#475569';
      ctx.fillRect(4, 0, 4, 256);
      ctx.fillRect(120, 0, 4, 256);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 10);
      tex.anisotropy = maxAniso;
      return tex;
    };

    const makeFieldTexture = () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#1f4d36';
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 16) {
        ctx.fillStyle = y % 32 === 0 ? '#266143' : '#183f2c';
        ctx.fillRect(0, y, 256, 8);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      tex.anisotropy = maxAniso;
      return tex;
    };

    const solarTex = makeSolarTexture();
    const roadTex = makeRoadTexture();
    const fieldTex = makeFieldTexture();

    // Shared PBR Materials (varied roughness >= 0.25 across adjacent components)
    const matConcrete = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.82,
      metalness: 0.05,
    });
    const matDarkSteel = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.78,
    });
    const matPlaster = new THREE.MeshStandardMaterial({
      color: 0xe6decb,
      roughness: 0.88,
      metalness: 0.0,
    });
    const matTerracotta = new THREE.MeshStandardMaterial({
      color: 0x9c4632,
      roughness: 0.74,
      metalness: 0.04,
    });
    const matSlateRoof = new THREE.MeshStandardMaterial({
      color: 0x2a4365,
      roughness: 0.62,
      metalness: 0.18,
    });
    const matWindowGlow = new THREE.MeshStandardMaterial({
      color: 0xffe4a0,
      emissive: 0xffb347,
      emissiveIntensity: 0.9,
      roughness: 0.18,
      metalness: 0.1,
    });
    const matSolarPanel = new THREE.MeshStandardMaterial({
      map: solarTex,
      roughness: 0.2,
      metalness: 0.65,
    });
    const matLampGlow = new THREE.MeshStandardMaterial({
      color: 0xfff5d6,
      emissive: 0xffcf70,
      emissiveIntensity: 1.5,
      roughness: 0.2,
    });
    const matCyanBeacon = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.4,
    });
    const matEmeraldBeacon = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.0,
      roughness: 0.25,
      metalness: 0.4,
    });
    const matMedicalRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    });

    // =========================================================================
    // 1. SCULPTED TERRAIN & NATURAL PERIMETER HILLS
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(140, 140, 84, 84);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);
    const cLow = new THREE.Color(0x163829);
    const cMid = new THREE.Color(0x1d4732);
    const cHill = new THREE.Color(0x234230);
    const cBank = new THREE.Color(0x2a3b34);

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = groundHeightAt(vx, vz);
      posAttr.setY(i, vy);

      const col =
        vy < -0.35 ? cBank : vy > 2.2 ? cHill : Math.hypot(vx, vz) < 22 ? cLow : cMid;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.02,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Winding River Ribbon
    const riverPoints: THREE.Vector3[] = [];
    for (let x = -65; x <= 65; x += 4) {
      const z = -21 + Math.sin(x * 0.08) * 3.0;
      riverPoints.push(new THREE.Vector3(x, -0.58, z));
    }
    const riverShape = new THREE.PlaneGeometry(132, 7.6, 48, 4);
    riverShape.rotateX(-Math.PI / 2);
    const rPos = riverShape.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const rx = rPos.getX(i);
      const rz = rPos.getZ(i);
      rPos.setZ(i, rz - 21 + Math.sin(rx * 0.08) * 3.0);
    }
    riverShape.computeVertexNormals();
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0e5e7e,
      roughness: 0.16,
      metalness: 0.45,
      transparent: true,
      opacity: 0.9,
    });
    const riverMesh = new THREE.Mesh(riverShape, riverMat);
    riverMesh.position.y = -0.45;
    riverMesh.userData.hotspotId = 'river_basin';
    scene.add(riverMesh);

    // =========================================================================
    // 2. PAVED ROADS & AGRICULTURAL PLOTS (offset Y >= 0.04 to prevent Z-fighting)
    // =========================================================================
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.82,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const mainRoadNS = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 42), roadMat);
    mainRoadNS.rotation.x = -Math.PI / 2;
    mainRoadNS.position.set(5, 0.05, 4);
    mainRoadNS.receiveShadow = true;
    scene.add(mainRoadNS);

    const mainRoadEW = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 46), roadMat);
    mainRoadEW.rotation.x = -Math.PI / 2;
    mainRoadEW.rotation.z = Math.PI / 2;
    mainRoadEW.position.set(0, 0.06, 0);
    mainRoadEW.receiveShadow = true;
    scene.add(mainRoadEW);

    // Bridge deck across river
    const bridgeGroup = new THREE.Group();
    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.4, 9.2),
      matConcrete
    );
    bridgeDeck.position.set(5, 0.25, -20.5);
    bridgeDeck.castShadow = true;
    bridgeDeck.receiveShadow = true;
    bridgeGroup.add(bridgeDeck);
    for (const side of [-2.1, 2.1]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.7, 9.2),
        matDarkSteel
      );
      rail.position.set(5 + side, 0.75, -20.5);
      bridgeGroup.add(rail);
    }
    scene.add(bridgeGroup);

    // Agricultural Terraced Crop Plots (West & Northeast)
    const fieldMat = new THREE.MeshStandardMaterial({
      map: fieldTex,
      roughness: 0.9,
      metalness: 0.0,
    });
    const plotSpecs = [
      { x: -16, z: -10, w: 12, d: 9 },
      { x: -16, z: 16, w: 11, d: 8 },
      { x: 22, z: -12, w: 10, d: 8 },
    ];
    plotSpecs.forEach((p, idx) => {
      const plotGroup = new THREE.Group();
      const baseBed = new THREE.Mesh(
        new THREE.BoxGeometry(p.w, 0.22, p.d),
        fieldMat
      );
      baseBed.position.y = 0.11;
      baseBed.receiveShadow = true;
      plotGroup.add(baseBed);

      // Low irrigation bund border
      const bund = new THREE.Mesh(
        new THREE.BoxGeometry(p.w + 0.4, 0.12, p.d + 0.4),
        new THREE.MeshStandardMaterial({ color: 0x3b4d3f, roughness: 0.95 })
      );
      bund.position.y = 0.06;
      plotGroup.add(bund);

      plotGroup.position.set(p.x, groundHeightAt(p.x, p.z), p.z);
      if (idx === 0) {
        plotGroup.traverse((c) => {
          c.userData.hotspotId = 'agri_terraces';
        });
      }
      scene.add(plotGroup);
    });

    // =========================================================================
    // 3. COMPOSITE 3-12 PART HERO STRUCTURES (THREE.Group, bottom-center grounded)
    // =========================================================================
    const clickableObjects: THREE.Object3D[] = [riverMesh];

    // A) Central Overhead Water Tower (9 parts)
    const buildWaterTower = (x: number, z: number, hotspotId?: string) => {
      const g = new THREE.Group();
      // Plinth pad
      const plinth = new THREE.Mesh(
        new THREE.CylinderGeometry(3.4, 3.8, 0.5, 16),
        matConcrete
      );
      plinth.position.y = 0.25;
      plinth.receiveShadow = true;
      g.add(plinth);

      // 4 structural concrete columns
      const colGeo = new THREE.CylinderGeometry(0.28, 0.34, 6.2, 10);
      for (const [cx, cz] of [
        [1.7, 1.7],
        [-1.7, 1.7],
        [1.7, -1.7],
        [-1.7, -1.7],
      ]) {
        const col = new THREE.Mesh(colGeo, matConcrete);
        col.position.set(cx, 3.4, cz);
        col.castShadow = true;
        g.add(col);
      }

      // Mid cross-brace ring
      const brace = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.14, 8, 24),
        matConcrete
      );
      brace.rotation.x = Math.PI / 2;
      brace.position.y = 3.5;
      g.add(brace);

      // Central vertical riser pipe
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 6.6, 12),
        matDarkSteel
      );
      pipe.position.y = 3.5;
      g.add(pipe);

      // Main reservoir drum
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(3.1, 2.75, 3.6, 20),
        matConcrete
      );
      tank.position.y = 8.1;
      tank.castShadow = true;
      g.add(tank);

      // Telemetry glowing band
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(3.05, 0.1, 8, 32),
        matCyanBeacon
      );
      band.rotation.x = Math.PI / 2;
      band.position.y = 8.4;
      g.add(band);

      // Conical roof dome
      const dome = new THREE.Mesh(
        new THREE.ConeGeometry(3.25, 1.3, 20),
        matSlateRoof
      );
      dome.position.y = 10.55;
      dome.castShadow = true;
      g.add(dome);

      g.position.set(x, groundHeightAt(x, z), z);
      if (hotspotId) {
        g.traverse((c) => {
          c.userData.hotspotId = hotspotId;
        });
        clickableObjects.push(g);
      }
      return g;
    };
    scene.add(buildWaterTower(0, -4, 'water_tower'));

    // B) 250 kW Community Solar Microgrid (multi-row racks + substation kiosk)
    const buildSolarFarm = (x: number, z: number, hotspotId?: string) => {
      const g = new THREE.Group();
      const gravel = new THREE.Mesh(
        new THREE.BoxGeometry(11.5, 0.14, 8.8),
        new THREE.MeshStandardMaterial({ color: 0x263244, roughness: 0.94 })
      );
      gravel.position.y = 0.07;
      gravel.receiveShadow = true;
      g.add(gravel);

      // 3 rows of tilted solar arrays with steel supports
      for (let r = -1; r <= 1; r++) {
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(7.2, 0.1, 1.85),
          matSolarPanel
        );
        panel.position.set(-1.1, 1.15, r * 2.55);
        panel.rotation.x = 0.42;
        panel.castShadow = true;
        g.add(panel);

        for (const px of [-3.8, -1.1, 1.6]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 1.15, 6),
            matDarkSteel
          );
          leg.position.set(px, 0.58, r * 2.55);
          g.add(leg);
        }
      }

      // Inverter / BESS Battery Container
      const bess = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 1.7, 3.8),
        matConcrete
      );
      bess.position.set(4.1, 0.92, 0);
      bess.castShadow = true;
      g.add(bess);

      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(2.18, 0.14, 3.84),
        matEmeraldBeacon
      );
      strip.position.set(4.1, 1.65, 0);
      g.add(strip);

      g.position.set(x, groundHeightAt(x, z), z);
      if (hotspotId) {
        g.traverse((c) => {
          c.userData.hotspotId = hotspotId;
        });
        clickableObjects.push(g);
      }
      return g;
    };
    scene.add(buildSolarFarm(-16, 6, 'solar_microgrid'));

    // C) Primary Health Center (Composite 8-part medical building)
    const buildHealthCenter = (x: number, z: number, hotspotId?: string) => {
      const g = new THREE.Group();
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(9.2, 0.25, 6.8),
        matConcrete
      );
      pad.position.y = 0.125;
      pad.receiveShadow = true;
      g.add(pad);

      const mainHall = new THREE.Mesh(
        new THREE.BoxGeometry(8.0, 3.1, 5.2),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.78 })
      );
      mainHall.position.y = 1.8;
      mainHall.castShadow = true;
      g.add(mainHall);

      const roofSlab = new THREE.Mesh(
        new THREE.BoxGeometry(8.5, 0.35, 5.7),
        matSlateRoof
      );
      roofSlab.position.y = 3.5;
      roofSlab.castShadow = true;
      g.add(roofSlab);

      // Entrance canopy
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.18, 1.4),
        matDarkSteel
      );
      canopy.position.set(0, 2.35, 3.1);
      g.add(canopy);

      // Medical Cross Sign
      const crossV = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 1.0, 0.14),
        matMedicalRed
      );
      crossV.position.set(0, 3.9, 2.86);
      g.add(crossV);
      const crossH = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.32, 0.14),
        matMedicalRed
      );
      crossH.position.set(0, 3.9, 2.86);
      g.add(crossH);

      // Warm lit windows
      for (const wx of [-2.4, 2.4]) {
        const win = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 1.0, 0.1),
          matWindowGlow
        );
        win.position.set(wx, 1.9, 2.62);
        g.add(win);
      }

      // Rooftop solar panel
      const roofSolar = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.1, 1.8),
        matSolarPanel
      );
      roofSolar.position.set(0, 3.95, -0.5);
      roofSolar.rotation.x = 0.25;
      g.add(roofSolar);

      g.position.set(x, groundHeightAt(x, z), z);
      if (hotspotId) {
        g.traverse((c) => {
          c.userData.hotspotId = hotspotId;
        });
        clickableObjects.push(g);
      }
      return g;
    };
    scene.add(buildHealthCenter(13, 6, 'health_center'));

    // D) Model High School (L-shaped wing + pitched roof + courtyard)
    const schoolGroup = new THREE.Group();
    const sPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(10.2, 0.24, 7.6),
      matConcrete
    );
    sPlinth.position.y = 0.12;
    sPlinth.receiveShadow = true;
    schoolGroup.add(sPlinth);

    const wingMain = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 2.9, 3.2),
      matPlaster
    );
    wingMain.position.set(0, 1.65, -1.6);
    wingMain.castShadow = true;
    schoolGroup.add(wingMain);

    const wingSide = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.9, 4.0),
      matPlaster
    );
    wingSide.position.set(-2.9, 1.65, 1.6);
    wingSide.castShadow = true;
    schoolGroup.add(wingSide);

    const sRoofMain = new THREE.Mesh(
      new THREE.ConeGeometry(6.6, 1.6, 4),
      matTerracotta
    );
    sRoofMain.rotation.y = Math.PI / 4;
    sRoofMain.scale.set(1.05, 1, 0.45);
    sRoofMain.position.set(0, 3.9, -1.6);
    sRoofMain.castShadow = true;
    schoolGroup.add(sRoofMain);

    for (const wx of [-2.8, 0, 2.8]) {
      const win = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.9, 0.1),
        matWindowGlow
      );
      win.position.set(wx, 1.75, 0.02);
      schoolGroup.add(win);
    }

    schoolGroup.position.set(13, groundHeightAt(13, -10), -10);
    schoolGroup.traverse((c) => {
      c.userData.hotspotId = 'village_school';
    });
    scene.add(schoolGroup);
    clickableObjects.push(schoolGroup);

    // E) 16 Multi-part Village Homes along residential streets
    const buildHouse = (
      x: number,
      z: number,
      rotY: number,
      hasSolar: boolean,
      scale = 1
    ) => {
      const g = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.2, 3.0),
        matConcrete
      );
      base.position.y = 0.1;
      g.add(base);

      const walls = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 2.0, 2.6),
        matPlaster
      );
      walls.position.y = 1.2;
      walls.castShadow = true;
      walls.receiveShadow = true;
      g.add(walls);

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.45, 1.25, 4),
        hasSolar ? matSlateRoof : matTerracotta
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 2.82;
      roof.castShadow = true;
      g.add(roof);

      const win = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.65, 0.08),
        matWindowGlow
      );
      win.position.set(0.6, 1.3, 1.32);
      g.add(win);

      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1.25, 0.08),
        matDarkSteel
      );
      door.position.set(-0.55, 0.82, 1.32);
      g.add(door);

      if (hasSolar) {
        const sp = new THREE.Mesh(
          new THREE.BoxGeometry(1.3, 0.07, 0.85),
          matSolarPanel
        );
        sp.position.set(0, 2.95, 0.62);
        sp.rotation.x = 0.55;
        g.add(sp);
      }

      g.scale.setScalar(scale);
      g.rotation.y = rotY;
      g.position.set(x, groundHeightAt(x, z), z);
      return g;
    };

    const houseCoords: [number, number, number, boolean, number][] = [
      [-6.5, 5.5, 0, true, 1.0],
      [-1.5, 5.5, 0, true, 0.96],
      [-6.5, 11.2, Math.PI, false, 1.04],
      [-1.5, 11.2, Math.PI, true, 0.95],
      [-6.5, 16.5, 0, false, 1.0],
      [-1.5, 16.5, 0, true, 1.02],
      [11.5, 14.2, Math.PI / 2, true, 1.0],
      [16.5, 14.2, Math.PI / 2, false, 0.95],
      [11.5, 19.5, -Math.PI / 2, true, 1.05],
      [16.5, 19.5, -Math.PI / 2, true, 0.96],
      [-6.5, -6.8, Math.PI, true, 1.0],
      [-6.5, -12.2, 0, false, 0.94],
      [21.5, 4.5, -Math.PI / 2, true, 1.02],
      [21.5, 10.0, -Math.PI / 2, false, 0.98],
    ];
    houseCoords.forEach(([hx, hz, rot, solar, sc]) => {
      scene.add(buildHouse(hx, hz, rot, solar, sc));
    });

    // F) Streetlamp Posts along Main Corridors
    const lampGroup = new THREE.Group();
    const lampCoords: [number, number][] = [
      [2.5, 8],
      [2.5, 16],
      [7.5, -6],
      [7.5, -14],
      [-8, -2.5],
      [-18, -2.5],
      [16, 2.5],
    ];
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 3.6, 6);
    const bulbGeo = new THREE.SphereGeometry(0.18, 8, 8);
    lampCoords.forEach(([lx, lz]) => {
      const y = groundHeightAt(lx, lz);
      const pole = new THREE.Mesh(poleGeo, matDarkSteel);
      pole.position.set(lx, y + 1.8, lz);
      lampGroup.add(pole);
      const bulb = new THREE.Mesh(bulbGeo, matLampGlow);
      bulb.position.set(lx, y + 3.65, lz);
      lampGroup.add(bulb);
    });
    scene.add(lampGroup);

    // =========================================================================
    // 4. INSTANCED TREES (Natural Perimeter Groves + Village Canopy)
    // =========================================================================
    const treePositions: { x: number; z: number; s: number }[] = [];
    // Deterministic pseudo-random distribution avoiding roads, buildings & river
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 110; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 23 + rand() * 34;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;
      const riverCenterZ = -21 + Math.sin(tx * 0.08) * 3.0;
      if (Math.abs(tz - riverCenterZ) < 5.5) continue;
      if (Math.abs(tx - 5) < 4 && tz > -20 && tz < 25) continue;
      if (Math.abs(tz) < 3.5 && Math.abs(tx) < 24) continue;
      treePositions.push({ x: tx, z: tz, s: 0.85 + rand() * 0.4 });
    }

    const trunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 1.8, 6);
    trunkGeo.translate(0, 0.9, 0);
    const canopyGeo = new THREE.ConeGeometry(1.45, 3.1, 7);
    canopyGeo.translate(0, 2.8, 0);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4b382a,
      roughness: 0.95,
    });
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.82,
    });

    const trunksInst = new THREE.InstancedMesh(
      trunkGeo,
      trunkMat,
      treePositions.length
    );
    const canopiesInst = new THREE.InstancedMesh(
      canopyGeo,
      canopyMat,
      treePositions.length
    );
    canopiesInst.castShadow = !isSoftwareGl;

    const dummy = new THREE.Object3D();
    const tint = new THREE.Color();
    const foliagePalette = [0x1c5938, 0x226b42, 0x184b31, 0x2c7849];

    treePositions.forEach((tp, idx) => {
      const y = groundHeightAt(tp.x, tp.z);
      dummy.position.set(tp.x, y, tp.z);
      dummy.rotation.y = rand() * Math.PI * 2;
      dummy.scale.setScalar(tp.s);
      dummy.updateMatrix();
      trunksInst.setMatrixAt(idx, dummy.matrix);
      canopiesInst.setMatrixAt(idx, dummy.matrix);
      tint.setHex(foliagePalette[idx % foliagePalette.length]);
      canopiesInst.setColorAt(idx, tint);
    });
    trunksInst.instanceMatrix.needsUpdate = true;
    canopiesInst.instanceMatrix.needsUpdate = true;
    if (canopiesInst.instanceColor) canopiesInst.instanceColor.needsUpdate = true;
    trunksInst.computeBoundingSphere();
    canopiesInst.computeBoundingSphere();
    scene.add(trunksInst);
    scene.add(canopiesInst);

    // =========================================================================
    // 5. DATA LAYER OVERLAYS & SIMULATED WHAT-IF 3D ASSETS
    // =========================================================================
    // Water Network glowing pipes
    const waterOverlayGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.4,
      roughness: 0.2,
    });
    const pipeLines: [THREE.Vector3, THREE.Vector3][] = [
      [new THREE.Vector3(0, 0.35, -4), new THREE.Vector3(0, 0.35, 16)],
      [new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(21, 0.35, 0)],
      [new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(-18, 0.35, 0)],
      [new THREE.Vector3(13, 0.35, 0), new THREE.Vector3(13, 0.35, 6)],
      [new THREE.Vector3(13, 0.35, 0), new THREE.Vector3(13, 0.35, -10)],
    ];
    pipeLines.forEach(([a, b]) => {
      const curve = new THREE.LineCurve3(a, b);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 8, 0.22, 8, false),
        pipeMat
      );
      waterOverlayGroup.add(tube);
    });
    waterOverlayGroup.visible = false;
    scene.add(waterOverlayGroup);

    // Solar Grid glowing conduits
    const solarOverlayGroup = new THREE.Group();
    const powerMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.4,
      roughness: 0.2,
    });
    const gridLines: [THREE.Vector3, THREE.Vector3][] = [
      [new THREE.Vector3(-16, 1.2, 6), new THREE.Vector3(-6, 1.2, 6)],
      [new THREE.Vector3(-6, 1.2, 6), new THREE.Vector3(5, 1.2, 6)],
      [new THREE.Vector3(5, 1.2, 6), new THREE.Vector3(13, 1.2, 6)],
      [new THREE.Vector3(5, 1.2, 6), new THREE.Vector3(5, 1.2, -10)],
      [new THREE.Vector3(5, 1.2, -10), new THREE.Vector3(13, 1.2, -10)],
    ];
    gridLines.forEach(([a, b]) => {
      const curve = new THREE.LineCurve3(a, b);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 8, 0.18, 8, false),
        powerMat
      );
      solarOverlayGroup.add(tube);
    });
    solarOverlayGroup.visible = false;
    scene.add(solarOverlayGroup);

    // Flood Risk Overlay Plane along Riverbend
    const floodPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(76, 18),
      new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.42,
        roughness: 0.25,
        depthWrite: false,
      })
    );
    floodPlane.rotation.x = -Math.PI / 2;
    floodPlane.position.set(0, 0.18, -20);
    floodPlane.visible = false;
    scene.add(floodPlane);

    // Simulated What-If Proposed Infrastructure (Dynamic visibility from Simulator)
    const simWaterTower = buildWaterTower(-22, -2);
    const simSolarPlant = buildSolarFarm(-22, 16);
    const simClinic = buildHealthCenter(24, 16);
    scene.add(simWaterTower);
    scene.add(simSolarPlant);
    scene.add(simClinic);

    // =========================================================================
    // VISUAL STATE APPLICATION & RENDER LOOP
    // =========================================================================
    let frameId = 0;
    let disposed = false;

    const applyVisualState = () => {
      const { layerMode: lm, timeOfDay: tod, showSimulatedAssets: showSim, simParams: sp } =
        stateRef.current;

      // Time of day lighting & horizon fog
      if (tod === 'day') {
        scene.background = new THREE.Color(0x1e3a5f);
        scene.fog = new THREE.FogExp2(0x1e3a5f, 0.0072);
        sunLight.color.setHex(0xfff1d6);
        sunLight.intensity = 2.3;
        sunLight.position.set(36, 52, 26);
        hemiLight.intensity = 1.05;
        matWindowGlow.emissiveIntensity = 0.15;
        matLampGlow.emissiveIntensity = 0.2;
      } else if (tod === 'dusk') {
        scene.background = new THREE.Color(0x09162b);
        scene.fog = new THREE.FogExp2(0x09162b, 0.0085);
        sunLight.color.setHex(0xffc996);
        sunLight.intensity = 1.65;
        sunLight.position.set(40, 26, 20);
        hemiLight.intensity = 0.72;
        matWindowGlow.emissiveIntensity = 1.0;
        matLampGlow.emissiveIntensity = 1.5;
      } else {
        scene.background = new THREE.Color(0x040914);
        scene.fog = new THREE.FogExp2(0x040914, 0.01);
        sunLight.color.setHex(0x6495ed);
        sunLight.intensity = 0.65;
        sunLight.position.set(-28, 38, 22);
        hemiLight.intensity = 0.4;
        matWindowGlow.emissiveIntensity = 1.65;
        matLampGlow.emissiveIntensity = 2.2;
      }

      // Data Layers
      waterOverlayGroup.visible = lm === 'water';
      solarOverlayGroup.visible = lm === 'solar';
      floodPlane.visible = lm === 'flood';

      // Simulated What-If structures
      simWaterTower.visible = showSim && sp.waterTanks > 0;
      simSolarPlant.visible = showSim && sp.solarPlants > 0;
      simClinic.visible = showSim && sp.hospitals > 0;
    };

    const triggerCameraPreset = (key: CameraPresetKey) => {
      const preset = CAMERA_PRESETS[key];
      stateRef.current.cameraTransition = {
        pos: new THREE.Vector3(...preset.pos),
        target: new THREE.Vector3(...preset.target),
      };
    };

    sceneCallbacksRef.current = { applyVisualState, triggerCameraPreset };
    applyVisualState();

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Click Raycasting for Interactive Building Inspection
    const raycaster = new THREE.Raycaster();
    let pointerDownX = 0;
    let pointerDownY = 0;

    const onPointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      if (dist > 6) return; // Ignore orbit drags
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(_mouse, camera);
      const hits = raycaster.intersectObjects(clickableObjects, true);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.hotspotId as string | undefined;
        if (hitId) {
          const found = HOTSPOTS.find((h) => h.id === hitId);
          if (found) setSelectedHotspot(found);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Paced Animation Loop (afterDraw fence sync on Software WebGL, rAF on GPU)
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(0.1, clock.getDelta());

      // Smooth damped camera preset glide
      const transition = stateRef.current.cameraTransition;
      if (transition) {
        _camTargetPos.copy(transition.pos);
        _camTargetLook.copy(transition.target);
        const lambda = 5.5;
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          _camTargetPos.x,
          lambda,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          _camTargetPos.y,
          lambda,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          _camTargetPos.z,
          lambda,
          delta
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          _camTargetLook.x,
          lambda,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          _camTargetLook.y,
          lambda,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          _camTargetLook.z,
          lambda,
          delta
        );
        if (
          camera.position.distanceTo(_camTargetPos) < 0.15 &&
          controls.target.distanceTo(_camTargetLook) < 0.15
        ) {
          stateRef.current.cameraTransition = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        handleContextLost
      );
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );
      controls.dispose();
      envTex.dispose();
      solarTex.dispose();
      roadTex.dispose();
      fieldTex.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });
      renderer.dispose();
      sceneCallbacksRef.current = null;
    };
  }, []);

  const handlePresetClick = (key: CameraPresetKey) => {
    setActivePreset(key);
    sceneCallbacksRef.current?.triggerCameraPreset(key);
    const mapPresetToHotspot: Partial<Record<CameraPresetKey, string>> = {
      water: 'water_tower',
      solar: 'solar_microgrid',
      health: 'health_center',
      river: 'river_basin',
    };
    const hsId = mapPresetToHotspot[key];
    if (hsId) {
      const hs = HOTSPOTS.find((h) => h.id === hsId);
      if (hs) setSelectedHotspot(hs);
    }
  };

  return (
    <div className="relative flex-1 w-full min-h-[calc(100vh-4rem)] bg-[#060D1A] overflow-hidden select-none">
      {/* Dedicated Isolated WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
        aria-label="Interactive Three.js 3D Village Digital Twin"
      />

      {webglError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#060D1A] p-8 text-center">
          <h2 className="font-display text-lg font-semibold text-[#F4F8FF]">
            3D WebGL Context Unavailable
          </h2>
          <p className="mt-2 text-sm text-[#94AAC9] max-w-md">
            Your browser environment could not initialize hardware or software WebGL. Try reloading or viewing the 2D Interactive GIS Map instead.
          </p>
        </div>
      )}

      {/* Minimal Top-Left Scene Title & Click-Inspected Asset Card (Solid rgba, NO backdrop-filter over WebGL) */}
      <div className="absolute top-4 left-4 z-10 max-w-xs sm:max-w-sm pointer-events-auto">
        <div className="rounded-xl bg-[#081326]/95 border border-[#1E3354] px-4 py-3">
          <div className="text-[11px] text-cyan-400 font-medium">
            3D Village Digital Twin · {village.name}
          </div>
          <div className="text-xs text-[#9BB0CE] mt-0.5">
            Drag to orbit · Scroll to zoom · Click any facility to inspect
          </div>
        </div>

        {selectedHotspot && (
          <div className="mt-2.5 rounded-xl bg-[#081326]/95 border border-[#1E3354] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] text-[#8BA3C7]">
                  {selectedHotspot.category} · {selectedHotspot.ward}
                </div>
                <h2 className="mt-0.5 font-display text-sm font-semibold text-[#F4F8FF]">
                  {selectedHotspot.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1 text-[#7E96B8] hover:text-white rounded"
                aria-label="Close inspector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-[#A5B8D4] leading-relaxed">
              {selectedHotspot.description}
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#172844] grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-[#7890B2]">
                  {selectedHotspot.metricA.label}
                </div>
                <div className="font-mono text-xs font-semibold text-cyan-300 tabular-nums">
                  {selectedHotspot.metricA.value}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#7890B2]">
                  {selectedHotspot.metricB.label}
                </div>
                <div className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                  {selectedHotspot.metricB.value}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Mid-Side Occlusion, Zero backdrop-filter) */}
      <div className="fixed lg:absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[min(940px,94%)] flex flex-col items-center pointer-events-none">
        <button
          onClick={() => setDockCollapsed((v) => !v)}
          className="pointer-events-auto mb-1.5 px-3.5 py-1 rounded-md bg-[#081326]/95 border border-[#1E3354] text-[11px] font-medium text-[#C5D4E8] hover:text-white inline-flex items-center gap-1.5"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Twin Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="pointer-events-auto w-full rounded-xl bg-[#081326]/95 border border-[#1E3354] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Camera Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Camera className="w-3.5 h-3.5 text-[#7890B2] mr-1 hidden sm:block" />
              {(Object.keys(CAMERA_PRESETS) as CameraPresetKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handlePresetClick(key)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activePreset === key
                      ? 'bg-cyan-400 text-[#04101E] font-semibold'
                      : 'bg-[#101F38] text-[#9BB0CE] hover:text-white'
                  }`}
                >
                  {CAMERA_PRESETS[key].label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-[#1B2E4B] hidden md:block" />

            {/* Spatial Data Layers */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Layers className="w-3.5 h-3.5 text-[#7890B2] mr-1 hidden sm:block" />
              {(
                [
                  { id: 'standard', label: 'Standard' },
                  { id: 'water', label: 'Water Pipes' },
                  { id: 'solar', label: 'Solar Grid' },
                  { id: 'flood', label: 'Flood Zone' },
                ] as { id: TwinLayerMode; label: string }[]
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setLayerMode(mode.id)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    layerMode === mode.id
                      ? 'bg-emerald-500 text-[#041410] font-semibold'
                      : 'bg-[#101F38] text-[#9BB0CE] hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-[#1B2E4B] hidden md:block" />

            {/* Lighting & What-If Toggle */}
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'day', icon: Sun, label: 'Day' },
                  { id: 'dusk', icon: Sunset, label: 'Dusk' },
                  { id: 'night', icon: Moon, label: 'Night' },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTimeOfDay(t.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      timeOfDay === t.id
                        ? 'bg-[#1B3358] text-cyan-300 border border-cyan-400/40'
                        : 'bg-[#101F38] text-[#8BA3C7] hover:text-white border border-transparent'
                    }`}
                    title={`${t.label} lighting`}
                    aria-label={`${t.label} lighting`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}

              <button
                onClick={() => setShowSimulatedAssets((v) => !v)}
                className={`ml-1 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                  showSimulatedAssets
                    ? 'bg-[#122645] border-cyan-400/50 text-cyan-300'
                    : 'bg-[#101F38] border-transparent text-[#8BA3C7]'
                }`}
              >
                What-If: {showSimulatedAssets ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
