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
    x: 12, y: 18,
    label: 'Head Pillow Cushions',
    product: 'Sensara Skin',
    spec: '260 gsm · 90% PES / 10% Spandex',
    detail: 'Ultimate softness engineered for direct skin contact. Four-way stretch ensures a flawless wrapped finish.',
    image: 'sensara/images/head-pillow.jpg',
  },
  {
    id: 'seat',
    x: 22, y: 50,
    label: 'Seat Systems',
    product: 'Sensara Core',
    spec: '320 gsm · 100% PES · Solvent free',
    detail: 'High abrasion resistance and low elongation designed for high-stress seating areas. Full recyclability at vehicle end-of-life.',
    image: 'sensara/images/seats.jpg',
  },
  {
    id: 'headliner',
    x: 42, y: 5,
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
    x: 54, y: 45,
    label: 'Door Panels',
    product: 'Sensara Plus',
    spec: '300 gsm · 70% PES / 30% PU · Water based',
    detail: 'Luxury performance for demanding interior surfaces. Available with up to 70% recycled content.',
    image: 'sensara/images/door-panel.jpg',
  },
];

function InteriorHotspots({ active, setActive }) {
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const activeSpot = HOTSPOT_DATA.find(s => s.id === active);

  // Animate slide panel with GSAP
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !window.gsap) return;
    const gsap = window.gsap;

    if (active) {
      // Kill running anims
      gsap.killTweensOf(panel);

      // Slide panel in from right
      gsap.fromTo(panel,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.6, ease: 'power3.out',
          onComplete: () => {
            // Stagger content after panel is visible
            const content = contentRef.current;
            if (content?.children?.length) {
              gsap.fromTo(content.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
              );
            }
          }
        }
      );
    } else {
      // Slide out
      gsap.to(panel, {
        xPercent: 105, duration: 0.4, ease: 'power2.in',
      });
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
          style={{
            filter: active ? 'brightness(0.6)' : 'brightness(1)',
            transform: active ? 'scale(1.03)' : 'scale(1)',
            transition:'filter 0.6s ease, transform 0.8s cubic-bezier(0.2,0.7,0.2,1)',
          }}
        />
        {/* Soft edge vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)'
        }}/>

        {/* Hotspot dots */}
        {HOTSPOT_DATA.map(spot => (
          <button
            key={spot.id}
            onClick={() => setActive(active === spot.id ? null : spot.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, minWidth:'44px', minHeight:'44px', display:'flex', alignItems:'center', justifyContent:'center' }}
            aria-label={spot.label}
          >
            <span className="relative block">
              <span className="absolute inset-0 rounded-full"
                style={{
                  width: active === spot.id ? '28px' : '20px',
                  height: active === spot.id ? '28px' : '20px',
                  margin: active === spot.id ? '-8px' : '-4px',
                  background: 'rgba(38,109,241,0.25)',
                  border: '1px solid rgba(38,109,241,0.5)',
                  borderRadius: '50%',
                  animation: active === spot.id ? 'none' : 'pulseDot 2s infinite',
                  transition: 'all 0.3s ease',
                }}/>
              <span className="block rounded-full bg-azure"
                style={{
                  width: active === spot.id ? '14px' : '10px',
                  height: active === spot.id ? '14px' : '10px',
                  boxShadow:'0 0 12px rgba(38,109,241,0.6), 0 0 0 2px rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                }}/>
            </span>
            {/* Floating label on hover — hidden when panel is open */}
            {!active && (
              <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <span className="mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-azure text-white inline-block"
                  style={{boxShadow:'0 4px 20px rgba(38,109,241,0.35)'}}>
                  {spot.label}
                </span>
              </span>
            )}
          </button>
        ))}

        {/* Slide-in detail panel — right side, always mounted */}
        <div ref={panelRef}
          className="absolute top-0 right-0 bottom-0 z-20 w-full md:w-[45%]"
          style={{
            transform: 'translateX(105%)',
            pointerEvents: activeSpot ? 'auto' : 'none',
          }}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Full-height product image */}
            <div className="absolute inset-0 overflow-hidden">
              {activeSpot && (
                <img key={activeSpot.id} src={activeSpot.image} alt={activeSpot.label} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{transform:'scale(1.05)'}}/>
              )}
              {/* Gradient overlays for text readability */}
              <div className="absolute inset-0" style={{
                background:'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.5) 100%)'
              }}/>
              <div className="absolute inset-0" style={{
                background:'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.8) 100%)'
              }}/>
            </div>

            {/* Left edge line accent */}
            <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-azure z-10"/>

            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              className="absolute top-5 right-5 z-30 w-10 h-10 flex items-center justify-center border border-white/20 hover:border-azure hover:bg-azure/10 transition-all duration-300"
              style={{backdropFilter:'blur(8px)', background:'rgba(0,0,0,0.3)'}}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M1 1l12 12M13 1L1 13"/>
              </svg>
            </button>

            {/* Content — staggered reveal */}
            {activeSpot && (
              <div ref={contentRef} className="relative z-20 flex flex-col justify-end h-full p-8 md:p-10">
                <div>
                  <span className="mono text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 bg-azure text-white inline-block mb-6">
                    {activeSpot.product}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[-0.04em] text-white leading-[0.95] mb-4">
                    {activeSpot.label}
                  </h3>
                </div>
                <div>
                  <p className="mono text-[11px] tracking-[0.15em] text-azure mb-5">{activeSpot.spec}</p>
                </div>
                <div>
                  <div className="w-16 h-px bg-white/20 mb-5"/>
                </div>
                <div>
                  <p className="text-base text-white/75 leading-relaxed max-w-sm" style={{textWrap:'pretty'}}>
                    {activeSpot.detail}
                  </p>
                </div>
                <div>
                  <a href="#contact" className="inline-flex items-center gap-3 mt-8 mono text-[11px] tracking-[0.2em] uppercase text-white hover:text-azure transition-colors group/cta">
                    <span>Request Sample</span>
                    <span className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
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
