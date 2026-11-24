// App-owned ground projection. The same HDR drives the sky, ground and reflections.
export function createGroundEnvironment(
  THREE,
  scene,
  base,
  HDRLoader,
  GroundedSkybox,
  url,
  onLoad = () => {},
  onError = console.warn,
) {
  let sky = null,
    map = null,
    disposed = false;
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const ctx = cv.getContext("2d"),
    g = ctx.createRadialGradient(64, 64, 18, 64, 64, 63);
  g.addColorStop(0, "#000b");
  g.addColorStop(0.65, "#0006");
  g.addColorStop(1, "#0000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(cv),
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);
  const update = () => {
    if (!sky) return;
    const r = base.scale.x;
    shadow.scale.setScalar(r);
    shadow.position.set(
      base.position.x,
      base.position.y - r * 0.102,
      base.position.z,
    );
    sky.scale.setScalar(r);
    sky.position.set(
      base.position.x,
      base.position.y - r * 0.105 + r * 1.6,
      base.position.z,
    );
  };
  new HDRLoader().load(
    url,
    (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      map = texture;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.8;
      sky = new GroundedSkybox(texture, 1.6, 80, 128);
      sky.name = "Kloppenheim 06 ground-projected environment";
      sky.rotation.y = 2.25;
      sky.renderOrder = -10;
      scene.environmentRotation.y = 2.25;
      scene.add(sky);
      update();
      onLoad();
    },
    undefined,
    onError,
  );
  return {
    update,
    dispose() {
      disposed = true;
      if (sky) {
        scene.remove(sky);
        sky.geometry.dispose();
        sky.material.dispose();
      }
      scene.remove(shadow);
      shadow.geometry.dispose();
      shadow.material.map.dispose();
      shadow.material.dispose();
      map?.dispose();
    },
  };
}
