/* Sensara App — root */

/* Error boundary — catches JS errors so the page never white-screens */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0d0d0d',color:'#fff',fontFamily:'Poppins,sans-serif'}}>
          <div style={{textAlign:'center'}}>
            <h1 style={{fontSize:'24px',marginBottom:'12px'}}>Something went wrong</h1>
            <p style={{color:'rgba(255,255,255,0.6)',marginBottom:'20px'}}>Please refresh the page to try again.</p>
            <button onClick={()=>window.location.reload()} style={{padding:'10px 24px',background:'#266DF1',color:'#fff',border:'none',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase'}}>Refresh</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  // Initialize GSAP + Lenis on mount, then hide loader
  useEffect(() => {
    initGSAP();
    initLenis();
    // Hide loading screen once app is mounted
    if (window._hideLoader) window._hideLoader();
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
      {/* Skip to content — keyboard a11y */}
      <a href="#technology" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-azure focus:text-white focus:px-4 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <SuedeScrollTexture/>
      <Nav/>
      <main>
        <Hero/>
        <div className="section-stack">
          <SectionEntry><TechStatement/></SectionEntry>
          <SectionEntry><TheTouch/></SectionEntry>
          <SectionEntry><ProductTypes/></SectionEntry>
          <SectionEntry><GlobeSection/></SectionEntry>
          <SectionEntry><Sustainability/></SectionEntry>
          <SectionEntry><Footer/></SectionEntry>
        </div>
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App/></ErrorBoundary>);
