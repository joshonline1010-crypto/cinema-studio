/**
 * 3D Camera Control using Three.js
 * Ported from Multi-Angle Studio
 * Matches Hugging Face Qwen implementation
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildQwenPromptContinuous } from './promptVocabulary';

interface Camera3DControlProps {
  azimuth: number;
  setAzimuth: (value: number) => void;
  elevation: number;
  setElevation: (value: number) => void;
  distance: number;
  setDistance: (value: number) => void;
  subjectImage?: string | null;
}

interface SceneRefs {
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  animation: number | null;
  handles: {
    azimuthHandle?: THREE.Mesh;
    elevationHandle?: THREE.Mesh;
    distanceHandle?: THREE.Mesh;
    distanceLine?: THREE.Line;
    cameraGroup?: THREE.Group;
    elevationArc?: THREE.Mesh;
    cardGroup?: THREE.Group;
  };
  plane: {
    cardGroup?: THREE.Group;
    smileyPlane?: THREE.Mesh;
    smileyMat?: THREE.MeshBasicMaterial;
  };
  state: { azimuth: number; elevation: number; distance: number };
}

// Constants matching HF implementation
const BASE_DISTANCE = 1.6;
const AZIMUTH_RADIUS = 2.4;
const ELEVATION_RADIUS = 1.8;
const CENTER = new THREE.Vector3(0, 0.75, 0);

export default function Camera3DControl({
  azimuth,
  setAzimuth,
  elevation,
  setElevation,
  distance,
  setDistance,
  subjectImage
}: Camera3DControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<SceneRefs>({
    scene: null,
    renderer: null,
    camera: null,
    animation: null,
    handles: {},
    plane: {},
    state: { azimuth, elevation, distance }
  });

  // Update state ref when props change
  useEffect(() => {
    refs.current.state = { azimuth, elevation, distance };
  }, [azimuth, elevation, distance]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const wrapper = containerRef.current;
    const width = wrapper.clientWidth;
    const height = 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    refs.current.scene = scene;

    // Camera - positioned to view from front-right-above
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0.5, 0);
    refs.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    wrapper.appendChild(renderer.domElement);
    refs.current.renderer = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Grid floor (subtle)
    const gridHelper = new THREE.GridHelper(8, 16, 0x2a2a3e, 0x2a2a3e);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // ========== SUBJECT CARD (UPRIGHT like HF) ==========
    const cardGroup = new THREE.Group();

    // Card background (dark gray)
    const cardGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x3a3a4a,
      side: THREE.DoubleSide
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    cardGroup.add(card);

    // Smiley face on card (will be replaced by uploaded image)
    const smileyCanvas = document.createElement('canvas');
    smileyCanvas.width = 256;
    smileyCanvas.height = 256;
    const ctx = smileyCanvas.getContext('2d');

    if (ctx) {
      // Draw smiley
      ctx.fillStyle = '#3a3a4a';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#f5a623';
      ctx.beginPath();
      ctx.arc(128, 128, 80, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.arc(100, 110, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(156, 110, 12, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(128, 130, 45, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    const smileyTexture = new THREE.CanvasTexture(smileyCanvas);
    const smileyMat = new THREE.MeshBasicMaterial({
      map: smileyTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const smileyPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), smileyMat);
    smileyPlane.position.z = 0.01;
    cardGroup.add(smileyPlane);

    // Position card UPRIGHT at center
    cardGroup.position.set(0, 0.75, 0);
    scene.add(cardGroup);
    refs.current.plane = { cardGroup, smileyPlane, smileyMat };

    // ========== AZIMUTH RING (GREEN on ground) ==========
    const azimuthRingGeo = new THREE.TorusGeometry(AZIMUTH_RADIUS, 0.05, 16, 64);
    const azimuthRingMat = new THREE.MeshStandardMaterial({
      color: 0x00ff99,
      emissive: 0x00ff99,
      emissiveIntensity: 0.4
    });
    const azimuthRing = new THREE.Mesh(azimuthRingGeo, azimuthRingMat);
    azimuthRing.rotation.x = Math.PI / 2;
    azimuthRing.position.y = 0.02;
    scene.add(azimuthRing);

    // ========== AZIMUTH HANDLE (GREEN sphere on ring) ==========
    const azimuthHandleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const azimuthHandleMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      emissive: 0x00ffcc,
      emissiveIntensity: 0.5
    });
    const azimuthHandle = new THREE.Mesh(azimuthHandleGeo, azimuthHandleMat);
    (azimuthHandle as any).userData = { type: 'azimuth' };
    scene.add(azimuthHandle);

    // ========== ELEVATION ARC (PINK vertical arc) ==========
    const createElevationArc = () => {
      const arcPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 32; i++) {
        const angle = THREE.MathUtils.degToRad(-30 + (90 * i / 32));
        arcPoints.push(new THREE.Vector3(
          -0.5,
          ELEVATION_RADIUS * Math.sin(angle) + CENTER.y,
          ELEVATION_RADIUS * Math.cos(angle)
        ));
      }
      const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
      return new THREE.TubeGeometry(arcCurve, 32, 0.05, 8, false);
    };

    const elevationArcGeo = createElevationArc();
    const elevationArcMat = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      emissive: 0xff69b4,
      emissiveIntensity: 0.4
    });
    const elevationArc = new THREE.Mesh(elevationArcGeo, elevationArcMat);
    scene.add(elevationArc);

    // ========== ELEVATION HANDLE (PINK sphere on arc) ==========
    const elevationHandleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const elevationHandleMat = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      emissive: 0xff69b4,
      emissiveIntensity: 0.5
    });
    const elevationHandle = new THREE.Mesh(elevationHandleGeo, elevationHandleMat);
    (elevationHandle as any).userData = { type: 'elevation' };
    scene.add(elevationHandle);

    // ========== DISTANCE LINE (ORANGE from subject to camera) ==========
    const distanceLineGeo = new THREE.BufferGeometry();
    const distanceLineMat = new THREE.LineBasicMaterial({
      color: 0xffa500
    });
    const distanceLine = new THREE.Line(distanceLineGeo, distanceLineMat);
    scene.add(distanceLine);

    // ========== DISTANCE HANDLE (YELLOW/ORANGE sphere) ==========
    const distanceHandleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const distanceHandleMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffcc00,
      emissiveIntensity: 0.5
    });
    const distanceHandle = new THREE.Mesh(distanceHandleGeo, distanceHandleMat);
    (distanceHandle as any).userData = { type: 'distance' };
    scene.add(distanceHandle);

    // ========== CAMERA MODEL (Dark gray box + lens) ==========
    const cameraGroup = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(0.4, 0.25, 0.25);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a5568 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    cameraGroup.add(body);

    const lensGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.18, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x2d3748 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.z = Math.PI / 2;
    lens.position.x = -0.28;
    cameraGroup.add(lens);

    scene.add(cameraGroup);

    // Store references
    refs.current.handles = {
      azimuthHandle,
      elevationHandle,
      distanceHandle,
      distanceLine,
      cameraGroup,
      elevationArc,
      cardGroup
    };

    // ========== UPDATE POSITIONS ==========
    const updatePositions = () => {
      const { azimuth: az, elevation: el, distance: dist } = refs.current.state;
      const actualDistance = BASE_DISTANCE * dist;

      const azRad = THREE.MathUtils.degToRad(az);
      const elRad = THREE.MathUtils.degToRad(el);

      // Camera position (orbiting around subject)
      const camX = actualDistance * Math.sin(azRad) * Math.cos(elRad);
      const camY = actualDistance * Math.sin(elRad) + CENTER.y;
      const camZ = actualDistance * Math.cos(azRad) * Math.cos(elRad);

      // Position and orient camera model
      cameraGroup.position.set(camX, camY, camZ);
      cameraGroup.lookAt(CENTER);

      // Azimuth handle (on the ring, at ground level)
      azimuthHandle.position.set(
        AZIMUTH_RADIUS * Math.sin(azRad),
        0.02,
        AZIMUTH_RADIUS * Math.cos(azRad)
      );

      // Elevation handle (on the pink arc)
      elevationHandle.position.set(
        -0.5,
        ELEVATION_RADIUS * Math.sin(elRad) + CENTER.y,
        ELEVATION_RADIUS * Math.cos(elRad)
      );

      // Distance handle (between subject and camera, closer to camera)
      const distHandleT = 0.7;
      distanceHandle.position.set(
        CENTER.x + (camX - CENTER.x) * distHandleT,
        CENTER.y + (camY - CENTER.y) * distHandleT,
        CENTER.z + (camZ - CENTER.z) * distHandleT
      );

      // Distance line (from subject center to camera)
      const linePoints = new Float32Array([
        CENTER.x, CENTER.y, CENTER.z,
        camX, camY, camZ
      ]);
      distanceLineGeo.setAttribute('position', new THREE.BufferAttribute(linePoints, 3));
    };

    // Initial update
    updatePositions();

    // ========== ANIMATION LOOP ==========
    const animate = () => {
      refs.current.animation = requestAnimationFrame(animate);
      updatePositions();
      renderer.render(scene, camera);
    };
    animate();

    // ========== MOUSE INTERACTION ==========
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let dragTarget: THREE.Mesh | null = null;

    const getMousePos = (e: MouseEvent | Touch) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseDown = (e: MouseEvent) => {
      getMousePos(e);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([azimuthHandle, elevationHandle, distanceHandle]);

      if (intersects.length > 0) {
        isDragging = true;
        dragTarget = intersects[0].object as THREE.Mesh;
        (dragTarget.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
        dragTarget.scale.setScalar(1.3);
        renderer.domElement.style.cursor = 'grabbing';
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      getMousePos(e);

      if (!isDragging) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([azimuthHandle, elevationHandle, distanceHandle]);
        renderer.domElement.style.cursor = intersects.length > 0 ? 'grab' : 'default';
        return;
      }

      if (dragTarget) {
        raycaster.setFromCamera(mouse, camera);
        const intersection = new THREE.Vector3();

        const userData = (dragTarget as any).userData;

        if (userData.type === 'azimuth') {
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          raycaster.ray.intersectPlane(plane, intersection);
          if (intersection) {
            let newAz = THREE.MathUtils.radToDeg(Math.atan2(intersection.x, intersection.z));
            if (newAz < 0) newAz += 360;
            setAzimuth(Math.round(newAz));
          }
        } else if (userData.type === 'elevation') {
          const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.5);
          raycaster.ray.intersectPlane(plane, intersection);
          if (intersection) {
            const relY = intersection.y - CENTER.y;
            const relZ = intersection.z;
            let newEl = THREE.MathUtils.radToDeg(Math.atan2(relY, relZ));
            newEl = Math.max(-30, Math.min(60, newEl));
            setElevation(Math.round(newEl));
          }
        } else if (userData.type === 'distance') {
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -CENTER.y);
          raycaster.ray.intersectPlane(plane, intersection);
          if (intersection) {
            const dist = intersection.distanceTo(new THREE.Vector3(CENTER.x, CENTER.y, CENTER.z)) / BASE_DISTANCE;
            const newDist = Math.max(0.6, Math.min(1.8, dist));
            setDistance(Math.round(newDist * 10) / 10);
          }
        }
      }
    };

    const onMouseUp = () => {
      if (dragTarget) {
        (dragTarget.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        dragTarget.scale.setScalar(1.0);
      }
      isDragging = false;
      dragTarget = null;
      renderer.domElement.style.cursor = 'default';
    };

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      onMouseUp();
    };

    // Event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: false });

    // Handle resize
    const handleResize = () => {
      const newWidth = wrapper.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (refs.current.animation) {
        cancelAnimationFrame(refs.current.animation);
      }
      renderer.dispose();
      if (wrapper.contains(renderer.domElement)) {
        wrapper.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [setAzimuth, setElevation, setDistance]);

  // Update texture when image changes
  useEffect(() => {
    if (!subjectImage || !refs.current.plane.smileyPlane) return;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    loader.load(subjectImage, (texture) => {
      const { smileyPlane } = refs.current.plane;
      if (smileyPlane) {
        (smileyPlane.material as THREE.MeshBasicMaterial).map = texture;
        (smileyPlane.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
    });
  }, [subjectImage]);

  const qwenPrompt = buildQwenPromptContinuous(azimuth, elevation, distance);

  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎬</span>
        <h3 className="text-sm font-semibold text-white">3D Camera Control</h3>
      </div>

      <p className="text-xs text-zinc-400 mb-4">
        <em>Drag the handles:</em>
        <span className="inline-flex items-center gap-1 ml-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#00ffcc' }}></span> Azimuth
        </span>
        <span className="inline-flex items-center gap-1 ml-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff69b4' }}></span> Elevation
        </span>
        <span className="inline-flex items-center gap-1 ml-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#ffcc00' }}></span> Distance
        </span>
      </p>

      {/* Three.js Container */}
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden"
        style={{ height: 400, background: '#1a1a2e' }}
      />

      {/* Numeric Controls */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Azimuth</label>
          <input
            type="number"
            value={azimuth}
            onChange={(e) => setAzimuth(Number(e.target.value) % 360)}
            className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white"
            min={0}
            max={359}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Elevation</label>
          <input
            type="number"
            value={elevation}
            onChange={(e) => setElevation(Math.max(-30, Math.min(60, Number(e.target.value))))}
            className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white"
            min={-30}
            max={60}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Distance</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Math.max(0.6, Math.min(1.8, Number(e.target.value))))}
            className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white"
            min={0.6}
            max={1.8}
            step={0.1}
          />
        </div>
      </div>

      {/* Prompt Preview */}
      <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.15)' }}>
        <code className="text-green-400 font-mono text-sm">
          {qwenPrompt}
        </code>
      </div>
    </div>
  );
}
