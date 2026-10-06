import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.getElementById('skyfield');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance'
  });

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1200);
  camera.position.z = 5;

  const pointer = new THREE.Vector2(0, 0);
  const targetPointer = new THREE.Vector2(0, 0);

  function makeStars(count, radius, size, opacity, tintA, tintB) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const twinkle = new Float32Array(count);

    const colorA = new THREE.Color(tintA);
    const colorB = new THREE.Color(tintB);

    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const s = Math.sqrt(1 - u * u);

      positions[i * 3] = r * s * Math.cos(theta);
      positions[i * 3 + 1] = r * s * Math.sin(theta);
      positions[i * 3 + 2] = r * u;

      const mix = Math.random();
      const c = colorA.clone().lerp(colorB, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      twinkle[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('twinkle', new THREE.BufferAttribute(twinkle, 1));

    const material = new THREE.PointsMaterial({
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return points;
  }

  const farStars = makeStars(1450, 120, 0.16, 0.68, 0xc7d8ff, 0xffffff);
  const midStars = makeStars(620, 64, 0.24, 0.82, 0x9dbdff, 0xd9e6ff);
  const nearStars = makeStars(120, 34, 0.38, 0.95, 0x86a9ff, 0xf5f8ff);

  // Small brighter stars sprinkled in front.
  const brightGeometry = new THREE.BufferGeometry();
  const brightCount = 34;
  const brightPositions = new Float32Array(brightCount * 3);
  for (let i = 0; i < brightCount; i++) {
    brightPositions[i * 3] = (Math.random() - 0.5) * 48;
    brightPositions[i * 3 + 1] = (Math.random() - 0.5) * 32;
    brightPositions[i * 3 + 2] = -4 - Math.random() * 22;
  }
  brightGeometry.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3));
  const brightMaterial = new THREE.PointsMaterial({
    color: 0xeaf1ff,
    size: 0.52,
    transparent: true,
    opacity: 0.86,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const brightStars = new THREE.Points(brightGeometry, brightMaterial);
  scene.add(brightStars);

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function onPointerMove(event) {
    targetPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    targetPointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();

    pointer.lerp(targetPointer, 0.035);

    if (!reduceMotion) {
      farStars.rotation.y = t * 0.0025;
      farStars.rotation.x = t * 0.0009;
      midStars.rotation.y = -t * 0.0042;
      midStars.rotation.x = t * 0.0016;
      nearStars.rotation.y = t * 0.006;
      brightStars.rotation.z = t * 0.0028;

      camera.position.x += ((pointer.x * 0.34) - camera.position.x) * 0.025;
      camera.position.y += ((-pointer.y * 0.22) - camera.position.y) * 0.025;

      farStars.material.opacity = 0.60 + Math.sin(t * 0.45) * 0.05;
      midStars.material.opacity = 0.76 + Math.sin(t * 0.68 + 1.7) * 0.06;
      brightStars.material.opacity = 0.76 + Math.sin(t * 1.1) * 0.10;
    }

    renderer.render(scene, camera);

    if (!reduceMotion) requestAnimationFrame(render);
  }

  render();
}
