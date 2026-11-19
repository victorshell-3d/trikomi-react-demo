import { GuidedPanel } from "./GuidedPanel";
import { Button } from "../../../ui-kit/controls";
import {
  ChoiceCard,
  SectionHeading,
  JewelryMark,
} from "../../../ui-kit/studio";
import { StudioDock } from "../../../ui-kit/jewelry/StudioChrome";
import { JewelryColorPicker } from "../../../ui-kit/jewelry/JewelryColorPicker";
import { prepareMaterials } from "./collectionMaterials";
import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three/webgpu";
import { observer } from "mobx-react-lite";
import {
  useViewerStore,
  DiamondPlugin,
  GLTFPlugin,
  OrbitControlsPlugin,
  CenterModelPlugin,
} from "@trikomi/core";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const assetBase = import.meta.env.BASE_URL;
const AVAILABLE_RINGS = [
  {
    name: "Classic Solitaire",
    url: `${import.meta.env.BASE_URL}models/ring.glb`,
    thumb: `${import.meta.env.BASE_URL}thumbs/ring1.png`,
  },
  {
    name: "Halo Setting",
    url: `${import.meta.env.BASE_URL}models/ring2.glb`,
    thumb: `${import.meta.env.BASE_URL}thumbs/ring2.png`,
  },
  {
    name: "Pendant",
    url: `${assetBase}models/studio/pendant.glb`,
    thumb: "",
    kind: "Pendant",
  },
  {
    name: "Pearls",
    url: `${assetBase}models/studio/necklace.glb`,
    thumb: "",
    kind: "Pearls",
  },
  {
    name: "Bracelet",
    url: `${assetBase}models/studio/bracelet.glb`,
    thumb: "",
    kind: "Bracelet",
  },
];

interface MaterialControlsProps {
  onMetalTone?: () => void;
  importRevision?: number;
  onPieceChange?: (name: string, description: string) => void;
  viewerRef: React.MutableRefObject<import("@trikomi/core").ThreeViewer | null>;
}

export const MaterialControls: React.FC<MaterialControlsProps> = observer(
  ({ viewerRef, onPieceChange, onMetalTone, importRevision = 0 }) => {
    const viewerStore = useViewerStore();
    const [selectedPart, setSelectedPart] = useState<{ part: "Stone" | "Metal"; revision: number }>();
    const [materials, setMaterials] = useState<
      Array<{
        id: string;
        name: string;
        color: string;
        mat: Record<string, unknown> | string | number | boolean;
        mesh: THREE.InstancedMesh | THREE.Mesh;
        isDiamond: boolean;
      }>
    >([]);
    const [diamondThumbs, setDiamondThumbs] = useState<Record<string, string>>(
      {},
    );
    const [diamondGeometries, setDiamondGeometries] = useState<
      Record<string, THREE.BufferGeometry>
    >({});
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeShapes, setActiveShapes] = useState<Record<string, string>>(
      {},
    );
    const [zRotations, setZRotations] = useState<Record<string, number>>({});
    const [scales, setScales] = useState<Record<string, number>>({});
    const [yOffsets, setYOffsets] = useState<Record<string, number>>({});
    const [activeRingIndex, setActiveRingIndex] = useState(0);

    const [undoColor, setUndoColor] = useState<{
      index: number;
      color: string;
    } | null>(null);
    useEffect(() => {
      if (importRevision) {
        setActiveRingIndex(-1);
        collectionColor.current = null;
        setUndoColor(null);
      }
    }, [importRevision]);
    const originalColors = useRef<Record<string, string>>({});
    const compareColor = useRef<string | null>(null);
    const [savedLooks, setSavedLooks] = useState<
      Array<{ name: string; piece: number; color: string }>
    >(() => {
      try {
        const items = JSON.parse(
          localStorage.getItem("jewelry-color-looks") || "[]",
        );
        return Array.isArray(items)
          ? items
              .filter(
                (x) =>
                  x &&
                  typeof x.name === "string" &&
                  Number.isInteger(x.piece) &&
                  x.piece >= 0 &&
                  x.piece < 5 &&
                  /^#[a-f0-9]{6}$/i.test(x.color),
              )
              .slice(0, 6)
          : [];
      } catch {
        return [];
      }
    });
    const [saveMessage, setSaveMessage] = useState("");
    const collectionColor = useRef<
      ((hex: string, surface: string) => void) | null
    >(null);
    const [showLegacy] = useState(false);
    const [category, setCategory] = useState("Models");
    const [shapePage, setShapePage] = useState(0);
    const [failedPiece, setFailedPiece] = useState(0);
    const [loadError, setLoadError] = useState("");
    const [pendingPiece, setPendingPiece] = useState<number | null>(null);
    const [readyMessage, setReadyMessage] = useState("");
    const modelCards = useRef<HTMLDivElement>(null);
    const descriptions = [
      "Diamond-set band",
      "Raised solitaire setting",
      "Teardrop pendant · display stand",
      "Pearl necklace · display bust",
      "Charm bracelet · display cushion",
    ];
    const previewNames = ["classic", "halo", "pendant", "pearls", "bracelet"];
    const handleRingChange = async (index: number) => {
      if (
        viewerStore.isModelLoading ||
        pendingPiece !== null ||
        (index === activeRingIndex && !loadError)
      )
        return index === activeRingIndex;
      const viewer = viewerRef.current;
      if (!viewer) return false;

      const plugin = viewer.getPlugin(GLTFPlugin);
      if (!plugin) return false;

      const previousIndex = activeRingIndex;
      setLoadError("");
      setReadyMessage("");
      setPendingPiece(index);

      try {
        const ring = AVAILABLE_RINGS[index];
        const model = await plugin.loadModel(
          ring.url,
          `jewelry_model_${index}`,
        );
        collectionColor.current = null;
        setUndoColor(null);
        originalColors.current = {};
        setExpandedId(null);
        setActiveShapes({});
        setZRotations({});
        setScales({});
        setYOffsets({});
        if (index >= 2) {
          collectionColor.current = prepareMaterials(model, index === 3);
          collectionColor.current("#d8bd82", "Satin");
          model.rotation.y = -0.25;
          if (index === 4) model.rotation.x = 0.85;
          model.updateMatrixWorld(true);
          viewer.getPlugin(CenterModelPlugin)?.center(model);
        }
        viewer.getPlugin(OrbitControlsPlugin)?.resetView();
        const diamondPlugin = viewer.getPlugin(DiamondPlugin) as any;
        if (
          index < 2 &&
          diamondPlugin &&
          typeof diamondPlugin.applyDiamondMaterial === "function"
        ) {
          diamondPlugin.applyDiamondMaterial();
        }
        setActiveRingIndex(index);
        onPieceChange?.(ring.name, descriptions[index]);
        setReadyMessage(ring.name + " ready");
        requestAnimationFrame(() => {
          const rail = modelCards.current;
          const card = rail?.querySelectorAll("button")[index];
          if (rail && card && rail.scrollWidth > rail.clientWidth)
            rail.scrollTo({
              left:
                card.offsetLeft -
                rail.offsetLeft -
                (rail.clientWidth - card.clientWidth) / 2,
              behavior: "smooth",
            });
        });
        return true;
      } catch (e) {
        setFailedPiece(index);
        setActiveRingIndex(previousIndex);
        setLoadError(
          "This piece couldn't load. Check your connection and try again.",
        );
        console.error("Error switching jewelry:", e);
        return false;
      } finally {
        setPendingPiece(null);
      }
    };

    // Fetch thumbnails
    useEffect(() => {
      fetch(`${import.meta.env.BASE_URL}json/diamond_map.json`)
        .then((res) => res.json())
        .then((data) => setDiamondThumbs(data))
        .catch((err) => console.error("Failed to load diamond map", err));
    }, []);

    // Load diamond geometries in background
    useEffect(() => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/gltf/`);
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        `${import.meta.env.BASE_URL}models/diamonds.glb`,
        (gltf) => {
          const geos: Record<string, THREE.BufferGeometry> = {};
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              geos[mesh.name] = mesh.geometry;
            }
          });
          setDiamondGeometries(geos);
          dracoLoader.dispose();
        },
        undefined,
        (err) => {
          console.error("Failed to load diamond geometries", err);
        },
      );
    }, []);

    // Re-scan for materials whenever the active model changes or finishes loading
    useEffect(() => {
      if (viewerStore.isModelLoading) return;

      const viewer = viewerRef.current;
      if (!viewer) return;

      const timeoutId = setTimeout(() => {
        const targetModel =
          viewerStore.currentModel ||
          viewer.runtimeRoot.children[0]?.nativeObject ||
          viewer.scene;
        if (!targetModel) return;

        const uniqueMats = new Map<
          string,
          {
            id: string;
            name: string;
            color: string;
            mat: THREE.Material | import("three/webgpu").NodeMaterial;
            mesh: THREE.Object3D;
            isDiamond: boolean;
          }
        >();

        targetModel.traverse((child: THREE.Object3D) => {
          if (child.isMesh || child.isInstancedMesh) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];

            if (!child.userData.originalSize && child.geometry) {
              child.geometry.computeBoundingBox();
              const size = new THREE.Vector3();
              if (child.geometry.boundingBox) {
                child.geometry.boundingBox.getSize(size);
                child.userData.originalSize = size;
              }
            }

            if (!child.userData.originalGeometry && child.geometry) {
              child.userData.originalGeometry = child.geometry.clone();
            }

            mats.forEach((mat) => {
              if (!mat) return;
              let displayName = child.name;
              if (
                child.parent &&
                child.parent.name &&
                child.parent.name !== "Scene"
              ) {
                displayName = child.parent.name;
              }
              if (!displayName) displayName = mat.name || "Unnamed Material";

              const hash = mat.uuid;
              if (!uniqueMats.has(hash)) {
                let hexColor = "#ffffff";
                let isDiamond = false;

                if (mat.color && mat.color.value && mat.color.value.isColor) {
                  hexColor = "#" + mat.color.value.getHexString();
                  isDiamond = true;
                } else if (mat.color && mat.color.isColor) {
                  hexColor = "#" + mat.color.getHexString();
                  if (mat.name && mat.name.toLowerCase().includes("diamond"))
                    isDiamond = true;
                }

                if (typeof mat.userData.jewelryTone === "string")
                  hexColor = mat.userData.jewelryTone;
                uniqueMats.set(hash, {
                  id: hash,
                  name: displayName,
                  color: hexColor,
                  mat: mat,
                  mesh: child,
                  isDiamond,
                });
              }
            });
          }
        });

        uniqueMats.forEach((mat) => {
          if (!originalColors.current[mat.id])
            originalColors.current[mat.id] = mat.color;
        });
        setUndoColor(null);
        setMaterials(Array.from(uniqueMats.values()));
      }, 500);

      return () => clearTimeout(timeoutId);
    }, [viewerStore.activeModelName, viewerStore.isModelLoading]);

    const handleColorChange = (
      index: number,
      newColorStr: string,
      remember = true,
    ) => {
      if (!materials[index]) return;
      if (remember && materials[index].color !== newColorStr)
        setUndoColor({ index, color: materials[index].color });
      if (activeRingIndex >= 2 && collectionColor.current) {
        collectionColor.current(newColorStr, "Satin");
        setMaterials(
          materials.map((material) => ({ ...material, color: newColorStr })),
        );
        return;
      }
      const newMats = [...materials];
      newMats[index].color = newColorStr;
      setMaterials(newMats);

      const mat = newMats[index].mat;
      if (mat) {
        if (mat.color && mat.color.value && mat.color.value.isColor) {
          mat.color.value.set(newColorStr);
        } else if (mat.color && mat.color.isColor) {
          mat.color.set(newColorStr);
        }
        mat.needsUpdate = true;
      }
    };

    const applyGeometryTransform = async (
      matId: string,
      mesh: THREE.Mesh,
      shapeName: string | undefined,
      rotationZ: number,
      scaleOffset: number,
      yOffset: number,
      isFinal: boolean,
    ) => {
      let cloned: THREE.BufferGeometry;

      if (shapeName && diamondGeometries[shapeName]) {
        const baseGeom = diamondGeometries[shapeName];
        cloned = baseGeom.clone();

        cloned.rotateY(rotationZ * (Math.PI / 180));

        // Fix scale: Scale the new geometry to match the size of the original mesh.
        if (mesh.userData.originalSize) {
          cloned.computeBoundingBox();
          const currentSize = new THREE.Vector3();
          if (cloned.boundingBox) {
            cloned.boundingBox.getSize(currentSize);
            const targetSize = mesh.userData.originalSize;

            const targetFootprint = Math.max(targetSize.x, targetSize.z);
            const currentFootprint = Math.max(currentSize.x, currentSize.z);

            if (currentFootprint > 0) {
              const scale =
                (targetFootprint / currentFootprint) * (scaleOffset / 100);
              cloned.scale(scale, scale, scale);
            }
          }
        }
      } else {
        if (!mesh.userData.originalGeometry) return;
        cloned = mesh.userData.originalGeometry.clone();
        cloned.rotateY(rotationZ * (Math.PI / 180));
        const s = scaleOffset / 100;
        cloned.scale(s, s, s);
      }

      if (yOffset !== 0) {
        cloned.translate(0, yOffset / 100, 0);
      }

      const viewer = viewerRef.current;
      if (viewer) {
        if (isFinal) {
          const diamondPlugin = viewer.getPlugin(DiamondPlugin);
          if (diamondPlugin && diamondPlugin.updateDiamondGeometry) {
            await diamondPlugin.updateDiamondGeometry(mesh, cloned);
          } else {
            mesh.geometry = cloned;
          }
        } else {
          mesh.geometry = cloned;
        }
      }
    };

    const handleShapeChange = (
      matId: string,
      mesh: THREE.Mesh,
      shapeName: string,
    ) => {
      setActiveShapes((prev) => ({ ...prev, [matId]: shapeName }));
      const currentRot = zRotations[matId] || 0;
      const currentScale = scales[matId] !== undefined ? scales[matId] : 100;
      const currentY = yOffsets[matId] || 0;
      applyGeometryTransform(
        matId,
        mesh,
        shapeName,
        currentRot,
        currentScale,
        currentY,
        true,
      );
    };

    const handleRotationChange = (
      matId: string,
      mesh: THREE.Mesh,
      rotation: number,
      isFinal: boolean,
    ) => {
      setZRotations((prev) => ({ ...prev, [matId]: rotation }));
      const currentShape = activeShapes[matId];
      const currentScale = scales[matId] !== undefined ? scales[matId] : 100;
      const currentY = yOffsets[matId] || 0;
      applyGeometryTransform(
        matId,
        mesh,
        currentShape,
        rotation,
        currentScale,
        currentY,
        isFinal,
      );
    };

    const handleScaleChange = (
      matId: string,
      mesh: THREE.Mesh,
      scale: number,
      isFinal: boolean,
    ) => {
      setScales((prev) => ({ ...prev, [matId]: scale }));
      const currentShape = activeShapes[matId];
      const currentRot = zRotations[matId] || 0;
      const currentY = yOffsets[matId] || 0;
      applyGeometryTransform(
        matId,
        mesh,
        currentShape,
        currentRot,
        scale,
        currentY,
        isFinal,
      );
    };

    const handleYOffsetChange = (
      matId: string,
      mesh: THREE.Mesh,
      offset: number,
      isFinal: boolean,
    ) => {
      setYOffsets((prev) => ({ ...prev, [matId]: offset }));
      const currentShape = activeShapes[matId];
      const currentRot = zRotations[matId] || 0;
      const currentScale = scales[matId] !== undefined ? scales[matId] : 100;
      applyGeometryTransform(
        matId,
        mesh,
        currentShape,
        currentRot,
        currentScale,
        offset,
        isFinal,
      );
    };

    // Use the already-discovered model materials, not names or screen hotspots.
    useEffect(() => {
      const viewer = viewerRef.current;
      const canvas = viewer?.renderer.domElement;
      if (!viewer || !canvas || activeRingIndex < 0 || activeRingIndex > 1 || viewerStore.isModelLoading) return;
      const raycaster = new THREE.Raycaster();
      const pointers = new Set<number>();
      let tap: { id: number; x: number; y: number; at: number; moved: boolean } | null = null;
      const down = (event: PointerEvent) => {
        pointers.add(event.pointerId);
        if (pointers.size !== 1 || !event.isPrimary || event.button !== 0) { tap = null; return; }
        tap = { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now(), moved: false };
      };
      const move = (event: PointerEvent) => { if (tap?.id === event.pointerId && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 6) tap.moved = true; };
      const up = (event: PointerEvent) => {
        const candidate = tap; tap = null; pointers.delete(event.pointerId);
        if (!candidate || candidate.id !== event.pointerId || candidate.moved || performance.now() - candidate.at > 600 || Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) > 6) return;
        const model = viewerStore.currentModel;
        if (!model) return;
        const rect = canvas.getBoundingClientRect();
        viewer.scene.updateMatrixWorld(true); viewer.camera.updateMatrixWorld(true);
        raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), viewer.camera);
        const hit = raycaster.intersectObject(model, true)[0];
        if (!hit) return;
        const mesh = hit.object as THREE.Mesh;
        const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const material = meshMaterials[hit.face?.materialIndex || 0];
        const match = materials.find((item) => item.id === material?.uuid);
        if (match) setSelectedPart((old) => ({ part: match.isDiamond ? "Stone" : "Metal", revision: (old?.revision || 0) + 1 }));
      };
      const cancel = (event: PointerEvent) => { tap = null; pointers.delete(event.pointerId); };
      canvas.addEventListener("pointerdown", down, true); canvas.addEventListener("pointermove", move, true);
      canvas.addEventListener("pointerup", up, true); canvas.addEventListener("pointercancel", cancel, true);
      return () => { canvas.removeEventListener("pointerdown", down, true); canvas.removeEventListener("pointermove", move, true); canvas.removeEventListener("pointerup", up, true); canvas.removeEventListener("pointercancel", cancel, true); };
    }, [materials, activeRingIndex, viewerStore.isModelLoading]);

    // Auto-select first material if none expanded
    useEffect(() => {
      if (!expandedId && materials.length > 0) {
        setExpandedId(materials[0].id);
      }
    }, [materials, expandedId]);

    const activeMat =
      materials.find((m) => m.id === expandedId) || materials[0];
    const shapes = Object.entries(diamondThumbs);
    const diamondMaterials = materials.filter((m) => m.isDiamond);
    const chooseCategory = (value: string) => {
      if (value === "Diamonds" && !activeMat?.isDiamond && diamondMaterials[0])
        setExpandedId(diamondMaterials[0].id);
      setCategory(value);
    };
    const colorChoices = activeMat?.isDiamond
      ? [
          { name: "Clear", color: "#ffffff" },
          { name: "Champagne", color: "#e4c48b" },
          { name: "Pink", color: "#e5a5bd" },
          { name: "Blue", color: "#8ac5e3" },
        ]
      : [
          { name: "Gold tone", color: "#d8bd82" },
          { name: "Silver tone", color: "#d4d7df" },
          { name: "Rose tone", color: "#d6a092" },
          { name: "Graphite", color: "#6d7380" },
        ];
    return (
      <>
        <GuidedPanel
          selectedPart={selectedPart}
          loading={
            viewerStore.isModelLoading ||
            pendingPiece !== null ||
            materials.length === 0
          }
          onPiece={handleRingChange}
          onTone={(target, color) => {
            if (target === "Metal") onMetalTone?.();
            const indices = materials
              .map((m, i) => ({ m, i }))
              .filter(({ m }) =>
                target === "Gem" ? m.isDiamond : !m.isDiamond,
              );
            indices.forEach(({ i }) => handleColorChange(i, color));
          }}
          onFinish={(finish) => {
            if (collectionColor.current)
              collectionColor.current(
                materials[0]?.color || "#d8bd82",
                finish === "Polished" ? "Chrome" : "Satin",
              );
            else
              materials
                .filter((m) => !m.isDiamond)
                .forEach(({ mat }) => {
                  if (mat && typeof mat === "object" && "roughness" in mat) {
                    if (typeof mat.roughness === "number")
                      mat.roughness = finish === "Polished" ? 0.13 : 0.5;
                    else if (
                      mat.roughness &&
                      typeof mat.roughness === "object" &&
                      "value" in mat.roughness
                    )
                      mat.roughness.value = finish === "Polished" ? 0.13 : 0.5;
                    mat.needsUpdate = true;
                  }
                });
          }}
          onShape={(shape) => {
            const first = diamondMaterials[0];
            if (first) {
              const key = (
                {
                  Round: "shape016",
                  Oval: "shape009",
                  Emerald: "shape018",
                } as Record<string, string>
              )[shape];
              if (key || shape === "Original")
                handleShapeChange(first.id, first.mesh, key || "");
            }
          }}
        />
        {showLegacy && (
          <aside
            className="js-inspector panel"
            data-category={category}
            aria-label="Jewelry product controls"
            aria-busy={pendingPiece !== null}
          >
            <StudioDock
              tabs={["Models", "Materials", "Diamonds", "View"]}
              category={category}
              onChange={chooseCategory}
            />
            <div
              className="js-option-panel"
              role="tabpanel"
              id="js-options"
              aria-labelledby={"js-category-" + category}
            >
              {(category === "Materials" || category === "Diamonds") && (
                <span className="atelier-scroll-hint">Scroll for more ↓</span>
              )}
              <SectionHeading
                eyebrow={
                  category === "Models"
                    ? "01 / COLLECTION"
                    : category === "Materials"
                      ? "02 / FINISH & COLOR"
                      : category === "Diamonds"
                        ? "03 / STONE DETAILS"
                        : "YOUR PERSPECTIVE"
                }
                title={
                  category === "Models"
                    ? "Find your piece"
                    : category === "Materials"
                      ? "Make it yours"
                      : category === "Diamonds"
                        ? "Choose the details"
                        : "Take a closer look"
                }
              />
              <div
                className="atelier-feedback"
                data-idle={!loadError && pendingPiece === null && !readyMessage}
                role={loadError ? "alert" : "status"}
                aria-live="polite"
              >
                {pendingPiece !== null
                  ? "Loading " + AVAILABLE_RINGS[pendingPiece].name + "…"
                  : loadError ||
                    readyMessage ||
                    "Changes stay in this preview."}
                {loadError && (
                  <Button onClick={() => handleRingChange(failedPiece)}>
                    Try again
                  </Button>
                )}
              </div>
              {category === "Models" ? (
                <>
                  <p className="atelier-intro">
                    Two original rings. Three studio pieces.
                    <br />
                    Choose a starting point.
                  </p>
                  <div
                    className="js-option-strip"
                    role="group"
                    aria-label="Jewelry models"
                    inert={pendingPiece !== null}
                    ref={modelCards}
                  >
                    {AVAILABLE_RINGS.map((piece, index) => (
                      <ChoiceCard
                        key={piece.name}
                        label={piece.name}
                        detail={descriptions[index]}
                        selected={activeRingIndex === index}
                        onClick={() => handleRingChange(index)}
                      >
                        <img
                          src={`${assetBase}thumbs/studio/${previewNames[index]}.webp`}
                          alt=""
                          width={96}
                          height={96}
                        />
                      </ChoiceCard>
                    ))}
                  </div>
                  <div className="original-pagination">
                    <Button
                      disabled={pendingPiece !== null}
                      aria-label="Previous ring"
                      onClick={() =>
                        handleRingChange(
                          (activeRingIndex - 1 + AVAILABLE_RINGS.length) %
                            AVAILABLE_RINGS.length,
                        )
                      }
                    >
                      ←
                    </Button>
                    <span>
                      {activeRingIndex < 0
                        ? "Imported model"
                        : String(activeRingIndex + 1).padStart(2, "0") +
                          " / 05"}
                    </span>
                    <Button
                      disabled={pendingPiece !== null}
                      aria-label="Next ring"
                      onClick={() =>
                        handleRingChange(
                          (activeRingIndex + 1) % AVAILABLE_RINGS.length,
                        )
                      }
                    >
                      →
                    </Button>
                  </div>
                  <Button
                    className="atelier-continue"
                    variant="primary"
                    onClick={() => chooseCategory("Materials")}
                  >
                    Customize this piece <span aria-hidden="true">↗</span>
                  </Button>
                </>
              ) : category === "View" ? (
                <div className="original-controls">
                  <p className="atelier-intro">
                    Drag to rotate. Scroll or pinch to zoom.
                    <br />
                    Find the angle that feels right.
                  </p>
                  <Button
                    onClick={() =>
                      viewerRef.current
                        ?.getPlugin(OrbitControlsPlugin)
                        ?.resetView()
                    }
                  >
                    Reset camera
                  </Button>
                  <p className="original-status">
                    Import a GLB or export your current model from the studio
                    header.
                  </p>
                </div>
              ) : (
                <div className="original-controls">
                  {activeMat ? (
                    <>
                      <label>
                        Editing part
                        <select
                          aria-label="Model material"
                          value={activeMat.id}
                          onChange={(e) => setExpandedId(e.target.value)}
                        >
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name.replace(/_/g, " ")}
                              {m.isDiamond ? " (diamond)" : ""}
                            </option>
                          ))}
                        </select>
                      </label>
                      <JewelryColorPicker
                        inline
                        value={activeMat.color}
                        onChange={(color) =>
                          handleColorChange(
                            materials.findIndex((m) => m.id === activeMat.id),
                            color,
                          )
                        }
                      />
                      <div
                        className="atelier-color-choices"
                        role="group"
                        aria-label="Color presets"
                      >
                        {colorChoices.map((choice) => (
                          <button
                            key={choice.name}
                            aria-label={choice.name}
                            aria-pressed={
                              activeMat.color.toLowerCase() === choice.color
                            }
                            onClick={() =>
                              handleColorChange(
                                materials.findIndex(
                                  (m) => m.id === activeMat.id,
                                ),
                                choice.color,
                              )
                            }
                          >
                            <span style={{ background: choice.color }} />
                            <small>{choice.name}</small>
                          </button>
                        ))}
                      </div>

                      <div className="atelier-secondary-actions">
                        <Button
                          aria-label="Hold to compare original color"
                          onPointerDown={() => {
                            compareColor.current = activeMat.color;
                            handleColorChange(
                              materials.findIndex((m) => m.id === activeMat.id),
                              originalColors.current[activeMat.id] ||
                                activeMat.color,
                              false,
                            );
                          }}
                          onPointerUp={() => {
                            if (compareColor.current)
                              handleColorChange(
                                materials.findIndex(
                                  (m) => m.id === activeMat.id,
                                ),
                                compareColor.current,
                                false,
                              );
                            compareColor.current = null;
                          }}
                          onPointerCancel={() => {
                            if (compareColor.current)
                              handleColorChange(
                                materials.findIndex(
                                  (m) => m.id === activeMat.id,
                                ),
                                compareColor.current,
                                false,
                              );
                            compareColor.current = null;
                          }}
                          onPointerLeave={() => {
                            if (compareColor.current)
                              handleColorChange(
                                materials.findIndex(
                                  (m) => m.id === activeMat.id,
                                ),
                                compareColor.current,
                                false,
                              );
                            compareColor.current = null;
                          }}
                          onKeyDown={(e) => {
                            if (
                              (e.key === " " || e.key === "Enter") &&
                              !e.repeat
                            ) {
                              e.preventDefault();
                              compareColor.current = activeMat.color;
                              handleColorChange(
                                materials.findIndex(
                                  (m) => m.id === activeMat.id,
                                ),
                                originalColors.current[activeMat.id] ||
                                  activeMat.color,
                                false,
                              );
                            }
                          }}
                          onBlur={() => {
                            if (compareColor.current)
                              handleColorChange(
                                materials.findIndex(
                                  (m) => m.id === activeMat.id,
                                ),
                                compareColor.current,
                                false,
                              );
                            compareColor.current = null;
                          }}
                          onKeyUp={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                              if (compareColor.current)
                                handleColorChange(
                                  materials.findIndex(
                                    (m) => m.id === activeMat.id,
                                  ),
                                  compareColor.current,
                                  false,
                                );
                              compareColor.current = null;
                            }
                          }}
                        >
                          Hold to compare
                        </Button>
                        <Button
                          disabled={activeRingIndex < 0}
                          title={
                            activeRingIndex < 0
                              ? "Browser color saving is available for collection pieces"
                              : undefined
                          }
                          onClick={() => {
                            if (activeRingIndex < 0) return;
                            const next = [
                              {
                                name: AVAILABLE_RINGS[activeRingIndex].name,
                                piece: activeRingIndex,
                                color: activeMat.color,
                              },
                              ...savedLooks,
                            ].slice(0, 6);
                            try {
                              localStorage.setItem(
                                "jewelry-color-looks",
                                JSON.stringify(next),
                              );
                              setSavedLooks(next);
                              setSaveMessage("Color saved on this browser");
                            } catch {
                              setSaveMessage(
                                "Couldn't save. Browser storage may be full.",
                              );
                            }
                          }}
                        >
                          Save color
                        </Button>
                      </div>
                      {undoColor && (
                        <div className="atelier-undo" role="status">
                          <span>Color updated</span>
                          <Button
                            onClick={() => {
                              handleColorChange(
                                undoColor.index,
                                undoColor.color,
                                false,
                              );
                              setUndoColor(null);
                            }}
                          >
                            Undo
                          </Button>
                        </div>
                      )}
                      {savedLooks.some(
                        (look) => look.piece === activeRingIndex,
                      ) && (
                        <details className="atelier-saved">
                          <summary>
                            Saved colors <span>On this browser only</span>
                          </summary>
                          <div>
                            {savedLooks
                              .filter((look) => look.piece === activeRingIndex)
                              .map((look, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleColorChange(
                                      materials.findIndex(
                                        (m) => m.id === activeMat.id,
                                      ),
                                      look.color,
                                    )
                                  }
                                  aria-label={"Apply saved color " + look.color}
                                >
                                  <span style={{ background: look.color }} />
                                  {look.color.toUpperCase()}
                                </button>
                              ))}
                          </div>
                        </details>
                      )}
                      {saveMessage && (
                        <p role="status" className="original-status">
                          {saveMessage}
                        </p>
                      )}
                      {category === "Materials" && (
                        <p className="atelier-note">
                          {activeRingIndex >= 2
                            ? "Color adjusts the jewelry finish while keeping the display textures."
                            : "Color changes the selected part only. Other materials stay as they are."}
                          <br />
                          Visual finish only, not a metal specification.
                        </p>
                      )}
                      {category === "Diamonds" &&
                        (activeMat.isDiamond ? (
                          <>
                            <div className="atelier-field-heading">
                              <h3>Stone shape</h3>
                              <span>{shapes.length} options</span>
                            </div>
                            <div
                              className="original-shapes"
                              role="group"
                              aria-label="Diamond shapes"
                            >
                              {shapes
                                .slice(shapePage * 12, (shapePage + 1) * 12)
                                .map(([name, path], index) => (
                                  <button
                                    key={name}
                                    aria-label={"Diamond " + name}
                                    aria-pressed={
                                      activeShapes[activeMat.id] === name
                                    }
                                    onClick={() =>
                                      handleShapeChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        name,
                                      )
                                    }
                                  >
                                    <img
                                      src={`${assetBase}${path.startsWith("/") ? path.slice(1) : path}`}
                                      alt=""
                                    />
                                    <small>
                                      {String(
                                        shapePage * 12 + index + 1,
                                      ).padStart(2, "0")}
                                    </small>
                                  </button>
                                ))}
                            </div>
                            <div className="original-pagination">
                              <Button
                                disabled={shapePage === 0}
                                aria-label="Previous shapes"
                                onClick={() => setShapePage((p) => p - 1)}
                              >
                                ←
                              </Button>
                              <span>
                                {shapePage * 12 + 1}-
                                {Math.min((shapePage + 1) * 12, shapes.length)}{" "}
                                / {shapes.length}
                              </span>
                              <Button
                                disabled={(shapePage + 1) * 12 >= shapes.length}
                                aria-label="Next shapes"
                                onClick={() => setShapePage((p) => p + 1)}
                              >
                                →
                              </Button>
                            </div>
                            <details className="atelier-fine-tune">
                              <summary>
                                Fine tune <span>Angle, scale & height</span>
                              </summary>
                              <div>
                                <label>
                                  Angle offset · {zRotations[activeMat.id] || 0}
                                  °
                                  <input
                                    aria-label="Angle offset"
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={zRotations[activeMat.id] || 0}
                                    onChange={(e) =>
                                      handleRotationChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.target.value),
                                        false,
                                      )
                                    }
                                    onPointerUp={(e) =>
                                      handleRotationChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.currentTarget.value),
                                        true,
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleRotationChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.currentTarget.value),
                                        true,
                                      )
                                    }
                                  />
                                </label>
                                <label>
                                  Scale offset · {scales[activeMat.id] ?? 100}%
                                  <input
                                    aria-label="Scale offset"
                                    type="range"
                                    min={50}
                                    max={200}
                                    step={1}
                                    value={scales[activeMat.id] ?? 100}
                                    onChange={(e) =>
                                      handleScaleChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.target.value),
                                        false,
                                      )
                                    }
                                    onPointerUp={(e) =>
                                      handleScaleChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.currentTarget.value),
                                        true,
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleScaleChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.currentTarget.value),
                                        true,
                                      )
                                    }
                                  />
                                </label>
                                <label>
                                  Height offset · {yOffsets[activeMat.id] || 0}
                                  <input
                                    aria-label="Height offset"
                                    type="range"
                                    min={-50}
                                    max={50}
                                    step={1}
                                    value={yOffsets[activeMat.id] || 0}
                                    onChange={(e) =>
                                      handleYOffsetChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.target.value),
                                        false,
                                      )
                                    }
                                    onPointerUp={(e) =>
                                      handleYOffsetChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.currentTarget.value),
                                        true,
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleYOffsetChange(
                                        activeMat.id,
                                        activeMat.mesh,
                                        Number(e.currentTarget.value),
                                        true,
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </details>
                          </>
                        ) : (
                          <div className="atelier-empty">
                            <JewelryMark kind="Ring" />
                            <h3>No diamond parts on this piece</h3>
                            <p>
                              Use Materials to change its color, or choose a
                              ring to explore stone shapes.
                            </p>
                            <Button onClick={() => chooseCategory("Materials")}>
                              Edit materials
                            </Button>
                          </div>
                        ))}
                    </>
                  ) : (
                    <p className="original-status" role="status">
                      Loading editable parts...
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </>
    );
  },
);
