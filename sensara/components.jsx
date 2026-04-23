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
  const activeSpot = HOTSPOT_DATA.find(s => s.id === active);
  const isOpen = !!activeSpot;
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Smooth cursor follow with lerp
  useEffect(() => {
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    if (isMobile) return;

    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.15);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.15);
      setCursorPos({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseEnter = useCallback(() => {
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    if (!isMobile) setCursorVisible(true);
  }, []);
  const handleMouseLeave = useCallback(() => { setCursorVisible(false); setHoveredSpot(null); }, []);

  // Cursor text — show spot label on hover, "Explore" otherwise
  const cursorText = hoveredSpot ? hoveredSpot : 'Explore';
  const cursorSize = hoveredSpot ? 90 : 70;

  return (
    <div className="relative w-full overflow-hidden" style={{borderRadius:'16px'}}>
      {/* Hero interior image */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{aspectRatio:'16/9', cursor: (cursorVisible && !isOpen) ? 'none' : 'auto'}}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Custom cursor */}
        <div
          ref={cursorRef}
          className="absolute pointer-events-none z-30"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: cursorSize + 'px',
            height: cursorSize + 'px',
            marginLeft: -(cursorSize / 2) + 'px',
            marginTop: -(cursorSize / 2) + 'px',
            borderRadius: '50%',
            border: '1px solid rgba(38,109,241,0.6)',
            background: 'rgba(38,109,241,0.08)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cursorVisible && !isOpen ? 1 : 0,
            transform: cursorVisible && !isOpen ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1), width 0.3s ease, height 0.3s ease, margin 0.3s ease',
            mixBlendMode: 'normal',
          }}
        >
          <span className="mono text-[9px] tracking-[0.2em] uppercase text-azure/90 select-none text-center leading-tight" style={{maxWidth:'60px'}}>
            {cursorText}
          </span>
        </div>

        <img
          src="sensara/images/interior-hero.jpg"
          alt="Premium car interior with Sensara materials"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: isOpen ? 'brightness(0.65)' : 'brightness(1)',
            transform: isOpen ? 'scale(1.02)' : 'scale(1)',
            transition:'filter 0.5s ease, transform 0.7s ease',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          background:'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)'
        }}/>

        {/* Hotspot dots */}
        {HOTSPOT_DATA.map(spot => (
          <button
            key={spot.id}
            onClick={() => setActive(active === spot.id ? null : spot.id)}
            onMouseEnter={() => setHoveredSpot(spot.label)}
            onMouseLeave={() => setHoveredSpot(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, minWidth:'44px', minHeight:'44px', display:'flex', alignItems:'center', justifyContent:'center', cursor: cursorVisible ? 'none' : 'pointer' }}
            aria-label={spot.label}
          >
            <span className="relative block">
              <span className="absolute inset-0 rounded-full"
                style={{
                  width: active === spot.id ? '36px' : hoveredSpot === spot.label ? '32px' : '20px',
                  height: active === spot.id ? '36px' : hoveredSpot === spot.label ? '32px' : '20px',
                  margin: active === spot.id ? '-12px' : hoveredSpot === spot.label ? '-10px' : '-4px',
                  background: hoveredSpot === spot.label ? 'rgba(38,109,241,0.35)' : 'rgba(38,109,241,0.25)',
                  border: '1px solid rgba(38,109,241,0.5)',
                  borderRadius: '50%',
                  animation: active === spot.id || hoveredSpot === spot.label ? 'none' : 'pulseDot 2s infinite',
                  transition: 'all 0.3s ease',
                }}/>
              <span className="block rounded-full bg-azure"
                style={{
                  width: active === spot.id ? '18px' : hoveredSpot === spot.label ? '16px' : '10px',
                  height: active === spot.id ? '18px' : hoveredSpot === spot.label ? '16px' : '10px',
                  boxShadow: hoveredSpot === spot.label
                    ? '0 0 20px rgba(38,109,241,0.8), 0 0 0 3px rgba(255,255,255,0.35)'
                    : '0 0 12px rgba(38,109,241,0.6), 0 0 0 2px rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                }}/>
            </span>
          </button>
        ))}

        {/* Slide-in panel — pure CSS transition, right side */}
        <div
          className="absolute top-0 right-0 bottom-0 z-20 w-[85%] md:w-[42%]"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            opacity: isOpen ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
            pointerEvents: isOpen ? 'auto' : 'none',
            cursor: 'default',
          }}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden" style={{
            background:'rgba(12,12,12,0.95)',
            backdropFilter:'blur(20px)',
            borderLeft:'1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Close button — top left */}
            <button
              onClick={() => setActive(null)}
              className="close-btn absolute top-4 left-4 z-30 w-9 h-9 flex items-center justify-center border border-white/20"
              style={{background:'rgba(255,255,255,0.05)', cursor:'pointer'}}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l10 10M11 1L1 11"/>
              </svg>
            </button>

            {/* Image — top half */}
            <div className="relative w-full flex-shrink-0" style={{height:'50%'}}>
              {activeSpot && (
                <img key={activeSpot.id} src={activeSpot.image} alt={activeSpot.label} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.4s ease 0.15s',
                  }}/>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-24" style={{
                background:'linear-gradient(to top, rgba(12,12,12,0.95), transparent)'
              }}/>
              {/* Azure accent line at bottom of image */}
              <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-azure"/>
            </div>

            {/* Content — bottom half */}
            {activeSpot && (
              <div className="flex-1 px-6 md:px-8 py-5 md:py-6 flex flex-col justify-between overflow-y-auto"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.4s ease 0.2s, transform 0.5s ease 0.2s',
                }}>
                <div>
                  {/* Product badge */}
                  <span className="mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 bg-azure text-white inline-block mb-4">
                    {activeSpot.product}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-2xl md:text-3xl tracking-[-0.03em] text-white leading-[1] mb-3">
                    {activeSpot.label}
                  </h3>

                  {/* Specs */}
                  <p className="mono text-[10px] tracking-[0.15em] text-azure/90 mb-4">{activeSpot.spec}</p>

                  {/* Divider */}
                  <div className="w-10 h-px bg-white/15 mb-4"/>

                  {/* Description */}
                  <p className="text-sm text-white/70 leading-relaxed" style={{textWrap:'pretty'}}>
                    {activeSpot.detail}
                  </p>
                </div>

                {/* CTA */}
                <a href="#contact" className="inline-flex items-center gap-2 mt-5 mono text-[10px] tracking-[0.2em] uppercase text-white/80 hover:text-azure transition-colors">
                  <span>Request Sample</span>
                  <span>→</span>
                </a>
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

Object.assign(window, { initLenis, initGSAP, useSectionProgress, useScrollY, Eyebrow, Reveal, RevealLines, StaggerReveal, Parallax, ParallaxImage, SectionEntry, SuedeScrollTexture, SuedeTile, InteriorHotspots, HOTSPOT_DATA });
