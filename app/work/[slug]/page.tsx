import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkshopNav } from "@/components/WorkshopNav";
import { featuredProjects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);
  return project
    ? {
        title: project.title,
        description: project.summary,
        alternates: { canonical: `/work/${slug}` },
      }
    : { title: "Project not found" };
}
export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <div className="workshop">
      <WorkshopNav />
      <main id="main-content" className="workshop-page case-study">
        <Link href="/work">All projects</Link>
        <h1>{project.title}</h1>
        <p className="page-intro">{project.summary}</p>
        {project.image && (
          <figure>
            <img
              src={project.image.src}
              alt={project.image.alt}
              width={1000}
              height={400}
            />
            <figcaption>
              Audio from the stored wood measurement.
            </figcaption>
          </figure>
        )}
        {project.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {project.source && (
          <a className="source-link" href={project.source}>
            Source code and setup
          </a>
        )}
      </main>
    </div>
  );
}
