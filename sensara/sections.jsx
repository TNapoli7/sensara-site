/* Sensara page sections */

/* ————————————————— NAV ————————————————— */
function Nav() {
  const y = useScrollY();
  const scrolled = y > 60;
  const [open, setOpen] = useState(false);
  const items = [
    ['Product', '#product'],
    ['Applications', '#applications'],
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
          <span className="mono text-[10px] tracking-[0.25em] uppercase text-shark-400 hidden md:inline-block border-l border-white/20 pl-3 ml-1">by Carlom · est. 1966</span>
        </a>
        <div className="hidden lg:flex items-center gap-x-7 xl:gap-x-9">
          {items.map(([l,h]) => (
            <a key={h} href={h} className="mono text-[11px] tracking-[0.2em] uppercase text-white/80 hover:text-azure transition-colors whitespace-nowrap">
              {l}
            </a>
          ))}
          <a href="#contact" className="mono text-[11px] tracking-[0.2em] uppercase px-4 py-2 bg-azure hover:bg-white hover:text-azure transition-colors whitespace-nowrap">
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
              poster=""
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

            {/* Carlom badge — only visible after hero shrinks away from nav */}
            <div className="absolute top-24 left-6 md:top-28 md:left-8 flex items-center gap-2 z-10 transition-opacity duration-500"
                 style={{opacity: ease > 0.15 ? 1 : 0}}>
              <span className="block w-4 h-4 relative">
                <span className="absolute inset-0 border border-white/80"></span>
                <span className="absolute inset-[3px] bg-white/80"></span>
              </span>
              <span className="mono text-[10px] tracking-[0.25em] uppercase text-white/80">by Carlom · est. 1966</span>
            </div>

            {/* Top-right spec chip — only after hero shrinks */}
            <div className="absolute top-24 right-6 md:top-28 md:right-8 mono text-[10px] tracking-[0.25em] uppercase text-white/60 z-10 transition-opacity duration-500"
                 style={{opacity: ease > 0.15 ? 1 : 0}}>
              [ REC ] · SUEDE · LOOP
            </div>

            {/* Hero text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{opacity: Math.max(0, 1 - ease * 1.4)}}>
              <Eyebrow className="mb-6 text-white/70">A Material by Carlom</Eyebrow>
              <h1 className="font-display text-[clamp(80px,18vw,280px)] leading-[0.85]" style={{letterSpacing:'-0.04em'}}>
                SENSARA
              </h1>
              <div className="mt-4 flex items-center gap-4 text-white/80">
                <span className="h-px w-12 bg-white/50"></span>
                <span className="font-light text-lg md:text-xl tracking-wide">Premium Suede for Automotive Interiors</span>
                <span className="h-px w-12 bg-white/50"></span>
              </div>

              <div className="mt-10 hidden md:flex items-center gap-10 mono text-[10px] tracking-[0.25em] uppercase text-white/60">
                <span>260–320 gsm</span>
                <span className="w-1 h-1 bg-white/40"></span>
                <span>Solvent Free</span>
                <span className="w-1 h-1 bg-white/40"></span>
                <span>Up to 70% Recycled</span>
                <span className="w-1 h-1 bg-white/40"></span>
                <span>Made in Portugal · China</span>
              </div>
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

/* ————————————————— TEXTURE DIVIDER ————————————————— */
function TextureDivider({ variant = 'dark' }) {
  const cls = variant === 'light' ? 'suede-light' : variant === 'azure' ? 'suede-azure' : 'suede-bg';
  return (
    <div className={`relative w-full h-10 md:h-14 ${cls} overflow-hidden`}>
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 80px)',
      }}/>
      <div className="absolute inset-y-0 left-0 w-24 md:w-40" style={{background: variant==='light' ? 'linear-gradient(90deg, #F6F6F6, transparent)' : 'linear-gradient(90deg, #0d0d0d, transparent)'}}/>
      <div className="absolute inset-y-0 right-0 w-24 md:w-40" style={{background: variant==='light' ? 'linear-gradient(-90deg, #F6F6F6, transparent)' : 'linear-gradient(-90deg, #0d0d0d, transparent)'}}/>
    </div>
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
    <section className="relative bg-shark-950 py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-60"/>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 relative">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-10 items-end mb-20">
          <div className="md:col-span-5">
            <Reveal><Eyebrow className="mb-6">01 · Technology</Eyebrow></Reveal>
            <div className="overflow-hidden">
              <Reveal clip>
                <h2 className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[-0.04em]">
                  Engineered<br/>for the<br/><span className="text-azure">Senses.</span>
                </h2>
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={150}>
              <p className="text-xl md:text-2xl font-light leading-[1.45] text-white/85 mb-6" style={{textWrap:'pretty'}}>
                Sensara is a premium suede material engineered to elevate the sensory experience of automotive interior surfaces. Designed for performance, aesthetics, and sustainability — it delivers a refined touch while meeting the demanding technical requirements of modern vehicle interiors.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-base md:text-lg text-shark-400 leading-relaxed" style={{textWrap:'pretty'}}>
                Produced using sustainable manufacturing practices with a low carbon footprint, Sensara can be manufactured using recycled fibers.
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

        {/* Car schematic */}
        <div className="mt-20 md:mt-28 grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8">
            <Reveal>
              <CarSchematic hover={hover} setHover={setHover}/>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow className="mb-4">Application Map</Eyebrow>
              <h3 className="font-display text-2xl md:text-3xl mb-6 tracking-tight">Six surfaces.<br/>One material family.</h3>
              <ul className="space-y-3">
                {[
                  ['headliner','Headliner & Pillars'],
                  ['seat','Seat Systems'],
                  ['door','Door Panels'],
                  ['ip','Instrument Panel'],
                  ['pillow','Head Pillow Cushions'],
                  ['sunvisor','Sunvisor'],
                ].map(([id,label])=>(
                  <li key={id}
                      onMouseEnter={()=>setHover(id)}
                      onMouseLeave={()=>setHover(null)}
                      className={`flex items-center gap-3 py-2 border-b border-white/10 cursor-default transition-colors ${hover===id ? 'text-azure' : 'text-white/80'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hover===id ? 'bg-azure' : 'bg-white/30'}`}></span>
                    <span className="mono text-[11px] tracking-[0.2em] uppercase">{label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
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
  // Flex grow: active=60, compressed=13 (sums ~100), default=25
  const flex = isActive ? 60 : isCompressed ? 13 : 25;

  // Per-panel texture
  const textures = {
    '01': {
      bg: 'radial-gradient(ellipse at 30% 30%, #3a3a3a, #151515 70%), #1a1a1a',
      overlay: 'radial-gradient(circle, rgba(255,255,255,.28) 1px, transparent 1.6px)',
      overlaySize: '14px 14px',
    },
    '02': {
      bg: 'radial-gradient(ellipse at 60% 40%, #343434, #121212 70%), #181818',
      overlay: 'repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 2px, transparent 2px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px)',
      overlaySize: 'auto',
    },
    '03': {
      bg: 'radial-gradient(ellipse at 40% 30%, rgba(38,109,241,.55), rgba(10,18,46,1) 65%), #0a1432',
      overlay: 'repeating-linear-gradient(115deg, rgba(255,255,255,.06) 0 2px, transparent 2px 5px)',
      overlaySize: 'auto',
    },
    '04': {
      bg: 'radial-gradient(ellipse at 50% 50%, #3a3238, #161217 70%), #1a1418',
      overlay: 'repeating-linear-gradient(45deg, transparent 0 7px, rgba(255,255,255,.08) 7px 8px)',
      overlaySize: 'auto',
    },
  };
  const tx = textures[p.code];

  return (
    <div
      onMouseEnter={()=>setHovered(idx)}
      onMouseLeave={()=>setHovered(null)}
      className="relative h-full cursor-pointer overflow-hidden border-r border-black/40 last:border-r-0"
      style={{
        flex: `${flex} 1 0`,
        transition: 'flex 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Base texture */}
      <div className="absolute inset-0" style={{ background: tx.bg }}/>
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: tx.overlay,
        backgroundSize: tx.overlaySize,
      }}/>
      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[.08]" style={{
        backgroundImage:'repeating-radial-gradient(circle at 0 0, rgba(255,255,255,.4) 0 .5px, transparent .5px 2px)',
        backgroundSize:'3px 3px',
        mixBlendMode:'overlay',
      }}/>
      {/* Dim when compressed */}
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{
        background: 'rgba(0,0,0,.45)',
        opacity: isCompressed ? 1 : 0,
      }}/>
      {/* Azure edge when active */}
      <div className="absolute inset-y-0 left-0 w-[2px] transition-opacity duration-500" style={{
        background:'var(--azure)', opacity: isActive ? 1 : 0,
      }}/>

      {/* Compressed state — rotated short name */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-8 pointer-events-none transition-opacity duration-300"
           style={{ opacity: isActive ? 0 : 1 }}>
        <div className="mono text-[10px] tracking-[0.3em] uppercase text-white/60">{p.code}</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="font-display text-lg md:text-xl lg:text-2xl text-white whitespace-nowrap"
               style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '-0.02em' }}>
            {p.name.replace('Sensara ', '')}
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center border border-white/30 text-white/60">+</div>
      </div>

      {/* Expanded state */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 pointer-events-none transition-opacity duration-500"
           style={{ opacity: isActive ? 1 : 0, transitionDelay: isActive ? '200ms' : '0ms' }}>
        <div className="flex items-start justify-between">
          <span className="mono text-[10px] tracking-[0.3em] uppercase text-white/70">{p.code} / 04</span>
          <span className="mono text-[10px] tracking-[0.25em] uppercase text-azure">● Active</span>
        </div>

        <div className="max-w-xl">
          <h3 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[-0.04em] text-white mb-3 leading-[0.95]">
            {p.name}
          </h3>
          <p className="text-base md:text-lg text-white/85 mb-6 font-light" style={{textWrap:'pretty'}}>{p.tag}</p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6 pb-6 border-b border-white/15">
            {p.specs.map((s,i)=>(
              <div key={i} className="flex items-center gap-2 mono text-[11px] text-white/80">
                <span className="w-1 h-1 bg-azure"></span>{s}
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="eyebrow mb-2 text-white/60">Applications</div>
            <div className="flex flex-wrap gap-1.5">
              {p.apps.map(a=>(
                <span key={a} className="mono text-[10px] tracking-[0.1em] uppercase px-2 py-1 border border-white/25 text-white/90 bg-white/5">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/80 leading-relaxed mb-6" style={{textWrap:'pretty'}}>{p.selling}</p>
        </div>

        <div className="flex items-end justify-between">
          <a href="#contact" className="mono text-[11px] tracking-[0.25em] uppercase flex items-center gap-2 text-white hover:text-azure transition-colors pointer-events-auto">
            <span>Request {p.name}</span>
            <span className="inline-block">→</span>
          </a>
          {/* Mini hotspot diagram */}
          <svg width="90" height="50" viewBox="0 0 90 50" className="text-white/50">
            <path d="M5 38 L15 30 L30 28 L42 20 L60 19 L72 24 L82 32 L85 38" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="22" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="70" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
            {/* Hotspot for this product */}
            {p.code === '01' && <circle cx="45" cy="16" r="3" fill="#266DF1"/>}
            {p.code === '02' && <circle cx="68" cy="28" r="3" fill="#266DF1"/>}
            {p.code === '03' && <circle cx="52" cy="22" r="3" fill="#266DF1"/>}
            {p.code === '04' && <circle cx="45" cy="24" r="3" fill="#266DF1"/>}
          </svg>
        </div>
      </div>
    </div>
  );
}

function ProductTypes() {
  const [hovered, setHovered] = useState(0); // default first panel active
  return (
    <section id="product" className="relative bg-shark-950 overflow-hidden">
      {/* Full-bleed accordion */}
      <Reveal>
        <div className="relative w-full h-[80vh] min-h-[640px] flex border-y border-white/5">
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
      </Reveal>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 flex items-center justify-between">
        <div className="eyebrow">Hover to expand · 01–04</div>
        <div className="eyebrow text-shark-400">Sensara Range · v1.0</div>
      </div>
    </section>
  );
}

/* ————————————————— SECTION 4: APPLICATIONS + BRANDS ————————————————— */
const APPLICATIONS = [
  { name: 'Headliner & Pillars', desc: 'Elegant and refined.', variant: 'dark', num:'A1' },
  { name: 'Seat Systems', desc: 'Comfortable, Ergonomic, Breathable.', variant: 'azure', num:'A2' },
  { name: 'Door Panels', desc: 'Robust, yet Elegant.', variant: 'dark', num:'A3' },
  { name: 'Instrument Panels', desc: 'Sleek, functional.', variant: 'light', num:'A4' },
  { name: 'Head Pillow Cushions', desc: 'Soft and comfortable.', variant: 'dark', num:'A5' },
  { name: 'Sunvisors', desc: 'Glare-reduction and resilient.', variant: 'light', num:'A6' },
];

function ApplicationTile({ a, i }) {
  const [hovered, setHovered] = useState(false);
  const isLight = a.variant === 'light';
  return (
    <Reveal delay={i*80}>
      <div
        onMouseEnter={()=>setHovered(true)}
        onMouseLeave={()=>setHovered(false)}
        className="relative h-[340px] md:h-[380px] overflow-hidden group cursor-pointer border border-black/5"
      >
        <SuedeTile variant={a.variant} className="absolute inset-0">
          <div className="absolute inset-0 transition-transform duration-[1200ms]" style={{
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}/>
        </SuedeTile>
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className={`mono text-[10px] tracking-[0.25em] uppercase ${isLight ? 'text-black/60' : 'text-white/60'}`}>{a.num} / Application</span>
            <span className={`w-8 h-8 flex items-center justify-center border ${hovered ? 'bg-azure border-azure text-white' : (isLight ? 'border-black/30 text-black/70' : 'border-white/30 text-white/70')} transition-all`}>
              ↗
            </span>
          </div>
          <div>
            <h3 className={`font-display text-2xl md:text-3xl tracking-tight mb-2 ${isLight ? 'text-black' : 'text-white'}`}>{a.name}</h3>
            <p className={`text-sm ${isLight ? 'text-black/70' : 'text-white/75'}`}>{a.desc}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Applications() {
  const brands = ['BYD','NIO','ZEEKR','GEELY','VOLKSWAGEN','XPENG','CHERY','DONGFENG'];
  return (
    <section id="applications" className="relative bg-shark-50 text-shark-950 py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        {/* Brand wall */}
        <div>
          <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
            <Reveal>
              <h3 className="font-display text-3xl md:text-5xl tracking-[-0.03em] text-shark-950">Trusted by leading<br/>automotive brands.</h3>
            </Reveal>
            <Reveal>
              <div className="eyebrow text-shark-500">Global OEM partners · 2020—present</div>
            </Reveal>
          </div>

          <div className="relative overflow-hidden border-y border-black/10 py-10">
            <div className="flex gap-16 marquee-track whitespace-nowrap">
              {[...brands, ...brands, ...brands].map((b,i)=>(
                <div key={i} className="flex items-center gap-4 shrink-0">
                  <span className="w-2 h-2 bg-shark-400"></span>
                  <span className="font-medium text-3xl md:text-4xl tracking-[-0.02em] text-shark-400 hover:text-shark-950 hover:opacity-100 transition-all" style={{fontFamily:'Poppins, sans-serif'}}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32" style={{background:'linear-gradient(90deg, #F6F6F6, transparent)'}}/>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32" style={{background:'linear-gradient(-90deg, #F6F6F6, transparent)'}}/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————— SECTION 6: SUSTAINABILITY ————————————————— */
function Sustainability() {
  const pillars = [
    { n:'01', title:'Recycled Fibers', desc:'Up to 70% recycled content across the Sensara portfolio. Turning waste into premium material.' },
    { n:'02', title:'Solvent Free',    desc:'100% solvent-free production. Water-based processes where applicable. Zero harmful emissions.' },
    { n:'03', title:'Mono-component Recyclability', desc:'Sensara Air and Core are 100% mono-component (PES), ensuring full recyclability at vehicle end-of-life. Circular by design.' },
    { n:'04', title:'Low Carbon Footprint', desc:'Sustainable manufacturing practices that minimize environmental impact throughout the entire production cycle.' },
  ];
  return (
    <section id="sustainability" className="relative bg-white text-shark-950 py-32 md:py-40 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          {/* Image col */}
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] bg-shark-100 overflow-hidden">
                <div className="absolute inset-0" style={{
                  background:`repeating-linear-gradient(135deg, #E7E7E7 0 14px, #D1D1D1 14px 15px)`,
                }}/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="mono text-[10px] tracking-[0.3em] uppercase text-shark-500 mb-2">[ SUSTAINABILITY EDITORIAL · RECYCLED FIBER CLOSE-UP ]</div>
                    <div className="font-display text-2xl text-shark-700" style={{letterSpacing:'-0.02em'}}>Recycled fiber · macro</div>
                  </div>
                </div>
                {/* stats bottom-left */}
                <div className="absolute left-6 bottom-6 right-6 bg-white p-5 border border-black/5">
                  <div className="eyebrow mb-2" style={{color:'#737373'}}>Recycled Content</div>
                  <div className="flex items-baseline gap-2">
                    <span className="mono text-xs tracking-[0.2em] uppercase text-shark-600 mb-2">UP TO</span>
                    <span className="font-display text-6xl" style={{color:'var(--azure)', letterSpacing:'-0.04em', fontWeight:900}}>70%</span>
                  </div>
                  <div className="text-sm text-shark-700 mt-2 mb-3">Recycled content across the Sensara portfolio</div>
                  <div className="h-1.5 bg-shark-100 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0" style={{width:'70%', background:'var(--azure)'}}></div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Content col */}
          <div className="md:col-span-7">
            <Reveal><Eyebrow className="mb-6" style={{color:'#737373'}}>05 · Sustainability</Eyebrow></Reveal>
            <div className="overflow-hidden mb-8">
              <Reveal clip>
                <h2 className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[-0.04em]">
                  Engineered with<br/><span style={{color:'var(--success)'}}>Purpose.</span>
                </h2>
              </Reveal>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-black/10 mt-10">
              {pillars.map((p,i)=>(
                <Reveal key={p.n} delay={i*100}>
                  <div className="bg-white p-6 md:p-8 h-full">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-display text-3xl tracking-tight" style={{color:'var(--success)'}}>{p.n}</span>
                      <span className="h-px flex-1 bg-black/10"></span>
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
    <footer id="contact" className="relative bg-shark-950 text-white overflow-hidden">
      {/* Massive wordmark backdrop */}
      <div className="relative pt-32 pb-12">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <Reveal>
            <Eyebrow className="mb-8">06 · Contact</Eyebrow>
          </Reveal>
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-7">
              <Reveal>
                <h2 className="font-display text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.04em] mb-8">
                  Specify Sensara<br/>in your next<br/><span className="text-azure">interior.</span>
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:marketing@carlom.com" className="mono text-[11px] tracking-[0.25em] uppercase px-5 py-3 bg-azure hover:bg-white hover:text-azure transition-colors">
                    Get in Touch
                  </a>
                  <a href="mailto:marketing@carlom.com" className="mono text-[11px] tracking-[0.25em] uppercase px-5 py-3 border border-white/20 hover:border-azure hover:text-azure transition-colors">
                    Request Samples
                  </a>
                  <a href="#" className="mono text-[11px] tracking-[0.25em] uppercase px-5 py-3 border border-white/20 hover:border-azure hover:text-azure transition-colors">
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
                    <a href="https://carlom.com" className="text-lg hover:text-azure">carlom.com</a>
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
              <span className="text-sm text-white/70">Sensara is a product of <a href="https://carlom.com" className="underline hover:text-azure">Carlom</a> — Innovating textiles since 1966.</span>
            </div>
            <div className="flex items-center gap-6 mono text-[10px] tracking-[0.2em] uppercase text-white/50">
              <a href="#" className="hover:text-azure">Privacy</a>
              <a href="#" className="hover:text-azure">Legal</a>
              <span>© 2026 Carlom</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, TechStatement, TextureDivider, ProductTypes, Applications, Sustainability, Footer });
