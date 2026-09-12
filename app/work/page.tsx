import type { Metadata } from "next";
import { WorkshopNav } from "@/components/WorkshopNav";
import { ProjectList } from "@/components/ProjectList";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "AI tools, instrumentation, applications, and electrical engineering research by Markus Kreitzer.",
  alternates: { canonical: "/work" },
};
export default function WorkPage() {
  return (
    <div className="workshop">
      <WorkshopNav />
      <main id="main-content" className="workshop-page">
        <h1>Projects</h1>
        <p className="page-intro">
          Software, instrumentation, and applications.
        </p>
        <ProjectList items={projects} />
      </main>
    </div>
  );
}
