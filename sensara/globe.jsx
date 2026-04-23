/* Three.js Globe section for Sensara */

function GlobeSection() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({ rot: 0 });
  const progress = useSectionProgress(wrapRef);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const R = 1.3;

    // Core sphere — very dark
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x151515 })
    );
    globeGroup.add(core);

    // Wireframe lat/long
    const wireMat = new THREE.LineBasicMaterial({ color: 0x3a4a6a, transparent: true, opacity: 0.28 });
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(R, 32, 20)),
      wireMat
    );
    globeGroup.add(wire);

    // Lat/Lng -> XYZ on sphere (must be defined before continent dots)
    function llToXYZ(lat, lng, r) {
      r = r || R * 1.015;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -r * Math.sin(phi) * Math.cos(theta);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    // ——— Real continent regions (lat/lng bounding boxes) ———
    const LAND = [
      // North America
      [48,85,-170,-55],[25,48,-130,-65],[15,30,-120,-85],
      // Greenland
      [60,84,-60,-15],
      // Central America
      [7,20,-92,-77],
      // Caribbean
      [17,28,-85,-60],
      // South America
      [-5,12,-82,-50],[-25,-5,-80,-35],[-40,-25,-72,-48],[-56,-40,-75,-63],
      // Europe — Iberia
      [36,44,-10,3],
      // Europe — France/Benelux/Germany
      [43,55,-5,15],
      // Europe — UK/Ireland
      [50,59,-11,2],
      // Europe — Scandinavia
      [55,71,4,32],
      // Europe — Italy/Balkans
      [37,47,7,30],
      // Europe — Eastern
      [44,56,14,40],
      // Africa — North
      [20,37,-18,35],
      // Africa — West
      [0,20,-18,15],
      // Africa — East / Horn
      [0,20,15,52],
      // Africa — Central
      [-15,0,8,35],
      // Africa — South
      [-35,-15,15,35],
      // Madagascar
      [-26,-12,43,50],
      // Middle East
      [12,38,35,60],
      // Arabia
      [12,32,35,60],
      // Russia — West
      [50,75,30,60],
      // Russia — Siberia
      [50,75,60,120],
      // Russia — Far East
      [50,72,120,180],
      // Central Asia
      [35,55,50,90],
      // South Asia — India
      [8,28,68,90],
      // South Asia — Pakistan/Afghanistan
      [24,38,60,78],
      // Southeast Asia — mainland
      [8,28,90,110],
      // Southeast Asia — Malay/Vietnam
      [-2,8,98,120],
      // East Asia — China south
      [20,40,98,122],
      // East Asia — China north
      [35,55,75,135],
      // Korea
      [33,43,124,130],
      // Japan
      [30,45,129,146],
      // Taiwan
      [22,26,120,122],
      // Philippines
      [5,20,117,127],
      // Indonesia — Sumatra/Java
      [-8,6,95,115],
      // Indonesia — Borneo/Sulawesi
      [-5,5,108,128],
      // Indonesia — Papua
      [-8,0,128,141],
      // Australia
      [-40,-10,112,155],
      // New Zealand
      [-47,-34,166,179],
    ];

    function isLand(lat, lng) {
      for (let i = 0; i < LAND.length; i++) {
        const r = LAND[i];
        if (lat >= r[0] && lat <= r[1] && lng >= r[2] && lng <= r[3]) return true;
      }
      return false;
    }

    // Generate continent dots using Fibonacci sphere
    const dotGeom = new THREE.BufferGeometry();
    const positions = [];
    const COUNT = 6000;

    for (let i = 0; i < COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // Unit sphere coords (Y-up for Three.js)
      const uy = Math.cos(phi);
      const sinP = Math.sin(phi);
      const ux = sinP * Math.cos(theta);
      const uz = sinP * Math.sin(theta);

      // Convert to lat/lng
      const lat = Math.asin(uy) * (180 / Math.PI);
      const lng = Math.atan2(uz, ux) * (180 / Math.PI);

      if (isLand(lat, lng)) {
        // Use llToXYZ for consistent coordinate system with markers
        const pos = llToXYZ(lat, lng, R * 1.005);
        positions.push(pos.x, pos.y, pos.z);
      }
    }
    dotGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const dotMat = new THREE.PointsMaterial({
      color: 0x266DF1,
      size: 0.022,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
    });
    const dots = new THREE.Points(dotGeom, dotMat);
    globeGroup.add(dots);

    // Subtle atmosphere glow
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x266DF1,
      transparent: true,
      opacity: 0.045,
      side: THREE.BackSide,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.06, 48, 48), atmoMat);
    globeGroup.add(atmo);

    const PORTUGAL = { lat: 38.7, lng: -9.1 };
    const CHINA = { lat: 30.3, lng: 120.2 };

    const pPos = llToXYZ(PORTUGAL.lat, PORTUGAL.lng);
    const cPos = llToXYZ(CHINA.lat, CHINA.lng);

    // Hotspot markers
    function makeMarker(pos, color) {
      color = color || 0x266DF1;
      const g = new THREE.Group();
      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      inner.position.copy(pos);
      g.add(inner);

      const ringGeom = new THREE.RingGeometry(0.055, 0.065, 32);
      const ring = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.8, side: THREE.DoubleSide,
      }));
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      g.add(ring);

      const pulseRing = new THREE.Mesh(
        new THREE.RingGeometry(0.07, 0.09, 32),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
      );
      pulseRing.position.copy(pos);
      pulseRing.lookAt(0, 0, 0);
      g.add(pulseRing);

      g.userData.pulse = pulseRing;
      return g;
    }
    const mP = makeMarker(pPos);
    const mC = makeMarker(cPos);
    globeGroup.add(mP); globeGroup.add(mC);

    // Arc — always fully visible
    function makeArc(a, b, segments, height) {
      segments = segments || 80;
      height = height || 0.6;
      const ax = a.clone().normalize();
      const bx = b.clone().normalize();
      const mid = ax.clone().add(bx).normalize().multiplyScalar(R * (1 + height));
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
      return curve.getPoints(segments);
    }
    const arcPts = makeArc(pPos, cPos, 120, 0.55);
    const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPts);
    const arcMat = new THREE.LineBasicMaterial({ color: 0x266DF1, transparent: true, opacity: 0.7 });
    const arc = new THREE.Line(arcGeom, arcMat);
    globeGroup.add(arc);

    // Traveler dot along arc
    const traveler = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    globeGroup.add(traveler);

    // Initial tilt
    globeGroup.rotation.x = 0.25;

    // Click-drag rotation
    let isDragging = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let dragMomentum = 0;

    canvas.addEventListener('mousedown', function(e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragMomentum = 0;
      canvas.style.cursor = 'grabbing';
    });
    const onMove = function(e) {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      dragStartX = e.clientX;
      dragOffset += dx * 0.005;
      dragMomentum = dx * 0.005;
    };
    const onUp = function() {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.style.cursor = 'grab';

    // Touch support
    canvas.addEventListener('touchstart', function(e) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragMomentum = 0;
    });
    const onTouchMove = function(e) {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - dragStartX;
      dragStartX = e.touches[0].clientX;
      dragOffset += dx * 0.005;
      dragMomentum = dx * 0.005;
    };
    const onTouchEnd = function() { isDragging = false; };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    let t0 = performance.now();
    let running = true;
    let visible = false;

    // Pause render loop when off-screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && running) requestAnimationFrame(tick);
    }, { threshold: 0.05 });
    io.observe(canvasRef.current);

    function tick() {
      if (!running || !visible) return;
      const t = (performance.now() - t0) / 1000;
      const p = stateRef.current.rot;

      // Slow momentum decay when not dragging
      if (!isDragging) {
        dragOffset += dragMomentum;
        dragMomentum *= 0.95;
      }

      // Rotate: Portugal-facing at p=0 → China-facing at p=1
      const baseY = -((PORTUGAL.lng) * Math.PI / 180);
      const endY = -((CHINA.lng) * Math.PI / 180);
      globeGroup.rotation.y = baseY + (endY - baseY) * p + t * 0.015 + dragOffset;

      // Traveler orbits continuously along the arc
      const tp = (t * 0.12) % 1;
      const idx = Math.min(arcPts.length - 1, Math.floor(tp * arcPts.length));
      traveler.position.copy(arcPts[idx]);

      // Pulse marker rings
      const pulseScale = 1 + Math.sin(t * 2.4) * 0.25;
      mP.userData.pulse.scale.setScalar(pulseScale);
      mC.userData.pulse.scale.setScalar(pulseScale);
      mP.userData.pulse.material.opacity = 0.5 - Math.sin(t * 2.4) * 0.3;
      mC.userData.pulse.material.opacity = 0.5 - Math.sin(t * 2.4) * 0.3;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    return () => {
      running = false;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      // Clean up all Three.js resources
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  // Update rotation progress from scroll
  useEffect(() => {
    stateRef.current.rot = Math.max(0, Math.min(1, (progress - 0.2) * 1.6));
  }, [progress]);

  return (
    <section id="global" ref={wrapRef} className="section-overlap relative bg-shark-950 overflow-hidden" style={{minHeight:'120vh', borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:5}}>
      {/* Subtle transition gradient from ProductTypes above */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[1]" style={{background:'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)', borderRadius:'32px 32px 0 0'}}/>
      {/* bg grid */}
      <div className="absolute inset-0 grid-lines opacity-40"/>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 relative py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Globe — no frame, full bleed */}
          <div className="md:col-span-7 order-1 relative">
            <div className="relative w-full mx-auto globe-wrap" style={{aspectRatio:'1/1', maxWidth:'720px'}}>
              <canvas ref={canvasRef} className="w-full h-full" role="img" aria-label="Interactive 3D globe showing Sensara production locations in Portugal and China" style={{touchAction:'none'}}/>
              {/* Labels */}
              <div className="absolute top-2 left-2 mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                fig.02 · joint venture network
              </div>
              <div className="absolute bottom-2 right-2 mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                scroll to rotate ↻
              </div>
              <div className="absolute bottom-2 left-2 mono text-[10px] tracking-[0.25em] uppercase text-azure">
                ● lisbon · hangzhou
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="md:col-span-5 order-2 relative">
            <Reveal><Eyebrow className="mb-6">02 · Global Presence</Eyebrow></Reveal>
            <div className="overflow-hidden mb-6">
              <Reveal clip>
                <h2 className="font-display text-[clamp(40px,5.5vw,80px)] leading-[0.9]" style={{letterSpacing:'-0.04em'}}>
                  Carlom<br/><span className="text-shark-400">×</span> Meisheng
                </h2>
              </Reveal>
            </div>
            <Reveal delay={150}>
              <p className="text-base md:text-lg text-white/85 leading-relaxed mb-6" style={{textWrap:'pretty'}}>
                A strategic joint venture combining Carlom's European automotive expertise with Meisheng's leadership in microfiber and suede technologies. Production facilities in both Europe and China enable flexible manufacturing, optimized supply chains, and consistent quality across regions.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="eyebrow mb-3">One Product · Two Brands</div>
                <div className="font-display text-xl md:text-2xl" style={{letterSpacing:'-0.02em'}}>
                  Sensara <span className="text-shark-500">in Europe.</span><br/>
                  MS Suede <span className="text-shark-500">in China.</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={450}>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-azure pulse-dot"></span>
                    <span className="eyebrow">HQ · Portugal</span>
                  </div>
                  <div className="font-display text-lg">Carlom</div>
                  <div className="text-xs text-shark-400">Est. 1966 · Europe</div>
                </div>
                <div className="border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-azure pulse-dot"></span>
                    <span className="eyebrow">JV · China</span>
                  </div>
                  <div className="font-display text-lg">Meisheng</div>
                  <div className="text-xs text-shark-400">Microfiber leader</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { GlobeSection });
