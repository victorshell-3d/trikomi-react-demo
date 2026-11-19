import * as THREE from "three/webgpu";
import { color, mix, smoothstep, texture, uniform, vec3 } from "three/tsl";

export function prepareMaterials(model: THREE.Object3D, pearls: boolean) {
  const materials: THREE.Material[] = [];
  const tone = uniform(new THREE.Color());
  const finish = uniform(0.3);
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const convert = (source: THREE.Material) => {
      const original = source as THREE.MeshStandardMaterial;
      if (!original.isMeshStandardMaterial) return source;
      const material = new THREE.MeshStandardNodeMaterial();
      THREE.MeshStandardMaterial.prototype.copy.call(material, original);
      const base = original.map
        ? texture(original.map).rgb.mul(color(original.color))
        : vec3(original.color.r, original.color.g, original.color.b);
      const metallic = original.metalnessMap
        ? texture(original.metalnessMap).b.mul(original.metalness)
        : uniform(original.metalness);
      const luminance = base.dot(vec3(0.2126, 0.7152, 0.0722));
      const mask = pearls
        ? smoothstep(0.08, 0.22, metallic).max(smoothstep(0.55, 0.8, luminance))
        : smoothstep(0.08, 0.22, metallic);
      material.colorNode = mix(
        base,
        tone.mul(luminance.mul(2).clamp(0.3, 1.2)),
        mask,
      );
      const roughness = original.roughnessMap
        ? texture(original.roughnessMap).g.mul(original.roughness)
        : uniform(original.roughness);
      material.roughnessNode = mix(roughness, finish, mask);
      materials.push(material);
      original.dispose();
      return material;
    };
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(convert)
      : convert(mesh.material);
  });
  return (hex: string, surface: string) => {
    tone.value.set(hex);
    materials.forEach((material) => {
      material.userData.jewelryTone = hex;
    });
    finish.value =
      surface === "Matte" ? 0.8 : surface === "Chrome" ? 0.08 : 0.3;
  };
}
