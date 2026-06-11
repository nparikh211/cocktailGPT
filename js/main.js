import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   IndoAm Foods — scroll-driven isometric distribution journey.
   A glowing supply path draws itself from the Port of LA, through
   the IndoAm distribution center, along SoCal routes, to a grocery
   store — scrubbed by scroll (GSAP ScrollTrigger + Three.js).
   ================================================================ */

const BG = 0xdfeaf3;

const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 130, 330);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 400);

/* ---------------- lights ---------------- */
scene.add(new THREE.HemisphereLight(0xffffff, 0xc4d6e6, 1.15));

const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(60, 90, 30);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -110; sun.shadow.camera.right = 110;
sun.shadow.camera.top = 110;  sun.shadow.camera.bottom = -110;
sun.shadow.camera.far = 260;
sun.shadow.bias = -0.0004;
scene.add(sun);

const headLight = new THREE.PointLight(0xff9a2e, 0, 36, 1.6);
headLight.position.set(0, 2, 0);
scene.add(headLight);

/* ---------------- materials ---------------- */
const matWhite  = new THREE.MeshStandardMaterial({ color: 0xeef3f8, roughness: 0.85, flatShading: true });
const matPale   = new THREE.MeshStandardMaterial({ color: 0xdce6f0, roughness: 0.9,  flatShading: true });
const matRoad   = new THREE.MeshStandardMaterial({ color: 0xc7d4e2, roughness: 1 });
const matWater  = new THREE.MeshStandardMaterial({ color: 0xb7d2e8, roughness: 0.5, metalness: 0.1 });
const matSaffron= new THREE.MeshStandardMaterial({ color: 0xe2641c, roughness: 0.6, flatShading: true });
const matGreen  = new THREE.MeshStandardMaterial({ color: 0xc9dfd0, roughness: 1, flatShading: true });
const matPeople = new THREE.MeshStandardMaterial({ color: 0xc2cfdd, roughness: 1 });

/* ---------------- helpers ---------------- */
const world = new THREE.Group();
scene.add(world);

function box(w, h, d, mat, x, y, z, ry = 0, parent = world) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  m.rotation.y = ry;
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}

function person(x, z) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 3, 8), matPeople);
  m.position.set(x, 0.55, z);
  m.castShadow = true;
  world.add(m);
}

/* ---------------- ground & water ---------------- */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 360), new THREE.MeshStandardMaterial({ color: BG, roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 360), matWater);
water.rotation.x = -Math.PI / 2;
water.position.set(-110, 0.04, 0);
scene.add(water);

/* ================================================================
   ZONE 1 — Port of LA / Long Beach  (x ≈ -85 … -48)
   ================================================================ */
const ship = new THREE.Group();
ship.position.set(-88, 0, 8);
world.add(ship);
box(20, 2.6, 6.4, matWhite, 0, 0.2, 0, 0, ship);                 // hull
box(3.4, 3.2, 5.2, matWhite, -7, 2.8, 0, 0, ship);               // bridge
box(1, 1.6, 1, matSaffron, -7, 6.0, 1.4, 0, ship);               // funnel
for (let i = 0; i < 4; i++)                                       // deck containers
  for (let j = 0; j < 2; j++)
    box(2.6, 1.1, 1.3, (i + j) % 3 ? matPale : matSaffron, -2 + i * 3, 2.8 + (j % 2) * 0, -1.2 + j * 2.4, 0, ship);

box(26, 0.5, 10, matPale, -72, 0, 6);                             // dock apron

// container yard
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 4; c++) {
    const h = 1 + ((r * 4 + c) % 3);
    for (let k = 0; k < h; k++)
      box(3.2, 1.2, 1.5, (r + c + k) % 4 === 0 ? matSaffron : matWhite,
          -62 + c * 4.2, k * 1.25, -8 + r * 3.4);
  }
}

// gantry cranes
function crane(x, z, ry) {
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.rotation.y = ry;
  world.add(g);
  [-4, 4].forEach(off => {
    box(0.7, 9, 0.7, matWhite, off, 0, -2.6, 0, g);
    box(0.7, 9, 0.7, matWhite, off, 0,  2.6, 0, g);
    box(0.7, 0.7, 6, matWhite, off, 8.6, 0, 0, g);
  });
  box(10.5, 0.8, 0.9, matWhite, 0, 9.3, 0, 0, g);
  box(1.4, 1, 1.2, matSaffron, -1.5, 7.6, 0, 0, g);               // trolley
}
crane(-70, 2, 0);
crane(-56, 12, Math.PI / 14);

person(-60, 11); person(-66, -2); person(-52, 4);

/* ================================================================
   ZONE 2 — IndoAm Distribution Center  (x ≈ -30 … -6)
   ================================================================ */
function warehouse(x, z, w, d, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.rotation.y = ry;
  world.add(g);
  box(w, 3.2, d, matWhite, 0, 0, 0, 0, g);
  const roof = new THREE.Mesh(
    new THREE.CylinderGeometry(d / 2, d / 2, w, 14, 1, false, 0, Math.PI), matWhite);
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 3.2;
  roof.castShadow = roof.receiveShadow = true;
  g.add(roof);
}
warehouse(-24, -6, 11, 7);
warehouse(-24,  4, 11, 7);
warehouse(-12, 10, 9, 6, Math.PI / 2);

// HQ with saffron sign
const hq = new THREE.Group();
hq.position.set(-12, 0, -4);
world.add(hq);
box(7, 6.5, 7, matWhite, 0, 0, 0, 0, hq);
box(8, 1.1, 8, matWhite, 0, 6.5, 0, 0, hq);
box(4.5, 2.2, 0.5, matSaffron, 0, 7.6, 0, 0, hq);                 // rooftop sign

// pallets + parked trucks
for (let i = 0; i < 6; i++)
  box(1.2, 0.9, 1.2, i % 3 ? matPale : matSaffron, -18 + (i % 3) * 1.8, 0, 12 + Math.floor(i / 3) * 1.8);

function truck(parent = world) {
  const g = new THREE.Group();
  parent.add(g);
  box(1.6, 1.5, 1.9, matWhite, 1.7, 0.35, 0, 0, g);               // cab
  box(3.6, 2.1, 2,   matWhite, -1, 0.35, 0, 0, g);                // trailer
  box(3.6, 0.55, 2.04, matSaffron, -1, 1.35, 0, 0, g);            // brand stripe
  [[-2.2, 0.75], [0.2, 0.75], [2, 0.75]].forEach(([wx]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.1, 10), matPale);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, 0.42, 0);
    g.add(wheel);
  });
  return g;
}
truck().position.set(-7, 0, 8);
truck().position.set(-7, 0, 12);

person(-15, 13); person(-9, -1); person(-20, 0);

/* ================================================================
   ZONE 3 — SoCal routes  (x ≈ 6 … 46)
   ================================================================ */
const roadMain = new THREE.Mesh(new THREE.PlaneGeometry(64, 3.4), matRoad);
roadMain.rotation.x = -Math.PI / 2;
roadMain.rotation.z = -0.12;
roadMain.position.set(26, 0.05, 2);
roadMain.receiveShadow = true;
scene.add(roadMain);

for (let i = 0; i < 14; i++) {                                    // lane dashes
  const dash = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.18),
    new THREE.MeshBasicMaterial({ color: 0xffffff }));
  dash.rotation.x = -Math.PI / 2;
  dash.rotation.z = -0.12;
  const t = -30 + i * 4.6;
  dash.position.set(26 + t * Math.cos(0.12), 0.07, 2 + t * Math.sin(0.12));
  scene.add(dash);
}

// palms
function palm(x, z, s = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.scale.setScalar(s);
  world.add(g);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 3.4, 6), matPale);
  trunk.position.y = 1.7; trunk.castShadow = true;
  g.add(trunk);
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.4, 4), matGreen);
    leaf.position.y = 3.4;
    leaf.rotation.z = Math.PI / 2.6;
    leaf.rotation.y = (i / 5) * Math.PI * 2;
    leaf.castShadow = true;
    g.add(leaf);
  }
}
palm(12, -4); palm(18, 9, 1.2); palm(30, -5, 0.9); palm(38, 11); palm(44, -2, 1.1);

// suburb blocks
for (let i = 0; i < 8; i++) {
  const hx = 10 + (i % 4) * 9, hz = 14 + Math.floor(i / 4) * 7;
  box(3.2, 2, 3.2, matWhite, hx, 0, hz, i * 0.2);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 4), matPale);
  roof.position.set(hx, 2.8, hz);
  roof.rotation.y = Math.PI / 4 + i * 0.2;
  roof.castShadow = true;
  world.add(roof);
}

// moving delivery trucks on the highway
const movingTrucks = [truck(scene), truck(scene)];

person(20, 13); person(34, -6);

/* ================================================================
   ZONE 4 — Grocery store + finale  (x ≈ 52 … 76)
   ================================================================ */
const store = new THREE.Group();
store.position.set(60, 0, 10);
store.rotation.y = Math.PI;          // storefront faces the camera
world.add(store);
box(15, 4.2, 8, matWhite, 0, 0, 0, 0, store);
box(15.6, 1, 1.6, matSaffron, 0, 3.4, -4.2, 0, store);            // awning

// storefront sign — canvas texture
const signCanvas = document.createElement('canvas');
signCanvas.width = 512; signCanvas.height = 96;
const sctx = signCanvas.getContext('2d');
sctx.fillStyle = '#e2641c'; sctx.fillRect(0, 0, 512, 96);
sctx.fillStyle = '#fff';
sctx.font = '700 56px Helvetica, Arial, sans-serif';
sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
sctx.fillText('INDOAM MARKET', 256, 52);
const signTex = new THREE.CanvasTexture(signCanvas);
signTex.colorSpace = THREE.SRGBColorSpace;
const sign = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.85),
  new THREE.MeshBasicMaterial({ map: signTex }));
sign.position.set(0, 5, -4.06);
sign.rotation.y = Math.PI;
store.add(sign);

box(20, 0.12, 9, matRoad, 60, 0, 20);                             // parking lot
[[54, 19], [58, 21], [64, 19.5], [68, 21]].forEach(([cx, cz], i) => {
  box(2.4, 1, 1.4, i % 2 ? matPale : matWhite, cx, 0.12, cz);
});
for (let i = 0; i < 5; i++)                                       // produce crates
  box(1.1, 0.8, 1.1, i % 2 ? matSaffron : matPale, 54 + i * 1.5, 0, 4.6);

person(57, 17); person(63, 16); person(60, 5); person(66, 7);

// finale "pixel sun" plaza logo (echo of the brand mark)
const plaza = new THREE.Group();
plaza.position.set(72, 0, 0);
plaza.scale.setScalar(1.5);
world.add(plaza);
const SUN = [
  [0, 0, 1.6], [2.2, 0, 1], [-2.2, 0, 1], [0, 2.2, 1], [0, -2.2, 1],
  [1.8, 1.8, 0.8], [-1.8, 1.8, 0.8], [1.8, -1.8, 0.8], [-1.8, -1.8, 0.8],
];
SUN.forEach(([px, pz, s], i) => {
  box(s, 0.6 + s * 0.25, s, i === 0 ? matSaffron : matWhite, px, 0, pz, 0, plaza);
});

/* ================================================================
   THE GLOWING PATH
   ================================================================ */
const ROUTE_PTS = [
  new THREE.Vector3(-80, 0.35, 7),
  new THREE.Vector3(-64, 0.35, 2),
  new THREE.Vector3(-46, 0.35, 9),
  new THREE.Vector3(-30, 0.35, 1),
  new THREE.Vector3(-16, 0.35, 4),
  new THREE.Vector3(-2, 0.35, -2),
  new THREE.Vector3(16, 0.35, 1),
  new THREE.Vector3(34, 0.35, 5),
  new THREE.Vector3(48, 0.35, 9),
  new THREE.Vector3(58, 0.35, 6),
  new THREE.Vector3(68, 0.35, 2),
  new THREE.Vector3(72, 0.35, 0),
];
const routeCurve = new THREE.CatmullRomCurve3(ROUTE_PTS, false, 'centripetal', 0.4);

const pathUniforms = {
  uProgress: { value: 0 },
  uColorA: { value: new THREE.Color(0xe3452f) },   // chili red (origin)
  uColorB: { value: new THREE.Color(0xff9a2e) },   // saffron (head)
};

const pathVert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const pathFrag = /* glsl */`
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProgress) discard;
    float d = uProgress - vUv.x;
    vec3 col = mix(uColorA, uColorB, vUv.x);
    float head = smoothstep(0.05, 0.0, d);
    col = mix(col, vec3(1.0, 0.97, 0.9), head * 0.85);
    gl_FragColor = vec4(col, 1.0);
  }`;

const glowFrag = /* glsl */`
  uniform float uProgress;
  uniform vec3 uColorB;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProgress) discard;
    float d = uProgress - vUv.x;
    float head = smoothstep(0.12, 0.0, d) * 0.5 + 0.18;
    gl_FragColor = vec4(uColorB, head * 0.45);
  }`;

const tubeGeo = new THREE.TubeGeometry(routeCurve, 600, 0.42, 8, false);
const tube = new THREE.Mesh(tubeGeo, new THREE.ShaderMaterial({
  uniforms: pathUniforms, vertexShader: pathVert, fragmentShader: pathFrag,
}));
scene.add(tube);

const glowGeo = new THREE.TubeGeometry(routeCurve, 600, 1.15, 8, false);
const glowTube = new THREE.Mesh(glowGeo, new THREE.ShaderMaterial({
  uniforms: pathUniforms, vertexShader: pathVert, fragmentShader: glowFrag,
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
}));
scene.add(glowTube);

// head flare sprite
const flareCanvas = document.createElement('canvas');
flareCanvas.width = flareCanvas.height = 128;
const fctx = flareCanvas.getContext('2d');
const grad = fctx.createRadialGradient(64, 64, 2, 64, 64, 64);
grad.addColorStop(0, 'rgba(255,244,224,1)');
grad.addColorStop(0.25, 'rgba(255,170,60,0.55)');
grad.addColorStop(1, 'rgba(255,150,40,0)');
fctx.fillStyle = grad;
fctx.fillRect(0, 0, 128, 128);
const flare = new THREE.Sprite(new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(flareCanvas),
  blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
}));
flare.scale.setScalar(0);
scene.add(flare);

// dotted ground halo that travels with the head
const haloUniforms = { uOpacity: { value: 0 } };
const halo = new THREE.Mesh(
  new THREE.PlaneGeometry(34, 34),
  new THREE.ShaderMaterial({
    uniforms: haloUniforms,
    transparent: true, depthWrite: false,
    vertexShader: pathVert,
    fragmentShader: /* glsl */`
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec2 cell = fract(vUv * 26.0) - 0.5;
        float dot = smoothstep(0.16, 0.10, length(cell));
        float fall = smoothstep(0.5, 0.05, distance(vUv, vec2(0.5)));
        gl_FragColor = vec4(vec3(1.0), dot * fall * uOpacity);
      }`,
  }));
halo.rotation.x = -Math.PI / 2;
halo.position.y = 0.09;
scene.add(halo);

/* ================================================================
   CAMERA CHOREOGRAPHY
   ================================================================ */
const HERO_FOCUS  = new THREE.Vector3(-28, 0, -16);
const HERO_OFFSET = new THREE.Vector3(46, 60, 46);

const offsetCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(48, 62, 48),
  new THREE.Vector3(40, 52, 40),
  new THREE.Vector3(46, 58, 46),
  new THREE.Vector3(38, 48, 38),
  new THREE.Vector3(42, 54, 42),
]);

const JOURNEY_START = 0.2;       // hero occupies first 20% of scroll space

let scrollP = 0;                 // raw scroll progress 0..1
const cur = {                    // damped camera state
  focus: HERO_FOCUS.clone(),
  offset: HERO_OFFSET.clone(),
};
const tgt = { focus: new THREE.Vector3(), offset: new THREE.Vector3() };
const headPos = new THREE.Vector3();

function routeT(p) {
  return THREE.MathUtils.clamp((p - JOURNEY_START) / (1 - JOURNEY_START), 0, 1);
}

function computeTargets(p) {
  if (p < JOURNEY_START) {
    const k = THREE.MathUtils.smoothstep(p / JOURNEY_START, 0, 1);
    tgt.focus.lerpVectors(HERO_FOCUS, ROUTE_PTS[0], k);
    tgt.offset.lerpVectors(HERO_OFFSET, offsetCurve.getPoint(0), k);
  } else {
    const t = routeT(p);
    routeCurve.getPointAt(t, tgt.focus);
    offsetCurve.getPoint(t, tgt.offset);
  }
}

/* ================================================================
   SCROLL WIRING
   ================================================================ */
gsap.to('.hero-inner', {
  opacity: 0, y: -80, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: '75% top', scrub: true },
});
gsap.to('.scroll-hint', {
  opacity: 0, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: '40% top', scrub: true },
});

ScrollTrigger.create({
  trigger: '#journey',
  start: 'top top',
  end: 'bottom bottom',
  pin: '#process-ui',
  pinSpacing: false,
});

gsap.to('#process-ui', {
  opacity: 1, ease: 'none',
  scrollTrigger: { trigger: '#journey', start: 'top 35%', end: 'top top', scrub: true },
});

const steps = Array.from(document.querySelectorAll('.step'));
let activeStep = -1;
function setStep(i) {
  if (i === activeStep) return;
  activeStep = i;
  steps.forEach((el, k) => el.classList.toggle('active', k === i));
}

ScrollTrigger.create({
  trigger: '#scroll-space',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
  onUpdate(self) {
    scrollP = self.progress;
    const stage = scrollP < JOURNEY_START
      ? -1
      : Math.min(3, Math.floor((scrollP - JOURNEY_START) / ((1 - JOURNEY_START) / 4)));
    setStep(stage);
  },
});

/* ================================================================
   RENDER LOOP
   ================================================================ */
const clock = new THREE.Clock();

function render() {
  const t = clock.getElapsedTime();

  computeTargets(scrollP);
  cur.focus.lerp(tgt.focus, 0.085);
  cur.offset.lerp(tgt.offset, 0.085);
  camera.position.copy(cur.focus).add(cur.offset);
  camera.lookAt(cur.focus);

  // path draw
  const drawT = routeT(scrollP);
  pathUniforms.uProgress.value = drawT;

  if (drawT > 0.001 && drawT < 0.9995) {
    routeCurve.getPointAt(drawT, headPos);
    const pulse = 1 + Math.sin(t * 6) * 0.12;
    flare.position.copy(headPos).y += 0.6;
    flare.scale.setScalar(3.1 * pulse);
    headLight.position.copy(headPos).y += 2.5;
    headLight.intensity = 10;
    halo.position.x = headPos.x;
    halo.position.z = headPos.z;
    haloUniforms.uOpacity.value = Math.min(1, drawT * 12) * 0.5;
  } else if (drawT >= 0.9995) {
    // arrival — flare settles on the plaza logo and breathes
    routeCurve.getPointAt(1, headPos);
    flare.position.copy(headPos).y += 0.8;
    flare.scale.setScalar(4.2 + Math.sin(t * 3) * 0.5);
    headLight.position.copy(headPos).y += 3;
    headLight.intensity = 15;
    halo.position.x = headPos.x;
    halo.position.z = headPos.z;
    haloUniforms.uOpacity.value = 0.6;
  } else {
    flare.scale.setScalar(0);
    headLight.intensity = 0;
    haloUniforms.uOpacity.value = 0;
  }

  // idle life: ship bob + trucks cruising the highway
  ship.position.y = Math.sin(t * 0.8) * 0.12;
  ship.rotation.z = Math.sin(t * 0.6) * 0.008;
  movingTrucks.forEach((tr, i) => {
    const s = ((t * 0.045 + i * 0.5) % 1);
    const along = -30 + s * 60;
    tr.position.set(26 + along * Math.cos(0.12), 0, 2 + along * Math.sin(0.12) + (i ? 1 : -1) * 0.85);
    tr.rotation.y = -0.12 + (i ? Math.PI : 0);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

/* ---------------- resize ---------------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------------- boot ---------------- */
document.body.classList.add('is-loading');
computeTargets(0);
cur.focus.copy(tgt.focus);
cur.offset.copy(tgt.offset);
camera.position.copy(cur.focus).add(cur.offset);
camera.lookAt(cur.focus);
renderer.compile(scene, camera);
render();

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.classList.remove('is-loading');
    ScrollTrigger.refresh();
  }, 900);
});
