/* Sensara page sections */

/* ————————————————— NAV ————————————————— */
function Nav() {
  const y = useScrollY();
  const scrolled = y > 60;
  const [open, setOpen] = useState(false);
  const items = [
    ['Technology', '#technology'],
    ['Product', '#product'],
    ['Global', '#global'],
    ['Sustainability', '#sustainability'],
    ['Contact', '#contact'],
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-md' : ''}`}
         style={{background: scrolled ? 'rgba(38,38,38,.72)' : 'transparent',
                 borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : '1px solid transparent'}}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="block w-6 h-6 relative">
            <span className="absolute inset-0 border border-white"></span>
            <span className="absolute inset-1 bg-azure"></span>
          </span>
          <span className="font-display text-xl tracking-tight">SENSARA</span>
          <span className="mono text-[10px] tracking-[0.25em] uppercase text-shark-400 hidden md:inline-block border-l border-white/20 pl-3 ml-1">a Carlom × Meisheng venture</span>
        </a>
        <div className="hidden lg:flex items-center gap-x-7 xl:gap-x-9">
          {items.map(([l,h]) => (
            <a key={h} href={h} className="nav-link mono text-[11px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors whitespace-nowrap">
              {l}
            </a>
          ))}
          <a href="#contact" className="mono text-[11px] tracking-[0.2em] uppercase px-4 py-2 bg-azure text-white hover:bg-white hover:text-black transition-colors whitespace-nowrap">
            Request Sample
          </a>
        </div>
        <button className="lg:hidden mono text-xs" onClick={()=>setOpen(!open)} aria-label="Menu">
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-shark-950 border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {items.map(([l,h]) => (
            <a key={h} href={h} onClick={()=>setOpen(false)} className="mono text-sm tracking-[0.2em] uppercase">{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ————————————————— HERO ————————————————— */
function Hero() {
  const ref = useRef(null);
  const y = useScrollY();
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  useEffect(() => {
    const f = () => setVh(window.innerHeight);
    window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, []);

  // Make the hero sticky over a 2x viewport scroll track so the shrink-window effect has room.
  // Progress 0..1 over the full track.
  const prog = Math.max(0, Math.min(1, y / (vh * 1.1)));
  const ease = prog * prog * (3 - 2 * prog); // smoothstep

  // Window shrink params
  const scale = 1 - ease * 0.22;          // 100% → 78%
  const radius = ease * 28;               // 0 → 28px
  const insetX = ease * 60;               // horizontal inset
  const insetY = ease * 40;               // vertical inset
  const translateY = -ease * 40;

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full"
      style={{ height: '200vh', background: '#0d0d0d' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden" style={{background:'#0d0d0d'}}>
        {/* Suede texture revealed behind hero as window shrinks */}
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: Math.min(1, prog * 2.5),
          transition: 'opacity 0.1s',
        }}>
          <img src="sensara/images/suede-texture.jpg" alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{opacity: 0.18, filter:'brightness(0.5) contrast(1.2) saturate(0) sepia(0.1)'}}/>
        </div>
        {/* Video stage */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            paddingLeft: `${insetX}px`,
            paddingRight: `${insetX}px`,
            paddingTop: `${insetY}px`,
            paddingBottom: `${insetY}px`,
          }}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ borderRadius: `${radius}px`, background:'#000' }}
          >
            {/* Actual video */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="sensara/images/suede-texture.jpg"
            >
              <source src="sensara/hero.mp4" type="video/mp4" />
            </video>

            {/* Darken overlay for text readability */}
            <div className="absolute inset-0" style={{background:'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 40%, rgba(0,0,0,.55) 100%)'}}/>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.55) 100%)'}}/>

            {/* Grain */}
            <div className="absolute inset-0 opacity-[.06] pointer-events-none" style={{
              backgroundImage:'repeating-radial-gradient(circle at 0 0, rgba(255,255,255,.5) 0 .5px, transparent .5px 2px)',
              backgroundSize:'3px 3px',
              mixBlendMode:'overlay',
            }}/>


            {/* Hero text */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16" style={{opacity: Math.max(0, 1 - ease * 1.4)}}>
              <h1 className="font-display text-[clamp(30px,4.7vw,61px)] leading-[1.05] tracking-[-0.03em] text-white">
                ENGINEERED FOR THE SENSES.
              </h1>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{opacity: Math.max(0, 1 - ease * 2)}}>
              <span className="mono text-[10px] tracking-[0.3em] uppercase text-white/70">Scroll to Explore</span>
              <svg className="chev" width="14" height="20" viewBox="0 0 14 20" fill="none">
                <path d="M1 1 L7 8 L13 1 M1 11 L7 18 L13 11" stroke="white" strokeOpacity=".8" strokeWidth="1.2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————— SECTION 2: TECH STATEMENT ————————————————— */
function TechStatement() {
  const [hover, setHover] = useState(null);
  const specs = [
    ['Gramature', '260 – 320 gsm'],
    ['Composition', 'PES, PU, Spandex blends'],
    ['Process', '100% Solvent Free'],
    ['Recyclability', 'Mono-component options'],
  ];
  return (
    <section id="technology" className="section-overlap relative bg-shark-950 py-24 md:py-36 overflow-hidden" style={{borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:2}}>
      <Parallax speed={0.08} className="absolute inset-0"><div className="absolute inset-0 grid-lines opacity-60" style={{height:'130%'}}/></Parallax>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 relative">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-10 items-end mb-20">
          <div className="md:col-span-5">
            <Reveal><Eyebrow className="mb-6">Technology</Eyebrow></Reveal>
            <h2 className="sr-only">Made to belong</h2>
            <RevealLines stagger={0.14}>
              <div><span className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[-0.04em] block" role="presentation">Made to</span></div>
              <div><span className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[-0.04em] block text-azure" role="presentation">belong</span></div>
            </RevealLines>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={150}>
              <p className="text-xl md:text-2xl font-light leading-[1.45] text-white/85 mb-6" style={{textWrap:'pretty'}}>
                Calibrated to each performance profile, the Sensara portfolio carries four distinct technologies: Air, Core, Plus, Skin. Each tuned to its application. The first microfiber-suede portfolio tailored to each surface. Considered to spec, never beyond it.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-base md:text-lg text-shark-400 leading-relaxed" style={{textWrap:'pretty'}}>
                Approved against the standards an automotive interior is expected to meet.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Spec strip */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
            {specs.map(([k,v],i)=>(
              <div key={i} className="py-6 px-1 md:px-6 border-b border-r border-white/10 last:border-r-0">
                <div className="eyebrow mb-2">{k}</div>
                <div className="font-display text-xl md:text-2xl tracking-tight">{v}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Interior application map with real images */}
        <div id="applications" className="mt-20 md:mt-28">
          <div className="grid md:grid-cols-12 gap-8 items-end mb-10">
            <div className="md:col-span-6">
              <Reveal>
                <Eyebrow className="mb-4">Application Map</Eyebrow>
                <h3 className="font-display text-2xl md:text-3xl tracking-tight">Made to belong</h3>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Reveal delay={100}>
                <p className="text-sm text-white/85 leading-relaxed" style={{textWrap:'pretty'}}>Calibrated to each performance profile, the Sensara portfolio carries four distinct technologies: Air, Core, Plus, Skin. Each tuned to its application. The first microfiber-suede portfolio tailored to each surface. Considered to spec, never beyond it.</p>
                <p className="text-sm text-shark-400 leading-relaxed mt-4" style={{textWrap:'pretty'}}>Approved against the standards an automotive interior is expected to meet.</p>
              </Reveal>
            </div>
          </div>
          <InteriorHotspots active={hover} setActive={setHover}/>
          {/* Zone list below image */}
          <div className="mt-4">
            <StaggerReveal className="grid grid-cols-2 md:grid-cols-5 gap-px" stagger={0.03}>
              {HOTSPOT_DATA.map(spot => (
                <button key={spot.id}
                  onClick={() => setHover(hover === spot.id ? null : spot.id)}
                  onMouseEnter={() => setHover(spot.id)}
                  className="text-left px-4 py-4 transition-all duration-300"
                  style={{
                    background: hover === spot.id ? 'rgba(38,109,241,0.12)' : 'rgba(255,255,255,0.03)',
                    borderBottom: hover === spot.id ? '2px solid var(--azure)' : '2px solid rgba(255,255,255,0.06)',
                  }}>
                  <span className={`block mono text-[10px] tracking-[0.2em] uppercase mb-1 transition-colors ${hover === spot.id ? 'text-azure' : 'text-white/50'}`}>
                    {spot.product}
                  </span>
                  <span className={`block text-sm font-medium transition-colors ${hover === spot.id ? 'text-white' : 'text-white/75'}`}>
                    {spot.label}
                  </span>
                </button>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————— SECTION: THE TOUCH — sensory reveal ————————————————— */
function TheTouch() {
  const sectionRef = useRef(null);
  const [mouse, setMouse] = useState({ x: -200, y: -200 });
  const [isInside, setIsInside] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileReveal, setMobileReveal] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mobile: scroll-driven reveal instead of cursor
  const sectionProgress = useSectionProgress(sectionRef);
  useEffect(() => {
    if (isMobile) {
      setMobileReveal(Math.min(1, Math.max(0, (sectionProgress - 0.2) * 2.5)));
    }
  }, [sectionProgress, isMobile]);

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [isMobile]);

  // Mobile: touch follow
  const handleTouchMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    setMouse({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    setIsInside(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-overlap relative overflow-hidden"
      style={{
        height: '100vh', minHeight:'600px',
        borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:3,
        cursor: isMobile ? 'auto' : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsInside(true)}
      onMouseLeave={() => { if (!isMobile) { setIsInside(false); setMouse({ x: -200, y: -200 }); }}}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { setIsInside(false); setMouse({ x: -200, y: -200 }); }}
    >
      {/* Base layer — dimmed suede texture */}
      <div className="absolute inset-0">
        <img src="sensara/images/suede-texture.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: isMobile
              ? `brightness(${0.25 + mobileReveal * 0.85}) contrast(1.2) saturate(${0.5 + mobileReveal * 0.7})`
              : 'brightness(0.25) contrast(1.2)',
            transform:'scale(1.1)',
            transition: isMobile ? 'filter 0.3s ease-out' : 'none',
          }}/>
      </div>

      {/* Revealed layer — cursor circle (desktop) or touch follow (mobile) */}
      {(!isMobile || isInside) && (
        <div className="absolute inset-0 pointer-events-none" style={{
          clipPath: isInside
            ? `circle(${isMobile ? '90px' : '120px'} at ${mouse.x}px ${mouse.y}px)`
            : `circle(0px at ${mouse.x}px ${mouse.y}px)`,
          transition: isInside ? 'none' : 'clip-path 0.4s ease-in',
        }}>
          <img src="sensara/images/suede-texture.jpg" alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{filter:'brightness(1.1) contrast(1.15) saturate(1.2)', transform:'scale(1.1)'}}/>
          <div className="absolute inset-0" style={{
            background: `radial-gradient(circle 120px at ${mouse.x}px ${mouse.y}px, rgba(38,109,241,0.08), transparent 70%)`,
          }}/>
        </div>
      )}

      {/* Custom cursor ring — desktop only */}
      {isInside && !isMobile && (
        <div className="absolute pointer-events-none z-30" style={{
          left: mouse.x - 120, top: mouse.y - 120,
          width: 240, height: 240,
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          transition: 'opacity 0.3s',
        }}/>
      )}

      {/* Center content — parallax for depth */}
      <Parallax speed={-0.06} className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20 px-6">
        <Reveal>
          <div className="eyebrow mb-6 text-white/50">The Touch</div>
        </Reveal>
        <RevealLines stagger={0.14}>
          <div><span className="font-display text-[clamp(36px,6vw,88px)] leading-[0.95] tracking-[-0.04em] text-white block" role="presentation">Masterclass</span></div>
          <div><span className="font-display text-[clamp(36px,6vw,88px)] leading-[0.95] tracking-[-0.04em] text-azure block" role="presentation">in detail</span></div>
        </RevealLines>
        <Reveal delay={200}>
          <p className="text-lg md:text-xl text-white/60 max-w-lg font-light mt-6" style={{textWrap:'pretty'}}>
            Real craft reveals itself slowly. With each movement, it tells you a little more. About its depth, about the way light shifts and highlights the hand behind it.
          </p>
        </Reveal>
      </Parallax>

      {/* Bottom hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-20">
        <span className="mono text-[10px] tracking-[0.25em] uppercase text-white/30">
          [ explore the texture ]
        </span>
      </div>
    </section>
  );
}

/* ————————————————— SECTION 3: PRODUCT TYPES ————————————————— */
const PRODUCTS = [
  {
    code: '01',
    name: 'Sensara Air',
    tag: 'Lightweight. Elegant. Fully Recyclable.',
    specs: ['280 gsm', 'Mono-component · 100% PES', 'Solvent free', 'High elongation'],
    apps: ['Headliner & Pillars', 'Overhead Systems'],
    selling: 'Exceptional quality-to-price ratio. Precision perforation. Lighting effects integration.',
    swatch: 'dark',
  },
  {
    code: '02',
    name: 'Sensara Core',
    tag: 'Design. Durability. Circularity.',
    specs: ['320 gsm', 'Mono-component · 100% PES', 'Solvent free', 'High abrasion resistance'],
    apps: ['Door Panels', 'Seat Systems'],
    selling: 'Low elongation for high-stress areas. Full recyclability at vehicle EOL.',
    swatch: 'dark',
  },
  {
    code: '03',
    name: 'Sensara Plus',
    tag: 'Luxury Performance for Demanding Interiors.',
    specs: ['300 gsm', '70% PES / 30% PU', 'Solvent free · Water based', 'High abrasion resistance'],
    apps: ['Seats', 'Door Panels', 'Instrument Panels', 'Headliner & Pillars'],
    selling: 'Available in Plus Light version for headliner applications. Up to 70% recycled content.',
    swatch: 'azure',
  },
  {
    code: '04',
    name: 'Sensara Skin',
    tag: 'Ultimate Softness for Direct Contact.',
    specs: ['260 gsm', '90% PES / 10% Spandex', 'Solvent free', 'Ultra-soft touch'],
    apps: ['Head Pillow Cushions'],
    selling: 'Engineered for comfort zones in direct contact with the human head. Up to 65% recycled content.',
    swatch: 'dark',
  },
];

/* Accordion panel for each product */
function AccordionPanel({ p, idx, hovered, anyHovered, setHovered }) {
  const isActive = hovered === idx;
  const isCompressed = anyHovered && !isActive;
  const flex = isActive ? 60 : isCompressed ? 13 : 25;
  const panelRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Per-panel color overlay for the texture — strong differentiation
  const tints = {
    '01': 'rgba(40,38,35,0.72)',       // warm sand
    '02': 'rgba(15,20,40,0.70)',       // deep navy
    '03': 'rgba(10,25,60,0.60)',       // azure blue
    '04': 'rgba(50,18,22,0.68)',       // burgundy wine
  };

  const handleMouseMove = useCallback((e) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  return (
    <div
      ref={panelRef}
      onMouseEnter={()=>setHovered(idx)}
      onMouseLeave={()=>setHovered(null)}
      onMouseMove={handleMouseMove}
      className="relative h-full cursor-pointer overflow-hidden border-r border-black/40 last:border-r-0"
      style={{
        flex: `${flex} 1 0`,
        transition: 'flex 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Real suede texture photo */}
      <div className="absolute inset-0">
        <img src="sensara/images/suede-texture.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: isActive ? 'scale(1.15)' : 'scale(1.05)',
            transition: 'transform 1.2s cubic-bezier(0.2,0.7,0.2,1)',
            filter: p.code === '01' ? 'sepia(0.3) saturate(0.6) brightness(1.05)'
              : p.code === '02' ? 'hue-rotate(210deg) saturate(1.6) brightness(0.95)'
              : p.code === '03' ? 'hue-rotate(200deg) saturate(2.0) brightness(1.1)'
              : 'hue-rotate(330deg) saturate(1.4) brightness(0.9)',
          }}/>
      </div>
      {/* Color tint overlay */}
      <div className="absolute inset-0" style={{ background: tints[p.code] }}/>
      {/* Mouse-follow spotlight — simulates suede nap changing with touch */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-500" style={{
        background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.12), transparent 70%)`,
        opacity: isActive ? 1 : 0,
      }}/>
      {/* Dim when compressed */}
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{
        background: 'rgba(0,0,0,.5)',
        opacity: isCompressed ? 1 : 0,
      }}/>
      {/* Azure edge when active */}
      <div className="absolute inset-y-0 left-0 w-[2px] transition-opacity duration-500" style={{
        background:'var(--azure)', opacity: isActive ? 1 : 0,
      }}/>

      {/* Compressed state — rotated short name */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-8 pointer-events-none transition-opacity duration-300"
           style={{ opacity: isActive ? 0 : 1 }}>
        <div className="mono text-[11px] tracking-[0.3em] uppercase text-white/60">{p.code}</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="font-display text-3xl md:text-4xl lg:text-5xl text-white whitespace-nowrap"
               style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '-0.02em' }}>
            {p.name.replace('Sensara ', '')}
          </div>
        </div>
        <div className="w-9 h-9 flex items-center justify-center border border-white/30 text-white/60 text-lg">+</div>
      </div>

      {/* Expanded state */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 pointer-events-none transition-opacity duration-500"
           style={{ opacity: isActive ? 1 : 0, transitionDelay: isActive ? '200ms' : '0ms' }}>
        <div className="flex items-start justify-between">
          <span className="mono text-[10px] tracking-[0.3em] uppercase text-white/70">{p.code} / 04</span>
          <span className="mono text-[10px] tracking-[0.25em] uppercase text-azure">● Active</span>
        </div>

        <div className="max-w-xl">
          <h3 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[-0.04em] text-white mb-4 leading-[0.95]">
            {p.name}
          </h3>
          <p className="text-lg md:text-xl text-white/85 mb-6 font-light" style={{textWrap:'pretty'}}>{p.tag}</p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 pb-6 border-b border-white/15">
            {p.specs.map((s,i)=>(
              <div key={i} className="flex items-center gap-2 mono text-[12px] text-white/85">
                <span className="w-1.5 h-1.5 bg-azure"></span>{s}
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="eyebrow mb-2 text-white/60">Applications</div>
            <div className="flex flex-wrap gap-2">
              {p.apps.map(a=>(
                <span key={a} className="mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 border border-white/25 text-white/90 bg-white/5">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <p className="text-base md:text-lg text-white/85 leading-relaxed mb-6" style={{textWrap:'pretty'}}>{p.selling}</p>
        </div>

        <div className="flex items-end justify-between">
          <a href="#contact" className="mono text-[11px] tracking-[0.25em] uppercase inline-flex items-center gap-2 px-4 py-2.5 bg-azure text-white hover:bg-white hover:text-black transition-colors pointer-events-auto">
            <span>Request {p.name}</span>
            <span className="inline-block">→</span>
          </a>
          {/* Mini hotspot diagram */}
          <div className="flex flex-col items-end gap-1">
            <span className="mono text-[11px] tracking-[0.15em] uppercase text-white/60 mb-1">Application zone</span>
            <svg width="200" height="112" viewBox="0 0 200 112" className="text-white/60">
              <path d="M12 86 L34 66 L68 63 L94 43 L134 42 L160 54 L184 72 L190 86" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="48" cy="92" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="154" cy="92" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="12" y1="98" x2="190" y2="98" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
              {/* Hotspot for this product */}
              {p.code === '01' && <><circle cx="100" cy="36" r="6" fill="#266DF1" opacity="0.9"/><text x="100" y="24" textAnchor="middle" fill="#266DF1" fontSize="11" fontFamily="monospace" fontWeight="500">HEADLINER</text></>}
              {p.code === '02' && <><circle cx="152" cy="60" r="6" fill="#266DF1" opacity="0.9"/><text x="152" y="48" textAnchor="middle" fill="#266DF1" fontSize="11" fontFamily="monospace" fontWeight="500">SEATS</text></>}
              {p.code === '03' && <><circle cx="118" cy="48" r="6" fill="#266DF1" opacity="0.9"/><text x="118" y="36" textAnchor="middle" fill="#266DF1" fontSize="11" fontFamily="monospace" fontWeight="500">MULTI</text></>}
              {p.code === '04' && <><circle cx="100" cy="52" r="6" fill="#266DF1" opacity="0.9"/><text x="100" y="40" textAnchor="middle" fill="#266DF1" fontSize="11" fontFamily="monospace" fontWeight="500">PILLOW</text></>}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTypes() {
  const [hovered, setHovered] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section id="product" className="section-overlap relative bg-shark-950 overflow-hidden" style={{borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:4}}>
      {/* Full-bleed accordion — desktop */}
      <Reveal>
        <div className="relative w-full hidden md:flex h-[80vh] min-h-[640px] border-y border-white/5">
          {PRODUCTS.map((p, i) => (
            <AccordionPanel
              key={p.code}
              p={p}
              idx={i}
              hovered={hovered}
              anyHovered={hovered !== null}
              setHovered={setHovered}
            />
          ))}
        </div>
        {/* Mobile stack — tap to expand */}
        <div className="md:hidden">
          {PRODUCTS.map((p, i) => (
            <div key={p.code}
              onClick={() => setMobileActive(mobileActive === i ? null : i)}
              className="relative overflow-hidden border-b border-white/10 cursor-pointer"
              style={{height: mobileActive === i ? '420px' : '80px', transition:'height 0.5s cubic-bezier(0.4,0,0.2,1)'}}
            >
              {/* Suede texture */}
              <div className="absolute inset-0">
                <img src="sensara/images/suede-texture.jpg" alt="" aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: p.code === '01' ? 'sepia(0.3) saturate(0.6) brightness(1.05)'
                      : p.code === '02' ? 'hue-rotate(210deg) saturate(1.6) brightness(0.95)'
                      : p.code === '03' ? 'hue-rotate(200deg) saturate(2.0) brightness(1.1)'
                      : 'hue-rotate(330deg) saturate(1.4) brightness(0.9)',
                  }}/>
              </div>
              <div className="absolute inset-0" style={{background: mobileActive === i ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)'}}/>
              {/* Header row */}
              <div className="relative flex items-center justify-between px-5 h-[80px]">
                <div className="flex items-center gap-4">
                  <span className="mono text-[10px] tracking-[0.3em] uppercase text-white/50">{p.code}</span>
                  <span className="font-display text-xl text-white">{p.name.replace('Sensara ', '')}</span>
                </div>
                <span className="text-white/50 text-xl transition-transform duration-300" style={{transform: mobileActive === i ? 'rotate(45deg)' : 'rotate(0)'}}>+</span>
              </div>
              {/* Expanded content */}
              <div className="relative px-5 pb-6" style={{opacity: mobileActive === i ? 1 : 0, transition:'opacity 0.3s ease', transitionDelay: mobileActive === i ? '0.2s' : '0s'}}>
                <p className="text-base text-white/85 mb-4 font-light">{p.tag}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 pb-4 border-b border-white/15">
                  {p.specs.map((s,si)=>(
                    <div key={si} className="flex items-center gap-2 mono text-[11px] text-white/80">
                      <span className="w-1 h-1 bg-azure"></span>{s}
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <div className="eyebrow mb-2 text-white/60">Applications</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.apps.map(a=>(
                      <span key={a} className="mono text-[10px] tracking-[0.1em] uppercase px-2 py-1 border border-white/25 text-white/90 bg-white/5">{a}</span>
                    ))}
                  </div>
                </div>
                <a href="#contact" className="mono text-[11px] tracking-[0.25em] uppercase flex items-center gap-2 text-azure mt-3">
                  <span>Request {p.name}</span><span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Brand marquee — integrated at bottom */}
      <div className="border-t border-white/[0.06] pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-10">
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <Reveal>
              <p className="font-display text-xl md:text-2xl tracking-tight text-white/80">The new standard, already in production.</p>
            </Reveal>
            <Reveal>
              <div className="eyebrow text-shark-600">Global OEM partners · 2020-present</div>
            </Reveal>
          </div>
        </div>
        <div className="relative overflow-hidden border-y border-white/[0.06] py-8">
          <div className="flex gap-16 marquee-track whitespace-nowrap">
            {['BYD','NIO','ZEEKR','GEELY','VOLKSWAGEN','XPENG','CHERY','DONGFENG','GAC','SAIC','BYD','NIO','ZEEKR','GEELY','VOLKSWAGEN','XPENG','CHERY','DONGFENG','GAC','SAIC','BYD','NIO','ZEEKR','GEELY','VOLKSWAGEN','XPENG','CHERY','DONGFENG','GAC','SAIC'].map((b,i)=>(
              <div key={i} className="flex items-center gap-4 shrink-0">
                <span className="w-1.5 h-1.5 bg-shark-700 rounded-full"></span>
                <span className="font-medium text-2xl md:text-3xl tracking-[-0.02em] text-shark-600 hover:text-azure transition-colors duration-300" style={{fontFamily:'Poppins, sans-serif'}}>
                  {b}
                </span>
              </div>
            ))}
          </div>
          {/* Fade edges — dark */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32" style={{background:'linear-gradient(90deg, var(--shark-950), transparent)'}}/>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32" style={{background:'linear-gradient(-90deg, var(--shark-950), transparent)'}}/>
        </div>
      </div>
    </section>
  );
}

/* Dead code removed: APPLICATIONS, ApplicationTile, BrandStrip */

/* ————————————————— CERTIFICATIONS BAR ————————————————— */
function Certifications() {
  const certs = [
    {
      id: 'iatf',
      name: 'IATF 16949',
      sub: 'Quality Austria',
      icon: (
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="64" height="64" rx="4" fill="#C41E3A"/>
          <text x="40" y="54" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="900" fontSize="42" fill="#fff">Q</text>
        </svg>
      ),
    },
    {
      id: 'iso',
      name: 'ISO 9001',
      sub: 'Quality Management',
      icon: (
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="32" stroke="#2E7D32" strokeWidth="4" fill="none"/>
          <circle cx="40" cy="40" r="22" stroke="#2E7D32" strokeWidth="2" fill="none"/>
          <text x="40" y="36" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="13" fill="#2E7D32">ISO</text>
          <text x="40" y="52" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="11" fill="#2E7D32">9001</text>
        </svg>
      ),
    },
    {
      id: 'grs',
      name: 'GRS',
      sub: 'Global Recycled Standard',
      icon: (
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 12 C55 12 66 23 66 38 L58 38 L68 52 L78 38 L70 38 C70 20 57 8 40 8" fill="#0277BD"/>
          <path d="M40 68 C25 68 14 57 14 42 L22 42 L12 28 L2 42 L10 42 C10 60 23 72 40 72" fill="#0277BD"/>
          <text x="40" y="44" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="14" fill="#0277BD">GRS</text>
        </svg>
      ),
    },
    {
      id: 'oekotex',
      name: 'OEKO-TEX',
      sub: 'Standard 100',
      icon: (
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 8 C40 8 58 20 58 42 C58 56 50 68 40 72 C30 68 22 56 22 42 C22 20 40 8 40 8Z" fill="#009688"/>
          <text x="40" y="38" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="10" fill="#fff" letterSpacing="0.5">OEKO</text>
          <text x="40" y="50" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="10" fill="#fff" letterSpacing="0.5">TEX</text>
          <text x="40" y="60" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="400" fontSize="6" fill="#fff" opacity="0.8">®</text>
        </svg>
      ),
    },
    {
      id: 'cfp1',
      name: 'Carbon Footprint',
      sub: 'Product 220 gsm',
      icon: (
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="30" stroke="#43A047" strokeWidth="3" fill="none"/>
          <ellipse cx="40" cy="40" rx="30" ry="12" stroke="#43A047" strokeWidth="1.5" fill="none"/>
          <ellipse cx="40" cy="40" rx="12" ry="30" stroke="#43A047" strokeWidth="1.5" fill="none"/>
          <line x1="10" y1="40" x2="70" y2="40" stroke="#43A047" strokeWidth="1"/>
          <line x1="40" y1="10" x2="40" y2="70" stroke="#43A047" strokeWidth="1"/>
          <path d="M34 56 C34 56 36 48 40 48 C44 48 46 56 46 56" stroke="#43A047" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M36 58 C36 58 38 52 40 52 C42 52 44 58 44 58" stroke="#43A047" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
    },
    {
      id: 'cfp2',
      name: 'Carbon Footprint',
      sub: 'Product 350 gsm',
      icon: (
        <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="30" stroke="#43A047" strokeWidth="3" fill="none"/>
          <ellipse cx="40" cy="40" rx="30" ry="12" stroke="#43A047" strokeWidth="1.5" fill="none"/>
          <ellipse cx="40" cy="40" rx="12" ry="30" stroke="#43A047" strokeWidth="1.5" fill="none"/>
          <line x1="10" y1="40" x2="70" y2="40" stroke="#43A047" strokeWidth="1"/>
          <line x1="40" y1="10" x2="40" y2="70" stroke="#43A047" strokeWidth="1"/>
          <path d="M34 56 C34 56 36 48 40 48 C44 48 46 56 46 56" stroke="#43A047" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M36 58 C36 58 38 52 40 52 C42 52 44 58 44 58" stroke="#43A047" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="section-overlap relative bg-shark-950 py-14 md:py-20 overflow-hidden" style={{borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:6}}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <Reveal>
            <Eyebrow>Certifications</Eyebrow>
          </Reveal>
          <Reveal>
            <div className="eyebrow text-shark-600">Independently verified · Global standards</div>
          </Reveal>
        </div>
        <Reveal>
          <div className="border-y border-white/[0.06] py-10">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 md:gap-6 items-start justify-items-center">
              {certs.map(cert => (
                <a key={cert.id} href="#" className="cert-item flex flex-col items-center gap-3 group cursor-pointer noselect" title={`${cert.name} - ${cert.sub}`}>
                  <div className="cert-logo">
                    {cert.icon}
                  </div>
                  <div className="text-center">
                    <span className="cert-label block mono text-[10px] tracking-[0.15em] uppercase text-white/35 transition-colors duration-500">
                      {cert.name}
                    </span>
                    <span className="cert-label block mono text-[8px] tracking-[0.1em] uppercase text-white/20 mt-0.5 transition-colors duration-500">
                      {cert.sub}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————— SECTION 6: SUSTAINABILITY ————————————————— */
function Sustainability() {
  const barRef = useRef(null);

  // Animate the 70% bar on scroll
  useEffect(() => {
    const el = barRef.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;

    gsap.set(el, { width: '0%' });

    const tl = gsap.to(el, {
      width: '70%',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'top 50%',
        scrub: 0.8,
      },
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const pillars = [
    { n:'01', title:'Recycled Fibers', desc:'Up to 70% recycled content across the Sensara portfolio. Turning waste into premium material.',
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 21l4-7h6l4 7"/><path d="M14 3v11"/><circle cx="14" cy="14" r="3"/><path d="M5 14a9 9 0 1 1 18 0" strokeDasharray="3,2"/></svg> },
    { n:'02', title:'Solvent Free', desc:'100% solvent-free production. Water-based processes where applicable. Zero harmful emissions.',
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 3l-5 10a6 6 0 1 0 10 0L14 3z"/><path d="M11 18h6" strokeDasharray="2,2"/></svg> },
    { n:'03', title:'Mono-component Recyclability', desc:'Sensara Air and Core are 100% mono-component (PES), ensuring full recyclability at vehicle end-of-life. Circular by design.',
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 5l6 4-6 4"/><path d="M20 15l-6 4 6 4"/><path d="M14 9v10"/><circle cx="14" cy="14" r="11"/></svg> },
    { n:'04', title:'Low Carbon Footprint', desc:'Sustainable manufacturing practices that minimize environmental impact throughout the entire production cycle.',
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 22C6 14 14 6 22 6c0 8-8 16-16 16z"/><path d="M14 14l-4 4"/><path d="M14 14l4-4" strokeDasharray="2,2"/></svg> },
  ];
  return (
    <section id="sustainability" className="section-overlap relative bg-white text-shark-950 py-32 md:py-40 overflow-hidden" style={{borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:7, color:'#262626'}}>
      {/* Transition gradient from dark Globe above */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-[1]" style={{background:'linear-gradient(180deg, rgba(38,38,38,0.18) 0%, transparent 100%)', borderRadius:'32px 32px 0 0'}}/>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          {/* Image col */}
          <div className="md:col-span-5">
            <Reveal>
              <Parallax speed={-0.08} className="relative aspect-[4/5] overflow-hidden" style={{background:'#0a0f0a', borderRadius:'16px'}}>
                {/* Abstract fiber generative visual */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                  <defs>
                    <linearGradient id="fiberGrad1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1a6b3c" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#0d3d22" stopOpacity="0.3"/>
                    </linearGradient>
                    <linearGradient id="fiberGrad2" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#266DF1" stopOpacity="0.15"/>
                      <stop offset="100%" stopColor="#1a6b3c" stopOpacity="0.4"/>
                    </linearGradient>
                    <filter id="fiberBlur">
                      <feGaussianBlur stdDeviation="1.5"/>
                    </filter>
                  </defs>
                  {/* Organic fiber strands */}
                  {[...Array(30)].map((_, i) => {
                    const x1 = (i * 37 + 10) % 400;
                    const y1 = (i * 53) % 500;
                    const cx1 = x1 + Math.sin(i) * 80;
                    const cy1 = y1 + 60;
                    const cx2 = x1 + Math.cos(i) * 60;
                    const cy2 = y1 + 120;
                    const x2 = (x1 + 40 + i * 11) % 400;
                    const y2 = Math.min(500, y1 + 150 + (i % 5) * 30);
                    return (
                      <path key={i}
                        d={`M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`}
                        fill="none"
                        stroke={i % 3 === 0 ? '#1a6b3c' : i % 3 === 1 ? '#266DF1' : '#2a8a4e'}
                        strokeWidth={0.8 + (i % 4) * 0.4}
                        strokeOpacity={0.15 + (i % 5) * 0.06}
                        filter={i % 4 === 0 ? 'url(#fiberBlur)' : undefined}
                      />
                    );
                  })}
                  {/* Circular nodes — recycled fiber cross-sections */}
                  {[...Array(12)].map((_, i) => (
                    <circle key={`c${i}`}
                      cx={(i * 67 + 30) % 380}
                      cy={(i * 89 + 40) % 480}
                      r={3 + (i % 4) * 2}
                      fill="none"
                      stroke={i % 2 === 0 ? '#1a6b3c' : '#266DF1'}
                      strokeWidth="0.6"
                      strokeOpacity={0.2 + (i % 3) * 0.1}
                    />
                  ))}
                  {/* Grain overlay */}
                  <rect width="400" height="500" fill="url(#fiberGrad2)" opacity="0.5"/>
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex items-end p-8">
                  <div>
                    <div className="mono text-[10px] tracking-[0.25em] uppercase text-white/30 mb-2">[ recycled fiber · macro ]</div>
                    <div className="font-display text-3xl text-white/60 tracking-tight" style={{letterSpacing:'-0.02em'}}>70% Recycled</div>
                    <div className="text-sm text-white/30 mt-1">PES fiber cross-section · 200× magnification</div>
                  </div>
                </div>
                {/* Radial glow */}
                <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 30% 40%, rgba(26,107,60,0.15), transparent 60%)'}}/>
                <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 70% 70%, rgba(38,109,241,0.08), transparent 50%)'}}/>
                {/* stats bottom-left */}
                <div className="absolute left-6 bottom-6 right-6 bg-white p-5 border border-black/5">
                  <div className="eyebrow mb-2" style={{color:'#737373'}}>Recycled Content</div>
                  <div className="flex items-baseline gap-2">
                    <span className="mono text-xs tracking-[0.2em] uppercase text-shark-600 mb-2">UP TO</span>
                    <span className="font-display text-6xl" style={{color:'var(--azure)', letterSpacing:'-0.04em', fontWeight:900}}>70%</span>
                  </div>
                  <div className="text-sm text-shark-700 mt-2 mb-3">Recycled content across the Sensara portfolio</div>
                  <div className="h-1.5 bg-shark-100 relative overflow-hidden">
                    <div ref={barRef} className="absolute inset-y-0 left-0" style={{width:'0%', background:'var(--azure)'}}></div>
                  </div>
                </div>
              </Parallax>
            </Reveal>
          </div>

          {/* Content col */}
          <div className="md:col-span-7">
            <Reveal><Eyebrow className="mb-6" style={{color:'#737373'}}>Sustainability</Eyebrow></Reveal>
            <RevealLines stagger={0.14} className="mb-8">
              <div><span className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[-0.04em] block" role="presentation">Engineered with</span></div>
              <div><span className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[-0.04em] block" role="presentation" style={{color:'var(--success)'}}>Purpose.</span></div>
            </RevealLines>

            <div className="grid sm:grid-cols-2 gap-px bg-black/10 mt-10">
              {pillars.map((p,i)=>(
                <Reveal key={p.n} delay={i*100}>
                  <div className="bg-white p-6 md:p-8 h-full pillar-card cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-3xl tracking-tight" style={{color:'var(--success)'}}>{p.n}</span>
                        <span className="h-px flex-1 bg-black/10" style={{minWidth:'20px'}}></span>
                      </div>
                      <div className="pillar-icon" style={{color:'var(--success)'}}>{p.icon}</div>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl tracking-tight mb-3">{p.title}</h3>
                    <p className="text-sm text-shark-700 leading-relaxed" style={{textWrap:'pretty'}}>{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <div className="mt-12 pt-10 border-t border-black/10">
                <p className="font-light text-xl md:text-2xl tracking-tight text-shark-950 leading-[1.4]" style={{textWrap:'pretty'}}>
                  <span className="text-shark-400">"</span>Sensara empowers designers and OEMs to create distinctive, high-value interiors without compromising sustainability or performance.<span className="text-shark-400">"</span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————— FOOTER ————————————————— */
function Footer() {
  return (
    <footer id="contact" className="section-overlap relative bg-shark-950 text-white overflow-hidden" style={{borderRadius:'32px 32px 0 0', marginTop:'-32px', zIndex:8}}>
      {/* Transition gradient from white Sustainability above */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[1]" style={{background:'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', borderRadius:'32px 32px 0 0'}}/>
      {/* Massive wordmark backdrop */}
      <div className="relative pt-32 pb-12">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <Reveal>
            <Eyebrow className="mb-8">Contact</Eyebrow>
          </Reveal>
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-7">
              <RevealLines stagger={0.12} className="mb-8">
                <div><span className="font-display text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.04em] block" role="presentation">Specify Sensara</span></div>
                <div><span className="font-display text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.04em] block" role="presentation">in your next</span></div>
                <div><span className="font-display text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.04em] text-azure block" role="presentation">interior.</span></div>
              </RevealLines>
              <Reveal delay={150}>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:marketing@carlom.com" className="mono text-[11px] tracking-[0.25em] uppercase px-5 py-3 bg-azure text-white hover:bg-white hover:text-black transition-colors">
                    Get in Touch
                  </a>
                  <a href="mailto:marketing@carlom.com" className="cta-outline mono text-[11px] tracking-[0.25em] uppercase px-5 py-3 border border-white/20">
                    Request Samples
                  </a>
                  <a href="mailto:marketing@carlom.com?subject=Tech%20Sheet%20Request" className="cta-outline mono text-[11px] tracking-[0.25em] uppercase px-5 py-3 border border-white/20">
                    Download Tech Sheet
                  </a>
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <Reveal delay={200}>
                <div className="space-y-6">
                  <div>
                    <div className="eyebrow mb-2">Email</div>
                    <a href="mailto:marketing@carlom.com" className="text-lg hover:text-azure">marketing@carlom.com</a>
                  </div>
                  <div>
                    <div className="eyebrow mb-2">Parent Company</div>
                    <a href="https://carlom.com" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-azure">carlom.com</a>
                  </div>
                  <div>
                    <div className="eyebrow mb-2">Headquarters</div>
                    <div className="text-lg">Portugal · Europe</div>
                    <div className="text-lg text-shark-400">Production: China (JV)</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Huge wordmark */}
          <div className="overflow-hidden">
            <Reveal>
              <div className="font-display text-[clamp(80px,22vw,360px)] leading-[0.8] tracking-[-0.06em] text-white/[0.06] select-none">
                SENSARA
              </div>
            </Reveal>
          </div>

          {/* Bottom row */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="block w-5 h-5 relative">
                <span className="absolute inset-0 border border-white/70"></span>
                <span className="absolute inset-1 bg-white/70"></span>
              </span>
              <span className="text-sm text-white/70">Sensara is a product of <a href="https://carlom.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-azure">Carlom</a> - Innovating textiles since 1966.</span>
            </div>
            <div className="flex items-center gap-6 mono text-[10px] tracking-[0.2em] uppercase text-white/50">
              <a href="mailto:marketing@carlom.com?subject=Privacy%20Policy" className="hover:text-azure">Privacy</a>
              <a href="mailto:marketing@carlom.com?subject=Legal" className="hover:text-azure">Legal</a>
              <span>© 2026 Carlom</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, TechStatement, TheTouch, ProductTypes, Certifications, Sustainability, Footer });
