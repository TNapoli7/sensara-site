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
    camera.position.set(0, 0, 4.2);

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
    const wireMat = new THREE.LineBasicMaterial({ color: 0x3a4a6a, transparent: true, opacity: 0.35 });
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(R, 32, 20)),
      wireMat
    );
    globeGroup.add(wire);

    // Dotted continents — procedurally placed dots only on "land" (using fbm-like noise mask)
    const dotGeom = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];
    const COUNT = 2400;

    // Simple hash-based mask to simulate continents (deterministic)
    function hash(x, y, z) {
      const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      return s - Math.floor(s);
    }
    function fbm(x, y, z) {
      let v = 0, a = 0.5, f = 1;
      for (let i = 0; i < 4; i++) {
        v += a * hash(Math.floor(x * f), Math.floor(y * f), Math.floor(z * f));
        f *= 2; a *= 0.5;
      }
      return v;
    }

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere
      const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      const mask = fbm(x * 3.2, y * 3.2, z * 3.2);
      if (mask > 0.55) {
        positions.push(x * R * 1.005, y * R * 1.005, z * R * 1.005);
        sizes.push(mask);
      }
    }
    dotGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const dotMat = new THREE.PointsMaterial({
      color: 0x266DF1,
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });
    const dots = new THREE.Points(dotGeom, dotMat);
    globeGroup.add(dots);

    // Atmosphere glow — layered transparent sphere
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x266DF1,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.08, 48, 48), atmoMat);
    globeGroup.add(atmo);

    // Lat/Lng -> XYZ on sphere
    function llToXYZ(lat, lng, r = R * 1.015) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -r * Math.sin(phi) * Math.cos(theta);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    const PORTUGAL = { lat: 38.7, lng: -9.1, name: 'Portugal' };
    const CHINA = { lat: 30.3, lng: 120.2, name: 'China' };

    const pPos = llToXYZ(PORTUGAL.lat, PORTUGAL.lng);
    const cPos = llToXYZ(CHINA.lat, CHINA.lng);

    // Hotspot markers
    function makeMarker(pos, color = 0x266DF1) {
      const g = new THREE.Group();
      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      inner.position.copy(pos);
      g.add(inner);

      const ringGeom = new THREE.RingGeometry(0.05, 0.06, 32);
      const ring = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.8, side: THREE.DoubleSide,
      }));
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      g.add(ring);

      // Outer pulse ring
      const pulseRing = new THREE.Mesh(
        new THREE.RingGeometry(0.06, 0.08, 32),
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

    // Arc between Portugal and China
    function makeArc(a, b, segments = 80, height = 0.6) {
      const ax = a.clone().normalize();
      const bx = b.clone().normalize();
      const mid = ax.clone().add(bx).normalize().multiplyScalar(R * (1 + height));
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
      const pts = curve.getPoints(segments);
      return pts;
    }
    const arcPts = makeArc(pPos, cPos, 120, 0.55);
    const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPts);
    const arcMat = new THREE.LineBasicMaterial({ color: 0x266DF1, transparent: true, opacity: 0.9 });
    const arc = new THREE.Line(arcGeom, arcMat);
    // Draw-on effect: use drawRange
    arcGeom.setDrawRange(0, 0);
    globeGroup.add(arc);

    // Soft glow dot traveling along arc
    const traveler = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    globeGroup.add(traveler);

    // Initial tilt
    globeGroup.rotation.x = 0.25;

    let t0 = performance.now();
    let running = true;
    function tick() {
      if (!running) return;
      const t = (performance.now() - t0) / 1000;
      // Rotate based on progress (China-facing → Portugal-facing)
      const p = stateRef.current.rot; // 0..1 updated from React
      // Rotate: Europe-facing at p=0 → China-facing at p=1
      const baseY = -((PORTUGAL.lng) * Math.PI / 180);
      const endY = -((CHINA.lng) * Math.PI / 180);
      globeGroup.rotation.y = baseY + (endY - baseY) * p + t * 0.04;

      // Arc draw-on
      const drawCount = Math.floor(arcPts.length * Math.min(1, Math.max(0, (p - 0.1) * 1.6)));
      arcGeom.setDrawRange(0, drawCount);

      // Traveler along arc
      const tp = (t * 0.15) % 1;
      const idx = Math.min(arcPts.length - 1, Math.floor(tp * arcPts.length));
      traveler.position.copy(arcPts[idx]);
      traveler.visible = drawCount > 10;

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
      ro.disconnect();
      renderer.dispose();
      dotGeom.dispose(); dotMat.dispose();
      arcGeom.dispose(); arcMat.dispose();
    };
  }, []);

  // Update rotation progress from scroll
  useEffect(() => {
    stateRef.current.rot = Math.max(0, Math.min(1, (progress - 0.2) * 1.6));
  }, [progress]);

  return (
    <section id="global" ref={wrapRef} className="relative bg-shark-950 overflow-hidden" style={{minHeight:'120vh'}}>
      {/* bg grid */}
      <div className="absolute inset-0 grid-lines opacity-40"/>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 relative py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Globe — larger, generous padding */}
          <div className="md:col-span-7 order-1 relative">
            <div className="relative w-full mx-auto globe-wrap" style={{aspectRatio:'1/1', maxWidth:'720px', padding:'40px'}}>
              <canvas ref={canvasRef} className="w-full h-full"/>
              {/* Corner ticks */}
              <div className="absolute top-0 left-0 w-6 h-6">
                <div className="absolute inset-x-0 top-0 h-px bg-white/30"/>
                <div className="absolute inset-y-0 left-0 w-px bg-white/30"/>
              </div>
              <div className="absolute top-0 right-0 w-6 h-6">
                <div className="absolute inset-x-0 top-0 h-px bg-white/30"/>
                <div className="absolute inset-y-0 right-0 w-px bg-white/30"/>
              </div>
              <div className="absolute bottom-0 left-0 w-6 h-6">
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/30"/>
                <div className="absolute inset-y-0 left-0 w-px bg-white/30"/>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6">
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/30"/>
                <div className="absolute inset-y-0 right-0 w-px bg-white/30"/>
              </div>

              {/* Labels */}
              <div className="absolute top-2 left-2 mono text-[10px] tracking-[0.25em] uppercase text-white/50">
                fig.02 · joint venture network
              </div>
              <div className="absolute bottom-2 right-2 mono text-[10px] tracking-[0.25em] uppercase text-white/50">
                scroll to rotate ↻
              </div>
              <div className="absolute bottom-2 left-2 mono text-[10px] tracking-[0.25em] uppercase text-azure">
                ● lisbon · hangzhou
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="md:col-span-5 order-2 relative">
            <Reveal><Eyebrow className="mb-6">04 · Global Presence</Eyebrow></Reveal>
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
