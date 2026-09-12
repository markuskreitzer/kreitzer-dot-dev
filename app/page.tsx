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
      <main id="main-content" className="home-page">
        <div className="home-intro">
          <p>
            I’m a software engineer in Huntsville, Alabama. I work on AI
            applications and developer tooling at PeopleTec and am pursuing a
            PhD in electrical engineering at Auburn.
          </p>
          <p>
            <Link href="/about">More about me</Link>.
          </p>
        </div>
        <section className="workshop-section">
          <div className="section-heading">
            <h1>Projects</h1>
            <Link href="/work">All projects</Link>
          </div>
          <ProjectList items={featuredProjects} />
        </section>
        <section className="workshop-section experience-summary">
          <h2>Professional work</h2>
          <p>
            At PeopleTec, I architected and built a Go application and led its
            development team before handing off team leadership. I also
            established DevOps practices for several projects; I now define
            requirements and guide the team implementing them.
          </p>
          <p>
            At Valkyrie, I overhauled DevSecOps and CI/CD for 26 microservices
            across 89 repositories. A Kubernetes cluster I built from lab
            desktops let us run simulations in parallel, reducing end-to-end
            testing from seven days to four hours.
          </p>
          <Link href="/about">Work history and education</Link>
        </section>
        <section className="workshop-section">
          <h2>Applications</h2>
          <ProjectList items={projects.filter((project) => project.demo)} />
        </section>
        <section className="workshop-section">
          <div className="section-heading">
            <h2>Writing</h2>
            <Link href="/blog">All articles</Link>
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
              </article>
            ))}
          </div>
        </section>
        <footer className="contact-strip">
          <a href="https://www.linkedin.com/in/markuskreitzer/">
            Contact me on LinkedIn
          </a>
          <a href="https://github.com/markuskreitzer">GitHub</a>
        </footer>
      </main>
    </div>
  );
}
