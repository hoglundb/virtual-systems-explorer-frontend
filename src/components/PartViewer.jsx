import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, Environment, Bounds } from "@react-three/drei";
import * as THREE from "three";
import EditPartModal from "./EditPartModal";

const CYAN = "rgba(100, 210, 230, 0.8)";
const CYAN_DIM = "rgba(80, 200, 220, 0.25)";
const CYAN_BG = "rgba(80, 200, 220, 0.07)";
const TITLE_COLOR = "rgba(200, 230, 255, 0.95)";
const MUTED = "rgba(100, 210, 230, 0.5)";
const BG = "rgb(8, 15, 25)";

// Dither dissolve shader — samples the mesh's own map/color, discards via Bayer during reveal.
// uProgress 0 = fully hidden, 1 = fully visible.
// uCellSize controls pixel block size (bigger = chunkier dither).
// Once uProgress >= 1, dither is skipped entirely and the mesh renders normally.

const DITHER_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const DITHER_FRAG = /* glsl */`
  uniform float uProgress;   // 0..1 dissolve progress
  uniform float uCellSize;   // pixel block size (e.g. 6.0)
  uniform sampler2D uMap;    // diffuse texture
  uniform vec3 uBaseColor;   // fallback color when no texture
  uniform bool uHasMap;      // whether a texture is bound

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  // 4x4 ordered Bayer matrix, returns threshold 0..1 for cell (px, py)
  float bayer(int px, int py) {
    int idx = py * 4 + px;
    if (idx == 0)  return  0.0/16.0;
    if (idx == 1)  return  8.0/16.0;
    if (idx == 2)  return  2.0/16.0;
    if (idx == 3)  return 10.0/16.0;
    if (idx == 4)  return 12.0/16.0;
    if (idx == 5)  return  4.0/16.0;
    if (idx == 6)  return 14.0/16.0;
    if (idx == 7)  return  6.0/16.0;
    if (idx == 8)  return  3.0/16.0;
    if (idx == 9)  return 11.0/16.0;
    if (idx == 10) return  1.0/16.0;
    if (idx == 11) return  9.0/16.0;
    if (idx == 12) return 15.0/16.0;
    if (idx == 13) return  7.0/16.0;
    if (idx == 14) return 13.0/16.0;
    return 5.0/16.0;
  }

  void main() {
    // Dither discard — skip when fully revealed
    if (uProgress < 1.0) {
      int px = int(mod(gl_FragCoord.x / uCellSize, 4.0));
      int py = int(mod(gl_FragCoord.y / uCellSize, 4.0));
      if (uProgress < bayer(px, py)) discard;
    }

    // Sample surface color
    vec4 color = uHasMap ? texture2D(uMap, vUv) : vec4(uBaseColor, 1.0);

    // Simple diffuse shading so it doesn't look flat
    vec3 n = normalize(vNormal);
    vec3 l = normalize(vec3(1.0, 2.0, 1.5));
    float diff = max(dot(n, l), 0.0) * 0.6 + 0.4;
    gl_FragColor = vec4(color.rgb * diff, color.a);
  }
`;

// Creates a dither ShaderMaterial that mimics the look of the original mesh material
function makeDitherMaterial(origMaterial) {
  const map = origMaterial.map ?? null;
  const color = origMaterial.color ?? new THREE.Color(1, 1, 1);
  return new THREE.ShaderMaterial({
    vertexShader: DITHER_VERT,
    fragmentShader: DITHER_FRAG,
    uniforms: {
      uProgress:  { value: 0.0 },
      uCellSize:  { value: 6.0 },
      uMap:       { value: map },
      uBaseColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
      uHasMap:    { value: map !== null },
    },
    side: origMaterial.side ?? THREE.FrontSide,
  });
}

function GLBModel({ url, onLoaded }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const progress = useRef(0);

  // Clone so we never mutate the useGLTF cache
  const cloned = useRef(null);
  if (!cloned.current || cloned.current.userData._url !== url) {
    cloned.current = scene.clone(true);
    cloned.current.userData._url = url;
  }

  useEffect(() => {
    progress.current = 0;
    if (!groupRef.current) return;
    groupRef.current.traverse((obj) => {
      if (!obj.isMesh) return;
      const orig = obj.material;
      obj.userData._orig = orig;
      obj.material = makeDitherMaterial(Array.isArray(orig) ? orig[0] : orig);
    });
    // Model is mounted and ready — notify parent
    onLoaded?.();
  }, [url]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    progress.current = Math.min(1.0, progress.current + delta * 1.6);
    groupRef.current.traverse((obj) => {
      if (!obj.isMesh || !obj.material.uniforms) return;
      obj.material.uniforms.uProgress.value = progress.current;
      // Restore original material when dissolve completes
      if (progress.current >= 1.0 && obj.userData._orig) {
        obj.material = obj.userData._orig;
        delete obj.userData._orig;
      }
    });
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={cloned.current} />
      </group>
    </Center>
  );
}

function PlaceholderModel() {
  const meshRef = useRef();
  const edgesRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.85 + Math.sin(t * 1.4) * 0.15;
    if (meshRef.current) meshRef.current.material.opacity = pulse * 0.06;
    if (edgesRef.current) edgesRef.current.material.opacity = pulse * 0.55;
  });
  return (
    <group>
      {/* Faint filled box */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#40c8dc" transparent opacity={0.06} />
      </mesh>
      {/* Cyan wireframe edges */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="#40c8dc" transparent opacity={0.5} />
      </lineSegments>
      {/* Corner tick marks on each axis */}
      {[
        [[0.5,0,0],[-0.5,0,0]],
        [[0,0.5,0],[0,-0.5,0]],
        [[0,0,0.5],[0,0,-0.5]],
      ].map(([a, b], i) => (
        <line key={i}>
          <bufferGeometry setFromPoints={[new THREE.Vector3(...a), new THREE.Vector3(...b)]} />
          <lineBasicMaterial color="#40c8dc" transparent opacity={0.25} />
        </line>
      ))}
    </group>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "0.6rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.85rem", color: TITLE_COLOR, letterSpacing: "0.5px", lineHeight: "1.5" }}>
        {value ?? <span style={{ color: MUTED, fontStyle: "italic" }}>—</span>}
      </div>
    </div>
  );
}

const LOADING_STYLE = `
  @keyframes vse-scan {
    0%   { left: -40%; }
    100% { left: 140%; }
  }
`;

function PartViewer({ selectedPart, onPartUpdated }) {
  const [detail, setDetail] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedPart) { setDetail(null); return; }
    fetch(`/api/parts/${encodeURIComponent(selectedPart.id)}`)
      .then((res) => res.json())
      .then(setDetail)
      .catch(() => setDetail(null));
  }, [selectedPart]);

  // Must be before any early returns — Rules of Hooks
  useEffect(() => {
    if (selectedPart) setIsLoading(true);
  }, [selectedPart?.id]);

  const handleSaved = (updated) => {
    setDetail(updated);
    onPartUpdated(updated);
  };

  if (!selectedPart) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: BG, overflow: "hidden", position: "relative" }}>
        {/* Radial glow behind placeholder too */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(40, 100, 140, 0.2) 0%, rgba(8, 15, 25, 1) 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        <Canvas camera={{ fov: 50, position: [2, 1.5, 2.5] }} style={{ flex: 1, background: "transparent", position: "relative", zIndex: 1 }}>
          <ambientLight intensity={0.4} />
          <PlaceholderModel />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.2} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
        {/* Overlay text */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          paddingBottom: "36px", gap: "10px", zIndex: 2, pointerEvents: "none",
        }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "4px", color: MUTED, textTransform: "uppercase" }}>
            No part selected
          </div>
          <div style={{ width: "30px", height: "1px", background: CYAN_DIM }} />
          <div style={{ fontSize: "0.7rem", color: "rgba(200, 220, 240, 0.35)", letterSpacing: "2px", textTransform: "uppercase" }}>
            Select a part from the catalog
          </div>
        </div>
      </div>
    );
  }

  const glbUrl = `/assets/parts/${selectedPart.id}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: BG, overflow: "hidden" }}>
      <style>{LOADING_STYLE}</style>

      {/* 3D Viewer */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Radial glow background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(40, 100, 140, 0.35) 0%, rgba(8, 15, 25, 1) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <Canvas
          camera={{ fov: 50 }}
          style={{ background: "transparent", position: "relative", zIndex: 1 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2} interpolateFunc={() => 1}>
              <GLBModel url={glbUrl} onLoaded={() => setIsLoading(false)} />
            </Bounds>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls makeDefault enablePan={true} enableZoom={true} enableRotate={true} minPolarAngle={0} maxPolarAngle={Math.PI} />
        </Canvas>

        <div style={{
          position: "absolute", top: "12px", left: "16px",
          fontSize: "0.6rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase",
          pointerEvents: "none",
        }}>
          Drag to rotate · Scroll to zoom
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "12px", pointerEvents: "none", zIndex: 2,
          }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "4px", color: MUTED, textTransform: "uppercase" }}>
              Retrieving Part Data
            </div>
            <div style={{ width: "80px", height: "1px", background: CYAN_DIM, position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, height: "100%",
                width: "40%", background: CYAN,
                animation: "vse-scan 1.2s ease-in-out infinite",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Metadata panel */}
      <div style={{
        borderTop: `1px solid ${CYAN_DIM}`,
        padding: "28px 20px",
        background: "rgba(8, 20, 35, 0.9)",
        display: "flex",
        alignItems: "flex-start",
        minHeight: "110px",
        gap: "24px",
      }}>
        {/* Fields row — ID, Name, Description */}
        <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "0 32px" }}>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "3px" }}>Part ID</div>
            <div style={{ fontSize: "0.85rem", color: TITLE_COLOR, letterSpacing: "0.5px", fontFamily: "monospace",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {detail?.id ?? selectedPart.id}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "3px" }}>Display Name</div>
            <div style={{ fontSize: "0.85rem", color: TITLE_COLOR, letterSpacing: "0.5px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {detail?.name ?? selectedPart.name}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginBottom: "3px" }}>Description</div>
            <div style={{ fontSize: "0.85rem", color: "rgba(200, 220, 240, 0.7)", letterSpacing: "0.3px", lineHeight: "1.4",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {detail?.description ?? <span style={{ color: MUTED, fontStyle: "italic" }}>No description</span>}
            </div>
          </div>
        </div>

        {/* Edit button — right aligned, more prominent */}
        <button
          onClick={() => setEditOpen(true)}
          style={{
            padding: "10px 22px",
            background: "rgba(80, 200, 220, 0.12)",
            border: `1px solid ${CYAN}`,
            color: CYAN,
            fontSize: "0.75rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: "bold",
            flexShrink: 0,
            alignSelf: "flex-start",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(80, 200, 220, 0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(80, 200, 220, 0.12)"}
        >
          Edit
        </button>
      </div>

      {/* Edit modal */}
      {editOpen && detail && (
        <EditPartModal
          part={detail}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default PartViewer;
