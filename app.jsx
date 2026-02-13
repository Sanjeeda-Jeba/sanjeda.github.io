const { useEffect, useMemo, useState } = React;

const content = window.SITE_CONTENT;

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
}

function useBackgroundNetwork() {
  useEffect(() => {
    const canvas = document.getElementById('bg-network');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nodes = [];
    let raf;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(100, Math.floor(window.innerWidth / 16));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      }));
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(137, 211, 133, 0.22)';
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 96) {
            const alpha = 1 - d / 96;
            ctx.strokeStyle = `rgba(108, 209, 240, ${alpha * 0.16})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(render);
    };

    setup();
    render();
    window.addEventListener('resize', setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setup);
    };
  }, []);
}

function App() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [track, setTrack] = useState(content.researchTracks[0].key);
  const [expandedNews, setExpandedNews] = useState(false);
  const [query, setQuery] = useState('');

  useReveal();
  useBackgroundNetwork();

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((p) => (p + 1) % content.roles.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const activeTrack = useMemo(() => content.researchTracks.find((t) => t.key === track), [track]);

  const filteredPublications = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return content.publications;
    return content.publications.filter((item) =>
      item.title.toLowerCase().includes(term) ||
      item.tag.toLowerCase().includes(term) ||
      item.venue.toLowerCase().includes(term) ||
      item.year.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <main className="shell" id="home">
      <nav className="top-nav glass reveal">
        <h2 className="brand">{content.site.owner}</h2>
        <div className="nav-links">
          {content.navLinks.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
        <a className="btn small primary" href={`mailto:${content.site.email}`}>Contact me</a>
      </nav>

      <header className="hero reveal">
        <div className="hero-photo-wrap">
          <img src={content.site.profileImage} alt="Sanjeda Akter profile" className="hero-photo" />
        </div>

        <article className="hero-card glass">
          <p className="chip">{content.site.headlineChip}</p>
          <h1>
            Hi, I’m {content.site.owner}
            <span>{content.site.subtitle}</span>
          </h1>
          <p className="typing">Now exploring: <b>{content.roles[roleIndex]}</b></p>
          <p className="lead">{content.site.description}</p>
          <div className="actions">
            <a className="btn primary" href="#projects">View Projects</a>
            <a className="btn" href={content.site.cvPath} target="_blank" rel="noreferrer">Open CV</a>
          </div>
          <div className="socials" aria-label="Social links">
            {content.socials.map((social) => (
              <a key={social.label} className="social-link" href={social.url} target="_blank" rel="noreferrer">
                <span>{social.icon}</span> {social.label}
              </a>
            ))}
          </div>
        </article>
      </header>

      <section id="about" className="about-spotlight reveal">
        <article className="about-card glass">
          <h2>About Me</h2>
          {content.aboutText.map((para) => <p key={para}>{para}</p>)}
        </article>
      </section>

      <section className="reveal values-section glass">
        <h2>Take a look at my values</h2>
        <div className="values-grid">
          {content.values.map((item) => (
            <article key={item.title} className="value-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal stats-grid">
        {content.stats.map((item) => (
          <article key={item.label} className="glass stat">
            <p>{item.label}</p>
            <h2>{item.value}</h2>
          </article>
        ))}
      </section>

      <section id="research" className="glass reveal section">
        <div className="section-head">
          <h2>Research Engine</h2>
          <span>interactive track selector</span>
        </div>
        <div className="track-tabs">
          {content.researchTracks.map((item) => (
            <button
              key={item.key}
              className={track === item.key ? 'tab active' : 'tab'}
              onClick={() => setTrack(item.key)}
              type="button"
            >
              {item.icon} {item.title}
            </button>
          ))}
        </div>
        <article className="track-panel">
          <h3>{activeTrack.title}</h3>
          <ul>{activeTrack.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </article>
      </section>

      <section id="projects" className="reveal section">
        <div className="section-head">
          <h2>Publications & Projects</h2>
          <span>search</span>
        </div>
        <div className="filters glass">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, venue, tag, year"
            aria-label="Search publications"
          />
        </div>
        <div className="cards">
          {filteredPublications.map((item) => (
            <article key={item.title} className="glass pub-card">
              <p className="tag">{item.tag} • {item.year}</p>
              <h3>{item.title}</h3>
              <p>{item.venue}</p>
              <a href={item.summaryUrl}>Read summary →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="glass reveal section">
        <div className="section-head">
          <h2>Lab Log</h2>
          <button className="btn small" onClick={() => setExpandedNews((v) => !v)} type="button">
            {expandedNews ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {content.labLog.map((item, idx) => (
          <details key={item} open={idx === 0 || expandedNews} className="news-row">
            <summary>{item}</summary>
            <p>Sharing notes, prototypes, experiment snapshots, and reproducible research directions.</p>
          </details>
        ))}
      </section>

      <section className="glass reveal section updater">
        <h2>Quick Update System</h2>
        <p>Edit only <code>content.js</code> for most updates.</p>
        <ul>{content.updateGuide.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </section>

      <section id="contact" className="glass reveal section contact">
        <h2>Let’s collaborate on impactful AI</h2>
        <p>Open to research collaborations, speaking, and ML/NLP engineering opportunities.</p>
        <div className="actions center">
          <a className="btn primary" href={`mailto:${content.site.email}`}>Email me</a>
          <a className="btn" href={content.site.cvPath} target="_blank" rel="noreferrer">Download CV</a>
        </div>
      </section>

      <footer>
        <p>© 2026 {content.site.owner} • Matcha kawaii AI portfolio</p>
        <div className="footer-socials">
          {content.socials.map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>
          ))}
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
