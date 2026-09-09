/**
 * The Students Hub - Interactive 3D Academic Hero Scene
 * High-performance WebGL using Three.js
 */

(function initHero3D() {
  const container = document.getElementById('hero-three-canvas');
  if (!container) return;

  // Check WebGL availability
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Hero running in fallback mode.');
    return;
  }

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.2, 7.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const bluePointLight = new THREE.PointLight(0x2563eb, 3.5, 20);
  bluePointLight.position.set(-4, 4, 3);
  scene.add(bluePointLight);

  const goldPointLight = new THREE.PointLight(0xf59e0b, 3, 20);
  goldPointLight.position.set(4, -2, 3);
  scene.add(goldPointLight);

  const cyanPointLight = new THREE.PointLight(0x06b6d4, 2.5, 15);
  cyanPointLight.position.set(0, 4, -3);
  scene.add(cyanPointLight);

  // Root Master Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // -------------------------------------------------------------
  // 1. Central 3D Graduation Cap (Mortarboard)
  // -------------------------------------------------------------
  const capGroup = new THREE.Group();

  // Cap Flat Top
  const capTopGeo = new THREE.BoxGeometry(2.3, 0.08, 2.3);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
    metalness: 0.15,
  });
  const capTop = new THREE.Mesh(capTopGeo, capMat);
  capGroup.add(capTop);

  // Skull Cap Cylinder under top
  const skullGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.65, 32);
  const skullCap = new THREE.Mesh(skullGeo, capMat);
  skullCap.position.y = -0.35;
  capGroup.add(skullCap);

  // Golden Button on top
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });
  const buttonGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 20);
  const button = new THREE.Mesh(buttonGeo, goldMat);
  button.position.y = 0.07;
  capGroup.add(button);

  // Flowing Golden Tassel Ribbon
  const tasselCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.08, 0),
    new THREE.Vector3(0.5, 0.06, 0.4),
    new THREE.Vector3(1.1, 0.02, 0.9),
    new THREE.Vector3(1.25, -0.4, 1.05),
    new THREE.Vector3(1.3, -0.9, 1.1),
  ]);
  const tasselGeo = new THREE.TubeGeometry(tasselCurve, 32, 0.025, 8, false);
  const tassel = new THREE.Mesh(tasselGeo, goldMat);
  capGroup.add(tassel);

  // Tassel Tip Drop
  const tasselTipGeo = new THREE.ConeGeometry(0.07, 0.25, 16);
  const tasselTip = new THREE.Mesh(tasselTipGeo, goldMat);
  tasselTip.position.set(1.3, -1.02, 1.1);
  tasselTip.rotation.x = Math.PI;
  capGroup.add(tasselTip);

  capGroup.position.set(0, 1.0, 0);
  capGroup.rotation.x = 0.2;
  capGroup.rotation.z = -0.15;
  masterGroup.add(capGroup);

  // -------------------------------------------------------------
  // 2. Glowing Achievement Icosahedron Core
  // -------------------------------------------------------------
  const crystalGeo = new THREE.IcosahedronGeometry(0.85, 0);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.15,
    metalness: 0.4,
    transparent: true,
    opacity: 0.85,
    wireframe: false,
  });
  const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
  crystalMesh.position.set(0, -0.35, 0);
  masterGroup.add(crystalMesh);

  // Wireframe Cage for Holographic Effect
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x93c5fd,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });
  const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), wireMat);
  wireMesh.position.set(0, -0.35, 0);
  masterGroup.add(wireMesh);

  // -------------------------------------------------------------
  // 3. Floating Open Academic Book
  // -------------------------------------------------------------
  const bookGroup = new THREE.Group();
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
    metalness: 0.1,
  });
  const spineMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.3,
    metalness: 0.3,
  });

  // Left Page
  const leftPageGeo = new THREE.BoxGeometry(0.85, 0.04, 1.1);
  const leftPage = new THREE.Mesh(leftPageGeo, pageMat);
  leftPage.position.set(-0.4, 0, 0);
  leftPage.rotation.z = 0.18;
  bookGroup.add(leftPage);

  // Right Page
  const rightPage = new THREE.Mesh(leftPageGeo, pageMat);
  rightPage.position.set(0.4, 0, 0);
  rightPage.rotation.z = -0.18;
  bookGroup.add(rightPage);

  // Book Spine
  const spineGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.12, 16);
  const spine = new THREE.Mesh(spineGeo, spineMat);
  spine.rotation.x = Math.PI / 2;
  bookGroup.add(spine);

  bookGroup.position.set(0, -1.5, 0);
  bookGroup.scale.set(0.85, 0.85, 0.85);
  masterGroup.add(bookGroup);

  // -------------------------------------------------------------
  // 4. Multi-Axis Orbital Knowledge Rings & Subject Nodes
  // -------------------------------------------------------------
  const orbitsGroup = new THREE.Group();
  masterGroup.add(orbitsGroup);

  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.35,
  });
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.3,
  });
  const ringMat3 = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.35,
  });

  // Ring 1 (Maths orbit)
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.02, 16, 100), ringMat1);
  ring1.rotation.x = Math.PI / 3;
  orbitsGroup.add(ring1);

  // Ring 2 (Science orbit)
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.02, 16, 100), ringMat2);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.y = Math.PI / 6;
  orbitsGroup.add(ring2);

  // Ring 3 (11+ & A-Level orbit)
  const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.02, 16, 100), ringMat3);
  ring3.rotation.x = Math.PI / 2.2;
  ring3.rotation.z = Math.PI / 5;
  orbitsGroup.add(ring3);

  // Subject Satellite Spheres
  const subjects = [
    { name: 'maths', color: 0x2563eb, radius: 2.3, speed: 0.8, size: 0.22, orbitGroup: ring1 },
    { name: 'science', color: 0x10b981, radius: 2.8, speed: -0.65, size: 0.25, orbitGroup: ring2 },
    { name: 'english', color: 0x8b5cf6, radius: 2.3, speed: 0.9, size: 0.2, orbitGroup: ring1 },
    { name: '11plus', color: 0xf59e0b, radius: 3.3, speed: 0.55, size: 0.26, orbitGroup: ring3 },
    { name: 'coding', color: 0x06b6d4, radius: 2.8, speed: -0.85, size: 0.22, orbitGroup: ring2 },
  ];

  const nodeMeshes = [];
  subjects.forEach((sub, i) => {
    const nodeMat = new THREE.MeshStandardMaterial({
      color: sub.color,
      roughness: 0.2,
      metalness: 0.6,
      emissive: sub.color,
      emissiveIntensity: 0.45,
    });
    const node = new THREE.Mesh(new THREE.SphereGeometry(sub.size, 24, 24), nodeMat);

    // Glowing miniature orbit ring around the node
    const miniRing = new THREE.Mesh(
      new THREE.TorusGeometry(sub.size * 1.5, 0.015, 12, 32),
      new THREE.MeshBasicMaterial({ color: sub.color, transparent: true, opacity: 0.6 })
    );
    miniRing.rotation.x = Math.PI / 3;
    node.add(miniRing);

    scene.add(node);
    nodeMeshes.push({ mesh: node, miniRing, config: sub, angle: (i * (Math.PI * 2)) / subjects.length });
  });

  // -------------------------------------------------------------
  // 5. Starry Academic Knowledge Particle Field
  // -------------------------------------------------------------
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x93c5fd),
    new THREE.Color(0xfef08a),
    new THREE.Color(0xa7f3d0),
    new THREE.Color(0xc4b5fd),
  ];

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 3.5 + Math.random() * 5.0;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePos[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = radius * Math.cos(phi);

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    particleColors[i] = chosenColor.r;
    particleColors[i + 1] = chosenColor.g;
    particleColors[i + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // -------------------------------------------------------------
  // Mouse Pointer & Drag Interaction
  // -------------------------------------------------------------
  let targetRotX = 0;
  let targetRotY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;

  // Window cursor parallax
  window.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseX = normX * 0.45;
    mouseY = normY * 0.35;
  });

  // Pointer drag to spin
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevPointerX;
    const deltaY = e.clientY - prevPointerY;
    targetRotY += deltaX * 0.008;
    targetRotX += deltaY * 0.008;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  // -------------------------------------------------------------
  // Subject HUD Buttons Integration
  // -------------------------------------------------------------
  const subjectButtons = document.querySelectorAll('.subject-node-btn');
  subjectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      subjectButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const subjectKey = btn.getAttribute('data-subject');
      const targetNode = nodeMeshes.find((n) => n.config.name === subjectKey);

      if (targetNode) {
        // Spotlight dynamic light color
        bluePointLight.color.setHex(targetNode.config.color);
        // Spin master group to face selected subject
        targetRotY += Math.PI * 0.75;
        // Pulse node
        targetNode.mesh.scale.set(1.5, 1.5, 1.5);
        setTimeout(() => targetNode.mesh.scale.set(1, 1, 1), 600);
      }
    });
  });

  // -------------------------------------------------------------
  // Animation Loop
  // -------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Natural Floating Oscillations
    capGroup.position.y = 1.0 + Math.sin(elapsedTime * 1.5) * 0.12;
    capGroup.rotation.y = Math.sin(elapsedTime * 0.7) * 0.15;

    crystalMesh.rotation.x = elapsedTime * 0.5;
    crystalMesh.rotation.y = elapsedTime * 0.65;
    wireMesh.rotation.x = -elapsedTime * 0.3;
    wireMesh.rotation.y = -elapsedTime * 0.4;

    bookGroup.position.y = -1.5 + Math.cos(elapsedTime * 1.6) * 0.09;
    bookGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.2;

    // Rotate Orbits
    orbitsGroup.rotation.y = elapsedTime * 0.2;
    particleSystem.rotation.y = -elapsedTime * 0.05;

    // Orbiting Satellite Nodes
    nodeMeshes.forEach((item) => {
      item.angle += item.config.speed * 0.012;
      const radius = item.config.radius;
      const x = Math.cos(item.angle) * radius;
      const z = Math.sin(item.angle) * radius;
      const y = Math.sin(item.angle * 2 + elapsedTime) * 0.45;

      item.mesh.position.set(x, y, z);
      item.miniRing.rotation.z += 0.03;
    });

    // Smooth Lerp Damping on Cursor Movement / Drag
    if (!isDragging) {
      targetRotY += 0.003; // Gentle ambient rotation
      masterGroup.rotation.y += (targetRotY + mouseX - masterGroup.rotation.y) * 0.05;
      masterGroup.rotation.x += (targetRotX + mouseY - masterGroup.rotation.x) * 0.05;
    } else {
      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.15;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.15;
    }

    renderer.render(scene, camera);
  }

  animate();

  // -------------------------------------------------------------
  // Responsive Resize Handling
  // -------------------------------------------------------------
  function handleResize() {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', handleResize);
})();
