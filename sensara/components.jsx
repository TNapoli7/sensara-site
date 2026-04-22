/* Shared primitives for Sensara — GSAP + Lenis powered */

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

/* ————————————————— Lenis smooth scroll singleton ————————————————— */
let _lenis = null;
function initLenis() {
  if (_lenis) return _lenis;
  if (!window.Lenis) return null;
  _lenis = new window.Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });
  // Sync Lenis with GSAP ScrollTrigger
  _lenis.on('scroll', () => {
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  });
  // Connect to GSAP ticker
  if (window.gsap) {
    window.gsap.ticker.add((time) => {
      _lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  }
  return _lenis;
}

/* ————————————————— Register GSAP plugins ————————————————— */
function initGSAP() {
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
}

/* ————————————————— Scroll progress within a section ————————————————— */
function useSectionProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current; if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const passed = vh - rect.top;
        const prog = Math.max(0, Math.min(1, passed / total));
        setP(prog);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ref]);
  return p;
}

/* ————————————————— Global scrollY ————————————————— */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const f = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; setY(window.scrollY); });
    };
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return y;
}

/* ————————————————— Eyebrow label ————————————————— */
function Eyebrow({ children, className = '', style }) {
  return <div className={`eyebrow ${className}`} style={style}>{children}</div>;
}

/* ————————————————— GSAP Reveal wrapper ————————————————— */
function Reveal({ children, delay = 0, className = '', as = 'div', clip = false, scrub = false }) {
  const ref = useRef(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;

    // Set initial state
    if (clip) {
      gsap.set(el, { yPercent: 100, opacity: 0 });
    } else {
      gsap.set(el, { y: 40, opacity: 0 });
    }

    const tl = gsap.to(el, {
      y: 0,
      yPercent: clip ? 0 : undefined,
      opacity: 1,
      duration: scrub ? 1 : 1.0,
      delay: scrub ? 0 : delay / 1000,
      ease: scrub ? 'none' : 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: scrub ? 'top 85%' : 'top 88%',
        end: scrub ? 'top 55%' : undefined,
        scrub: scrub ? 0.6 : false,
        toggleActions: scrub ? undefined : 'play none none none',
      },
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [delay, clip, scrub]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}

/* ————————————————— Stagger Reveal — animates children one by one ————————————————— */
function StaggerReveal({ children, className = '', stagger = 0.08 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;
    const kids = el.children;
    if (!kids.length) return;

    gsap.set(kids, { y: 30, opacity: 0 });

    const tl = gsap.to(kids, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [stagger]);

  return <div ref={ref} className={className}>{children}</div>;
}

/* ————————————————— Parallax wrapper ————————————————— */
function Parallax({ children, speed = 0.15, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;

    const tl = gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [speed]);

  return <div ref={ref} className={className}>{children}</div>;
}

/* ————————————————— Suede texture scroll overlay ————————————————— */
function SuedeScrollTexture() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;

    // Slow parallax on the texture
    gsap.to(el, {
      backgroundPositionY: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(255,255,255,0.012) 2px,
            rgba(255,255,255,0.012) 3px
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 3px,
            rgba(255,255,255,0.008) 3px,
            rgba(255,255,255,0.008) 4px
          )
        `,
        backgroundSize: '4px 300%',
        mixBlendMode: 'overlay',
        opacity: 0.6,
      }}
    />
  );
}

/* ————————————————— Suede tile (CSS-only visual placeholder, labelled) ————————————————— */
function SuedeTile({ label, variant = 'dark', className = '', children }) {
  const cls = variant === 'azure' ? 'suede-azure' : variant === 'light' ? 'suede-light' : 'suede-bg';
  const textCls = variant === 'light' ? 'text-black/60' : 'text-white/60';
  return (
    <div className={`relative overflow-hidden ${cls} ${className}`}>
      {label && (
        <div className={`absolute top-3 left-3 mono text-[10px] tracking-[0.2em] uppercase ${textCls}`}>
          [ {label} ]
        </div>
      )}
      {children}
    </div>
  );
}

/* ————————————————— Azure hotspot dot ————————————————— */
function Hotspot({ x, y, label, active, onHover, onLeave }) {
  return (
    <button
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={label}
    >
      <span className="relative block">
        <span className="absolute inset-0 rounded-full pulse-dot" style={{background:'var(--azure)', width:'12px', height:'12px'}} />
        <span className="block w-3 h-3 rounded-full bg-azure" style={{boxShadow:'0 0 0 2px rgba(255,255,255,.15)'}} />
      </span>
      {active && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 bg-white text-black">
          {label}
        </span>
      )}
    </button>
  );
}

/* ————————————————— Car schematic SVG ————————————————— */
function CarSchematic({ hover, setHover }) {
  const spots = [
    { id:'headliner', x: 50, y: 22, label: 'Headliner & Pillars' },
    { id:'sunvisor',  x: 35, y: 30, label: 'Sunvisor' },
    { id:'pillow',    x: 40, y: 46, label: 'Head Pillow Cushions' },
    { id:'ip',        x: 22, y: 52, label: 'Instrument Panel' },
    { id:'door',      x: 58, y: 62, label: 'Door Panels' },
    { id:'seat',      x: 48, y: 74, label: 'Seat Systems' },
  ];
  return (
    <div className="relative w-full" style={{aspectRatio:'16/9'}}>
      <div className="absolute inset-0 suede-bg" />
      <div className="absolute inset-0 grid-lines" />
      <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="floorGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#266DF1" stopOpacity=".0"/>
            <stop offset="1" stopColor="#266DF1" stopOpacity=".15"/>
          </linearGradient>
        </defs>
        <rect x="0" y="380" width="800" height="70" fill="url(#floorGrad)"/>
        <line x1="0" y1="380" x2="800" y2="380" stroke="#266DF1" strokeOpacity=".35"/>
        <g stroke="#ffffff" strokeOpacity=".85" fill="none" strokeWidth="1.25">
          <path d="M80 340 L140 300 L260 290 L360 240 L520 230 L640 260 L720 290 L740 340 Z" />
          <path d="M260 290 C 320 210, 520 210, 640 260" />
          <line x1="420" y1="230" x2="420" y2="290" />
          <circle cx="210" cy="340" r="42" />
          <circle cx="620" cy="340" r="42" />
          <circle cx="210" cy="340" r="22" strokeOpacity=".4" />
          <circle cx="620" cy="340" r="22" strokeOpacity=".4" />
          <path d="M380 290 L380 250 L420 245 L420 290" strokeOpacity=".35"/>
          <path d="M455 290 L455 250 L500 245 L500 290" strokeOpacity=".35"/>
          <line x1="340" y1="290" x2="340" y2="340" strokeOpacity=".35"/>
          <line x1="530" y1="290" x2="530" y2="340" strokeOpacity=".35"/>
          <path d="M300 220 C 400 200, 520 200, 600 230" strokeOpacity=".25"/>
        </g>
      </svg>
      {spots.map(s => (
        <Hotspot key={s.id} x={s.x} y={s.y} label={s.label} active={hover === s.id} onHover={() => setHover(s.id)} onLeave={() => setHover(null)} />
      ))}
      {[['top-4 left-4'],['top-4 right-4'],['bottom-4 left-4'],['bottom-4 right-4']].map((c,i)=>(
        <div key={i} className={`absolute ${c[0]} w-4 h-4`}>
          <div className="absolute inset-x-0 top-0 h-px bg-white/40"/>
          <div className="absolute inset-y-0 left-0 w-px bg-white/40"/>
        </div>
      ))}
      <div className="absolute bottom-3 left-3 mono text-[10px] tracking-[0.2em] uppercase text-white/50">
        [ fig.01 — interior application map ]
      </div>
      <div className="absolute bottom-3 right-3 mono text-[10px] tracking-[0.2em] uppercase text-white/50">
        hover zones
      </div>
    </div>
  );
}

Object.assign(window, { initLenis, initGSAP, useSectionProgress, useScrollY, Eyebrow, Reveal, StaggerReveal, Parallax, SuedeScrollTexture, SuedeTile, Hotspot, CarSchematic });
