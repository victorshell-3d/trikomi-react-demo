// Ring-page display pedestal: Anas's Kintsugi base module (his RingBase.js),
// scaled from its native r=3.2 frame into the studio's radius-1 frame
// (slab top y=+.094, foot y=-.094). The host copies this mesh's
// geometry/material and re-parents its children, so the slab mesh is the
// root and everything else hangs off it. Background and ground environment
// stay untouched.
export function createPedestal(THREE, root, onLoad = () => {}) {
  const S = 1 / 3.2;
  const loader = new THREE.TextureLoader();
  const load = (name, srgb = false) => { const t = loader.load(root + 'kbase/' + name, onLoad); t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };

  const topDiffuse = load('top_diffuse.png', true);
  const topEmissive = load('top_emissive.png');
  const topBump = load('top_bump.png');
  const topMetal = load('top_metalness.png');
  const topRough = load('top_roughness.png');
  const sideDiffuse = load('side_diffuse.png', true);
  const sideEmissive = load('side_emissive.png');
  const sideBump = load('side_bump.png');
  const sideMetal = load('side_metalness.png');
  const sideRough = load('side_roughness.png');

  // --- Chiseled rock slab ---
  const radiusTop = 3.2, radiusBottom = 3.5, height = .6;
  const geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 128, 32);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    if (dist > 1.2) {
      const angle = Math.atan2(z, x);
      const facet =
        Math.sin(angle * 3 + 1.7) * .11 +
        Math.sin(angle * 7) * .08 +
        Math.cos(angle * 13 + y * 3) * .05 +
        Math.sin(angle * 23 + y * 9) * .03;
      const factor = 1 + facet / dist;
      pos.setX(i, x * factor); pos.setZ(i, z * factor);
      pos.setY(i, y + Math.sin(angle * 17 + y * 11) * .04 * Math.min(1, (dist - 2.6) / .6));
    }
    if (y > height * .4) {
      const crown = Math.cos(dist / radiusTop * Math.PI * .5) * .03;
      pos.setY(i, y + crown);
    }
  }
  geom.rotateY(-.42); // crack runs diagonally front-left to rear-right
  geom.scale(S, S, S);
  geom.computeVertexNormals();

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, map: sideDiffuse, emissiveMap: sideEmissive, emissive: new THREE.Color(0xffb050), emissiveIntensity: .85,
    bumpMap: sideBump, bumpScale: .2,
    metalnessMap: sideMetal, metalness: 1, roughnessMap: sideRough, roughness: 1, envMapIntensity: .12,
  });
  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, map: topDiffuse, emissiveMap: topEmissive, emissive: new THREE.Color(0xffb050), emissiveIntensity: .85,
    bumpMap: topBump, bumpScale: .3,
    metalnessMap: topMetal, metalness: 1, roughnessMap: topRough, roughness: 1, envMapIntensity: .12,
  });
  const bottomMaterial = new THREE.MeshStandardMaterial({ color: 0x151618, roughness: .8 });

  const base = new THREE.Mesh(geom, [sideMaterial, topMaterial, bottomMaterial]);
  base.name = 'Kintsugi rock slab pedestal';
  base.receiveShadow = true; base.castShadow = true; base.layers.set(2);
  const add = (obj) => { obj.traverse((n) => n.layers.set(2)); base.add(obj); return obj; };
  const footY = -height / 2 * S;

  // --- Neon ring at the slab's foot, plus a subtle outer ring ---
  const neonMat = new THREE.MeshBasicMaterial({ color: 0xd9b163, toneMapped: false });
  const neon = add(new THREE.Mesh(new THREE.TorusGeometry(4.12 * S, .032 * S, 16, 128), neonMat));
  neon.rotation.x = Math.PI / 2; neon.position.y = footY + .015 * S;
  const outer = add(new THREE.Mesh(new THREE.TorusGeometry(4.52 * S, .012 * S, 16, 128),
    new THREE.MeshBasicMaterial({ color: 0xd9a94e, transparent: true, opacity: .18, toneMapped: false })));
  outer.rotation.x = Math.PI / 2; outer.position.y = footY + .005 * S;
  const halo = add(new THREE.Mesh(new THREE.TorusGeometry(4.12 * S, .09 * S, 12, 128),
    new THREE.MeshBasicMaterial({ color: 0xcfa64e, transparent: true, opacity: .14, blending: THREE.AdditiveBlending, toneMapped: false, depthWrite: false })));
  halo.rotation.x = Math.PI / 2; halo.position.y = footY + .015 * S;

  // --- Wet ground plane with a golden light-ring reflection ---
  const glow = add(new THREE.Mesh(new THREE.PlaneGeometry(8.6 * S, 8.6 * S),
    new THREE.MeshBasicMaterial({ map: load('ground_light_ring.png', true), transparent: true, blending: THREE.AdditiveBlending, opacity: .88, depthWrite: false })));
  glow.rotation.x = -Math.PI / 2; glow.position.y = footY + .003 * S;

  // --- Flanking boulder with its own glow ring ---
  const bGeom = new THREE.SphereGeometry(.85 * S, 28, 20);
  const bPos = bGeom.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const bx = bPos.getX(i), by = bPos.getY(i), bz = bPos.getZ(i);
    const n = (Math.sin(bx * 14) + Math.cos(by * 17) + Math.sin(bz * 19)) * .045
      + (Math.sin(bx * 5) + Math.cos(by * 6) + Math.sin(bz * 7)) * .05;
    bPos.setXYZ(i, bx * (1 + n), by * (.8 + n), bz * (1 + n));
  }
  bGeom.computeVertexNormals();
  const boulder = add(new THREE.Mesh(bGeom, new THREE.MeshStandardMaterial({
    map: topDiffuse, bumpMap: topBump, bumpScale: .3, roughness: .85, color: 0x6f6f6f, envMapIntensity: .2,
  })));
  boulder.position.set(-3.5 * S, .02 * S, .8 * S); boulder.rotation.set(.3, .7, -.2);
  const bRing = add(new THREE.Mesh(new THREE.TorusGeometry(.95 * S, .022 * S, 16, 64), neonMat));
  bRing.rotation.x = Math.PI / 2; bRing.position.set(-3.5 * S, footY + .015 * S, .8 * S);

  // --- Golden foliage sprigs: a few arcing stems with small bright leaf clusters ---
  const sprout = (x, z, scale, rotY, height) => {
    const g = new THREE.Group();
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x6e5222, metalness: .5, roughness: .55, envMapIntensity: .7 });
    const leafGeom = new THREE.SphereGeometry(.05, 7, 6); leafGeom.scale(1.9, .45, .32);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .85, roughness: .34, envMapIntensity: 1.1 });
    const leafTints = [new THREE.Color(0xcfa750), new THREE.Color(0xb08b3a), new THREE.Color(0x99752c), new THREE.Color(0xdbb969)];
    const stems = 6, leavesPerStem = 10;
    const leaves = new THREE.InstancedMesh(leafGeom, leafMat, stems * leavesPerStem);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
    let li = 0;
    for (let i = 0; i < stems; i++) {
      const a = (i / stems) * Math.PI * 2 + rotY;
      const lean = .35 + (i % 3) * .2;
      const h = height * (.75 + (i % 4) * .12);
      const dx = Math.cos(a) * lean, dz = Math.sin(a) * lean;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(dx * .3, h * .55, dz * .3),
        new THREE.Vector3(dx, h, dz),
      ]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 10, .009, 5, false), stemMat));
      for (let j = 0; j < leavesPerStem; j++) {
        const t = .25 + (j / leavesPerStem) * .75;
        const p = curve.getPoint(Math.min(1, t));
        e.set(j * 2.1, j * 1.3 + i, j * .7); q.setFromEuler(e);
        const jitter = .035;
        m4.compose(new THREE.Vector3(p.x + Math.sin(j * 3.1 + i) * jitter, p.y + Math.cos(j * 1.7) * jitter, p.z + Math.sin(j * 2.3) * jitter), q, one);
        leaves.setMatrixAt(li, m4);
        leaves.setColorAt(li, leafTints[(i * 7 + j * 3) % leafTints.length]);
        li++;
      }
    }
    g.add(leaves);
    g.scale.setScalar(scale * S); g.position.set(x * S, footY, z * S);
    return add(g);
  };
  sprout(-2.4, -1.0, 1.35, .4, .62);
  sprout(2.6, -1.2, 1.25, -.6, .8);
  sprout(3.2, .4, 1.1, 1.2, .7);
  sprout(-3.0, .2, 1.05, 2.4, .55);
  sprout(1.9, -0.7, 1.3, 1.9, 1.25);

  // Soft contact shadow so the ring sits into the slab top.
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const ctx = cv.getContext('2d'), grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0,0,0,.5)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 256);
  const shadow = add(new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, opacity: .45 })));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .104;

  base.userData.updatePulse = (time) => {
    const pulse = 1 + Math.sin(time * 1.4) * .06;
    sideMaterial.emissiveIntensity = .85 * pulse;
    topMaterial.emissiveIntensity = .85 * pulse;
  };
  return base;
}

export function lightPedestal(THREE, scene, camera) { camera.layers.enable(2); const amb = new THREE.AmbientLight(0xffeed6, .55); amb.layers.set(2); scene.add(amb); const sun = new THREE.DirectionalLight(0xffdfaa, 1.8); sun.layers.set(2); sun.position.set(-3, 3.5, -3.5); scene.add(sun); const sky = new THREE.DirectionalLight(0xb0d2f0, .7); sky.layers.set(2); sky.position.set(2.5, 3.5, 2.5); scene.add(sky); return [amb, sun, sky]; }

export function framePedestal(THREE, camera, controls, base, side = false) { const radius = base.scale.x; const target = base.position.clone().add(new THREE.Vector3(0, radius * .85, 0)); camera.fov = 35; camera.updateProjectionMatrix(); const direction = side ? new THREE.Vector3(4.9, .7, 0) : new THREE.Vector3(0, .7, 4.9); camera.position.copy(target).addScaledVector(direction, radius); camera.lookAt(target); if (controls) { controls.target.copy(target); controls.update() } return target; }
