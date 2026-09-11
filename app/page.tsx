import Link from "next/link";
import { WorkshopNav } from "@/components/WorkshopNav";
import { ProjectList } from "@/components/ProjectList";
import { featuredProjects, projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <div className="workshop">
      <WorkshopNav />
      <main id="main-content">
        <section className="workshop-hero">
          <div>
            <h1>
              Software that reaches
              <br />
              the workbench.
            </h1>
            <p>
              I’m Markus, an AI and platform engineer. I build developer tools,
              automate delivery, and connect software to physical systems.
            </p>
            <div className="hero-links">
              <Link href="/work">Explore my work</Link>
              <Link href="/about">Engineering background</Link>
            </div>
          </div>
          <aside className="bench-note">
            <h2>On my bench</h2>
            <img
              src="/images/ryobi-signal.svg"
              alt="Recorded pulse train from the Ryobi moisture meter"
              width={960}
              height={350}
              className="bench-waveform"
            />
            <p>
              A moisture meter speaks in pulses. An oscilloscope becomes an AI
              tool. A coffee roaster asks for beans.
            </p>
            <p>Small, tangible problems. Plenty of engineering underneath.</p>
            <Link href="/work/ryobi-moisture-meter">
              Inside the moisture-meter project
            </Link>
          </aside>
        </section>
        <section className="workshop-section automation">
          <h2>
            Build it. Automate it.
            <br />
            Keep it useful.
          </h2>
          <div>
            <p>
              My professional work spans AI services, distributed systems, and
              the tools engineers use to deliver them.
            </p>
            <ul>
              <li>
                GitLab CI/CD and Kubernetes delivery for an{" "}
                <strong>89-service system</strong>.
              </li>
              <li>
                Secure container builds, automated checks, and SBOM generation.
              </li>
              <li>
                A one-click deployment dashboard supporting{" "}
                <strong>approximately 20 developers</strong>.
              </li>
              <li>
                Java, Python, and Ansible automation; ML pipelines and model
                evaluation.
              </li>
            </ul>
            <Link href="/about">More about my experience</Link>
          </div>
        </section>
        <section className="workshop-section">
          <div className="section-heading">
            <h2>Selected work</h2>
            <Link href="/work">All projects</Link>
          </div>
          <ProjectList items={featuredProjects} />
        </section>
        <section className="workshop-section">
          <div className="section-heading">
            <h2>Applications you can explore</h2>
          </div>
          <ProjectList items={projects.filter((project) => project.demo)} />
        </section>
        <section className="workshop-section">
          <div className="section-heading">
            <h2>From the notebook</h2>
            <Link href="/blog">All writing</Link>
          </div>
          <div className="writing-list">
            {posts.map((post) => (
              <article key={post.slug}>
                <time dateTime={String(post.date)}>
                  {String(post.date).slice(0, 10)}
                </time>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="contact-strip">
          <h2>Let’s talk engineering.</h2>
          <a href="mailto:markus.kreitzer@proton.me">
            markus.kreitzer@proton.me
          </a>
          <a href="https://github.com/markuskreitzer">GitHub</a>
          <a href="https://www.linkedin.com/in/markuskreitzer/">LinkedIn</a>
        </section>
      </main>
    </div>
  );
}
