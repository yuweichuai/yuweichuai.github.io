import { ArrowUpRight, Download, Mail, MapPin } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import AnalyticsConsent from "./analytics-consent";
import ResearchNetwork from "./research-network";
import siteConfig from "../site.config.json";
import bibliography from "../publications.bib?raw";
import venues from "../data/venues.json";
import { getPublications } from "../lib/publications.mjs";

const scholarUrl = "https://scholar.google.com/citations?user=C_1EKy0AAAAJ";

const profileLinks = [
  { label: "Google Scholar", href: scholarUrl },
  { label: "ORCID", href: "https://orcid.org/0000-0001-6181-7311" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yuwei-chuai-804916221/" },
  { label: "X / Twitter", href: "https://x.com/yuweichuai" },
];

const researchAreas = [
  {
    title: "Platform governance",
    description: "Misinformation, community-based fact-checking, and content moderation.",
  },
  {
    title: "Cross-platform information",
    description: "Information diffusion and systemic risk across digital platforms.",
  },
  {
    title: "Human–AI collaboration",
    description: "AI and LLM evaluation, and tools that support collaborative fact-checking.",
  },
];

const publications = getPublications(bibliography, venues);

const appointments = [
  {
    period: "May 2026 — Present",
    title: "Postdoctoral Researcher",
    institution: "University of Luxembourg",
    detail: "SnT · CLARITY project",
  },
  {
    period: "Dec 2025 — Mar 2026",
    title: "Visiting Research Fellow",
    institution: "University of Oxford",
    detail: "Oxford Internet Institute · Wolfson College · Host: Mohsen Mosleh",
  },
  {
    period: "Jun — Sep 2025",
    title: "Visiting Doctoral Student",
    institution: "Tsinghua University",
    detail: "Institute for Network Sciences and Cyberspace · Host: Xin Yi",
  },
];

const education = [
  {
    period: "2022 — 2026",
    title: "PhD in Computer Science",
    institution: "University of Luxembourg",
    detail: "Supervisor: Gabriele Lenzini. Thesis: Computational analysis of misinformation engagement and interventions on social media.",
  },
  {
    period: "2019 — 2022",
    title: "MSc in Management Science and Engineering",
    institution: "Beihang University",
    detail: "Exchange at the University of Luxembourg, 2021–2022.",
  },
  {
    period: "2015 — 2019",
    title: "BEng in Information Management and Information System",
    institution: "Hefei University of Technology",
    detail: "Outstanding Graduate, 2019.",
  },
];

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight size={14} strokeWidth={1.7} aria-hidden="true" />
    </a>
  );
}

function Authors({ authors }: { authors: { name: string; owner: boolean; corresponding: boolean }[] }) {
  return (
    <p className="publication-authors">
      {authors.map((author, index) => (
        <Fragment key={`${index}-${author.name}`}>
          {index > 0 && (index === authors.length - 1 ? " & " : ", ")}
          <span className="publication-author">
            {author.owner ? <strong>{author.name}</strong> : author.name}
            {author.corresponding && <sup className="corresponding-mark" title="Corresponding author" aria-label="Corresponding author">†</sup>}
          </span>
        </Fragment>
      ))}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top">Yuwei Chuai<span aria-hidden="true">.</span></a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#research">Research</a>
            <a href="#publications">Publications</a>
            <a href="#experience">Experience</a>
          </nav>
        </div>
      </header>

      <div className="site-layout">
        <aside className="profile" aria-label="Yuwei Chuai’s profile">
          <div className="profile-identity">
            <img
              className="portrait"
              src="./yuwei-chuai.jpg"
              alt="Portrait of Yuwei Chuai"
              width={128}
              height={128}
            />
            <div>
              <h1>Yuwei Chuai</h1>
              <p className="profile-role">Postdoctoral Researcher</p>
              <p className="profile-affiliation">SnT, University of Luxembourg</p>
            </div>
          </div>

          <div className="profile-contact">
            <a href="mailto:yuwei.chuai@uni.lu">
              <Mail size={15} aria-hidden="true" /><span>yuwei.chuai@uni.lu</span>
            </a>
            <p><MapPin size={15} aria-hidden="true" /><span>Luxembourg</span></p>
          </div>

          <a className="cv-button" href="./Yuwei_Chuai_CV.pdf" target="_blank" rel="noopener noreferrer">
            <Download size={16} aria-hidden="true" /> Curriculum vitae
          </a>

          <div className="profile-links" aria-label="Academic and social profiles">
            {profileLinks.map((link) => (
              <ExternalLink key={link.label} href={link.href}>{link.label}</ExternalLink>
            ))}
          </div>
          <p className="profile-caption">Computational social science<br />Online trust & safety</p>
        </aside>

        <main className="main-content" id="main">
          <section className="about-section" id="about" aria-labelledby="about-heading">
            <div className="about-overview">
              <div className="about-copy">
                <p className="eyebrow">Computational social science</p>
                <h2 id="about-heading">About me</h2>
                <p>
                  I study how information spreads online and how digital platforms can
                  become more trustworthy. I am a postdoctoral researcher at the
                  <strong> University of Luxembourg</strong>, working on misinformation,
                  community-based fact-checking, and platform governance.
                </p>
              </div>
              <ResearchNetwork />
            </div>
            <p>
              Trained in computer science and information systems, I combine causal
              inference with large-scale digital trace data, network analysis,
              LLM-based measurement, and experiments. My first-author work has
              appeared in <em>Nature Communications</em>, CHI, WWW, CSCW, and ICWSM.
            </p>
            <p className="current-note">
              <span>Currently</span>
              Studying location transparency on X and the downstream effects of
              Community Notes on misinformation producers.
            </p>
          </section>

          <section className="content-section research-section" id="research" aria-labelledby="research-heading">
            <div className="section-heading">
              <h2 id="research-heading">Research interests</h2>
            </div>
            <dl className="research-list">
              {researchAreas.map((area) => (
                <div key={area.title}>
                  <dt>{area.title}</dt>
                  <dd>{area.description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="content-section" id="publications" aria-labelledby="publications-heading">
            <div className="section-heading">
              <h2 id="publications-heading">Selected publications</h2>
              <ExternalLink href={scholarUrl} className="section-link">Google Scholar</ExternalLink>
            </div>
            <ol className="publication-list">
              {publications.map((paper) => (
                <li key={paper.key}>
                  <article className="publication">
                    <div className="publication-content">
                      <p className="publication-meta">
                        <span className="publication-venue">
                          <span className="venue-logo">
                            {paper.logo ? <img src={paper.logo} alt={paper.logoAlt} width={72} height={28} loading="lazy" decoding="async" /> : <span>{paper.badge}</span>}
                          </span>
                          <span>{paper.venue}</span>
                        </span>
                        <span className="publication-year">{paper.year}</span>
                      </p>
                      <h3>{paper.href ? <a href={paper.href} target="_blank" rel="noopener noreferrer">{paper.title}</a> : paper.title}</h3>
                      <Authors authors={paper.authors} />
                    </div>
                    {paper.href && <ExternalLink href={paper.href} className="paper-link">
                      <span className="sr-only">{paper.title}: </span>Paper
                    </ExternalLink>}
                  </article>
                </li>
              ))}
            </ol>
            {publications.some(paper => paper.authors.some(author => author.corresponding)) && (
              <p className="publication-legend">† Corresponding author</p>
            )}
            <p className="publication-footnote">
              A full list of publications and working papers is available in my{" "}
              <a href="./Yuwei_Chuai_CV.pdf" target="_blank" rel="noopener noreferrer">CV</a> and on{" "}
              <a href={scholarUrl} target="_blank" rel="noopener noreferrer">Google Scholar</a>.
            </p>
          </section>

          <section className="content-section" id="experience" aria-labelledby="experience-heading">
            <div className="section-heading"><h2 id="experience-heading">Appointments & visits</h2></div>
            <ol className="career-list">
              {appointments.map((item) => (
                <li key={item.title}>
                  <p className="career-period">{item.period}</p>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="career-institution">{item.institution}</p>
                    <p className="career-detail">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-section" id="education" aria-labelledby="education-heading">
            <div className="section-heading"><h2 id="education-heading">Education</h2></div>
            <ol className="career-list">
              {education.map((item) => (
                <li key={item.title}>
                  <p className="career-period">{item.period}</p>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="career-institution">{item.institution}</p>
                    <p className="career-detail">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-section" id="projects" aria-labelledby="projects-heading">
            <div className="section-heading"><h2 id="projects-heading">Funded research</h2></div>
            <div className="project-list">
              <article>
                <div className="project-heading"><h3>CLARITY</h3><span>FNR CORE 2025 · FNR / DFG</span></div>
                <p>Community-led analysis and reporting to improve trust and transparency.</p>
                <p className="career-detail">Co-developed the proposal with Gabriele Lenzini (PI) and Nicolas Pröllochs (co-PI).</p>
              </article>
              <article>
                <div className="project-heading"><h3>REMEDIS</h3><span>FNR / FNRS 2021</span></div>
                <p>Regulatory and other solutions to mitigate online disinformation.</p>
                <p className="career-detail">Doctoral researcher studying online misinformation and its interventions.</p>
              </article>
            </div>
          </section>

          <div className="academic-columns">
            <section className="content-section" aria-labelledby="teaching-heading">
              <div className="section-heading"><h2 id="teaching-heading">Teaching & mentoring</h2></div>
              <p>Guest lecturer on misinformation in the Master in Cybersecurity and Cyber Defense at the University of Luxembourg (2025).</p>
              <p>Previously a teaching assistant for Programming in C at Beihang University (2019–2021).</p>
              <p className="career-detail">Research supervision: Shuning Zhang (Tsinghua University) and Dai Shi (Tongji University).</p>
            </section>
            <section className="content-section" aria-labelledby="service-heading">
              <div className="section-heading"><h2 id="service-heading">Academic service</h2></div>
              <p>Reviewer for WWW, CHI, CSCW, ICWSM, and EMNLP.</p>
              <p>Journal reviewing includes Information Processing & Management, Digital Journalism, and Humanities and Social Sciences Communications.</p>
              <p className="career-detail">Program committee: CIVIL session, IEEE DSAA.</p>
            </section>
          </div>

          <section className="content-section" id="recognition" aria-labelledby="recognition-heading">
            <div className="section-heading"><h2 id="recognition-heading">Recognition & media</h2></div>
            <ul className="award-list">
              <li><span>Guillaume Dupaix International PhD Scholarship</span><span>2025</span></li>
              <li><span>Government Scholarship of the Grand Duchy of Luxembourg</span><span>2022</span></li>
              <li><span>Outstanding Graduate, Hefei University of Technology</span><span>2019</span></li>
            </ul>
            <p className="media-copy">
              Research covered by <span>MIT Technology Review</span>, <span>Nature News</span>,{" "}
              <span>The Washington Post</span>, <span>New Scientist</span>, and <span>Poynter</span>.
              Interviews also include Columbia Journalism Review.
            </p>
          </section>

          <footer className="site-footer" id="contact">
            <p>© 2026 Yuwei Chuai <span>·</span> <a href="mailto:yuwei.chuai@uni.lu">Get in touch</a></p>
            <a href="#top">Back to top ↑</a>
          </footer>
          <AnalyticsConsent measurementId={(process.env.NEXT_PUBLIC_GA_ID || siteConfig.googleAnalyticsId).trim()} />
        </main>
      </div>
    </>
  );
}
