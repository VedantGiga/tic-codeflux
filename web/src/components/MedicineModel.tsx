import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function Model({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF("/medicines.glb");
  const groupRef = useRef<THREE.Group>(null!);
  const idleRotation = useRef(0);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name.includes("001")) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#EC4899",
            roughness: 0.2,
            metalness: 0.2,
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#60A5FA",
            roughness: 0.1,
            metalness: 0.1,
          });
        }
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    idleRotation.current += delta * 0.3;
    groupRef.current.rotation.y = idleRotation.current + mouse.current.x * 0.3;
    groupRef.current.rotation.x = mouse.current.y * 0.2;
  });

  return <primitive ref={groupRef} object={scene} scale={0.65} position={[0, -1.5, 0]} />;
}

function StudioLights() {
  return (
    <>
      <directionalLight position={[5, 8, 5]} intensity={0.5} castShadow />
      <directionalLight position={[-3, 3, -5]} intensity={0.5} color="#a0c4ff" />
      <ambientLight intensity={0.2} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />
    </>
  );
}

export default function MedicineModel() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  return (
    <div className="w-full h-full" onMouseMove={handleMouseMove}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <StudioLights />
          <Model mouse={mouse} />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          <Environment preset="studio" />
          <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.05} rotateSpeed={1.75} />
        </Canvas>
      </Suspense>
    </div>
  );
}

