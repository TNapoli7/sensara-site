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

/* ————————————————— Interior Hotspots — real image based ————————————————— */
const HOTSPOT_DATA = [
  {
    id: 'pillow',
    x: 18, y: 18,
    label: 'Head Pillow Cushions',
    product: 'Sensara Skin',
    spec: '260 gsm · 90% PES / 10% Spandex',
    detail: 'Ultimate softness engineered for direct skin contact. Four-way stretch ensures a flawless wrapped finish.',
    image: 'sensara/images/head-pillow.jpg',
  },
  {
    id: 'seat',
    x: 30, y: 50,
    label: 'Seat Systems',
    product: 'Sensara Core',
    spec: '320 gsm · 100% PES · Solvent free',
    detail: 'High abrasion resistance and low elongation designed for high-stress seating areas. Full recyclability at vehicle end-of-life.',
    image: 'sensara/images/seats.jpg',
  },
  {
    id: 'headliner',
    x: 50, y: 5,
    label: 'Headliner & Pillars',
    product: 'Sensara Air',
    spec: '280 gsm · 100% PES · Mono-component',
    detail: 'Lightweight and fully recyclable. Precision perforation capability enables integrated lighting effects for overhead systems.',
    image: 'sensara/images/headliner.jpg',
  },
  {
    id: 'ip',
    x: 74, y: 38,
    label: 'Instrument Panel',
    product: 'Sensara Plus',
    spec: '300 gsm · 70% PES / 30% PU · Water based',
    detail: 'Premium suede finish for the most visible interior surface. High abrasion resistance meets refined aesthetics.',
    image: 'sensara/images/door-panel.jpg',
  },
  {
    id: 'door',
    x: 58, y: 55,
    label: 'Door Panels',
    product: 'Sensara Plus',
    spec: '300 gsm · 70% PES / 30% PU · Water based',
    detail: 'Luxury performance for demanding interior surfaces. Available with up to 70% recycled content.',
    image: 'sensara/images/door-panel.jpg',
  },
];

function InteriorHotspots({ active, setActive }) {
  const containerRef = useRef(null);
  const detailRef = useRef(null);
  const activeSpot = HOTSPOT_DATA.find(s => s.id === active);

  // Animate detail panel
  useEffect(() => {
    const el = detailRef.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;
    if (activeSpot) {
      gsap.killTweensOf(el);
      gsap.fromTo(el,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [active]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{borderRadius:'16px'}}>
      {/* Hero interior image */}
      <div className="relative w-full" style={{aspectRatio:'16/9'}}>
        <img
          src="sensara/images/interior-hero.jpg"
          alt="Premium car interior with Sensara materials"
          className="absolute inset-0 w-full h-full object-cover"
          style={{filter: active ? 'brightness(0.75)' : 'brightness(1)', transition:'filter 0.5s ease'}}
        />
        {/* Soft edge vignette only */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)'
        }}/>
        {/* Bottom gradient — only where detail panel sits */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none" style={{
          background:'linear-gradient(to top, rgba(0,0,0,0.55), transparent)'
        }}/>

        {/* Hotspot dots */}
        {HOTSPOT_DATA.map(spot => (
          <button
            key={spot.id}
            onClick={() => setActive(active === spot.id ? null : spot.id)}
            onMouseEnter={() => setActive(spot.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, minWidth:'44px', minHeight:'44px', display:'flex', alignItems:'center', justifyContent:'center' }}
            aria-label={spot.label}
          >
            <span className="relative block">
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full"
                style={{
                  width: active === spot.id ? '28px' : '20px',
                  height: active === spot.id ? '28px' : '20px',
                  margin: active === spot.id ? '-8px' : '-4px',
                  background: 'rgba(38,109,241,0.25)',
                  border: '1px solid rgba(38,109,241,0.5)',
                  borderRadius: '50%',
                  animation: 'pulseDot 2s infinite',
                  transition: 'all 0.3s ease',
                }}/>
              {/* Center dot */}
              <span className="block rounded-full bg-azure"
                style={{
                  width: active === spot.id ? '14px' : '10px',
                  height: active === spot.id ? '14px' : '10px',
                  boxShadow:'0 0 12px rgba(38,109,241,0.6), 0 0 0 2px rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                }}/>
            </span>
            {/* Floating label on hover */}
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
              style={{
                opacity: active === spot.id ? 1 : 0,
                transform: active === spot.id ? 'translateX(0) translateY(-50%)' : 'translateX(-8px) translateY(-50%)',
                transition: 'all 0.3s ease',
              }}>
              <span className="mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-azure text-white inline-block"
                style={{boxShadow:'0 4px 20px rgba(38,109,241,0.35)'}}>
                {spot.label}
              </span>
            </span>
          </button>
        ))}

        {/* Detail panel — appears over image when a spot is active */}
        {activeSpot && (
          <div ref={detailRef}
            className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-auto md:w-[420px] z-20"
            style={{pointerEvents:'auto'}}>
            <div className="backdrop-blur-xl overflow-hidden" style={{
              background:'rgba(18,18,18,0.85)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:'12px',
              boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
            }}>
              {/* Detail image */}
              <div className="relative w-full" style={{aspectRatio:'16/10'}}>
                <img src={activeSpot.image} alt={activeSpot.label} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{
                  background:'linear-gradient(to top, rgba(18,18,18,0.95), transparent)'
                }}/>
                <div className="absolute bottom-3 left-4">
                  <span className="mono text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 bg-azure/90 text-white">
                    {activeSpot.product}
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="px-5 py-4">
                <h4 className="font-display text-lg tracking-tight text-white mb-1">{activeSpot.label}</h4>
                <p className="mono text-[10px] tracking-[0.15em] text-azure mb-3">{activeSpot.spec}</p>
                <p className="text-sm text-white/65 leading-relaxed">{activeSpot.detail}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom caption bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{background:'rgba(26,26,26,0.95)'}}>
        <span className="mono text-[10px] tracking-[0.2em] uppercase text-white/40">
          [ fig.01 — interior application map ]
        </span>
        <span className="mono text-[10px] tracking-[0.2em] uppercase text-white/40">
          {active ? '← click to close' : 'select a zone'}
        </span>
      </div>
    </div>
  );
}

/* ————————————————— RevealLines — splits children into lines and staggers them ————————————————— */
function RevealLines({ children, stagger = 0.12, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;
    const lines = el.children;
    if (!lines.length) return;

    gsap.set(lines, { y: 60, opacity: 0, rotateX: 8 });

    const tl = gsap.to(lines, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.0,
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

  return <div ref={ref} className={className} style={{perspective:'800px'}}>{children}</div>;
}

/* ————————————————— ParallaxImage — image with parallax + reveal ————————————————— */
function ParallaxImage({ src, alt, speed = -0.12, className = '', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;
    const img = el.querySelector('img');
    if (!img) return;

    // Parallax on the image
    gsap.to(img, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Reveal clip
    gsap.fromTo(el,
      { clipPath: 'inset(15% 0% 15% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} style={style}>
      <img src={src} alt={alt || ''} className="w-full h-full object-cover" style={{transform:'scale(1.2)'}}/>
    </div>
  );
}

/* ————————————————— SectionEntry — animates section entrance with scale + shadow ————————————————— */
function SectionEntry({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    const gsap = window.gsap;

    gsap.fromTo(el,
      {
        scale: 0.97,
        boxShadow: '0 -20px 80px rgba(0,0,0,0)',
      },
      {
        scale: 1,
        boxShadow: '0 -20px 80px rgba(0,0,0,0.4)',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'top 40%',
          scrub: 0.8,
        },
      }
    );
  }, []);

  return <div ref={ref} className={className} style={{transformOrigin:'top center'}}>{children}</div>;
}

Object.assign(window, { initLenis, initGSAP, useSectionProgress, useScrollY, Eyebrow, Reveal, RevealLines, StaggerReveal, Parallax, ParallaxImage, SectionEntry, SuedeScrollTexture, SuedeTile, Hotspot, InteriorHotspots, HOTSPOT_DATA });
