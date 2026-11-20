import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three/webgpu';
import { ThreeViewer, ViewerStore, OrbitControlsPlugin, EnvironmentPlugin, GLTFPlugin, CenterModelPlugin, ExportPlugin, DiamondPlugin } from '@trikomi/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
export type RingDesign = { metal: string; size: string; stone: string; carat: string; finish: string; engraving: string };
export type RingController = { setView: (view: string) => void; rotate: () => void; changeRing: (index: number) => Promise<void>; exportModel: () => void; importModel: (file: File) => Promise<void>; setHd: (enabled: boolean) => void; celebrate: () => void; sparkle: () => void; replay: () => void; inspect: () => object };
type Props = { design: RingDesign; step?: number; onReady: (controller: RingController) => void; onStatus: (status: string) => void };
// Own the plugin lifecycle in the app so asynchronous model/cut changes cannot race.
class StudioDiamondPlugin extends DiamondPlugin { onUpdate() {} }
// The packaged declarations mark these runtime lifecycle hooks private and narrow
// updateDiamondGeometry to InstancedMesh, although the supplied rings use Mesh.
// Keep that vendor mismatch in one app-side adapter; do not alter the SDK.
type DiamondLifecycle = {
 restoreOriginalMaterials: () => void;
 applyDiamondMaterial: () => Promise<void>;
 originalMaterials: Map<THREE.Mesh, unknown>;
 updateDiamondGeometry: (mesh: THREE.Mesh, geometry: THREE.BufferGeometry) => Promise<void>;
};
const diamondLifecycle = (plugin: DiamondPlugin) => plugin as unknown as DiamondLifecycle;
type GemMesh = THREE.Mesh & { userData: { studioScale?: THREE.Vector3; originalGeometry?: THREE.BufferGeometry; originalSize?: THREE.Vector3; studioCut?: string; restPos?: THREE.Vector3; gripPoint?: THREE.Vector3; basePos?: THREE.Vector3; seatPivot?: THREE.Vector3 } };
export function RingStage({ design, step = 0, onReady, onStatus }: Props) {
 const [diamondState,setDiamondState]=useState('awaiting-auth');
 const host = useRef<HTMLDivElement>(null); const viewerRef = useRef<ThreeViewer | null>(null); const modelRef = useRef<THREE.Object3D | null>(null); const gemsRef = useRef<GemMesh[]>([]); const metalsRef = useRef<THREE.Mesh[]>([]); const shapeRef = useRef<Record<string,THREE.BufferGeometry>>({}); const latest = useRef(design); const applyRef = useRef<() => void>(() => {}); const stepFxRef = useRef<(step: number) => void>(() => {});
 useEffect(() => { latest.current = design; }, [design]);
 useEffect(() => {
  if (!host.current) return;
  let disposed = false; let generation = 0; let diamond: StudioDiamondPlugin | null = null; let diamondFailed = false; let effectGeneration = 0; let effectQueue = Promise.resolve(); let effectTimer: ReturnType<typeof setTimeout> | undefined;
  const store = new ViewerStore();
  store.setSsgiEnabled(false); store.setSSREnabled(false); store.setProgressiveShadowEnabled(false); store.setBloomEnabled(false); store.setBackgroundColor('transparent'); store.setFloorTransparent(true); store.setUseEnvAsBackground(false); store.setShowEnvironment(true); store.setEnvIntensity(1.3); store.setLightIntensity(3); store.showStats = false;
  const viewer = new ThreeViewer(host.current, store, { enableOnDemandRendering: true }); viewerRef.current = viewer;
  viewer.addPlugin(new EnvironmentPlugin()); viewer.addPlugin(new OrbitControlsPlugin()); viewer.addPlugin(new GLTFPlugin()); viewer.addPlugin(new CenterModelPlugin());
  viewer.camera.position.set(0,2.5,4.5); viewer.camera.lookAt(0,0,0);
  viewer.renderer.setPixelRatio(1); // intro runs at base resolution; finish() upgrades sharp machines after the probe
  const loader = new GLTFLoader(); const draco = new DRACOLoader(); draco.setDecoderPath(`${import.meta.env.BASE_URL}draco/gltf/`); loader.setDRACOLoader(draco);
  loader.load(`${import.meta.env.BASE_URL}models/diamonds.glb`, gltf => { if(disposed)return; gltf.scene.traverse(node => { if((node as THREE.Mesh).isMesh) shapeRef.current[node.name]=(node as THREE.Mesh).geometry; }); applyRef.current(); }, undefined, () => onStatus('Stone library could not load. Original stones are still available.'));
  function effectState(state:string) { if(disposed)return;setDiamondState(state);if(host.current)host.current.dataset.diamondEffect=state; }
  function restoreDiamonds() { if(diamond)diamondLifecycle(diamond).restoreOriginalMaterials(); }
  function refreshDiamonds(changedMesh?: GemMesh) {
   const version=++effectGeneration;
   clearTimeout(effectTimer);
   effectTimer=setTimeout(()=>{
   if(introActive){effectTimer=setTimeout(()=>refreshDiamonds(changedMesh),500);return;} // keep the shader compile off the opening animation
   if(lite){effectState('lite');return;}
   effectQueue=effectQueue.then(async()=>{
    if(disposed||version!==effectGeneration||!modelRef.current)return;if(diamondFailed){viewer.needsRender=true;viewer.play();return;}
    // Shader access follows the vendor's normal successful authentication, never a bypass.
    if(viewer.authStatus!=='AUTHORIZED') {effectState('awaiting-auth');viewer.play();return;}
    effectState('checking');
    if(!diamond){diamond=new StudioDiamondPlugin();viewer.addPlugin(diamond);}
    const renderer=viewer.renderer;
    let shaderFailed=false;
    const debug=renderer.debug;
    const previous=debug.onShaderError;
    debug.onShaderError=(...args: Parameters<NonNullable<typeof previous>>)=>{shaderFailed=true;console.warn('Studio: diamond shader could not compile; using supplied standard materials.');previous?.(...args);};
    try {
     // The plugin recognises diamond names. The supplied Halo uses Crystal instead.
     const renamed: {material:THREE.Material;name:string}[]=[];
     for(const mesh of gemsRef.current)for(const material of(Array.isArray(mesh.material)?mesh.material:[mesh.material]))if(!/diamond/i.test(material.name)){renamed.push({material,name:material.name});material.name='Diamond';}
     try{if(changedMesh&&diamondLifecycle(diamond).originalMaterials.has(changedMesh)){await diamondLifecycle(diamond).updateDiamondGeometry(changedMesh,changedMesh.geometry);}else{await diamondLifecycle(diamond).applyDiamondMaterial();}}finally{for(const entry of renamed)entry.material.name=entry.name;}
     if(disposed)return;
     viewer.pause();
     await renderer.compileAsync(viewer.scene,viewer.camera);
     renderer.render(viewer.scene,viewer.camera);
     if(shaderFailed)throw new Error('Diamond shader compilation failed');
     if(disposed||version!==effectGeneration){restoreDiamonds();return;}
     effectState('enabled');
    }catch(error){
     diamondFailed=true;restoreDiamonds();effectState('fallback');
     console.warn('Studio diamond effect unavailable on this renderer. Original materials restored.',error);
    }finally{debug.onShaderError=previous;viewer.needsRender=true;if(!disposed)viewer.play();}
   });},120);
  }
  function scan(model:THREE.Object3D) {
   modelRef.current=model; gemsRef.current=[]; metalsRef.current=[];
   model.traverse(node => { const mesh=node as GemMesh; if(!mesh.isMesh)return;
    const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    const gem=mats.some(mat=>/diamond|crystal|gem/i.test(mat.name));
    if(gem){mesh.userData.studioScale=mesh.scale.clone();mesh.userData.restPos=mesh.position.clone();mesh.userData.basePos=mesh.position.clone();mesh.userData.originalGeometry=mesh.geometry;mesh.geometry.computeBoundingBox();mesh.userData.originalSize=mesh.geometry.boundingBox?.getSize(new THREE.Vector3());gemsRef.current.push(mesh);}
    else metalsRef.current.push(mesh);
   });
   seatGems(sizeFactor[latest.current.size] ?? 1);
  }
  // Intro: the welded metal mesh splits into band, basket and prongs by world
  // height so the ring can assemble from an exploded pose. App-side only.
  function splitMetalByHeight(mesh:THREE.Mesh,stoneY:number):{band:THREE.Mesh;basket:THREE.Mesh;prongs:THREE.Mesh}|null{
   if(!mesh.parent||Array.isArray(mesh.material))return null;
   const source=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();
   mesh.updateWorldMatrix(true,false);
   const pos=source.attributes.position as THREE.BufferAttribute;
   const box=new THREE.Box3();const v=new THREE.Vector3();
   for(let i=0;i<pos.count;i++)box.expandByPoint(v.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld));
   const span=stoneY-box.min.y;
   if(span<2||span>12)return null; // unexpected proportions: keep the welded mesh
   const cutA=box.min.y+span*0.912; // band -> basket
   const cutB=box.min.y+span*0.9945; // basket -> prong tips
   const attrNames=Object.keys(source.attributes);
   const buckets:Record<string,number[][]>=Object.fromEntries(attrNames.map(name=>[name,[[],[],[]]]));
   const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
   for(let i=0;i<pos.count;i+=3){
    a.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);
    b.fromBufferAttribute(pos,i+1).applyMatrix4(mesh.matrixWorld);
    c.fromBufferAttribute(pos,i+2).applyMatrix4(mesh.matrixWorld);
    const bucket=(a.y+b.y+c.y)/3<cutA?0:(a.y+b.y+c.y)/3<cutB?1:2;
    for(const name of attrNames){const attr=source.attributes[name] as THREE.BufferAttribute;const size=attr.itemSize;for(let k=0;k<3;k++)for(let j=0;j<size;j++)buckets[name][bucket].push((attr.array as Float32Array)[(i+k)*size+j]);}
   }
   const make=(index:number,suffix:string)=>{
    const geometry=new THREE.BufferGeometry();
    for(const name of attrNames){const attr=source.attributes[name] as THREE.BufferAttribute;geometry.setAttribute(name,new THREE.BufferAttribute(new Float32Array(buckets[name][index]),attr.itemSize));}
    const piece=new THREE.Mesh(geometry,mesh.material);
    piece.name=`${mesh.name}_${suffix}`;piece.position.copy(mesh.position);piece.quaternion.copy(mesh.quaternion);piece.scale.copy(mesh.scale);
    piece.userData.restPos=piece.position.clone();
    mesh.parent!.add(piece);
    return piece;
   };
   const pieces={band:make(0,'band'),basket:make(1,'basket'),prongs:make(2,'prongs')};
   const mainGem=gemsRef.current.find(g=>g.parent?.name==='Main');
   if(mainGem){pieces.prongs.updateWorldMatrix(true,false);pieces.prongs.userData.gripPoint=pieces.prongs.parent!.worldToLocal(new THREE.Box3().setFromObject(mainGem).getCenter(new THREE.Vector3()));}
   mesh.parent.remove(mesh);mesh.geometry.dispose();source.dispose();
   return pieces;
  }
  let introPlayed=false;let introRaf=0;let introActive=false;let cutAnimating=false;let cutGeneration=0;let cutRaf=0;let stageLights:THREE.PointLight[]=[];
  // Fixed light budget: effect lights are pre-seated at intensity 0 and reused, because
  // adding or removing a light rebuilds every lit shader (multi-second main-thread stall).
  let fxLights:THREE.PointLight[]=[];let fxLightIdx=0;
  const borrowFxLight=(color:number)=>{if(fxLights.length<3)return undefined;const l=fxLights[2+(fxLightIdx++%(fxLights.length-2))];l.color.set(color);return l;};
  // Small tweens for option changes (metal colour, visual scales, finish sheen). They run their own frame loop and hand the viewer back to on-demand rendering when done.
  const fxParam=new URLSearchParams(window.location.search).get('fx');
  let lite=fxParam==='lite'?true:fxParam==='full'?false:window.matchMedia('(max-width: 720px)').matches;
  const metalColors:Record<string,string>={'Yellow gold':'#dca84d','Rose gold':'#ce8b6d','Platinum':'#dce1e8','White gold':'#e9e4d2'};
  const sizeFactor:Record<string,number>={'6':.94,'7':.97,'8':1,'9':1.03,'10':1.06};
  const caratFactor=(carat:string)=>carat==='90%'?.9:carat==='110%'?1.1:1;
  // Prongs grow with the stone, scaled around the stone centre so they keep their seat. Home and pivot are recorded while the ring is assembled.
  const gripProngs=(mesh:THREE.Mesh,f:number)=>{
   const P0=mesh.userData.restPos as THREE.Vector3|undefined,F=mesh.userData.gripPoint as THREE.Vector3|undefined;
   if(!P0||!F)return;
   mesh.position.copy(F).sub(F.clone().sub(P0).multiplyScalar(f));
  };
  // Gems sit in sibling groups that do not scale with the band, so slide them to the
  // scaled seat: same offset from the metal pivot, multiplied by the ring factor.
  const seatGems=(ring:number)=>{
   const pivotMesh=metalsRef.current[0];if(!pivotMesh)return;
   for(const mesh of gemsRef.current){
    const base=mesh.userData.basePos;if(!base)continue;
    if((mesh.parent as THREE.Mesh)?.isMesh)continue; // a child of a metal mesh already follows it
    if(!mesh.userData.seatPivot){mesh.parent!.updateWorldMatrix(true,false);mesh.userData.seatPivot=mesh.parent!.worldToLocal(pivotMesh.getWorldPosition(new THREE.Vector3()));}
    mesh.position.copy(mesh.userData.seatPivot).add(base.clone().sub(mesh.userData.seatPivot).multiplyScalar(ring));
    mesh.userData.restPos=mesh.position.clone();
   }
   const mainGem=gemsRef.current.find(m=>m.parent?.name==='Main');
   const prongs=metalsRef.current[2];
   if(mainGem&&prongs?.userData.gripPoint){prongs.parent!.updateWorldMatrix(true,false);prongs.userData.gripPoint=prongs.parent!.worldToLocal(new THREE.Box3().setFromObject(mainGem).getCenter(new THREE.Vector3()));}
  };
  type Fx={kind:'metal'|'scale'|'sweep'|'cam'|'spin';t0:number;dur:number;from?:THREE.Color;to?:THREE.Color;r0?:number;r1?:number;c0?:number;c1?:number;overshoot?:number;light?:THREE.PointLight;p0?:THREE.Vector3;p1?:THREE.Vector3;s0?:THREE.Spherical;s1?:THREE.Spherical;tgt?:THREE.Vector3;node?:THREE.Object3D;a0?:number;peak?:number;gems?:{mesh:THREE.Object3D;to:THREE.Vector3;delay:number}[];dir?:'in'|'out';onDone?:()=>void};
  let homeSph:THREE.Spherical|null=null;let homeTarget=new THREE.Vector3();let stepInit=false;
  const fxList:Fx[]=[];const scaleState={ring:1,carat:1};const lastApplied={...latest.current};let fxRaf=0;let loadingModel=false;
  function playAssembleIntro(){
   const metal=metalsRef.current.length===1?metalsRef.current[0]:null;
   const stone=gemsRef.current.find(mesh=>mesh.parent?.name==='Main');
   if(!metal||!stone)return;
   stone.updateWorldMatrix(true,false);
   const stoneBox=new THREE.Box3().setFromObject(stone);
   const stoneC=stoneBox.getCenter(new THREE.Vector3());
   const pieces=splitMetalByHeight(metal,stoneC.y);
   if(!pieces)return;
   introPlayed=true;
   metalsRef.current=[pieces.band,pieces.basket,pieces.prongs];
   const toLocal=(obj:THREE.Object3D,world:THREE.Vector3)=>{
    const parent=obj.parent;if(!parent)return world.clone();
    parent.updateWorldMatrix(true,false);
    return world.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(parent.matrixWorld).invert());
   };
   const bandBox=new THREE.Box3().setFromObject(pieces.band);
   const ringCenterY=(bandBox.min.y+bandBox.max.y)/2;
   const axisWorld=new THREE.Vector3(stoneC.x,ringCenterY,stoneC.z);
   type Mover={mesh:THREE.Object3D;to:THREE.Vector3;off:THREE.Vector3;axisP:THREE.Vector3;axisD:THREE.Vector3;spin:number;delay:number;dur:number;kind:'drop'|'float'|'stone';base?:THREE.Vector3};
   const movers:Mover[]=[];
   const add=(obj:THREE.Object3D,world:THREE.Vector3,spin:number,delay:number,dur:number,kind:Mover['kind'])=>{
    const to=obj.position.clone();const off=toLocal(obj,world);
    obj.updateWorldMatrix(true,false);
    const axisP=obj.parent?obj.parent.worldToLocal(axisWorld.clone()):axisWorld.clone();
    const axisD=toLocal(obj,new THREE.Vector3(0,1,0)).normalize();
    obj.position.copy(to).add(off);
    movers.push({mesh:obj,to,off,axisP,axisD,spin,delay,dur,kind});
   };
   add(pieces.basket,new THREE.Vector3(0,0.62,0),0.35,0,0.6,'drop');
   add(pieces.prongs,new THREE.Vector3(0,1.4,0),0.5,0.25,0.6,'drop');
   add(stone,new THREE.Vector3(0,2.0,0),2.3,1.35,0.7,'stone');
   const ripple=(a:THREE.Object3D,b:THREE.Object3D)=>{const ca=new THREE.Box3().setFromObject(a).getCenter(new THREE.Vector3());const cb=new THREE.Box3().setFromObject(b).getCenter(new THREE.Vector3());return Math.atan2(ca.z-stoneC.z,ca.x-stoneC.x)-Math.atan2(cb.z-stoneC.z,cb.x-stoneC.x);};
   gemsRef.current.filter(mesh=>mesh.parent?.name==='Top').sort(ripple).forEach((mesh,i)=>{
    const c=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    const dir=new THREE.Vector3(c.x-stoneC.x,0,c.z-stoneC.z).normalize();
    add(mesh,new THREE.Vector3(dir.x*0.22,1.05,dir.z*0.22),1.7,0.5+i*0.022,0.65,'float');
   });
   gemsRef.current.filter(mesh=>mesh.parent?.name==='Side').sort(ripple).forEach((mesh,i)=>{
    const c=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    const dir=new THREE.Vector3(c.x,c.y-ringCenterY,0).normalize();
    add(mesh,new THREE.Vector3(dir.x*0.3,dir.y*0.3+0.28,dir.z*0.25),1.0,0.65+i*0.022,0.6,'float');
   });
   const END=2.75;
   const ease=(t:number)=>{t=Math.min(1,Math.max(0,t));return t*t*t*(t*(t*6-15)+10);};
   const easeOutBack=(t:number,c:number)=>{t=Math.min(1,Math.max(0,t));return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
   const easeStone=(t:number)=>{t=Math.min(1,Math.max(0,t));if(t<0.78){const q=t/0.78;return 0.93*q*q*q;}const q=(t-0.78)/0.22;return 0.93+0.07*easeOutBack(q,3);};
   const hostObj=pieces.band.parent;
   const flash=fxLights[0];
   const glow=fxLights[1];
   if(hostObj&&flash&&glow){
    hostObj.updateWorldMatrix(true,false);
    flash.color.set(0xffe9c4);flash.decay=1.6;flash.position.copy(hostObj.worldToLocal(new THREE.Vector3(stoneC.x,stoneC.y+0.12,stoneC.z)));
    glow.color.set(0xffd9a0);glow.decay=1.5;glow.position.copy(hostObj.worldToLocal(new THREE.Vector3(stoneC.x,bandBox.min.y+0.35,stoneC.z)));
    stageLights=[flash,glow];
   }
   const cam=viewer.camera;
   const controls=viewer.getPlugin(OrbitControlsPlugin) as unknown as {controls?:{target?:THREE.Vector3}}|undefined;
   const camTarget=controls?.controls?.target?.clone() ?? new THREE.Vector3(stoneC.x,ringCenterY,stoneC.z);
   const camSph=new THREE.Spherical();
   let camReady=false;
   const tmp=new THREE.Vector3();
   const pose=(t:number)=>{
    for(const m of movers){
     const raw=Math.min(1,Math.max(0,(t-m.delay)/m.dur));
     const e=m.kind==='stone'?easeStone(raw):m.kind==='drop'?easeOutBack(raw,1.4):ease(raw);
     if(m.base===undefined)m.base=m.mesh.scale.clone();
     tmp.copy(m.off).multiplyScalar(1-e).add(m.to);
     const angle=m.spin*(1-e);
     if(angle!==0&&e<1)tmp.sub(m.axisP).applyAxisAngle(m.axisD,angle).add(m.axisP);
     m.mesh.position.copy(tmp);
     if(m.kind!=='drop'){
      const pop=raw>0.82?Math.sin((raw-0.82)/0.18*Math.PI):0;
      m.mesh.scale.copy(m.base).multiplyScalar(1+0.22*pop);
     }
    }
    if(flash){const fi=t<2.0?0:t<2.15?(t-2.0)/0.15:Math.max(0,1-(t-2.15)/0.55);flash.intensity=3.2*fi;}
    if(glow){const gi=t<1.8?0:t<2.1?(t-1.8)/0.3:Math.max(0,1-(t-2.1)/0.5);glow.intensity=1.6*gi;}
    if(cam&&t>=0){
     if(!camReady){camReady=true;camSph.setFromVector3(cam.position.clone().sub(camTarget));}
     const s=ease(Math.min(1,t/2.1));
     cam.position.setFromSphericalCoords(camSph.radius*(1+0.06*(1-s)),camSph.phi*(0.45+0.55*s),camSph.theta+0.14*(1-s)).add(camTarget);
     cam.lookAt(camTarget);
    }
   };
   const finish=()=>{
    if(flash)flash.intensity=0;
    if(glow)glow.intensity=0;
    stageLights=[];
    if(!lite)viewer.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    viewer.needsRender=true;
    setTimeout(()=>{if(!disposed)viewer.pause();},300);
   };
   const myGeneration=generation;const start=performance.now()+250;
   introActive=true;
   viewer.play();
   let probeN=0;const probeT0=performance.now();let probeDone=fxParam!==null;
   const tick=()=>{
    if(disposed||myGeneration!==generation||!introActive)return;
    const t=(performance.now()-start)/1000;pose(t);updateShadow();
    probeN++;if(!probeDone){const el=performance.now()-probeT0;if(el>900){probeDone=true;if(probeN/(el/1000)<26){lite=true;for(const l of stageLights)l.intensity=0;stageLights=[];}}}
    viewer.needsRender=true;
    if(t<END)introRaf=requestAnimationFrame(tick);
    else{introActive=false;finish();}
   };
   introRaf=requestAnimationFrame(tick);
  }
  function playCutSwap(main:GemMesh){
   const basket=metalsRef.current[1],prongs=metalsRef.current[2];
   if(!basket||!prongs)return;
   for(const l of stageLights)l.intensity=0;stageLights=[];
   cutAnimating=true;const myCut=++cutGeneration;
   introActive=false;cancelAnimationFrame(introRaf);
   main.updateWorldMatrix(true,false);
   const stoneC=new THREE.Box3().setFromObject(main).getCenter(new THREE.Vector3());
   const toLocal=(obj:THREE.Object3D,world:THREE.Vector3)=>{
    const parent=obj.parent;if(!parent)return world.clone();
    parent.updateWorldMatrix(true,false);
    return world.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(parent.matrixWorld).invert());
   };
   const bandBox=new THREE.Box3().setFromObject(metalsRef.current[0]);
   const ringCenterY=(bandBox.min.y+bandBox.max.y)/2;
   const axisWorld=new THREE.Vector3(stoneC.x,ringCenterY,stoneC.z);
   type CMover={mesh:THREE.Object3D;to:THREE.Vector3;off:THREE.Vector3;axisP:THREE.Vector3;axisD:THREE.Vector3;spin:number;oD:number;oU:number;cD:number;cU:number;pop:boolean;base?:THREE.Vector3};
   const movers:CMover[]=[];
   const add=(obj:THREE.Object3D,world:THREE.Vector3,spin:number,oD:number,oU:number,cD:number,cU:number,pop:boolean)=>{
    const to=(obj.userData.restPos as THREE.Vector3|undefined)?.clone() ?? obj.position.clone();const off=toLocal(obj,world);
    obj.updateWorldMatrix(true,false);
    const axisP=obj.parent?obj.parent.worldToLocal(axisWorld.clone()):axisWorld.clone();
    const axisD=toLocal(obj,new THREE.Vector3(0,1,0)).normalize();
    movers.push({mesh:obj,to,off,axisP,axisD,spin,oD,oU,cD,cU,pop});
   };
   add(basket,new THREE.Vector3(0,0.62,0),0.35,0,0.55,2.4,0.55,false);
   add(prongs,new THREE.Vector3(0,1.4,0),0.5,0.1,0.55,2.35,0.55,false);
   const ripple=(a:THREE.Object3D,b:THREE.Object3D)=>{const ca=new THREE.Box3().setFromObject(a).getCenter(new THREE.Vector3());const cb=new THREE.Box3().setFromObject(b).getCenter(new THREE.Vector3());return Math.atan2(ca.z-stoneC.z,ca.x-stoneC.x)-Math.atan2(cb.z-stoneC.z,cb.x-stoneC.x);};
   gemsRef.current.filter(mesh=>mesh!==main&&mesh.parent?.name==='Top').sort(ripple).forEach((mesh,i)=>{
    const c=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    const dir=new THREE.Vector3(c.x-stoneC.x,0,c.z-stoneC.z).normalize();
    add(mesh,new THREE.Vector3(dir.x*0.22,1.05,dir.z*0.22),1.7,0.15+i*0.012,0.55,2.1+i*0.008,0.5,true);
   });
   gemsRef.current.filter(mesh=>mesh.parent?.name==='Side').sort(ripple).forEach((mesh,i)=>{
    const c=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    const dir=new THREE.Vector3(c.x,c.y-ringCenterY,0).normalize();
    add(mesh,new THREE.Vector3(dir.x*0.3,dir.y*0.3+0.28,dir.z*0.25),1.0,0.18+i*0.012,0.55,2.15+i*0.008,0.5,true);
   });
   const stoneTo=(main.userData.restPos as THREE.Vector3|undefined)?.clone() ?? main.position.clone();
   main.updateWorldMatrix(true,false);
   const stoneAxisP=main.parent?main.parent.worldToLocal(axisWorld.clone()):axisWorld.clone();
   const stoneAxisD=toLocal(main,new THREE.Vector3(0,1,0)).normalize();
   const outOff=toLocal(main,new THREE.Vector3(1.6,2.2,0));
   const inOff=toLocal(main,new THREE.Vector3(0,2.2,0));
   const stoneBase=main.scale.clone();
   const END=3.0;
   const ease=(t:number)=>{t=Math.min(1,Math.max(0,t));return t*t*t*(t*(t*6-15)+10);};
   const easeOutBack=(t:number,c:number)=>{t=Math.min(1,Math.max(0,t));return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
   const easeStone=(t:number)=>{t=Math.min(1,Math.max(0,t));if(t<0.78){const q=t/0.78;return 0.93*q*q*q;}const q=(t-0.78)/0.22;return 0.93+0.07*easeOutBack(q,3);};
   const easeExpo=(t:number)=>{t=Math.min(1,Math.max(0,t));return t>=1?1:1-Math.pow(2,-10*t);};
   const hostObj=metalsRef.current[0].parent;
   const flash=fxLights[0];
   const glow=fxLights[1];
   if(hostObj&&flash&&glow){
    hostObj.updateWorldMatrix(true,false);
    flash.color.set(0xffe9c4);flash.decay=1.6;flash.position.copy(hostObj.worldToLocal(new THREE.Vector3(stoneC.x,stoneC.y+0.12,stoneC.z)));
    glow.color.set(0xffd9a0);glow.decay=1.5;glow.position.copy(hostObj.worldToLocal(new THREE.Vector3(stoneC.x,bandBox.min.y+0.35,stoneC.z)));
    stageLights=[flash,glow];
   }
   const cam=viewer.camera;
   const controls=viewer.getPlugin(OrbitControlsPlugin) as unknown as {controls?:{target?:THREE.Vector3}}|undefined;
   const camTarget=controls?.controls?.target?.clone() ?? new THREE.Vector3(stoneC.x,ringCenterY,stoneC.z);
   const camSph=new THREE.Spherical();
   let camReady=false;
   let swapped=false;
   const tmp=new THREE.Vector3();
   const pose=(t:number)=>{
    for(const m of movers){
     const openT=(t-m.oD)/m.oU;
     const dip=openT<0&&openT>-0.18?-0.05*Math.sin(Math.PI*(openT+0.18)/0.18):0;
     const q=Math.max(-0.06,easeExpo(openT)-ease((t-m.cD)/m.cU)+dip);
     tmp.copy(m.off).multiplyScalar(q).add(m.to);
     const angle=m.spin*q;
     if(angle!==0)tmp.sub(m.axisP).applyAxisAngle(m.axisD,angle).add(m.axisP);
     m.mesh.position.copy(tmp);
     if(m.base===undefined)m.base=m.mesh.scale.clone();
     const cRaw=m.pop?Math.min(1,Math.max(0,(t-m.cD)/m.cU)):0;
     const pop=cRaw>0.82?Math.sin((cRaw-0.82)/0.18*Math.PI):0;
     m.mesh.scale.copy(m.base).multiplyScalar(1+0.18*pop);
    }
    const sPos=stoneTo.clone();let sScale=1;
    if(t>=0.85&&t<1.35){const e=ease((t-0.85)/0.5);sPos.add(tmp.copy(outOff).multiplyScalar(e));sPos.sub(stoneAxisP).applyAxisAngle(stoneAxisD,2.3*e).add(stoneAxisP);sScale=Math.max(0.001,1-e);}
    else if(t>=1.35&&t<1.45){sPos.add(outOff);sScale=0.001;}
    else if(t>=1.45){const raw=Math.min(1,(t-1.45)/0.7);const e=easeStone(raw);sPos.add(tmp.copy(inOff).multiplyScalar(1-e));const a=2.3*(1-e);if(a!==0)sPos.sub(stoneAxisP).applyAxisAngle(stoneAxisD,a).add(stoneAxisP);const pop=raw>0.82?Math.sin((raw-0.82)/0.18*Math.PI):0;sScale=Math.max(0.001,raw)*(1+0.22*pop);}
    main.position.copy(sPos);main.scale.copy(stoneBase).multiplyScalar(sScale);
    if(!swapped&&t>=1.37){swapped=true;const target=latest.current.stone;if(main.userData.studioCut!==target){const source=target==='Original'?main.userData.originalGeometry:shapeRef.current[target];if(source&&main.userData.originalGeometry){if(main.geometry!==main.userData.originalGeometry)main.geometry.dispose();if(target==='Original')main.geometry=source;else{const geometry=source.clone();geometry.computeBoundingBox();const size=geometry.boundingBox?.getSize(new THREE.Vector3());const orig=main.userData.originalSize;if(size&&orig){const ratio=Math.max(orig.x,orig.z)/Math.max(size.x,size.z);geometry.scale(ratio,ratio,ratio);}main.geometry=geometry;}main.userData.studioCut=target;refreshDiamonds(main);}}}
    if(flash){const fi=t<2.1?0:t<2.23?(t-2.1)/0.13:Math.max(0,1-(t-2.23)/0.5);flash.intensity=3.2*fi;}
    if(glow){const gi=t<1.98?0:t<2.23?(t-1.98)/0.25:Math.max(0,1-(t-2.23)/0.45);glow.intensity=1.6*gi;}
    if(cam){
     if(!camReady){camReady=true;camSph.setFromVector3(cam.position.clone().sub(camTarget));}
     const topAmt=Math.max(0,ease(t/0.8)-ease((t-2.15)/0.75));
     cam.position.setFromSphericalCoords(camSph.radius*(1-0.08*topAmt),camSph.phi*(1-0.8*topAmt),camSph.theta+0.1*topAmt).add(camTarget);
     cam.lookAt(camTarget);
    }
   };
   const finish=()=>{
    if(flash)flash.intensity=0;
    if(glow)glow.intensity=0;
    stageLights=[];
    cutAnimating=false;
    applyRef.current();
    viewer.needsRender=true;
    setTimeout(()=>{if(!disposed)viewer.pause();},300);
   };
   pose(0);
   const myGeneration=generation;const start=performance.now();
   viewer.play();
   const tick=()=>{
    if(disposed||myGeneration!==generation||myCut!==cutGeneration)return;
    const t=(performance.now()-start)/1000;pose(t);updateShadow();
    viewer.needsRender=true;
    if(t<END)cutRaf=requestAnimationFrame(tick);
    else finish();
   };
   cutRaf=requestAnimationFrame(tick);
  }
  const poseFx=(fx:Fx,now:number)=>{
   const raw=Math.min(1,Math.max(0,(now-fx.t0)/1000/fx.dur));
   if(fx.kind==='metal'&&fx.from&&fx.to){
    const e=raw*raw*(3-2*raw);
    for(const mesh of metalsRef.current)for(const mat of (Array.isArray(mesh.material)?mesh.material:[mesh.material])){(mat as THREE.MeshStandardMaterial).color?.lerpColors(fx.from,fx.to,e);}
   }else if(fx.kind==='scale'){
    const c=fx.overshoot ?? 1.4;const e=raw>=1?1:1+(c+1)*Math.pow(raw-1,3)+c*Math.pow(raw-1,2);
    const ring=fx.r0!+(fx.r1!-fx.r0!)*e,carat=fx.c0!+(fx.c1!-fx.c0!)*e;
    scaleState.ring=ring;scaleState.carat=carat;
    for(const mesh of metalsRef.current){const base=mesh.userData.studioScale;if(!base)continue;const prF=mesh===metalsRef.current[2]?1+(carat-1)*0.85:1;mesh.scale.set(base.x*ring*prF,base.y*ring*prF,base.z*ring*prF);if(mesh===metalsRef.current[2]&&!introActive&&!cutAnimating)gripProngs(mesh,prF);}
    for(const mesh of gemsRef.current){const base=mesh.userData.studioScale;if(base)mesh.scale.copy(base).multiplyScalar(ring*carat);}
    if(!fxList.some(f=>f.kind==='cascade'))seatGems(ring);
   }else if(fx.kind==='sweep'&&fx.light&&fx.p0&&fx.p1){
    const e=raw*raw*(3-2*raw);
    fx.light.position.lerpVectors(fx.p0,fx.p1,e);
    fx.light.intensity=(fx.peak ?? 2.2)*Math.sin(Math.PI*raw);
   }else if(fx.kind==='cascade'&&fx.gems){
    const el=(now-fx.t0)/1000;const gemDur=fx.dir==='in'?0.45:0.3;
    for(const g of fx.gems){
     const r=Math.min(1,Math.max(0,(el-g.delay)/gemDur));
     const e=fx.dir==='in'?(r>=1?1:1+2.8*Math.pow(r-1,3)+1.8*Math.pow(r-1,2)):r*r;
     g.mesh.scale.copy(g.to).multiplyScalar(fx.dir==='in'?Math.max(0.001,e):Math.max(0.001,1-e));
    }
   }else if(fx.kind==='cam'&&fx.s0&&fx.s1&&fx.tgt){
    const e=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2;
    let dTheta=fx.s1.theta-fx.s0.theta;dTheta=Math.atan2(Math.sin(dTheta),Math.cos(dTheta));
    viewer.camera.position.setFromSphericalCoords(fx.s0.radius+(fx.s1.radius-fx.s0.radius)*e,fx.s0.phi+(fx.s1.phi-fx.s0.phi)*e,fx.s0.theta+dTheta*e).add(fx.tgt);
    viewer.camera.lookAt(fx.tgt);
   }else if(fx.kind==='spin'&&fx.node){
    const e=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2;
    fx.node.rotation.y=fx.a0!+Math.PI*2*e;
   }
  };
  const pumpFx=()=>{
   if(disposed)return;
   const now=performance.now();
   for(let i=fxList.length-1;i>=0;i--){const fx=fxList[i];poseFx(fx,now);if(now-fx.t0>=fx.dur*1000){if(fx.kind==='scale'){scaleState.ring=fx.r1!;scaleState.carat=fx.c1!;}if(fx.kind==='spin'&&fx.node)fx.node.rotation.y=fx.a0 ?? 0;if(fx.light)fx.light.intensity=0;fx.onDone?.();fxList.splice(i,1);}}
   updateShadow();
   viewer.needsRender=true;
   if(fxList.length)fxRaf=requestAnimationFrame(pumpFx);
   else{applyRef.current();setTimeout(()=>{if(!disposed&&!idleActive&&!introActive&&!cutAnimating)viewer.pause();},300);}
  };
  let replayBoost=1;
  const startFx=(fx:Fx)=>{
   idleLast=performance.now();stopIdle();
   if(replayBoost!==1){fx.dur=Math.max(0.2,fx.dur*replayBoost);replayBoost=1;}
   for(let i=fxList.length-1;i>=0;i--)if(fxList[i].kind===fx.kind){const old=fxList[i];if(old.light)old.light.intensity=0;fxList.splice(i,1);}
   fxList.push(fx);
   viewer.play();cancelAnimationFrame(fxRaf);fxRaf=requestAnimationFrame(pumpFx);
  };

  // The user grabbing the ring wins over a running camera move.
  host.current?.addEventListener('pointerdown',()=>{for(let i=fxList.length-1;i>=0;i--)if(fxList[i].kind==='cam')fxList.splice(i,1);});
  // Each design step gets its own camera angle; the stone step leans over the top so the stone stays in view.
  stepFxRef.current=(next:number)=>{
   if(!stepInit){stepInit=true;return;}
   if(!homeSph||introActive||cutAnimating||loadingModel)return;
   const cam=viewer.camera;
   const cur=new THREE.Spherical().setFromVector3(cam.position.clone().sub(homeTarget));
   let to:THREE.Spherical;
   if(next===1)to=new THREE.Spherical(homeSph.radius,homeSph.phi*0.55,homeSph.theta+0.3);
   else if(next===2)to=new THREE.Spherical(homeSph.radius,Math.min(Math.PI/2,homeSph.phi*1.05),homeSph.theta-0.55);
   else to=homeSph.clone();
   startFx({kind:'cam',t0:performance.now(),dur:0.9,s0:cur,s1:to,tgt:homeTarget.clone()});
  };
  // Classic <-> Halo switch: accent stones spiral out of the old ring and into the new one, one by one around the band, main stone last.
  const playGemCascade=(direction:'in'|'out')=>new Promise<void>((resolve)=>{
   const gems=gemsRef.current.filter(g=>g.userData.studioScale);
   if(lite||!gems.length||!modelRef.current){resolve();return;}
   const ring=sizeFactor[latest.current.size] ?? 1,carat=caratFactor(latest.current.carat);
   const center=new THREE.Box3().setFromObject(modelRef.current).getCenter(new THREE.Vector3());
   const ordered=gems.map(mesh=>{const c=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());return {mesh,ang:Math.atan2(c.z-center.z,c.x-center.x),main:mesh.parent?.name==='Main'};}).sort((a,b)=>(a.ang-b.ang)||(Number(a.main)-Number(b.main)));
   const stagger=direction==='in'?0.018:0.008,gemDur=direction==='in'?0.45:0.3;
   const list=ordered.map((o,i)=>({mesh:o.mesh,to:(o.mesh.userData.studioScale as THREE.Vector3).clone().multiplyScalar(ring*carat),delay:i*stagger}));
   if(direction==='in')for(const g of list)g.mesh.scale.copy(g.to).multiplyScalar(0.001);
   startFx({kind:'cascade',t0:performance.now(),dur:gemDur+stagger*(list.length-1),gems:list,dir:direction,onDone:()=>resolve()});
  });
  // Warm sparkle flash parked on a gem; used for save/heart feedback.
  const flashAt=(target:THREE.Object3D|undefined,peak:number)=>{
   const hostObj=metalsRef.current[0]?.parent;if(!target||!hostObj)return;
   hostObj.updateWorldMatrix(true,false);
   const p=hostObj.worldToLocal(new THREE.Box3().setFromObject(target).getCenter(new THREE.Vector3()));
   const light=borrowFxLight(0xffe9c4);if(!light)return;light.position.copy(p);
   startFx({kind:'sweep',t0:performance.now(),dur:0.6,light,p0:p.clone(),p1:p.clone(),peak});
  };
  // Same flash without touching the idle timer; the idle loop uses it for occasional glints.
  const glintAt=(mesh:THREE.Object3D)=>{
   const hostObj=metalsRef.current[0]?.parent;if(!hostObj)return;
   hostObj.updateWorldMatrix(true,false);
   const p=hostObj.worldToLocal(new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3()));
   const light=borrowFxLight(0xffe9c4);if(!light)return;light.position.copy(p);
   fxList.push({kind:'sweep',t0:performance.now(),dur:0.5,light,p0:p.clone(),p1:p.clone(),peak:1.3});
   cancelAnimationFrame(fxRaf);fxRaf=requestAnimationFrame(pumpFx);
  };
  // After a quiet spell the ring turns slowly and a gem glints now and then; any touch or option change stops it.
  let idleRaf=0;let idleActive=false;let idleLast=performance.now();let nextGlint=0;
  const stopIdle=()=>{if(!idleActive)return;idleActive=false;cancelAnimationFrame(idleRaf);setTimeout(()=>{if(!disposed&&!idleActive&&!fxList.length&&!introActive&&!cutAnimating)viewer.pause();},250);};
  host.current?.addEventListener('pointerdown',()=>{idleLast=performance.now();stopIdle();});
  host.current?.addEventListener('wheel',()=>{idleLast=performance.now();stopIdle();},{passive:true});
  const idleTimer=setInterval(()=>{
   if(disposed||idleActive||lite||loadingModel||fxList.length||introActive||cutAnimating||!modelRef.current)return;
   if(performance.now()-idleLast<7000)return;
   idleActive=true;nextGlint=performance.now()+2500;viewer.play();
   let prev=performance.now();
   const spin=()=>{if(disposed||!idleActive)return;const now=performance.now();const dt=(now-prev)/1000;prev=now;const node=modelRef.current;if(node)node.rotation.y+=dt*0.22;if(now>=nextGlint){nextGlint=now+3200+Math.random()*2800;const gems=gemsRef.current;if(gems.length)glintAt(gems[Math.floor(Math.random()*gems.length)]);}updateShadow();viewer.needsRender=true;idleRaf=requestAnimationFrame(spin);};
   idleRaf=requestAnimationFrame(spin);
  },1000);
  // Orbit only moves the camera; a paused viewer would never paint the drag. Wake for the gesture, then settle back to on-demand.
  const orbit=viewer.getPlugin(OrbitControlsPlugin) as unknown as {controls?:{addEventListener:(type:string,cb:()=>void)=>void}}|undefined;
  let interactPause: ReturnType<typeof setTimeout> | undefined;
  orbit?.controls?.addEventListener('start',()=>{clearTimeout(interactPause);viewer.play();});
  orbit?.controls?.addEventListener('end',()=>{clearTimeout(interactPause);interactPause=setTimeout(()=>{if(!disposed&&!idleActive&&!fxList.length&&!introActive&&!cutAnimating)viewer.pause();},300);});
  // Our own soft contact shadow under the ring (the SDK floor stays transparent). It spreads and fades as stones lift, and scales with ring size.
  let shadow:THREE.Mesh|null=null;let shadowBase=1;let stoneSeatY=0;
  const ensureShadow=()=>{
   if(shadow||!modelRef.current)return;
   const hostObj=metalsRef.current[0]?.parent ?? modelRef.current;
   hostObj.updateWorldMatrix(true,false);
   const box=new THREE.Box3().setFromObject(modelRef.current);
   const cv=document.createElement('canvas');cv.width=cv.height=256;const ctx=cv.getContext('2d')!;
   const grad=ctx.createRadialGradient(128,128,10,128,128,128);grad.addColorStop(0,'rgba(0,0,0,0.8)');grad.addColorStop(0.55,'rgba(0,0,0,0.32)');grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,256,256);
   shadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,opacity:0.5}));
   shadow.rotation.x=-Math.PI/2;shadow.renderOrder=2;
   shadow.position.copy(hostObj.worldToLocal(new THREE.Vector3((box.min.x+box.max.x)/2,box.min.y-0.02,(box.min.z+box.max.z)/2)));
   shadowBase=(box.max.x-box.min.x)*1.2;shadow.scale.setScalar(shadowBase);
   const main=gemsRef.current.find(m=>m.parent?.name==='Main');if(main){mainGemCache=main;stoneSeatY=main.getWorldPosition(new THREE.Vector3()).y;}
   hostObj.add(shadow);
  };
  let mainGemCache:THREE.Object3D|null=null;const shadowV=new THREE.Vector3();
  const updateShadow=()=>{
   if(!shadow)return;
   if(mainGemCache&&!mainGemCache.parent)mainGemCache=null;
   if(!mainGemCache)mainGemCache=gemsRef.current.find(m=>m.parent?.name==='Main') ?? null;
   const lift=mainGemCache?Math.max(0,mainGemCache.getWorldPosition(shadowV).y-stoneSeatY):0;
   const ring=sizeFactor[latest.current.size] ?? 1;
   shadow.scale.setScalar(shadowBase*ring*(1+lift*0.16));
   (shadow.material as THREE.MeshBasicMaterial).opacity=Math.max(0.12,0.5/(1+lift*0.6));
  };
  applyRef.current=()=>{
   if(!modelRef.current)return;
   const current=latest.current;
   const fxOk=!loadingModel&&!introActive&&!cutAnimating&&metalsRef.current.length>0;
   if(fxOk){
    if(lastApplied.metal!==current.metal){
     const shown=(metalsRef.current[0]?.material as THREE.MeshStandardMaterial|undefined)?.color;
     const target=new THREE.Color(metalColors[current.metal] || '#dca84d');
     startFx({kind:'metal',t0:performance.now(),dur:lite?0.35:0.5,from:shown?shown.clone():target.clone(),to:target});
     if(!lite){const hostObj=metalsRef.current[0]?.parent;if(hostObj){hostObj.updateWorldMatrix(true,false);const glint=borrowFxLight(0xfff2d0);if(glint){glint.position.copy(hostObj.worldToLocal(new THREE.Vector3(-1.5,2.6,0.9)));startFx({kind:'sweep',t0:performance.now(),dur:0.85,light:glint,p0:hostObj.worldToLocal(new THREE.Vector3(-1.5,2.6,0.9)),p1:hostObj.worldToLocal(new THREE.Vector3(1.5,2.6,0.9)),peak:1.5});}}}
    }
    if(lastApplied.size!==current.size||lastApplied.carat!==current.carat){
     startFx({kind:'scale',t0:performance.now(),dur:lite?0.4:0.55,r0:scaleState.ring,r1:sizeFactor[current.size] ?? 1,c0:scaleState.carat,c1:caratFactor(current.carat),overshoot:lastApplied.carat!==current.carat?2.4:1.3});
    }
    if(lastApplied.finish!==current.finish&&!lite){
     const hostObj=metalsRef.current[0]?.parent;
     if(hostObj){hostObj.updateWorldMatrix(true,false);const sweep=borrowFxLight(0xffe9c4);if(sweep){sweep.position.copy(hostObj.worldToLocal(new THREE.Vector3(-1.5,2.6,0.9)));startFx({kind:'sweep',t0:performance.now(),dur:0.7,light:sweep,p0:hostObj.worldToLocal(new THREE.Vector3(-1.5,2.6,0.9)),p1:hostObj.worldToLocal(new THREE.Vector3(1.5,2.6,0.9))});}}
    }
   }
   Object.assign(lastApplied,current);
   const metalFxOn=fxList.some(fx=>fx.kind==='metal');
   const scaleFxOn=fxList.some(fx=>fx.kind==='scale');
   const cascadeFxOn=fxList.some(fx=>fx.kind==='cascade');
   for(const mesh of metalsRef.current){for(const mat of (Array.isArray(mesh.material)?mesh.material:[mesh.material])){const metal=mat as THREE.MeshStandardMaterial;if(!metalFxOn)metal.color?.set(metalColors[current.metal] || '#dca84d');metal.metalness=1;metal.roughness=current.finish==='Satin'?.38:current.finish==='Brushed'?.58:.12;metal.needsUpdate=true;}}
   // These are explicit visual scales, not physical ring sizes or carat claims.
   const ringSize=sizeFactor[current.size] ?? 1;
   if(!scaleFxOn){scaleState.ring=ringSize;scaleState.carat=caratFactor(current.carat);}
   for(const mesh of metalsRef.current){ if(!mesh.userData.studioScale)mesh.userData.studioScale=mesh.scale.clone();const base=mesh.userData.studioScale;const prF=mesh===metalsRef.current[2]?1+(caratFactor(current.carat)-1)*0.85:1;if(!scaleFxOn){mesh.scale.set(base.x*ringSize*prF,base.y*ringSize*prF,base.z*ringSize*prF);if(mesh===metalsRef.current[2]&&!introActive&&!cutAnimating)gripProngs(mesh,prF);} }
   for(const mesh of gemsRef.current){const base=mesh.userData.studioScale;if(base&&!scaleFxOn&&!cascadeFxOn)mesh.scale.copy(base).multiplyScalar(ringSize*caratFactor(current.carat));}
   if(!scaleFxOn&&!cascadeFxOn)seatGems(ringSize);
   // Apply selected cuts to the main stone only. Side stones retain their original fit.
   const main=gemsRef.current.find(mesh=>mesh.parent?.name==='Main') || gemsRef.current[0];
   let cutChanged=false;
   if(main&&main.userData.studioCut===undefined)main.userData.studioCut=current.stone;
   if(main&&main.userData.studioCut!==current.stone){if(cutAnimating){/* the running swap picks up the latest cut at its swap step */}else if(metalsRef.current.length===3&&!introActive&&!loadingModel&&!cascadeFxOn){playCutSwap(main);}else{viewer.pause();cutChanged=true;main.userData.studioCut=current.stone;const source=current.stone==='Original'?main.userData.originalGeometry:shapeRef.current[current.stone];if(source&&main.userData.originalGeometry){if(main.geometry!==main.userData.originalGeometry)main.geometry.dispose();if(current.stone==='Original')main.geometry=source;else{const geometry=source.clone();geometry.computeBoundingBox();const size=geometry.boundingBox?.getSize(new THREE.Vector3());const target=main.userData.originalSize;if(size&&target){const ratio=Math.max(target.x,target.z)/Math.max(size.x,size.z);geometry.scale(ratio,ratio,ratio);}main.geometry=geometry;}}}}
   if(cutChanged)refreshDiamonds(main);
   updateShadow();
   viewer.needsRender=true;
   if(host.current) host.current.dataset.ringState=JSON.stringify({metal:current.metal,finish:current.finish,metals:metalsRef.current.length,gems:gemsRef.current.length,shapes:Object.keys(shapeRef.current),color:((metalsRef.current[0]?.material as THREE.MeshStandardMaterial)?.color)?.getHexString(),roughness:(metalsRef.current[0]?.material as THREE.MeshStandardMaterial)?.roughness,stone:current.stone,auth:viewer.authStatus,mainVertices:main?.geometry.attributes.position?.count,gemScale:main?.scale.toArray(),ringSize:current.size,bandScale:metalsRef.current[0]?.scale.toArray()});
  };
  async function load(url:string,name:string){ const myGeneration=++generation; onStatus('Loading VictorShell ring…');loadingModel=true;if(modelRef.current&&gemsRef.current.length)await playGemCascade('out');if(disposed||myGeneration!==generation)return; ++effectGeneration;clearTimeout(effectTimer);await effectQueue;viewer.pause();restoreDiamonds(); try{const model=await viewer.getPlugin(GLTFPlugin)!.loadModel(url,name);if(disposed||myGeneration!==generation)return;scan(model);fxLights=[];{const lightHost=metalsRef.current[0]?.parent??model;for(let i=0;i<6;i++){const pl=new THREE.PointLight(0xffe9c4,0,0,1.6);lightHost.add(pl);fxLights.push(pl);}}shadow=null;ensureShadow();if(!introPlayed&&name==='Classic Solitaire')playAssembleIntro();applyRef.current();refreshDiamonds();viewer.getPlugin(OrbitControlsPlugin)?.resetView();loadingModel=false;{const controls=viewer.getPlugin(OrbitControlsPlugin) as unknown as {controls?:{target?:THREE.Vector3}}|undefined;homeTarget=controls?.controls?.target?.clone() ?? new THREE.Vector3();homeSph=new THREE.Spherical().setFromVector3(viewer.camera.position.clone().sub(homeTarget));}if(!introActive&&gemsRef.current.length)void playGemCascade('in');else updateShadow();viewer.needsRender=true;onStatus('');}catch(error){loadingModel=false;if(!disposed)onStatus(`Ring could not load: ${error instanceof Error?error.message:'unknown error'}`);} }
  onReady({
   setView(view){
    const controls=viewer.getPlugin(OrbitControlsPlugin) as unknown as {controls?:{target?:THREE.Vector3};setView:(axis:string)=>void;resetView:()=>void}|undefined;
    const tgt=controls?.controls?.target?.clone() ?? homeTarget.clone();
    const cur=new THREE.Spherical().setFromVector3(viewer.camera.position.clone().sub(tgt));
    let to:THREE.Spherical|null=null;
    if(view==='side')to=new THREE.Spherical(cur.radius,Math.PI/2,Math.PI/2);
    else if(view==='front')to=new THREE.Spherical(cur.radius,Math.PI/2,0);
    else if(homeSph)to=homeSph.clone();
    if(to&&!introActive&&!cutAnimating)startFx({kind:'cam',t0:performance.now(),dur:0.8,s0:cur,s1:to,tgt});
    else if(!to)controls?.resetView();
    viewer.needsRender=true;if(host.current&&to)host.current.dataset.camera=JSON.stringify(new THREE.Vector3().setFromSpherical(to).add(tgt).toArray());
   },
   rotate(){const node=modelRef.current;if(node&&!introActive&&!cutAnimating)startFx({kind:'spin',t0:performance.now(),dur:2.2,node,a0:node.rotation.y});viewer.needsRender=true;},
   celebrate(){const node=modelRef.current;if(node&&!introActive&&!cutAnimating){startFx({kind:'spin',t0:performance.now(),dur:2.2,node,a0:node.rotation.y});flashAt(gemsRef.current.find(m=>m.parent?.name==='Main') ?? gemsRef.current[0],3);}viewer.needsRender=true;},
   sparkle(){flashAt(gemsRef.current.find(m=>m.parent?.name==='Main') ?? gemsRef.current[0],2.2);},
   replay(){replayBoost=0.55;},
   setHd(enabled){store.setBloomEnabled(enabled);viewer.needsRender=true;viewer.play();},
   async changeRing(index){await load(`${import.meta.env.BASE_URL}models/${index?'ring2':'ring'}.glb`,index?'Halo Setting':'Classic Solitaire');},
   exportModel(){let plugin=viewer.getPlugin(ExportPlugin);if(!plugin){viewer.addPlugin(new ExportPlugin());plugin=viewer.getPlugin(ExportPlugin);}plugin?.exportGLTF();},
   async importModel(file){const url=URL.createObjectURL(file);try{await load(url,file.name);}finally{URL.revokeObjectURL(url);}},
   inspect(){return {authStatus:viewer.authStatus,model:store.activeModelName,metals:metalsRef.current.map(mesh=>({name:mesh.name,scale:mesh.scale.toArray(),materials:(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(mat=>({color:(mat as THREE.MeshStandardMaterial).color?.getHexString(),roughness:(mat as THREE.MeshStandardMaterial).roughness}))})),gems:gemsRef.current.length,shapes:Object.keys(shapeRef.current),camera:viewer.camera.position.toArray(),design:latest.current};}
  });
  // The panel toggle animates the stage width. The SDK already tracks the new
  // aspect, but a paused (on-demand) viewer never paints the resized frame, so
  // wake it while the stage is moving and settle back to paused afterwards.
  let resizeSettle: ReturnType<typeof setTimeout> | undefined;
  const resizeObserver=new ResizeObserver(()=>{viewer.needsRender=true;viewer.play();clearTimeout(resizeSettle);resizeSettle=setTimeout(()=>{if(!introActive&&!cutAnimating&&!fxList.length&&!idleActive)viewer.pause();},650);});
  resizeObserver.observe(host.current!);
  const authTimer=setInterval(()=>{if(host.current){host.current.dataset.authStatus=viewer.authStatus;if(viewer.authStatus==='AUTHORIZED'&&host.current.dataset.diamondEffect==='awaiting-auth')refreshDiamonds();}},1000);
  // Preserve the vendor authentication flow. No domain or licensing override.
  void load(`${import.meta.env.BASE_URL}models/ring.glb`,'Classic Solitaire');
  return ()=>{disposed=true;generation++;effectGeneration++;cancelAnimationFrame(introRaf);cancelAnimationFrame(cutRaf);cancelAnimationFrame(fxRaf);cancelAnimationFrame(idleRaf);clearInterval(idleTimer);cutGeneration++;resizeObserver.disconnect();clearTimeout(resizeSettle);clearTimeout(interactPause);clearTimeout(effectTimer);restoreDiamonds();clearInterval(authTimer);viewerRef.current=null;modelRef.current=null;draco.dispose();viewer.dispose();};
 },[onReady,onStatus]);
 useEffect(()=>{applyRef.current();},[design]);
 useEffect(()=>{stepFxRef.current(step);},[step]);
 return <><div className="studio-live-canvas" ref={host} aria-label="Interactive VictorShell 3D ring. Drag to rotate and scroll to zoom."/>{diamondState==='fallback'&&<span className="studio-diamond-notice" role="status">Diamond effect unavailable on this renderer. Standard materials shown.</span>}</>;
}
