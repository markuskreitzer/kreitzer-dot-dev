import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectList({ items }: { items: Project[] }) {
  return (
    <div className="project-list">
      {items.map((project) => (
        <article key={project.slug} className="project-entry">
          <div>
            <p className="project-category">{project.category}</p>
            <h3>
              {project.sections.length ? (
                <Link href={`/work/${project.slug}`}>{project.title}</Link>
              ) : (
                project.title
              )}
            </h3>
            {project.image && (
              <img
                src={project.image.src}
                alt={project.image.alt}
                width={640}
                height={450}
                loading="lazy"
                className="project-thumbnail"
              />
            )}
          </div>
          <div>
            <p>{project.summary}</p>
            <p className="project-meta">
              {project.status} · {project.technologies.join(", ")}
            </p>
            <div className="project-links">
              {project.sections.length > 0 && (
                <Link href={`/work/${project.slug}`}>Read the case study</Link>
              )}
              {project.source && <a href={project.source}>Source repository</a>}
              {project.demo && <a href={project.demo}>Open application</a>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
