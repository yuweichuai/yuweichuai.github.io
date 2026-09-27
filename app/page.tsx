import { ArrowUpRight, Briefcase, Download, Mail, MapPin } from "lucide-react";
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

const newsUpdates = [
  {
    date: "2026-09",
    title: "New preprint",
    description:
      <>
        We studied X's location transparency feature and found it can reduce
        activity by accounts misrepresenting their location. Read our preprint on{" "}
        <ExternalLink href="https://arxiv.org/abs/2609.25933" className="paper-link">
          arXiv
        </ExternalLink>.
      </>
  },
  {
    date: "2026-08",
    title: "New preprint",
    description:
      <>
        The downstream effects of community notes on misinformation producers are divergent.{" "}
        Read our preprint on <ExternalLink href="https://arxiv.org/abs/2608.27526" className="paper-link">arXiv</ExternalLink>
      </>
  },
  {
    date: "2026-08",
    title: "EMNLP 2026",
    description:
      "One paper accepted in the EMNLP 2026 main conference, to be held in Budapest, Hungary from October 24–29, 2026.",
  },
  {
    date: "2026-07",
    title: "ICWSM 2027",
    description: "One paper accepted at ICWSM 2027, to be held in Edinburgh, Scotland.",
  },
  {
    date: "2026-06",
    title: "WWW 2026",
    description: "Oral presentation at WWW 2026.",
  },
].sort((a, b) => b.date.localeCompare(a.date));

const newsDateLabel = (iso: string) =>
  new Date(`${iso}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

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

const hfModels = [
  {
    name: "Multilingual Community Notes topic classifier",
    description: "TwHIN-BERT fine-tuned to assign zero or more of ten topics to a post and its associated Community Note summaries.",
    href: "ychuai/community-notes-topic-classifier",
    tag: "Text Classification",
  },
  // Add one object per model, most recent first.
];

const appointments = [
  {
    period: "May 2026 — Present",
    title: "Postdoctoral Researcher",
    institution: "University of Luxembourg",
    detail: "SnT · CLARITY project",
  },
  {
    period: ["Dec 2025 – Mar 2026", "Oct 2026 – Present"],
    title: "Visiting Research Fellow",
    institution: "University of Oxford",
    detail: "Oxford Internet Institute · Host: Prof. Mohsen Mosleh",
  },
  {
    period: "Jun — Sep 2025",
    title: "Visiting Doctoral Student",
    institution: "Tsinghua University",
    detail: "Institute for Network Sciences and Cyberspace · Host: Prof. Xin Yi",
  },
];

const education = [
  {
    period: "2022 — 2026",
    title: "PhD in Computer Science",
    institution: "University of Luxembourg, Luxembourg",
    detail: "Supervisor: Prof. Gabriele Lenzini. Thesis: Computational analysis of misinformation engagement and interventions on social media [Excellent Thesis Award Nomination].",
  },
  {
    period: "2019 — 2022",
    title: "MSc in Management Science and Engineering",
    institution: "Beihang University, China",
    detail: "Exchange at the University of Luxembourg, 2021–2022.",
  },
  {
    period: "2015 — 2019",
    title: "BEng in Information Management and Information System",
    institution: "Hefei University of Technology, China",
    detail: "Outstanding Graduate, 2019.",
  },
];

const invitedTalks = [
  {
    date: "2025-09",
    title: "Community-based fact-checking",
    venue: "Tsinghua University, China",
  },
  // Add one object per talk, most recent first. Date format: "YYYY-MM".
].sort((a, b) => b.date.localeCompare(a.date));

const interviews = [
  { outlet: "X/Twitter", date: "2025-09", href: "", detail: "Topic: Comments as early fact-checking signals; Interviewers: Mr. Jay Baxter, Community Notes ML Lead at X/Twitter; Mr. Keith Coleman, VP of Product at X/Twitter" },
  { outlet: "Meta", date: "2025-03", href: "", detail: "Topic: External expert to inform Meta’s product and policy decision-making; Interviewer: Dr. Louisa Bartolo, Content Policy Manager at Meta" }
  { outlet: "Columbia Journalism Review", date: "2025-01", href: "", detail: "Topic: Obstacle for Community Notes to be successful; Interviewer: Ms. Sarah Grevy Gotfredsen, Investigative Journalism Fellow, Columbia University, New York, US" }
  { outlet: "Poynter Media", date: "2024-09", href: "https://www.poynter.org/fact-checking/2024/how-elon-musk-twitter-takeover-accelerated-misinformation/", detail: "Topic: Fact-checking on X/Twitter; Interviewer: Ms. Angela Fu, Poynter Media Reporter" }

  // Add more interviews here. `href` and `detail` are optional.
].sort((a, b) => b.date.localeCompare(a.date));

const mediaCoverage = [
  { outlet: "MIT Technology Review", date: "2025-01", href: "https://www.technologyreview.com/2025/01/29/1110630/three-reasons-meta-will-struggle-with-community-fact-checking/" },
  { outlet: "Nature News", date: "2025-01", href: "https://www.nature.com/articles/d41586-025-00027-0" },
  { outlet: "The Washington Post", date: "2024-10", href: "https://www.washingtonpost.com/technology/2024/10/30/elon-musk-x-fact-check-community-notes-misinformation/" },
  { outlet: "New Scientist", date: "2025-01", href: "https://www.newscientist.com/article/2462974-are-tech-firms-giving-up-on-policing-their-platforms/" },
  // Add more coverage here. `href` is optional (adds a link when set).
].sort((a, b) => b.date.localeCompare(a.date));

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
              <p className="profile-role">Visiting Research Fellow</p>
              <p className="profile-affiliation">Oxford Internet Institute, University of Oxford</p>
            </div>
          </div>

          <div className="profile-contact">
            <a href="mailto:yuwei.chuai@uni.lu">
              <Mail size={15} aria-hidden="true" /><span>yuwei.chuai@uni.lu</span>
            </a>
            <p><MapPin size={15} aria-hidden="true" /><span>Luxembourg</span></p>
          </div>

          {/*<a className="cv-button" href="./Yuwei_Chuai_CV.pdf" target="_blank" rel="noopener noreferrer">
            <Download size={16} aria-hidden="true" /> Curriculum vitae
          </a>*/}
          <div className="job-market-note" role="note" aria-label="On the academic job market">
            <p className="job-market-note-title"><Briefcase size={14} aria-hidden="true" /><span>On the faculty job market</span></p>
            <p>Applying for tenure-track positions in 2026–2027. Get in touch if you think my profile might be a fit!</p>
          </div>

          <div className="profile-links" aria-label="Academic and social profiles">
            {profileLinks.map((link) => (
              <ExternalLink key={link.label} href={link.href}>{link.label}</ExternalLink>
            ))}
          </div>
          {/*<p className="profile-caption">Let's work together</p>*/}
        </aside>

        <main className="main-content" id="main">
          <section className="about-section" id="about" aria-labelledby="about-heading">
            <div className="about-overview">
              <div className="about-copy">
                {/*<p className="eyebrow">Computational social science · Online trust and safety</p>*/}
                <h2 id="about-heading">About me</h2>
                <p>
                  I study how information spreads online and how digital platforms can
                  become more trustworthy. I am currently a postdoctoral researcher at the
                  <strong> University of Luxembourg</strong>, working on misinformation,
                  community-based fact-checking, and platform governance.
                </p>
              </div>
              <ResearchNetwork />
            </div>
            <p>
              Trained in computer science and information systems, I combine causal
              inference with large-scale digital trace data, network analysis,
              LLM-based measurement, and experiments. My first-author publications have appeared in leading interdisciplinary venues 
              such as <em>Nature Communications</em>, <em>CHI</em>, <em>WWW</em>, <em>CSCW</em>, and <em>ICWSM</em>. 
              These studies provide some of the first large-scale empirical and causal evidence on the effectiveness, limitations, 
              and behavioural consequences of community-based fact-checking systems. 
              Additionally, my work has attracted international media attention through coverage 
              in <em>MIT Technology Review</em>, <em>The Washington Post</em>, and <em>New Scientist</em>, 
              and informed discussions surrounding platform governance and content moderation.
            </p>
            <p className="current-note">
              <span>Current work</span>
              Causal evaluation of location transparency feature on X (with Thomas Renault, David Rand, Mohsen Mosleh); the effect of community notes on misinformation producers (with Thomas Renault, Nicolas Pröllochs, Gabriele Lenzini, Mohsen Mosleh).
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

          <section className="content-section" id="news" aria-labelledby="news-heading">
            <div className="section-heading">
              <h2 id="news-heading">News</h2>
            </div>
            <div className="news-scroll">
            <ul className="news-list">
              {newsUpdates.map((item, index) => (
                <li key={item.title} className="news-item">
                  <div className="news-marker" aria-hidden="true" />
                  <time className="news-date" dateTime={item.date}>
                    {newsDateLabel(item.date)}
                  </time>
                  <div className="news-body">
                    <p className="news-title">
                      {item.title}
                      {index === 0 && <span className="news-badge">Latest</span>}
                    </p>
                    <p className="news-description">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            </div>
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
              A full list of publications and working papers is available on{" "}
              <a href={scholarUrl} target="_blank" rel="noopener noreferrer">Google Scholar</a>.
            </p>
          </section>

          <section className="content-section" id="models" aria-labelledby="models-heading">
            <div className="section-heading">
              <h2 id="models-heading">Published models</h2>
              <ExternalLink href="https://huggingface.co/your-username" className="section-link">Hugging Face</ExternalLink>
            </div>
            <ul className="model-list">
              {hfModels.map((model) => (
                <li key={model.name}>
                  <article className="model">
                    <div className="model-content">
                      {model.tag && <p className="model-tag">{model.tag}</p>}
                      <h3>
                        {model.href ? <a href={model.href} target="_blank" rel="noopener noreferrer">{model.name}</a> : model.name}
                      </h3>
                      <p className="model-description">{model.description}</p>
                    </div>
                    {model.href && (
                      <ExternalLink href={model.href} className="paper-link">
                        <span className="sr-only">{model.name}: </span>Model
                      </ExternalLink>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section className="content-section" id="experience" aria-labelledby="experience-heading">
            <div className="section-heading"><h2 id="experience-heading">Appointments & visits</h2></div>
            <ol className="career-list">
              {appointments.map((item) => (
                <li key={item.title}>
                  <div className="career-period">
                    {Array.isArray(item.period)
                      ? item.period.map((p) => <p key={p}>{p}</p>)
                      : <p>{item.period}</p>}
                  </div>
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
                <div className="project-heading"><h3>CLARITY</h3><span>FNR CORE 2025 · FNR / DFG · €694,000</span></div>
                <p>Community-led analysis and reporting to improve trust and transparency.</p>
                <p className="career-detail">Co-developed the proposal with Gabriele Lenzini (PI) and Nicolas Pröllochs (co-PI).</p>
              </article>
              <article>
                <div className="project-heading"><h3>REMEDIS</h3><span>FNR / FNRS 2021 · €747,000</span></div>
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
          </section>

          <section className="content-section" id="talks-media" aria-labelledby="talks-media-heading">
            <div className="section-heading"><h2 id="talks-media-heading">Talks & media</h2></div>

            <div className="subsection">
              <h3>Invited talks</h3>
              <ul className="talk-list">
                {invitedTalks.map((talk) => (
                  <li key={talk.title}>
                    <time className="talk-date" dateTime={talk.date}>{newsDateLabel(talk.date)}</time>
                    <span className="talk-body">
                      <strong>{talk.title}</strong>
                      <span className="talk-venue">{talk.venue}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="subsection">
              <h3>Interviews</h3>
              <ul className="media-list">
                {interviews.map((item) => (
                  <li key={item.outlet}>
                    <div className="media-row">
                      <span className="media-outlet">
                        {item.href ? <ExternalLink href={item.href}>{item.outlet}</ExternalLink> : item.outlet}
                      </span>
                      {item.date && <time className="media-date" dateTime={item.date}>{newsDateLabel(item.date)}</time>}
                    </div>
                    {item.detail && <p className="media-detail">{item.detail}</p>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="subsection">
              <h3>Media coverage</h3>
              <ul className="media-list">
                {mediaCoverage.map((item) => (
                  <li key={item.outlet}>
                    <div className="media-row">
                      <span className="media-outlet">
                        {item.href ? <ExternalLink href={item.href}>{item.outlet}</ExternalLink> : item.outlet}
                      </span>
                      {item.date && <time className="media-date" dateTime={item.date}>{newsDateLabel(item.date)}</time>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
