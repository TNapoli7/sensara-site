/* Sensara App — root */

function App() {
  // Smooth anchor scroll
  useEffect(() => {
    const handle = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, []);

  return (
    <>
      <Nav/>
      <Hero/>
      <TechStatement/>
      <TextureDivider variant="dark"/>
      <ProductTypes/>
      <TextureDivider variant="dark"/>
      <Applications/>
      <GlobeSection/>
      <TextureDivider variant="dark"/>
      <Sustainability/>
      <Footer/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
