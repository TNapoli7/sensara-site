/* Sensara App — root */

function App() {
  // Initialize GSAP + Lenis on mount
  useEffect(() => {
    initGSAP();
    initLenis();
  }, []);

  // Smooth anchor scroll via Lenis
  useEffect(() => {
    const handle = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (window._lenis) {
        window._lenis.scrollTo(el, { offset: -40 });
      } else {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, []);

  return (
    <>
      <SuedeScrollTexture/>
      <Nav/>
      <Hero/>
      <div className="section-stack">
        <SectionEntry><TechStatement/></SectionEntry>
        <SectionEntry><TheTouch/></SectionEntry>
        <SectionEntry><ProductTypes/></SectionEntry>
        <SectionEntry><GlobeSection/></SectionEntry>
        <SectionEntry><Sustainability/></SectionEntry>
        <SectionEntry><Footer/></SectionEntry>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
